using DocumentFormat.OpenXml.Vml.Spreadsheet;

using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using Portal.Areas.Sales.ViewModels;
using Portal.Models;
using Portal.Utilities.DynamicRoles;
using Portal.Utilities.ModelBinderAttributes;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Samples;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Sales.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("sales")]
    [RoutePrefix("leads")]
    [Route("{action=index}")]
    public class LeadsController : BaseController
    {
        public LeadsController(ApplicationUserManager userManager, PortalDbContext portalDbContext) 
            : base(userManager, portalDbContext)
        {

        }

        [ActionName("index")]
        public async System.Threading.Tasks.Task<ActionResult> Index(long? leadId) 
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "leads" && p.AreaName == "sales" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());
            
            var preselectedSalesRep = PortalDb.SalesRepresentatives
                                            .Where(p => p.Visible == true && p.MemberID == user.Id)
                                            .SingleOrDefault();
            
            if (preselectedSalesRep != null)
            {
                preselectedSalesRep.SalesMarketID = preselectedSalesRep.SalesRepresentative_SalesMarkets.FirstOrDefault()?.SalesMarketID;
            }

            var powerRoles = new List<int> { 1, 12, 26, 29, 31, 32, 30, 34 };

            var lockedToRep = !user.Roles.Where(p => powerRoles.Contains(p.RoleId)).Any();
            var tradeAccountClasses = PortalDb.TradeAccountClasses.ToList();
            var creditControllers = PortalDb.CreditControllers.Where(cc => cc.Deleted == false).ToList();
            var creditControllerSalesMarketMap = PortalDb.CreditControllerSalesMarketMap.ToList();
            var banks = PortalDb.Banks.Where(b => b.CreditControlVisible == true).OrderBy(b => b.BankCode).ToList();
            var bankSalesMarketMap = PortalDb.BankSalesMarketMap.Include("SalesMarket.Currency").ToList();
            var tradeAccountGroups = PortalDb.TradeAccountGroups.ToList();
            //PortalDb.TradeHauliers.ToList(),
            //PortalDb.TradeCarriages.ToList(),
            //PortalDb.TradeHauliers.ToList(),
            //PortalDb.TradeCarriages.ToList();
            var salesDivisions = PortalDb.SalesDivisions.Where(sd => sd.SalesDivisionCode == "N" || sd.SalesDivisionCode == "T").ToList();

            salesDivisions.ForEach(sd =>
            {
                sd.Name = new System.Globalization.CultureInfo("en-GB").TextInfo.ToTitleCase(sd.Name);
            });

            var deliveryTerms = PortalDb.DeliveryTerms.Where(dt => dt.Name != null).ToList();

            var model = new LeadEnquiryViewModel(
                leadId,
                PortalDb.Channels.Where(p => p.Deleted == false).ToList(),
                PortalDb.LeadStatuses.Where(p => p.Deleted == false && p.Visible == true).ToList(),
                PortalDb.LeadSources.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList(),
                PortalDb.LeadContactTypes.ToList(),
                PortalDb.LeadMagnitudes.Where(p => p.Deleted == false).ToList(),
                PortalFramework.GetClientSideCountries(PortalDb),
                PortalFramework.GetClientSideLanguages(PortalDb),
                PortalDb.Titles.ToList(),
                PortalDb.Currencies.Where(p => p.ISO_4217 != "NZD" && p.ISO_4217 != "AUD").ToList(),
                PortalFramework.GetNextFiveFinancialYears(),
                PortalFramework.GetTradingSinceOptions(),
                PortalFramework.GetYesNo(),
                PortalDb.CompanyTypes.Where(p => p.Deleted == false).OrderBy(p => p.CompanyTypeID).ToList(),
                PortalDb.Competitors.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList(),
                PortalDb.PaymentTerms.Where(p => p.Visible == true).ToList(),
                PortalDb.LeadTypes.ToList(),
                PortalDb.SalesMarkets.Where(p => p.Code != "I" && p.Code != "M" && p.Code != "R").OrderBy(p => p.Name).ToList(),
                PortalDb.AccountTypes.OrderBy(p => p.Name).ToList(),
                PortalDb.CustomerTypes.OrderBy(p => p.Code).ToList(),
                PortalDb.Tags.Where(p => p.Deleted == false).ToList(),
                PortalDb.PaymentOptions.Where(p => p.Deleted == false).ToList(),
                preselectedSalesRep,
                new List<TradeAccountContactType> { new TradeAccountContactType() { TradeAccountContactTypeID = 1, Name = "Standard" } },
                PortalDb.RetailAppointmentType.OrderBy(p => p.SortOrder).ToList(),
                lockedToRep,
                PortalDb.Launches.Where(p => p.TradeLaunchDate != null).Select(p => p.LaunchID).OrderByDescending(p => p).First(),
                tradeAccountClasses,
                creditControllers,
                creditControllerSalesMarketMap,
                banks,
                bankSalesMarketMap,
                tradeAccountGroups,
                salesDivisions,
                deliveryTerms,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("LeadEnquiry/LeadEnquiry", model);
        }
        
        [HttpPost]
        public ActionResult CreateNewLead(PassLeadUpsert objLead)
        {
            if (objLead.CompanyName == null)
                objLead.CompanyName = "N/A";

            var results = PortalDb.LeadUpsert(objLead, User.Identity.GetUserId<int>());
            
            if (results.LeadID != null)
            {
                objLead.LeadContact.leadId = results.LeadID;

                var contact = PortalDb.LeadContactUpsert(objLead.LeadContact);

                objLead.LeadAddress.leadId = results.LeadID;
                objLead.LeadAddress.defaultInvoiceAddress = true;
                objLead.LeadAddress.defaultDeliveryAddress = true;

                var address = PortalDb.LeadAddressUpsert(objLead.LeadAddress);

                var lead = PortalDb.Leads.Where(p => p.LeadID == results.LeadID).Single();

                lead.LeadContactID = contact.LeadContactID;
                lead.DefaultInvoiceLeadAddressID = address.LeadAddressID;
                lead.DefaultDeliveryLeadAddressID = address.LeadAddressID;

                if (!String.IsNullOrEmpty(objLead.Note))
                {
                    var userId = User.Identity.GetUserId<int>();

                    PortalDb.LeadNotes.Add(new LeadNote()
                    {
                        LeadID = results.LeadID.Value,
                        Note = objLead.Note,
                        MemberID = userId,
                        CreatedDT = DateTime.Now
                    });
                }

                PortalDb.SaveChanges();
            }

            var dashboardMembers = PortalDb.Leads
                                            .Where(p => p.OwnerMember != null)
                                            .Select(p => p.OwnerMember)
                                            .ToList();

            var clientSideDashboardMembers = dashboardMembers.Distinct()
                                                                .ToList()
                                                                .ConvertAll(p => new ClientSideMember()
                                                                {
                                                                    MemberID = p.MemberID,
                                                                    FullName = p.FullName,
                                                                    Email = p.Email
                                                                })
                                                                .OrderBy(p => p.FullName)
                                                                .ToList();

            return Content(JsonConvert.SerializeObject(new { LeadID = results.LeadID, dashboardMembers = clientSideDashboardMembers }, 
                new JsonSerializerSettings() {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                    PreserveReferencesHandling = PreserveReferencesHandling.None
                }));
        }

        [HttpPost]
        public ActionResult SaveNewNote(PassLeadNote objNote)
        {
            var userId = User.Identity.GetUserId<int>();
            
            PortalDb.LeadNotes.Add(new LeadNote()
            {
                LeadID = objNote.LeadID,
                Note = objNote.Note,
                MemberID = userId,
                CreatedDT = DateTime.Now
            });

            PortalDb.SaveChanges();

            var notes = PortalDb.LeadNotes.Include("CreatedBy").Where(p => p.LeadID == objNote.LeadID).OrderByDescending(p => p.CreatedDT).ToList();

            return Content(JsonConvert.SerializeObject(notes,
                new JsonSerializerSettings()
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                    PreserveReferencesHandling = PreserveReferencesHandling.None
                }));
        }

        [AllowAnonymous]
        public ActionResult FacebookPlatform()
        {
            return View("Facebook/PermissionGranter");
        }

        public ActionResult TestBed()
        {
            //ViewBag.PreselectedLaunchID = portalDb.Launches.Where(p => p.TradeLaunchDate != null).Select(p => p.LaunchID).OrderByDescending(p => p).First();

            //ViewBag.TradeAccount = portalDb.TradeAccounts.Where(p => p.TradeAccountID == 6400).Single();

            //ViewBag.ProductFilterButtons = portalDb.FetchProductSearchFilters(new PassProductSearchFilter() {
            //    launchId = null,
            //    clearance = false,
            //    searchNew = false
            //});

            //var brandIds = new List<byte>() { 1, 2, 3, 4, 5, 6, 8, 9, 14 };

            //ViewBag.BrandFilterButtons = portalDb.Brands.Where(p => brandIds.Contains(p.BrandID)).OrderBy(p => p.SortOrder).ToList();

            //ViewBag.LaunchFilterButtons = portalDb.Launches.Where(p => p.TradeLaunchDate != null &&
            //    !p.Name.Contains("Mid")).OrderByDescending(p => p.LaunchID).Take(4).ToList();

            //ViewBag.PatternFilterButtons = portalDb.Patterns.Where(p => p.Deleted == false).OrderBy(p => p.PatternID).ToList();

            //ViewBag.ItemTypeFilterButtons = portalDb.ItemTypeSelect(new PassProductSearch() { productFilterId = null });

            //ViewBag.MartindaleFilterButtons = portalDb.Martindales.OrderBy(p => p.MartindaleID).ToList();

            //ViewBag.DeliveryFOCReasons = portalDb.DeliveryFOCReasons.OrderBy(p => p.DeliveryFOCReasonID).ToList();

            return View("TestBed/TestBed");
        }
    }
}