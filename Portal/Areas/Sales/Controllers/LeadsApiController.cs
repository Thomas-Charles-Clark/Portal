using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json;
using Portal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using NLog;
using System.Threading.Tasks;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Utilities;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.FBLeads;
using SharedEFClasses.Models.TradeAccounts;
using SalesStatistics.Models;
using SharedEFClasses.Models.Cache;
using SharedEFClasses.Models.Pricing;
using SharedEFClasses;
using SharedEFClasses.Models.Customers;
using System.IO;
using System.Net.Http.Headers;

namespace Portal.Areas.Sales.Controllers
{
    //[Authorize]
    public class LeadsAPIController : ApiController
    {
        private static Logger Logger = LogManager.GetCurrentClassLogger();

        private ApplicationUserManager userManager;

        private PortalDbContext portalDb { get; set; }

        private SalesStatsDbContext statsDb { get; set; }

        public LeadsAPIController(ApplicationUserManager userManager, PortalDbContext portalDbContext, SalesStatsDbContext statsDbContext)
        {
            this.userManager = userManager;
            this.portalDb = portalDbContext;
            this.statsDb = statsDbContext;
        }

        [HttpGet]
        public DataSourceResult LeadSearch(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassLeadSearch objLeadSearch)
        {
            var results = portalDb.LeadSearch(objLeadSearch);

            return results.Leads.AsQueryable().ToDataSourceResult(request);
        }
        
        [HttpPost]
        public IHttpActionResult CustomerSearch([FromBody]PassCustomerSearch objSearch)
        {
            objSearch.userId = User.Identity.GetUserId<int>();

            var results = portalDb.CustomerSearch(objSearch);
            
            return Json(results);
        }

        [HttpGet]
        public DataSourceResult MiscCustomerSearch(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassCustomerSearch objSearch)
        {
            var results = portalDb.MiscCustomerSearch(objSearch);

            return results.Customers.AsQueryable().ToDataSourceResult(request);
        }

        [HttpPost]
        public IHttpActionResult LeadCheck([FromBody]PassLeadCheck objLeadCheck)
        {
            var results = portalDb.LeadCheck(objLeadCheck);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult LoadLead([FromBody]PassLeadID objLeadId)
        {
            var result = portalDb.Leads.Where(p => p.LeadID == objLeadId.leadId).SingleOrDefault();

            if (result != null)
            {
                result.SecondaryContacts = result.SecondaryContacts.Where(p => p.Deleted == false).ToList();
            }

            result.LeadAddresses = result.LeadAddresses.Where(p => p.Deleted == false).OrderBy(p => p.LeadAddressID == result.LeadAddressID ? 0 : 1).ToList();
            result.SecondaryContacts = result.SecondaryContacts.Where(p => p.Deleted == false).OrderBy(p => p.LeadContactID == result.LeadContactID ? 0 : 1).ToList();
            result.CreatedSince = PortalFramework.DateTimeDistanceString(result.CreatedDT, true);
            result.ModifiedSince = PortalFramework.DateTimeDistanceString(result.ModifiedDT, true);
            result.AssignedSince = PortalFramework.DateTimeDistanceString(result.AssignedDT, true);

            result.Potentials = result.Potentials.ToList();

            foreach (var po in result.Potentials)
            {
                po.NoPotentialSince = PortalFramework.DateTimeDistanceString(po.NoPotentialDT, true, true);
            }

            result.TotalPotential = result.Potentials.Select(p => p.Value).Sum();

            result.Competitors = result.BrandsWorkedWith.Select(p => p.Competitor).ToList();

            string tradingSince = null;

            if (result.TradingSince != null)
            {
                var diff = DateTime.Now - result.TradingSince.Value;

                var yearsDiff = TimeSpanExtensions.GetYears(diff);
                var monthsDiff = TimeSpanExtensions.GetMonths(diff);

                if (monthsDiff > 12)
                {
                    monthsDiff = (int)(monthsDiff % 12);
                }
                
                if (yearsDiff > 0)
                {
                    tradingSince = $"{yearsDiff} years";
                    if (monthsDiff > 0)
                    {
                        tradingSince += $", {monthsDiff} months";
                    }
                }
                else
                {
                    if (monthsDiff > 0)
                    {
                        tradingSince = $"{monthsDiff} months";
                    }
                    else
                    {
                        tradingSince = "Less than one month";
                    }
                }

                tradingSince = result.TradingSince.Value.ToString("dd/MM/yyyy");
            }

            foreach (var a in result.LeadAddresses)
            {
                a.AppleMapsButton = string.Format("<a class=\"btn btn-secondary-blue directions-link btn-sm\" target=\"_blank\" href=\"https://www.google.com/maps?saddr=My+Location&daddr={0},{1},{2}\">Google Maps</a>",
                    HttpUtility.UrlEncode(a.AddressLine1?.Replace(",", "")),
                    HttpUtility.UrlEncode(a.PostCode?.Replace(",", "")),
                    HttpUtility.UrlEncode(a.Country?.Code));

                a.WazeButton = string.Format("<a class=\"btn btn-secondary-blue directions-link btn-sm\" target=\"_blank\" href=\"waze://?q={0},{1},{2}\">Waze</a>",
                    HttpUtility.UrlEncode(a.AddressLine1?.Replace(",", "")),
                    HttpUtility.UrlEncode(a.PostCode?.Replace(",", "")),
                    HttpUtility.UrlEncode(a.Country?.Code));

                a.GoogleStreetViewButton = string.Format("MONKIES");
            }

            var countryId = result.CountryID;

            var productTypeGroups = portalDb.ProductTypeGroup_Brand_Country.Where(p => p.CountryID == countryId).ToList();

            var leadProximityResult = portalDb.Lead_TradeAccountProximity_Select(new PassLeadProximitySelect()
            {
                leadId = result.LeadID,
                proximity = 10,
                countryId = result.CountryID,
                memberId = null
            });

            result.LeadNotes = result.LeadNotes.OrderByDescending(p => p.CreatedDT).ToList();

            var leadStageInfo = portalDb.LeadStage_Select(objLeadId.leadId);

            return Ok(new
            {
                Lead = result,
                TradingSince = tradingSince,
                StageInformation = leadStageInfo,
                ProductTypeGroups = productTypeGroups,
                ProximalTradeAccounts = leadProximityResult.Results
            });
        }

        [HttpPost]
        public IHttpActionResult LoadLeadContact([FromBody]PassLeadContactID objLeadContactId)
        {
            var result = portalDb.LeadContacts.Where(p => p.LeadContactID == objLeadContactId.leadContactId).SingleOrDefault();

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult LeadUpsert([FromBody]PassLeadUpsert objLeadUpsert)
        {
            var result = portalDb.LeadUpsert(objLeadUpsert, User.Identity.GetUserId<int>());

            if (objLeadUpsert.LeadStatusID == 13)
            {
                // sending to Misc
                if (result.LeadID != null)
                {
                    var lead = portalDb.Leads.Where(p => p.LeadID == result.LeadID).Single();
                    
                    lead.TradeAccountID = objLeadUpsert.miscTradeAccountId;

                    portalDb.SaveChanges();

                    var rep = portalDb.SalesRepresentatives.Where(p => p.SalesRepresentativeID == objLeadUpsert.miscSalesRepId).Single();

                    var ta = portalDb.TradeAccounts.Where(p => p.TradeAccountID == objLeadUpsert.miscTradeAccountId).Single();

                    System.Threading.Tasks.Task.Factory.StartNew(() =>
                    {
                        var body = "";
                        var subject = "";

                        var miscAccountNumber = ta.Code;
                        var salesRepName = rep.Name;
                        var salesRepEmail = rep.Email;
                        var salesRepPhone = rep.PhoneNumber;

                        switch (objLeadUpsert.LanguageID) {
                            //case 3:
                            //    subject = "Merci d'avoir demandé l'ouverture d'un compte professionnel auprès de Designers Guild";
                            //    body = $@"<p class='hello'>
                            //    Merci d'avoir demandé l'ouverture d'un compte professionnel auprès de Designers Guild.
                            //</p>
                            //<p class='footer'>
                            //    Merci de votre intérêt pour nos produits et nos marques.
                            //</p>";
                            //    break;
                            //case 4:
                            //    subject = "Vielen Dank für Ihr Interesse an einem Designers Guild Händler Konto";
                            //    body = $@"<p class='hello'>
                            //    Vielen Dank für Ihr Interesse an einem Designers Guild Händler Konto.
                            //</p>
                            //<p class='footer'>
                            //    Vielen Dank für Ihr Interesse an Designers Guild.
                            //</p>";
                            //    break;
                            //case 5:
                            //    subject = "Gracias por solicitar una apertura de cuenta cliente con Designers Guild";
                            //    body = $@"<p class='hello'>
                            //    Gracias por solicitar una apertura de cuenta cliente con Designers Guild.
                            //</p>
                            //<p class='footer'>
                            //    Gracias por su interés en Designers Guild.
                            //</p>";
                            //    break;
                            //case 6:
                            //    subject = "Grazie per aver richiesto un account commerciale con Designers Guild";
                            //    body = $@"<p class='hello'>
                            //    Grazie per aver richiesto un account commerciale con Designers Guild.
                            //</p>
                            //<p class='footer'>
                            //    Grazie per il vostro interesse in Designers Guild.
                            //</p>";
                            //    break;
                            //case 10:
                            //    subject = "Благодарим вас за запрос на открытие бизнес аккаунта в Designers Guild";
                            //    body = $@"<p class='hello'>
                            //    Благодарим вас за запрос на открытие бизнес аккаунта в Designers Guild.
                            //</p>
                            //<p class='footer'>
                            //    Спасибо вам за интерес к Designers Guild.
                            //</p>";
                            //    break;
                            default:
                                subject = "Your Designers Guild Trade Account Application";
                                body = $@"<p class='hello'>
                                    Thank you for requesting a trade account with Designers Guild.
                                </p>
                                <p>
                                    Your application has been approved for trading with us on a proforma basis.
                                </p>
                                <p>
                                    Please quote the following account number on all future orders: <strong>{miscAccountNumber}</strong>
                                </p>
                                <p>
                                    Your local Sales Representative is {salesRepName} (<a href=""mailto:{salesRepEmail}"">{salesRepEmail}</a>{(!String.IsNullOrEmpty(salesRepPhone) ? $@" - <a href=""tel:{salesRepPhone}"">{salesRepPhone}</a>" : "")}).
                                </p>
                                <p class='footer'>
                                    Thank you for your interest in Designers Guild.
                                </p>";
                            break;
                        }

                        userManager.EmailService.SendAsync(new IdentityMessage()
                        {
                            Body = body,
                            Subject = subject,
                            Destination = lead.InvoiceStatementsEmail
                        });
                    });
                }
            }

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult UpsertLeadPotential([FromBody]PassLeadPotential objLeadPotential)
        {
            var thisLead = portalDb.Leads.Where(p => p.LeadID == objLeadPotential.editingLeadId).Single();

            if (thisLead.CurrencyID != objLeadPotential.editingCurrencyId)
            {
                thisLead.CurrencyID = objLeadPotential.editingCurrencyId;

                portalDb.SaveChanges();
            }

            LeadPotentialUpsertResult result = portalDb.UpsertLeadPotential(objLeadPotential);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult UpsertLeadContact([FromBody]PassLeadContactUpsert objLeadContactUpsert)
        {
            var result = portalDb.LeadContactUpsert(objLeadContactUpsert);

            if (result != null)
                return Ok(result);
            else
                return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult RemoveLeadContact([FromBody]PassLeadContactID objleadContactId)
        {
            var leadContact = portalDb.LeadContacts.Where(p => p.LeadContactID == objleadContactId.leadContactId).Single();

            leadContact.DeletedDT = DateTime.Now;

            portalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult LoadLeadAddress([FromBody]PassLeadAddressID objLeadAddressId)
        {
            var result = portalDb.LeadAddresses.Where(p => p.LeadAddressID == objLeadAddressId.leadAddressId).Single();

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult SaveLeadAddress([FromBody]PassLeadAddress objLeadAddress)
        {
            var result = portalDb.LeadAddressUpsert(objLeadAddress);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult RemoveLeadAddress([FromBody]PassLeadAddressID objLeadAddressId)
        {
            var leadAddress = portalDb.LeadAddresses.Where(p => p.LeadAddressID == objLeadAddressId.leadAddressId).Single();

            leadAddress.DeletedDT = DateTime.Now;

            portalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult DashboardSelect([FromBody]PassLeadDashboard objDashboard)
        {
            var result = portalDb.LeadDashboardSelect(objDashboard);

            return Ok(result);
        }
        
        [HttpPost]
        public IHttpActionResult CustomerDashboardSelect([FromBody]PassCustomerDashboard objDashboard)
        {
            var result = portalDb.CustomerDashboardSelect(objDashboard);

            return Ok(result);
        }
        
        [HttpPost]
        public IHttpActionResult MiscCustomerDashboardSelect([FromBody]PassCustomerDashboard objDashboard)
        {
            var result = portalDb.MiscCustomerDashboardSelect(objDashboard);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult SetLeadPrimaryContact([FromBody]PassLeadAndContactIDs objLeadContactId)
        {
            portalDb.SetLeadPrimaryContact(objLeadContactId.leadId, objLeadContactId.leadContactId);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult SetLeadPrimaryAddress([FromBody]PassLeadAndAddressIDs objLeadAddressId)
        {
            portalDb.SetLeadPrimaryAddress(objLeadAddressId.leadId, objLeadAddressId.leadAddressId);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult SetLeadDefaultInvoicingAddress([FromBody]PassLeadAndAddressIDs objLeadAddressId)
        {
            portalDb.SetLeadDefaultInvoicingAddress(objLeadAddressId.leadId, objLeadAddressId.leadAddressId);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult SetLeadDefaultDeliveryAddress([FromBody]PassLeadAndAddressIDs objLeadAddressId)
        {
            portalDb.SetLeadDefaultDeliveryAddress(objLeadAddressId.leadId, objLeadAddressId.leadAddressId);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult SetLeadDefaultVisitAddress([FromBody]PassLeadAndAddressIDs objLeadAddressId)
        {
            portalDb.SetLeadDefaultVisitAddress(objLeadAddressId.leadId, objLeadAddressId.leadAddressId);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult AddCompetitor([FromBody]PassNameString objName)
        {
            objName.Name = objName.Name.Trim();

            System.Globalization.CultureInfo cul = System.Threading.Thread.CurrentThread.CurrentCulture;
            System.Globalization.TextInfo ti = cul.TextInfo;
            objName.Name = ti.ToTitleCase(objName.Name);

            if (portalDb.Competitors.Any(p => p.Name == objName.Name))
            {
                var c = portalDb.Competitors.Where(p => p.Name == objName.Name).First();

                return Ok(new { CompetitorID = c.CompetitorID, Name = objName.Name });
            }
            else
            {
                var c = portalDb.Competitors.Add(new Competitor() { Name = objName.Name });
                portalDb.SaveChanges();

                return Ok(new { CompetitorID = c.CompetitorID, Name = objName.Name });
            }
        }

        [HttpPost]
        public IHttpActionResult LeadTradeAccountsWithinProximity([FromBody]PassLeadProximitySelect objProximity)
        {
            var leadProximityResult = portalDb.Lead_TradeAccountProximity_Select(objProximity);

            return Ok(new { Results = leadProximityResult.Results });
        }

        [HttpPost]
        public IHttpActionResult SaveLeadAddressLatLng([FromBody]PassLeadAddressCoordinates objCoords)
        {
            portalDb.LeadAddress_UpdateLatLng(objCoords);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult UpdateLeadAddressPano([FromBody]PassPanoramaLink objLink)
        {
            var leadAddress = portalDb.LeadAddresses.Where(p => p.LeadAddressID == objLink.LeadAddressID).Single();

            leadAddress.GooglePanoramaLink = objLink.GooglePanoramaLink;

            portalDb.SaveChanges();

            return Ok(objLink);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<HttpResponseMessage> FBLeadGen(object obj)
        {
            try
            {
                var jsonString = obj.ToString();
                FBLeadGen objLeadGen = JsonConvert.DeserializeObject<FBLeadGen>(jsonString);

                if (objLeadGen == null)
                {
                    Logger.Info("objLeadGen was null");
                }
                else
                {
                    Logger.Info(objLeadGen);
                }

                var accessToken = System.Configuration.ConfigurationManager.AppSettings["fb-leadgen-accesstoken"];
                
                using (HttpClient client = new HttpClient())
                {
                    foreach (var e in objLeadGen.entry)
                    {
                        foreach (var c in e.changes)
                        {
                            if (c.field == "leadgen")
                            {
                                var requestString = $"https://graph.facebook.com/v2.12/{c.value?.leadgen_id}?access_token={accessToken}";

                                var response = await client.GetAsync(requestString);

                                var content = await response.Content.ReadAsStringAsync();

                                Logger.Info(content);

                                var fbLeadData = JsonConvert.DeserializeObject<FBLeadData>(content);

                                if (fbLeadData != null)
                                {
                                    var subscriber = new PassMemberSubscribe()
                                    {
                                        FullName = fbLeadData.field_data.Where(p => p.name == "full_name").Single().values[0],
                                        Email = fbLeadData.field_data.Where(p => p.name == "email").Single().values[0],
                                        CountryID = 81,
                                        LanguageID = 1,
                                        MarketingCountryID = 81,
                                        MarketingLanguageID = 1,
                                        SourceID = 6
                                    };

                                    portalDb.SubscribeMember(subscriber);
                                }

                                Logger.Info(fbLeadData);
                            }
                        }
                    }
                }
                

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
                //  
                //      The beneath was used to get the webhooks / graph api set up and talking to this endpoint.
                //      Method has to be GET for 'webhooks' edit subscription to succeed, then must be POST for receiving 
                //      the leadgen events.

                //var kvps = Request.GetQueryNameValuePairs();
                
                //var challenge = kvps.Where(p => p.Key == "hub.challenge").SingleOrDefault();

                //var token = kvps.Where(p => p.Key == "hub.verify_token").SingleOrDefault();

                //if (token.Value == "gsjeor43qq980")
                //{
                //    var res = Request.CreateResponse(HttpStatusCode.OK, challenge.Value);
                //    res.Content = new StringContent(challenge.Value, System.Text.Encoding.UTF8, "text/plain");
                //    return res;
                //}

                return Request.CreateResponse(HttpStatusCode.Accepted, "Accepted");

            }
            catch (Exception ex)
            {
                Logger.Error(ex);

                return Request.CreateResponse(HttpStatusCode.OK, ex.ToString());
            }
        }

        [HttpPost]
        public IHttpActionResult CreditControllerSelectList(PassNullableCountryID objCountry)
        {
            var results = portalDb.CreditController_SelectList(objCountry);

            return Ok(results.CreditControllers);
        }

        [HttpPost]
        public IHttpActionResult TagAutocomplete(PassAutocompleteTerm objAutocomplete)
        {
            var results = portalDb.Tags.Where(p =>
                p.Deleted == false &&
                p.Name.StartsWith(objAutocomplete.term)
            ).OrderBy(p => p.Name).Skip(0).Take(20).ToList();

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult AddTag(PassNameString objName)
        {
            objName.Name.Trim();

            System.Globalization.CultureInfo cul = System.Threading.Thread.CurrentThread.CurrentCulture;
            System.Globalization.TextInfo ti = cul.TextInfo;
            objName.Name = ti.ToTitleCase(objName.Name);

            if (portalDb.Tags.Any(p => p.Name == objName.Name))
            {
                var c = portalDb.Tags.Where(p => p.Name == objName.Name).First();

                return Ok(new { TagID = c.TagID, Name = objName.Name });
            }
            else
            {
                var c = portalDb.Tags.Add(new Tag() { Name = objName.Name });
                portalDb.SaveChanges();

                return Ok(new { TagID = c.TagID, Name = objName.Name });
            }
        }


        //[HttpPost]
        //public DataSourceResult VisitSearch(
        //    [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
        //    [FromBody] PassVisitSearch objVisitSearch)
        //{
        //    var result = PortalDb.CustomerVisitSearch(objVisitSearch);

        //    return result.Results.AsQueryable().ToDataSourceResult(request);
        //}

        [HttpGet]
        public IHttpActionResult SalesMarketSlicerEndpoint(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, 
            [FromUri]PassCustomerSlicerGroupFilters objFilters)
        {
            var data = portalDb.SalesStatisticsFilterSelect(new PassTradeAccountFilterParams() { IncludeArea = true, IncludeCurrency = objFilters.CurrencyDisplay });
            
            var salesMarkets = data.Where(p =>
                (objFilters.SalesAreaID == null || objFilters.SalesAreaID == p.SalesAreaID))
                .Select(p => new SalesMarketSlicerTuple
                {
                    Name = p.SalesMarketName,
                    SalesMarketID = p.SalesMarketID,
                    CurrencyID = p.CurrencyID,
                    CurrencyName = p.CurrencyName,
                    CurrencyCode = p.CurrencyCode,
                    FormattingCulture = p.FormattingCulture
                })
                .Distinct()
                .OrderBy(p => p.Name)
                .ToList();
            
            if (objFilters.CurrencyDisplay)
            {
                salesMarkets.ForEach(c => {
                    c.SalesMarketID = c.SalesMarketID;
                    c.Name = $"{c.Name} - {c.CurrencyName}";
                });
            }

            salesMarkets = salesMarkets.Distinct(new SalesMarketTupleComparer()).ToList();

            return Ok(salesMarkets.AsQueryable().ToDataSourceResult(request));
        }

        [HttpGet]
        public IHttpActionResult SalesAreaSlicerEndpoint(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, 
            [FromUri] PassCustomerSlicerGroupFilters objFilters)
        {
            var data = portalDb.TradeAccountFilters;

            var salesAreas = data.Where(p =>
                (objFilters.SalesMarketID == null || objFilters.SalesMarketID == p.SalesMarketID)
            ).Select(p => new { Name = p.SalesAreaName, SalesAreaID = p.SalesAreaID }).Distinct().OrderBy(p => p.Name);

            return Ok(salesAreas.AsQueryable().ToDataSourceResult(request));
        }
        
        [HttpGet]
        public IHttpActionResult SalesRepresentativeSlicerEndpoint(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, 
            [FromUri] PassCustomerSlicerGroupFilters objFilters)
        {
            var data = portalDb.TradeAccountFilters;

            var salesRepresentative = data.Where(p =>
                (objFilters.SalesMarketID == null || objFilters.SalesMarketID == p.SalesMarketID) &&
                (objFilters.SalesAreaID == null || objFilters.SalesAreaID == p.SalesAreaID)
            ).Select(p => p.SalesRepresentativeID).Distinct();

            var reps = portalDb.SalesRepresentatives.Where(p => salesRepresentative.Contains(p.SalesRepresentativeID)).OrderBy(p => p.Name);
            
            return Ok(reps.AsQueryable().ToDataSourceResult(request));
        }

        [HttpPost]
        public IHttpActionResult SalesRepresentativeValueMapper([FromBody]PassSalesRepresentativeID objSalesRep)
        {
            return Ok(portalDb.SalesRepresentatives.Where(p => p.SalesRepresentativeID == objSalesRep.SalesRepresentativeID).AsQueryable());
        }

        [HttpGet]
        public IHttpActionResult MiscSalesRepresentativeSlicerEndpoint(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        {
            return Ok(portalDb.SalesRepresentatives.Where(p => p.MiscTradeAccounts.Count > 0).OrderBy(p => p.Name).AsQueryable().ToDataSourceResult(request));
        }

        [HttpGet]
        public IHttpActionResult MiscSalesRepresentativeMiscAccountSlicerEndpoint(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassSalesRepID objSalesRep)
        {
            return Ok(portalDb.SalesRepresentatives.Where(p => p.SalesRepresentativeID == objSalesRep.SalesRepID).SelectMany(p => p.MiscTradeAccounts.Select(q => q.TradeAccount)).AsQueryable().ToDataSourceResult(request));
        }

        [HttpGet]
        public IHttpActionResult TradeAccountTypeSlicerEndpoint(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri] PassCustomerSlicerGroupFilters objFilters)
        {
            var data = portalDb.TradeAccountTypes;

            return Ok(data.AsQueryable().ToDataSourceResult(request));
        }

        [HttpGet]
        public IHttpActionResult TradeAccountGroupSlicerEndpoint(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, 
            [FromUri] PassCustomerSlicerGroupFilters objFilters)
        {
            var data = portalDb.TradeAccountGroups;

            return Ok(data.AsQueryable().ToDataSourceResult(request));
        }

        [HttpGet]
        public IHttpActionResult SalesRepOrAgentSlicerEndpoint([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            return Ok(new[] {
                new { SalesRepOrAgent = true, Name = "Representative" },
                new { SalesRepOrAgent = false, Name = "Agent" }
            }.AsQueryable().ToDataSourceResult(request));
        }

        [HttpPost]
        public IHttpActionResult LoadCustomerView([FromBody]PassTradeAccountID objTradeAccount)
        {
            var summary = portalDb.CustomerCareEnquiry(objTradeAccount);
                
            var result = portalDb.TradeAccounts.Where(p => p.TradeAccountID == objTradeAccount.tradeAccountId).Single();

            result.Visits = result.Visits.Where(p => p.Deleted == false).ToList();

            var statusGroups = portalDb.OrderLineStatusGroups.Where(p => p.OrderLineStatusGroupID != 0 && p.OrderLineStatusGroupID != 7).OrderBy(p => p.SortOrder).ToList();

            statusGroups.ForEach(c => {
                c.Count = portalDb.LoadOutstandingOrders(new PassOutstandingOrderLoad()
                {
                    tradeAccountId = objTradeAccount.tradeAccountId,
                    orderLineStatusGroupId = c.OrderLineStatusGroupID
                }).Count;
            });

            var inProgress = portalDb.LoadOutstandingOrders(new PassOutstandingOrderLoad()
            {
                tradeAccountId = objTradeAccount.tradeAccountId,
                orderLineStatusGroupId = 1
            });

            var careRecords = portalDb.CustomerCareEnquiry(new PassCareSearch() {
                tradeAccountId = objTradeAccount.tradeAccountId,
                period = "all-time",
                careStatusId = 0,
                pageNumber = 1,
                pageSize = int.MaxValue
            });

            var statsDb = new SalesStatsDbContext();

            var objStatsSummary = new PassStatisticsSummary()
            {
                TradeAccountID = objTradeAccount.tradeAccountId
            };

            var quarterlies = statsDb.SalesByQuarter(objStatsSummary);

            var stats = new
            {
                TotalSales = statsDb.SalesStatisticsProcedure<TotalSalesResult>(objStatsSummary, "[portal].[CustomerSalesAnalysis_TotalSales]"),
                SalesByQuarterFinancial = quarterlies.Financial,
                SalesByQuarterCalendar = quarterlies.Calendar
            };


            var patternBooks = portalDb.PatternBookSaturationEnquiry(objTradeAccount);

            var patternBooksHeld = patternBooks.Where(p => p.LastPurchasedDT != null).ToList();

            var patternBooksNotHeld = patternBooks.Except(patternBooksHeld);

            // product group code PB, status C, L, Y

            // We want a checkableListComponent for our pattern books.
            // We want a Product Group / Item Type prefilterable autocomplete for other products:
            // if these products exist and are C, L or Y then permit selection.

            // Specify quantity. 

            // Click button, email sent to Customer Services detailing the rep sending, the customer and the PBs / other Ps required.

            //var recentPatternBooks = (from p 
            //                            in portalDb.Products
            //                          join l 
            //                            in (from l2 
            //                                    in portalDb.Launches
            //                                    orderby l2.LaunchID descending
            //                                select l2)
            //                                .Take(4)
            //                            on p.LaunchID equals l.LaunchID
            //                          where p.ProductGroupID == 17 // "PB"
            //                          where (p.Status == "C" || p.Status == "L" || p.Status == "Y")
            //                          orderby p.Name
            //                          select p);

            var launchId = portalDb.Launches.Where(p => p.TradeLaunchDate != null).Select(p => p.LaunchID).OrderByDescending(p => p).First();
            
            return Ok(new
            {
                summary = summary,
                tradeAccount = result,
                statusGroups = statusGroups,
                inProgressOrders = inProgress,
                careRecords = careRecords.Results,
                salesStats = stats,
                recentLaunchId = launchId,
                patternBooksHeld = patternBooksHeld,
                patternBooksNotHeld = patternBooksNotHeld
            });
        }

        [HttpPost]
        public  IHttpActionResult SaveCustomerNote([FromBody]PassTradeAccountNote objNote)
        {
            if (objNote.tradeAccountNoteId.HasValue)
            {
                var note = portalDb.TradeAccountNotes.Where(p => p.TradeAccountID == objNote.tradeAccountId).Single();
                note.Note = objNote.note;
                note.AuthorMemberID = User.Identity.GetUserId<int>();

                portalDb.SaveChanges();
            }
            else
            {
                portalDb.TradeAccountNotes.Add(new TradeAccountNote() {
                    CreatedDT = DateTime.Now,
                    TradeAccountID = objNote.tradeAccountId,
                    AuthorMemberID = User.Identity.GetUserId<int>(),
                    Note = objNote.note
                });

                portalDb.SaveChanges();
            }

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult LoadOutstandingOrders([FromBody]PassOutstandingOrderLoad objLoad)
        {
            var result = portalDb.LoadOutstandingOrders(objLoad);

            return Ok(result);
        }
        
        [HttpPost]
        public IHttpActionResult FetchTotalsAndQuarterlies([FromBody]PassStatisticsSummary objSummary)
        {
            var statsDb = new SalesStatsDbContext();

            var quarterlies = statsDb.SalesByQuarter(objSummary);

            var result = new
            {
                TotalSales = statsDb.SalesStatisticsProcedure<TotalSalesResult>(objSummary, "[portal].[CustomerSalesAnalysis_TotalSales]"),
                SalesByQuarterFinancial = quarterlies.Financial,
                SalesByQuarterCalendar = quarterlies.Calendar
            };

            return Ok(result);
        }
        
        [HttpPost]
        public IHttpActionResult LoadTradeAccountContact([FromBody]PassTradeAccountContactID objTradeAccountContactId)
        {
            var result = portalDb.TradeAccountContacts.Where(p => p.TradeAccountContactID == objTradeAccountContactId.TradeAccountContactID).SingleOrDefault();

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult UpsertTradeAccountContact([FromBody]PassTradeAccountContactUpsert objTradeAccountContactUpsert)
        {
            try
            {
                var result = portalDb.TradeAccountContactUpsert(objTradeAccountContactUpsert);

                var tradeAccountContact = portalDb.TradeAccountContacts.Where(p => p.TradeAccountContactID == result.TradeAccountContactID).Single();
                
                return Ok(tradeAccountContact);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        public IHttpActionResult DeleteTradeAccountContact([FromBody]PassTradeAccountContactID objTradeAccountContactId)
        {
            var tradeAccountContact = portalDb.TradeAccountContacts.Where(p => p.TradeAccountContactID == objTradeAccountContactId.TradeAccountContactID).Single();

            tradeAccountContact.DeletedDT = DateTime.Now;

            portalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult TradeAccountContactSlicerEndpoint([FromBody]PassTradeAccountContactFilters objFilters)
        {
            var data = portalDb.TradeAccountContacts.Where(p =>
                p.Deleted == false &&
                p.TradeAccountID == objFilters.TradeAccountID).ToList();

            if (!String.IsNullOrEmpty(objFilters.term))
            {
                data = data.Where(p => p.FullName.StartsWith(objFilters.term)).ToList();
            }

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult LaunchSlicerEndpoint()
        {
            var results = portalDb.Launches.Where(p => p.TradeLaunchDate != null).OrderByDescending(p => p.LaunchID).ToList();

            return Ok(results);
        }

        //[HttpPost]
        //public IHttpActionResult FetchPatternBooks([FromBody]PassLaunchID objLaunch)
        //{
        //    var results = portalDb.Products.Where(p => 
        //        p.ProductGroupID == 17 && 
        //        (
        //            p.Status == "C" ||
        //            p.Status == "Y" ||
        //            p.Status == "L"
        //        ) &&
        //        p.LaunchID == objLaunch.LaunchID
        //    )
        //    .OrderBy(p => p.Name)
        //    .ToList();

        //    var textInfo = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo;

        //    results.ForEach(c =>
        //    {
        //        c.Name = textInfo.ToTitleCase(c.Name);
        //    });

        //    return Ok(results);
        //}
        
        [HttpPost]
        public IHttpActionResult ProductGroupSlicerEndpoint([FromBody]PassProductSearchAutocompleteFilters objFilters)
        {
            var data = portalDb.ProductFilters.ToList();

            var productGroups = data.Where(p =>
                //(objFilters.ProductGroupID == null || objFilters.ProductGroupID == p.ProductGroupID) &&
                (objFilters.ItemTypeID == null || objFilters.ItemTypeID == p.ItemTypeID)
            ).Select(p => new { Name = p.ProductGroupName, ProductGroupID = p.ProductGroupID }).Distinct().OrderBy(p => p.Name).ToList();

            return Ok(productGroups);
        }

        [HttpPost]
        public IHttpActionResult ItemTypeSlicerEndpoint([FromBody]PassProductSearchAutocompleteFilters objFilters)
        {
            var data = portalDb.ProductFilters.ToList();

            var itemTypes = data.Where(p =>
                (objFilters.ProductGroupID == null || objFilters.ProductGroupID == p.ProductGroupID)// &&
                //(objFilters.ItemTypeID == null || objFilters.ItemTypeID == p.ItemTypeID)
            ).Select(p => new { Name = p.ItemTypeName, ItemTypeID = p.ItemTypeID }).Distinct().OrderBy(p => p.Name).ToList();

            return Ok(itemTypes);
        }

        [HttpPost]
        public IHttpActionResult VisitProductSearchAutocomplete([FromBody]PassProductSearchAutocompleteFilters objFilters)
        {
            var data = portalDb.ProductSearch_Autocomplete(objFilters);

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult SaveCustomerVisit(SaveVisitModel objVisit)
        {
            var extant = portalDb.TradeAccountVisits.Where(p => p.TradeAccountVisitID == objVisit.TradeAccountVisitID).SingleOrDefault();

            if (extant == null)
            {
                var visit = portalDb.TradeAccountVisits.Add(new TradeAccountVisit()
                {
                    TradeAccountID = objVisit.TradeAccountID,
                    Notes = objVisit.Notes,
                    VisitDT = objVisit.VisitDT
                });

                portalDb.SaveChanges();

                if (objVisit.Attendees != null)
                {
                    foreach (var i in objVisit.Attendees)
                    {
                        portalDb.TradeAccountVisit_TradeAccountContacts.Add(new TradeAccountVisit_TradeAccountContact() { TradeAccountContactID = i.TradeAccountContactID, TradeAccountVisitID = visit.TradeAccountVisitID });
                    }

                    portalDb.SaveChanges();
                }
            }
            else
            {
                extant.VisitDT = objVisit.VisitDT;
                extant.Notes = objVisit.Notes;

                var attendees = portalDb.TradeAccountVisit_TradeAccountContacts.Where(p => p.TradeAccountVisitID == objVisit.TradeAccountVisitID).ToList();

                portalDb.TradeAccountVisit_TradeAccountContacts.RemoveRange(attendees);

                if (objVisit.Attendees != null)
                {
                    foreach (var i in objVisit.Attendees)
                    {
                        portalDb.TradeAccountVisit_TradeAccountContacts.Add(new TradeAccountVisit_TradeAccountContact() { TradeAccountContactID = i.TradeAccountContactID, TradeAccountVisitID = objVisit.TradeAccountVisitID.Value });
                    }
                }

                var products = portalDb.TradeAccountVisit_Products.Where(p => p.TradeAccountVisitID == objVisit.TradeAccountVisitID).ToList();

                portalDb.TradeAccountVisit_Products.RemoveRange(products);

                if (objVisit.Products != null)
                {
                    foreach (var p in objVisit.Products)
                    {
                        portalDb.TradeAccountVisit_Products.Add(new TradeAccountVisit_Product()
                        {
                            TradeAccountVisitID = objVisit.TradeAccountVisitID.Value,
                            ProductID = p.ProductID,
                            Quantity = p.Quantity
                        });
                    }
                }
                
                portalDb.SaveChanges();
            }

            if (objVisit.ConfirmAndSend)
            {
                extant.OrderConfirmed = true;
                extant.OrderEmailedDT = DateTime.Now;
                extant.OrderEmailRecipient = objVisit.RecipientEmail;
                
                var user = userManager.FindById(User.Identity.GetUserId<int>());
                
                var tradeAccount = portalDb.TradeAccounts.Where(p => p.TradeAccountID == objVisit.TradeAccountID).Single();

                var productIds = objVisit.Products.Select(q => q.ProductID).ToList();
                
                portalDb.SaveChanges();

                System.Threading.Tasks.Task.Factory.StartNew(() =>
                {
                    var products = portalDb.Products.Where(p => productIds.Contains(p.ProductID)).OrderBy(p => p.Code).ToList();

                    var productRows = "";
                    products.ForEach(c => {

                        var pr = objVisit.Products.Where(p => p.ProductID == c.ProductID).Single();

                        productRows += $@"<tr>
<td>
{c.Code}
</td>
<td>
{c.BasketName}
</td>
<td>
{pr.Quantity}
</td>
</tr>";
                    });

                    var subject = "Please Place this Order";
                    var body = $@"<p class='hello'>
                        Hello,
                    </p>
                    <p>
                        {user.FullName} has requested that you place the following order.
                    </p>
<h2 style=""font-weight: bold"">
Account: {tradeAccount.Code}
</h2>
<table>
<colgroup>
<col width=""110px"" />
<col />
<col width=""60px"" />
</colgroup>
<thead>
<tr>
<th>
Code
</th>
<th>
Name
</th>
<th>
Quantity
</th>
</tr>
</thead>
<tbody>
{productRows}
</tbody>
</table>
<p class=""goodbye"">
Thank you
</p>
";

                    userManager.EmailService.SendAsync(new IdentityMessage()
                    {
                        Body = body,
                        Subject = subject,
                        Destination = objVisit.RecipientEmail
                    });
                });
            }

            return Ok(extant);
        }

        [HttpPost]
        public IHttpActionResult FetchPatternBooks([FromBody]PassCustomerPatternBook objSearch)
        {
            var result = portalDb.FetchCustomerPatternBooks(objSearch);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult AddTradeAccountAddress([FromBody]PassNewTradeAccountAddress objAddress)
        {
            var ta = new TradeAccountAddress()
            {
                TradeAccountID = objAddress.tradeAccountId,
                AddressLine1 = objAddress.addressLine1,
                AddressLine2 = objAddress.addressLine2,
                Town = objAddress.town,
                County = objAddress.county,
                Postcode = objAddress.postcode,
                CountryID = objAddress.countryId,
                Name = objAddress.name,
                Label = objAddress.label,
                ModifiedDT = DateTime.Now
            };

            portalDb.TradeAccountAddresses.Add(ta);

            portalDb.SaveChanges();

            if (objAddress.tags != null)
            {
                portalDb.TradeAccountAddressTags.AddRange(objAddress.tags.ConvertAll<TradeAccountAddress_Tag>(c =>
                {
                    return new TradeAccountAddress_Tag()
                    {
                        TagID = c.TagID,
                        TradeAccountAddressID = ta.TradeAccountAddressID
                    };
                }));
            }

            portalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult UpdateTradeAccountAddress([FromBody]PassNewTradeAccountAddress objAddress)
        {
            var addr = portalDb.TradeAccountAddresses.Where(p => p.TradeAccountAddressID == objAddress.tradeAccountAddressId).Single();

            addr.Name = objAddress.name;
            addr.Label = objAddress.label;
            addr.AddressLine1 = objAddress.addressLine1;
            addr.AddressLine2 = objAddress.addressLine2;
            addr.Town = objAddress.town;
            addr.County = objAddress.county;
            addr.Postcode = objAddress.postcode;
            addr.CountryID = objAddress.countryId;
            addr.ModifiedDT = DateTime.Now;

            if (objAddress.tags != null)
            {
                var extant = portalDb.TradeAccountAddressTags.Where(p => p.TradeAccountAddressID == objAddress.tradeAccountAddressId).ToList();

                var removals = extant.Except(objAddress.tags, new TradeAccountAddressTagComparer());

                portalDb.TradeAccountAddressTags.RemoveRange(removals);

                portalDb.SaveChanges();

                var additions = objAddress.tags.Except(extant, new TradeAccountAddressTagComparer()).ToList();

                additions.ForEach(c => 
                {
                    c.TradeAccountAddressID = addr.TradeAccountAddressID;
                });

                portalDb.TradeAccountAddressTags.AddRange(additions);
            }

            portalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult DeleteTradeAccountAddress([FromBody]PassNewTradeAccountAddress objAddress)
        {
            var addr = portalDb.TradeAccountAddresses.Where(p => p.TradeAccountAddressID == objAddress.tradeAccountAddressId).Single();

            addr.DeletedDT = DateTime.Now;

            portalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult SetDefaultDeliveryAddress([FromBody]PassNewTradeAccountAddress objAddress)
        {
            var ta = portalDb.TradeAccounts.Where(p => p.TradeAccountID == objAddress.tradeAccountId).Single();

            ta.DefaultDeliveryTradeAccountAddressID = objAddress.tradeAccountAddressId;

            portalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult SetDefaultVisitAddress([FromBody]PassNewTradeAccountAddress objAddress)
        {
            var ta = portalDb.TradeAccounts.Where(p => p.TradeAccountID == objAddress.tradeAccountId).Single();

            ta.DefaultVisitTradeAccountAddressID = objAddress.tradeAccountAddressId;

            portalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult saveActualRetailAppointmentDetails([FromBody]PassActualRetailAppointmentDetails objSave)
        {
            var l = portalDb.Leads.Where(p => p.LeadID == objSave.leadId).Single();

            l.RetailAppointmentActualDate = objSave.date;
            l.RetailAppointmentActualShop = objSave.shop;
            l.RetailAppointmentActualTime = objSave.time;
            l.RetailAppointmentActualTypeID = objSave.type;
            l.RetailAppointmentActualAssistant = objSave.assistant;

            portalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public HttpResponseMessage CustomerContactSpreadsheet([FromBody] PassTradeAccountIDs tradeAccountIds)
        {
            var json = portalDb.FetchTradeAccountContactDetails(tradeAccountIds);

            var result = new HttpResponseMessage(HttpStatusCode.OK);
            result.Content = new ByteArrayContent(FileWriter.Writer.WriteFileStream("Trade-Account-Contacts", "xlsx", json.JSON, true, true, 15, 13, 5, 26).Buffer);
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/octet-stream");

            return result;
        }

        [HttpPost]
        public DataSourceResult TagSlicerEndpoint(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            var data = portalDb.Tags.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList();

            return data.AsQueryable().ToDataSourceResult(request);
        }
    }


    public class PassActualRetailAppointmentDetails
    {
        public long leadId { get; set; }
        public string time { get; set; }
        public string shop { get; set; }
        public DateTime? date { get; set; }
        public byte? type { get; set; }
        public string assistant { get; set; }
    }

    internal class TradeAccountAddressTagComparer : IEqualityComparer<TradeAccountAddress_Tag>
    {
        public bool Equals(TradeAccountAddress_Tag x, TradeAccountAddress_Tag y)
        {
            return (x.TagID == y.TagID); // && (x.TradeAccountAddressID == y.TradeAccountAddressID)
        }

        public int GetHashCode(TradeAccountAddress_Tag obj)
        {
            if (obj == null)
                return 0;

            long i = obj.TagID;// ^ obj.TradeAccountAddressID;

            return i.GetHashCode();
        }
    }
}