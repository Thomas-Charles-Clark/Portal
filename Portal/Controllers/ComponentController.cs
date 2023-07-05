using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using Portal.Models;
using Portal.ViewModels.ComponentModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Applications;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Portal.Controllers
{
    [Authorize]
    public class ComponentController : BaseController
    {
        public ComponentController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        /// <summary>
        /// Right.
        /// 
        /// You're either able to search the entire complement of trade accounts
        /// or your particular subset of trade accounts
        /// or not search at all, being limited to just one trade account for use.
        /// 
        /// We need to ensure that whatever I'm doing doesn't affect John Lewis, so bear that in mind before publishing.
        /// 
        /// What if... you're not allowed to search, but you're supposed to be able to search your subset?
        /// 
        /// Well, we'd have to select a trade account from your subset and call that the default...
        /// 
        /// We've also got the oddity that TradeAccountID exists on mbr.Member - is it null...
        /// AHA! It isn't null, it is there simply to cater for John Lewis.
        /// 
        /// So we can't remove that, or functionality upon which that relies, until we're good and ready.
        /// 
        /// Fine.
        /// 
        /// So it would behoove me to make sure that the John Lewis users relying on that method actually have the correct trade account relationship record.
        ///
        /// They now do.
        ///
        /// We still have the issue of whether or not you're "allowed" to search - and if you're NOT allowed to search, which of your trade account relationship records should be the default?
        /// the one which is selected as a matter of course? the one which is referenced by TradeAccountID in mbr.Member?
        /// 
        /// Do we need a Default flag on mbr.Member_TradeAccount? How do we maintain it? That's out of my remit at the moment.
        /// 
        /// What should we do in case of error? When you're restricted and yet don't have a default?
        /// - Inform the user politely and they'll contact us saying that they've found the error, it is explicit in its statement and it can easily be remedied.
        /// 
        /// Does having records in mbr.Member_TradeAccount act as the instruction that you are not to see any other trade accounts than these? Yes, that sounds reasonable.
        /// 
        /// The limiting is done by the woosit, stored procedure.
        /// 
        /// What about the default selectioneering.
        /// 
        /// </summary>
        /// <param name="canSearch"></param>
        /// <param name="canCollapse"></param>
        /// <returns></returns>
        public ActionResult TradeAccountSelector(bool? canSearch, bool? canCollapse, bool orderProductsExtension = false)
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());
            
            var selected = user.DefaultTradeAccount;
            
            TradeAccountNumber_AutocompleteResult tradeAccountResult = null;

            TradeAccountAddressReturn addressesResult = null;

            var autocompleteResult = PortalDb.TradeAccountNumber_Autocomplete(selected?.Name, user.Id, selected?.TradeAccountID).FirstOrDefault();

            if (autocompleteResult != null)
            {
                tradeAccountResult = autocompleteResult;
                addressesResult = PortalDb.TradeAccountNumber_FetchAddresses(tradeAccountResult.Code);
            }
            else
            {
                if (selected != null)
                {
                    tradeAccountResult = new TradeAccountNumber_AutocompleteResult()
                    {
                        TradeAccountID = selected.TradeAccountID,
                        TradeAccountGroupID = selected.TradeAccountGroupID,
                        TradePriceListID = selected.TradePriceListID,
                        Label = selected.Code + " - " + selected.Name,
                        Code = selected.Code,
                        Name = selected.Name,
                        CountryCode = selected.CountryCode,
                        Email = selected.Email,
                        SampleCARRCODE = selected.SampleCARRCODE,
                        SampleHAULCODE = selected.SampleHAULCODE,
                        SampleOwnHaulierAccNo = selected.SampleOwnHaulierAccNo,
                        PriceList = selected.TradePriceList.Code,
                        OrderConfirmationLanguageID = selected.TradeLanguage?.LanguageID,
                        MarketID = selected.TradePriceList.MarketID,
                        CurrencyID = selected.CurrencyID,
                        CurrencySymbol = selected.Currency?.Symbol,
                        CurrencyCulture = selected.Currency?.FormattingCulture,
                        CurrencyCode = selected.Currency?.Code,
                        Memo = selected.Memo,
                        CreditLimit = 10000,//selected.CreditLimit,
                        CreditStatus = "On Stop - O/S Balance",
                        DeliveryType = selected.DeliveryType,
                        UPSAccountNumber = selected.UPSAccountNumber,
                        DHLAccountNumber = selected.DHLAccountNumber,
                        SampleOrderConfirmationTopText = "",
                        SampleOrderConfirmationTopTextReadOnly = ""
                    };

                    addressesResult = PortalDb.TradeAccountNumber_FetchAddresses(tradeAccountResult.Code);
                }
            }
            // TODO: Determine if user (or usage context) is permitted to select a different trade account from the one associated to their login.
            var model = new TradeAccountSelectorViewModel(autocompleteResult,
                                                          addressesResult,
                                                          canSearch ?? false,
                                                          canCollapse ?? true,
                                                          user.GetActiveRoleProperties(),
                                                          orderProductsExtension,
                                                          PortalDb.TradeMarkets.Where(p => p.Deleted == false).OrderBy(p => p.Code).ToList());

            return PartialView("Components/_TradeAccountSelector", model);
        }

        public ActionResult ProductSearch()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new ProductSearchViewModel(user.GetActiveRoleProperties());

            return PartialView("Components/_ProductSearch", model);
        }

        public ActionResult OrderSearch()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new OrderSearchViewModel(user.DefaultTradeAccount?.TradeAccountGroup?.TradeAccountGroupID,
                                                 user.DefaultTradeAccount?.TradeAccountID,
                                                 PortalDb.ProductTypes.ToList(),
                                                 user.GetActiveRoleProperties()?.Application_ButtonClass);

            return PartialView("Components/_OrderSearch", model);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult OrderEnquirySearch(PassOrderEnquirySearch objEnquiry)
        {
            var results = PortalDb.TradeOrderEnquirySearch(objEnquiry);

            return Json(results, JsonRequestBehavior.DenyGet);
        }

        public ActionResult CareSearch()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new CareRecordsViewModel(user.DefaultTradeAccount?.TradeAccountGroup?.TradeAccountGroupID,
                                                 user.DefaultTradeAccount?.TradeAccountID,
                                                 PortalDb.ProductTypes.ToList(),
                                                 user.GetActiveRoleProperties()?.Application_ButtonClass);

            return PartialView("Components/_CareSearch", model);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult CareSearch(PassCareSearch objEnquiry)
        {
            var results = PortalDb.CustomerCareEnquiry(objEnquiry);

            return Json(results, JsonRequestBehavior.DenyGet);
        }

        public ActionResult TaskSearch()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new TaskSearchViewModel(user.DefaultTradeAccount?.TradeAccountGroup?.TradeAccountGroupID,
                                                 user.DefaultTradeAccount?.TradeAccountID,
                                                 user.GetActiveRoleProperties()?.Application_ButtonClass);

            return PartialView("Components/_TaskSearch", model);
        }

        public ActionResult VisitSearch()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new VisitSearchViewModel(user.DefaultTradeAccount?.TradeAccountID,
                                                 user.GetActiveRoleProperties()?.Application_ButtonClass);

            return PartialView("Components/_VisitSearch", model);
        }

        public ActionResult LeadSearch()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());
            var dateOffset = DateTime.Now.AddMonths(-6);
            var dashboardMembers = PortalDb.Leads
                                            .Where(p => p.Deleted == false && p.OwnerMember != null && p.ModifiedDT > dateOffset)
                                            .Select(p => p.OwnerMember)
                                            .ToList();

            dashboardMembers.AddRange(PortalDb.Users.Where(u => u.Deleted == false && u.InvalidEmail == false && u.Roles.Select(r => r.RoleId).Contains(13)));

            dashboardMembers = dashboardMembers.Distinct().ToList();

            var clientSideDashboardMembers = dashboardMembers.Distinct()
                                                                .ToList()
                                                                .ConvertAll(p => new ClientSideMember()
                                                                {
                                                                    MemberID = p.MemberID,
                                                                    FullName = p.FullName,
                                                                    Email = p.Email
                                                                }).ToList();

            ClientSideMember preselectedDashboardUser = null;

            if (clientSideDashboardMembers.Select(p => p.MemberID).Contains(user.Id))
            {
                preselectedDashboardUser = new ClientSideMember()
                {
                    MemberID = user.Id,
                    Email = user.Email,
                    FullName = user.FullName
                };
            }

            clientSideDashboardMembers = clientSideDashboardMembers.OrderBy(p => p.FullName).ToList();

            clientSideDashboardMembers.Insert(0, new ClientSideMember()
            {
                MemberID = null,
                Email = null,
                FullName = "Everyone"
            });

            if (user.GetActiveRoleProperties()?.LeadsPermissions == null)
            {
                clientSideDashboardMembers.RemoveAll(c => c.MemberID != user.Id);
            }
            else
            {
                if (user.GetActiveRoleProperties()?.LeadsPermissions.MayViewOthersLeads == false)
                {
                    clientSideDashboardMembers.RemoveAll(c => c.MemberID != user.Id);
                }
            }

            if (clientSideDashboardMembers.Where(p => p.MemberID == user.Id).SingleOrDefault() == null)
            {
                preselectedDashboardUser = new ClientSideMember()
                {
                    MemberID = user.Id,
                    Email = user.Email,
                    FullName = user.FullName
                };

                clientSideDashboardMembers.Add(preselectedDashboardUser);
            }

            var countries = PortalFramework.GetClientSideCountries(PortalDb);

            var preselectedDashboardCountry = countries.Where(p => p.CountryID == user.MarketingCountryID).FirstOrDefault();

            // Frida Skoglund needs the default market to not be selected.
            if (user.Id == 1299294)
            {
                preselectedDashboardCountry = null;
            }

            var model = new LeadSearchViewModel(
                user.DefaultTradeAccount?.TradeAccountGroup?.TradeAccountGroupID,
                user.DefaultTradeAccount?.TradeAccountID,
                PortalFramework.GetClientSideCountries(PortalDb),
                PortalFramework.GetClientSideLanguages(PortalDb),
                PortalDb.LeadStatuses.Where(p => p.Visible == true && (p.Deleted == false || p.LeadStatusID == 254)).OrderBy(p => p.SortOrder).ToList(),
                PortalDb.LeadSources.Where(p => p.Deleted == false).ToList(),
                clientSideDashboardMembers,
                preselectedDashboardUser,
                preselectedDashboardCountry,
                PortalDb.LeadTypes.ToList(),
                user.GetActiveRoleProperties());

            return PartialView("Components/_LeadSearch", model);
        }

        public ActionResult MemberSearch(string clientObjectName, bool showClearButton, string validationElement, PassMemberSearchProperties objProperties)
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());
            
            foreach (var i in objProperties.AdditionalOptions)
            {
                if (i.Value.MemberID == -1)
                {
                    i.Value.MemberID = user.MemberID;
                    i.Value.FullName = user.FullName;
                    i.Value.Email = user.Email;
                }
            }
            
            var model = new MemberSearchViewModel(user.DefaultTradeAccount?.TradeAccountGroup?.TradeAccountGroupID,
                                                 user.DefaultTradeAccount?.TradeAccountID,
                                                 user.GetActiveRoleProperties()?.Application_ButtonClass,
                                                 clientObjectName,
                                                 showClearButton,
                                                 validationElement,
                                                 objProperties?.AdditionalOptions,
                                                 user.RecentlyUsedMembers.Select(p => p.OtherMember).ToList().ConvertAll(p => new ClientSideMember() { MemberID = p.MemberID, FullName = p.FullName, Email = p.Email }));
            
            return PartialView("Components/_MemberSearch", model);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult MemberSearch(PassMemberSearch objMemberSearch)
        {
            var results = PortalDb.MemberSearch(objMemberSearch);

            return Json(results, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult LeadOwnerSearch(PassMemberSearch objMemberSearch)
        {
            var results = PortalDb.Users.Where(p => p.Roles.Where(q => q.RoleId == 1 || q.RoleId == 25).Any() &&
                                                    
                                                    (p.FullName.StartsWith(objMemberSearch.term) || p.Email.StartsWith(objMemberSearch.term))
                                                    
                                                    ).ToList();

            if (results.Count == 0)
            {
                results = PortalDb.Users.Where(p => p.Roles.Where(q => q.RoleId == 1 || q.RoleId == 25).Any() &&
                                                    (p.FullName.Contains(objMemberSearch.term) || p.Email.Contains(objMemberSearch.term))
                                                    ).ToList();
            }

            var result = new MemberSearchViewResult()
            {
                Members = results.Select(p => new MemberSearchResult()
                {
                    Email = p.Email,
                    FullName = p.FullName,
                    MemberID = p.MemberID,
                    PhoneNumber = p.PhoneNumber
                }).ToList(),
                TotalResultsCount = 0
            };
            
            return Content(JsonConvert.SerializeObject(result, new JsonSerializerSettings()
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                PreserveReferencesHandling = PreserveReferencesHandling.None
            }));
        }

        [HttpPost]
        public ActionResult MemberAutocomplete(string term)
        {
            var results = PortalDb.Users.Where(p => p.Deleted == false && p.MemberTypeID == 1 && 
                            (
                                p.FullName.StartsWith(term)
                            )
                            ).OrderBy(p => p.FullName).Skip(0).Take(50).ToList().ConvertAll(p => new ClientSideMember() { MemberID = p.MemberID, FullName = p.FullName, Email = p.Email }).ToList();
            
            return Json(results, JsonRequestBehavior.DenyGet);
            //return Content(JsonConvert.SerializeObject(results, new JsonSerializerSettings()
            //{
            //    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            //    PreserveReferencesHandling = PreserveReferencesHandling.None
            //}));
        }

        public ActionResult RecentlyUsedMembers()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new RecentlyUsedMembersViewModel(user.RecentlyUsedMembers.Select(p => p.OtherMember).ToList(),
                                                         user.GetActiveRoleProperties()?.Application_ButtonClass);

            return PartialView("Components/_RecentlyUsedMembers", model);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult UpdateRecentlyUsedMembers(int memberId)
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (user.RecentlyUsedMembers.Count() == 15)
            {
                user.RecentlyUsedMembers.Remove(user.RecentlyUsedMembers.OrderByDescending(p => p.UsedDT).Last());
            }
            
            user.RecentlyUsedMembers.Add(new Member_RecentlyUsedMember() { MemberID = user.Id, OtherMemberID = memberId });
            
            UserManager.Update(user);
            
            // Not updating - of course it isn't, how is identity framework's .Update method supposed to know about my Member_RecentlyUsedMember if I haven't informed it?
            // so write an update method...?
            //userManager.UpdateAsync(user);
           
            return Json(new { }, JsonRequestBehavior.DenyGet);
        }
        
        public ActionResult TradeAddressSelector()
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult SetSelectedTradeAccount(int? tradeAccountId)
        {
            Session["selectedTradeAccountId"] = tradeAccountId;
            return Json(new { }, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult FetchAddresses(PassTradeAccountNumber objAccountNumber)
        {
            var queryResults = PortalDb.TradeAccountNumber_FetchAddresses(objAccountNumber.accountNumber);

            return Json(queryResults, JsonRequestBehavior.DenyGet);
        }

        public ActionResult GetExchangeRates()
        {
            var exchangeRates = PortalDb.MertexExchangeRates
                                        .Where(p => p.Code != null && p.Code.Trim() != "UDS")
                                        .Select(p => new { Code = p.Code, Rate = p.ExchangeRate })
                                        .Distinct()
                                        .ToDictionary(p => p.Code, p => p.Rate);

            var q = PortalDb.MertexExchangeRates.ToList();

            return Json(new {
                @base = "GBP",
                rates = exchangeRates
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult CompetitorAutocomplete(PassAutocompleteTerm objAutocomplete)
        {
            var results = PortalDb.Competitors.Where(p => 
                p.Deleted == false &&
                p.Name.StartsWith(objAutocomplete.term)
            ).OrderBy(p => p.Name).Skip(0).Take(20).ToList();

            return Content(JsonConvert.SerializeObject(results));
            //return Json(results, JsonRequestBehavior.DenyGet);
        }
        
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult PriceCheckerAutocomplete(PassAutocompleteTerm objAutocomplete)
        {
            var results = new List<PriceCheckerAutocompleteResult>();

            results.Add(new PriceCheckerAutocompleteResult() { Type = "FreeText", ID = objAutocomplete.term, Name = "Search for '" + objAutocomplete.term + "'" });

            System.Globalization.TextInfo ti = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo;

            var suggestions = PortalDb.SearchTerm_KeywordHint(objAutocomplete)
                                    .Select(p => new PriceCheckerAutocompleteResult()
                                    {
                                        Type = "FreeText",
                                        ID = p.Keyword,
                                        Name = "Did you mean: '" + ti.ToTitleCase(p.Keyword) + "'"
                                    })
                                    .OrderBy(p => p.ID);
            
            var brands = PortalDb.Brands
                                 .Where(x => x.Name.StartsWith(objAutocomplete.term))
                                 .Select(p => new PriceCheckerAutocompleteResult()
                                 {
                                     Type = "Brand",
                                     ID = p.BrandID.ToString(),
                                     Name = p.Name
                                 })
                                 .OrderBy(p => p.Name);

            var productTypes = PortalDb.ProductTypes
                                       .Where(x => x.Name.StartsWith(objAutocomplete.term))
                                       .Select(p => new PriceCheckerAutocompleteResult()
                                       {
                                           Type = "ProductType",
                                           ID = p.ProductTypeID.ToString(),
                                           Name = p.Name
                                       })
                                       .OrderBy(p => p.Name);

            var collections = PortalDb.Collections
                                      .Where(x => x.Heading == null ?
                                                  x.Name.Contains(objAutocomplete.term) :
                                                  x.Heading.StartsWith(objAutocomplete.term))
                                    .Select(p => new PriceCheckerAutocompleteResult()
                                    {
                                        Type = "Collection",
                                        ID = p.CollectionID.ToString(),
                                        Name = p.Name
                                    })
                                     .Take(50)
                                     .OrderBy(p => p.Name);

            var qualities = PortalDb.Qualities
                                     .Where(p => (p.Name.StartsWith(objAutocomplete.term) || p.Code.StartsWith(objAutocomplete.term)) &&
                                                  p.Products.Any(q => q.Status != "D") &&
                                                  (p.Code.StartsWith("F") || p.Code.StartsWith("P")) &&
                                                  (!p.Code.EndsWith("FR")) &&
                                                  p.Products.Any(q => q.Stock.StockStatusID < 255))
                                     .Select(p => new PriceCheckerAutocompleteResult()
                                     {
                                         Type = "Quality",
                                         ID = p.QualityID.ToString(),
                                         Name = p.Code + " - " + p.Name,
                                         LabelAddition = p.Code.StartsWith("F") ? "FABRIC" : p.Code.StartsWith("P") ? "WALLPAPER" : ""
                                     })
                                     .Take(50)
                                     .OrderBy(p => p.Name);

            var products = PortalDb.Products
                                     .Where(p => 
                                     
                                                    
                                     
                                     
                                                 (p.Name.StartsWith(objAutocomplete.term) || p.Code.StartsWith(objAutocomplete.term)) &&
                                                 (p.ProductTypeID != 55 && p.ProductTypeID != 56))
                                     .Select(p => new PriceCheckerAutocompleteResult()
                                     {
                                         Type = "Product",
                                         ID = p.ProductID.ToString(),
                                         Name = p.Code + " - " + p.Name
                                     })
                                     .Take(50)
                                     .OrderBy(p => p.Name);
            
            results.AddRange(suggestions);
            results.AddRange(brands);
            results.AddRange(productTypes);
            results.AddRange(collections);
            results.AddRange(qualities);
            results.AddRange(products);

            return Content(JsonConvert.SerializeObject(results));
        }


        [HttpPost]
        [ValidateInput(false)]
        public ActionResult OrderEntry_ProductSearchAutocomplete(PassAutocompleteTerm objAutocomplete)
        {
            var results = new List<PriceCheckerAutocompleteResult>();

            results.Add(new PriceCheckerAutocompleteResult() { Type = "FreeText", ID = objAutocomplete.term, Name = "Search for '" + objAutocomplete.term + "'" });

            System.Globalization.TextInfo ti = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo;

            var suggestions = PortalDb.SearchTerm_KeywordHint(objAutocomplete)
                                    .Select(p => new PriceCheckerAutocompleteResult()
                                    {
                                        Type = "FreeText",
                                        ID = p.Keyword,
                                        Name = "Did you mean: '" + ti.ToTitleCase(p.Keyword) + "'"
                                    })
                                    .OrderBy(p => p.ID);

            var brands = PortalDb.Brands
                                 .Where(x => x.Name.StartsWith(objAutocomplete.term))
                                 .Select(p => new PriceCheckerAutocompleteResult()
                                 {
                                     Type = "Brand",
                                     ID = p.BrandID.ToString(),
                                     Name = p.Name
                                 })
                                 .OrderBy(p => p.Name);

            var productTypes = PortalDb.ProductTypes
                                       .Where(x => x.Name.StartsWith(objAutocomplete.term))
                                       .Select(p => new PriceCheckerAutocompleteResult()
                                       {
                                           Type = "ProductType",
                                           ID = p.ProductTypeID.ToString(),
                                           Name = p.Name
                                       })
                                       .OrderBy(p => p.Name);

            var collections = PortalDb.Collections
                                      .Where(x => x.Heading == null ?
                                                  x.Name.Contains(objAutocomplete.term) :
                                                  x.Heading.StartsWith(objAutocomplete.term))
                                        .Select(p => new PriceCheckerAutocompleteResult()
                                        {
                                            Type = "Collection",
                                            ID = p.CollectionID.ToString(),
                                            Name = p.Name
                                        })
                                     .Take(50)
                                     .OrderBy(p => p.Name);

            var qualities = PortalDb.Qualities
                                     .Where(p => (p.Name.StartsWith(objAutocomplete.term) || p.Code.StartsWith(objAutocomplete.term)) &&
                                                  p.Products.Any(q => q.Status != "D") &&
                                                  (p.Code.StartsWith("F") || p.Code.StartsWith("P")) &&
                                                  (!p.Code.EndsWith("FR")) &&
                                                  p.Products.Any(q => q.Stock.StockStatusID < 255))
                                     .Select(p => new PriceCheckerAutocompleteResult()
                                     {
                                         Type = "Quality",
                                         ID = p.QualityID.ToString(),
                                         Name = p.Code + " - " + p.Name,
                                         LabelAddition = p.Code.StartsWith("F") ? "FABRIC" : p.Code.StartsWith("P") ? "WALLPAPER" : ""
                                     })
                                     .Take(50)
                                     .OrderBy(p => p.Name);

            var products = PortalDb.Products
                                     .Where(p => (p.Name.StartsWith(objAutocomplete.term) || p.Code.StartsWith(objAutocomplete.term)) &&
                                                 (p.ProductTypeID != 55 && p.ProductTypeID != 56))
                                     .Select(p => new PriceCheckerAutocompleteResult()
                                     {
                                         Type = "Product",
                                         ID = p.ProductID.ToString(),
                                         Name = p.Code + " - " + p.Name,
                                         Code = p.Code
                                     })
                                     .Take(50)
                                     .OrderBy(p => p.Name);

            results.AddRange(suggestions);
            results.AddRange(brands);
            results.AddRange(productTypes);
            results.AddRange(collections);
            results.AddRange(qualities);
            results.AddRange(products);

            return Content(JsonConvert.SerializeObject(results));
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult OrderEntry_QuickAddProductSearchAutocomplete(PassAutocompleteTerm objAutocomplete)
        {
            var results = new List<PriceCheckerAutocompleteResult>();
            
            var products = PortalDb.Products
                                     .Where(p => (p.Name.StartsWith(objAutocomplete.term) || p.Code.StartsWith(objAutocomplete.term)) &&
                                                 (p.ProductTypeID != 55 && p.ProductTypeID != 56))
                                     .Select(p => new PriceCheckerAutocompleteResult()
                                     {
                                         Type = "Product",
                                         ID = p.ProductID.ToString(),
                                         Name = p.Code + " - " + p.Name,
                                         Code = p.Code
                                     })
                                     .Take(50)
                                     .OrderBy(p => p.Name);

            results.AddRange(products);

            return Content(JsonConvert.SerializeObject(results));
        }


        public ActionResult ProductRangeSelector(string clickFunction, string buttonClass)
        {
            //var cache = new PortalCache<ProductRangeButtonCacheResult>(String.Format("ProductRangeButtons~{0}", "N"));

            //var newCollectionButtons = cache.Get(DateTime.Now);

            //if (newCollectionButtons == null)
            //{
            //    newCollectionButtons = new ProductRangeButtonCacheResult() { Buttons = portalDb.ProductRangeButton_Select("N") };
            //    cache.Set(DateTime.Now, newCollectionButtons, 600);
            //}

            //cache = new PortalCache<ProductRangeButtonCacheResult>(String.Format("ProductRangeButtons~{0}", "C"));

            //var clearanceButtons = cache.Get(DateTime.Now);

            //if (clearanceButtons == null)
            //{
            //    clearanceButtons = new ProductRangeButtonCacheResult() { Buttons = portalDb.ProductRangeButton_Select("C") };
            //    cache.Set(DateTime.Now, clearanceButtons, 600);
            //}

            var newCollectionButtons = new ProductRangeButtonCacheResult() { Buttons = new List<ProductRangeButton>() };

            var clearanceButtons = new ProductRangeButtonCacheResult() { Buttons = new List<ProductRangeButton>() };

            var Model = new ProductRangeSelectorViewModel(
                clickFunction, 
                buttonClass,
                newCollectionButtons.Buttons,
                clearanceButtons.Buttons);

            return PartialView("Components/_ProductRangeSelector", Model);
        }

        [HttpPost]
        public ActionResult sendTradeAccountRequestFormEmail(PassTARFData objEmail)
        {
            if (objEmail.countryId == 0 || objEmail.languageId == 0 || String.IsNullOrEmpty(objEmail.email))
            {
                return new HttpStatusCodeResult(System.Net.HttpStatusCode.ExpectationFailed);
            }
            
            var member = UserManager.FindById(User.Identity.GetUserId<int>());
            
            var leadUpsert = new PassLeadUpsert()
            {
                ChannelID = 0,
                LeadSourceID = 12,
                CountryID = objEmail.countryId, // how are we to determine who is in what country so as to create the initial lead with the correct countryId...
                                // can we go by the countryId the logged-in Member is currently grooving with?
                
                                // this should be overwritten by their submission from the form...
                                // we might eventually need to offer language selection for sending of translated versions
                                // of the email.
                LanguageID = objEmail.languageId,
                LeadStatusID = 253
            };

            var upsertResult = PortalDb.LeadUpsert(leadUpsert, member.MemberID, shouldNotify: false);

            if (upsertResult.LeadID.HasValue)
            {
                if (objEmail.immediateOrderRequested)
                {
                    var lead = PortalDb.Leads.Where(p => p.LeadID == upsertResult.LeadID).Single();
                    lead.ImmediateOrderRequested = true;
                    PortalDb.SaveChanges();
                }

                var leadContactUpsertResult = PortalDb.LeadContactUpsert(
                    new PassLeadContactUpsert()
                    {
                        leadId = upsertResult.LeadID,
                        email = objEmail.email,
                        workPhone = objEmail.phone,
                        fullName = objEmail.name
                    }
                );

                var url = PortalDb.CountryLanguages.FirstOrDefault(p => p.CountryID == objEmail.countryId &&
                                                                           p.LanguageID == objEmail.languageId)
                    ?.URL ?? "dynamic";

                System.Threading.Tasks.Task.Factory.StartNew(() =>
                {
                    var body = "";
                    var subject = "";

                    switch (objEmail.languageId) {
                        case 3:
                            subject = "Merci d'avoir demandé l'ouverture d'un compte professionnel auprès de Designers Guild";
                            body = $@"<p class='hello'>
                            Merci d'avoir demandé l'ouverture d'un compte professionnel auprès de Designers Guild.
                        </p>
                        <p>
                           Designers Guild a été créé en 1970 par Tricia Guild et conçoit et vend des tissus d'ameublement, revêtements muraux, 
                           linges de lit dans plus de 80 pays à travers le monde. La société est dirigée Tricia Guild, fondatrice et directrice de 
                           la création, et son frère, Simon Jeffreys, directeur général du groupe. La philosophie de 
                           Designers Guild est de combiner créativité et innovation avec les plus hauts niveaux de qualité.
                        </p>
                        <p>
                            Afin de demander l'ouverture de compte professionnel, veuillez suivre ce lien 
                            <a href='https://www.designersguild.com/{url}/l540?id={upsertResult.LeadID}'>https://www.designersguild.com/{url}/request-a-trade-account/l540</a> 
                            et remplir le formulaire en ligne.
                        </p>
                        <p>
                            Afin que votre demande soit traitée le plus rapidement possible, nous vous remercions de bien vouloir renseigner un maximum de champs.
                        </p>
                        <p>
                            Dans l’intervalle, vous pouvez consulter notre site <a href='https://www.designersguild.com/{url}/l0'>https://wwww.designersguild.com</a>.
                        </p>
                        <p>
                            Chez Designers nous sommes fiers de vous offrir de magnifiques produits pour votre intérieur et nous espérons que nos produits 
                            vous inspirent a laisser aller votre créativité. Sachez que vous pouvez commander
                        </p>
                        <p class='footer'>
                            Merci de votre intérêt pour nos produits et nos marques.
                        </p>";
                            break;
                        case 4:
                            subject = "Vielen Dank für Ihr Interesse an einem Designers Guild Händler Konto";
                            body = $@"<p class='hello'>
                            Vielen Dank für Ihr Interesse an einem Designers Guild Händler Konto.
                        </p>
                        <p>
                            Designers Guild wurde 1970 von Tricia Guild gegründet und handelt weltweit mit Bezugstoffen, Tapeten sowie Dekostoffe, Bed & Bath Kollektionen. 
                            Eigentümer und Geschäftsführer des Unternehmens sind die Geschwister Tricia Guild U( Gründerin und Creative Director ) und Simon Jeffreys ( Group Chief Executive). 
                            Die Firmenphilosophie von Designers Guild besteht darin, Kreativität und Innovation in höchster Qualität zu verbinden.
                        </p>
                        <p>
                            Um Ihre Anmeldung zu starten klicken Sie bitte auf den folgenden Link 
                            <a href='https://www.designersguild.com/{url}/l540?id={upsertResult.LeadID}'>https://www.designersguild.com/{url}/request-a-trade-account/l540</a> 
                            und füllen Sie das online Formular vollständig aus.
                        </p>
                        <p>
                            Bitte denken Sie daran, umso mehr Informationen Sie uns zu Verfügung stellen umso einfacher und schneller können wir Ihre Anfrage bearbeiten. 
                            Nach Bearbeitung Ihrer Anmeldung erhalten Sie eine Rückmeldung von Ihrem zuständigen Außendienst.
                        </p>
                        <p>
                            In der Zwischenzeit können Sie auf unserer schönen Homepage surfen <a href='https://www.designersguild.com/{url}/l0'>https://wwww.designersguild.com</a>.
                        </p>
                        <p>
                            Wir sind stolz darauf mit unseren schönen Produkten Ihnen eine komplette Lifestyle Marke anzubieten. Unsere Vision ist es, Sie zu inspirieren und 
                            Ihnen ein gutes Gefühl zu vermitteln. Wir hoffen, dass Sie unsere Kollektionen lieben und freuen uns auf Ihre Stoff- oder Tapetenmusterbestellung über unsere Homepage.
                        </p>
                        <p class='footer'>
                            Vielen Dank für Ihr Interesse an Designers Guild.
                        </p>";
                            break;
                        case 5:
                            subject = "Gracias por solicitar una apertura de cuenta cliente con Designers Guild";
                            body = $@"<p class='hello'>
                            Gracias por solicitar una apertura de cuenta cliente con Designers Guild.
                        </p>
                        <p>
                            Fundada en 1970 por Tricia Guild, Designers Guild diseña y vende telas de decoración, papeles pintados, mobiliario y accesorios a nivel mundial. 
                            La compañía está dirigida y es propiedad de dos hermanos, Tricia Guild, fundadora y Directora Creativoa y Simon Jeffreys, 
                            Director Ejecutivo del Grupo. La filosofía empresarial Designers Guild es combinar la creatividad y la innovación con los más altos niveles de calidad
                        </p>
                        <p>
                            Para comenzar su solicitud de cuenta, por favor haga click en el siguiente link
                            <a href='https://www.designersguild.com/{url}/l540?id={upsertResult.LeadID}'>https://www.designersguild.com/{url}/request-a-trade-account/l540</a> 
                            y rellene el formulario 
                        </p>
                        <p>
                           Por favor, recuerde que tiene que proporcionarnos la mayor información posible. Esto nos ayudará a evaluar rápida y eficazmente su solicitud. 
                            Una vez recibida, su solicitud será revisada y uno de nuestros representantes se pondrá en contacto con usted 
                        </p>
                        <p>
                            Mientras tanto, navegue en nuestra página web <a href='https://www.designersguild.com/{url}/l0'>https://wwww.designersguild.com</a>.
                        </p>
                        <p>
                            En Designers Guild, estamos orgullosos de ofrecerles una gama de productos completa para el hogar.  Esperamos inspirarle con nuestras colecciones y recuerde, 
                            puede solicitar muestras de telas o papeles pintados a través de nuestra página web 
                        </p>
                        <p class='footer'>
                            Gracias por su interés en Designers Guild.
                        </p>";
                            break;
                        case 6:
                            subject = "Grazie per aver richiesto un account commerciale con Designers Guild";
                            body = $@"<p class='hello'>
                            Grazie per aver richiesto un account commerciale con Designers Guild.
                        </p>
                        <p>
                            Designers Guild è stata fondata nel 1970 da Tricia Guild e progetta e commercia all'ingrosso; tessuti d'arredamento, rivestimenti murali, 
                            collezioni di tappezzerie , in oltre 80 paesi in tutto il mondo. La società è diretta e di proprietà di fratello e sorella, 
                            Tricia Guild, fondatrice e direttrice creativa, e Simon Jeffreys, amministratore delegato del gruppo. La filosofia di Designers Guild è combinare 
                            creatività e innovazione con i più alti livelli di qualità.
                        </p>
                        <p>
                            Per avviare la procedura di richiesta di iscrizione, fai clic su questo link 
                            <a href='https://www.designersguild.com/{url}/l540?id={upsertResult.LeadID}'>https://www.designersguild.com/{url}/request-a-trade-account/l540</a>
                            e compila il modulo online.
                        </p>
                        <p>
                            Si Ricordi di fornirci quante più informazioni possibili. Questo ci consentirà di valutare la sua applicazione in modo rapido ed efficiente. 
                            Una volta ricevuta, la domanda verrà esaminata e uno dei nostri rappresentanti si mettera' in contatto.
                        </p>
                        <p>
                            Nel frattempo, perché non visitare il nostro sito <a href='https://www.designersguild.com/{url}/l0'>https://wwww.designersguild.com</a>.
                        </p>
                        <p>
                            A Designers Guild, siamo orgogliosi di offrire lo stile di vita completo attraverso i nostri bellissimi prodotti e la nostra visione è quella di ispirare e potenziarvi. 
                            Speriamo che tu ami le nostre collezioni e ricorda che puoi richiedere un campione di tessuto o carta da parati tramite il nostro sito web.
                        </p>
                        <p class='footer'>
                            Grazie per il vostro interesse in Designers Guild.
                        </p>";
                            break;
                        case 10:
                            subject = "Благодарим вас за запрос на открытие бизнес аккаунта в Designers Guild";
                            body = $@"<p class='hello'>
                            Благодарим вас за запрос на открытие бизнес аккаунта в Designers Guild.
                        </p>
                        <p>
                            В 1970 году Триша Гилд основала компанию Designers Guild, известную уникальным дизайном, которая также занимается оптовыми продажами более чем в 80 странах мира и 
                            представляет декоративные ткани, обои, обивочные ткани, коллекции для спальных комнат и ванных комнат. Компанию возглавляют брат и сестра: Тришей Гилд - учредитель 
                            и креативный директор компании, и Саймоном Джеффри - исполнительный директор группы. Философия Designers Guild - это объединение творского подхода, 
                            новаторства и высокого качества материалов.
                        </p>
                        <p>
                            Пожалуйста, заполните форму по этой ссылке:
                            <a href='https://www.designersguild.com/{url}/l540?id={upsertResult.LeadID}'>https://www.designersguild.com/{url}/request-a-trade-account/l540</a>
                            и заполните онлайн-форму.
                        </p>
                        <p>
                            Пожалуйста, сообщите как можно более полную информацию. Это поможет нам быстро и эффективно рассмотреть ваше заявление.
                            Как только мы получим и рассмотрим ваше заявление, оно будет рассмотрено и наш представитель свяжется с вами.
                        </p>
                        <p>
                            Пока ваше заявление на рассмотрении, посетите наш сайт <a href='https://www.designersguild.com/{url}/l0'>https://wwww.designersguild.com</a>.
                        </p>
                        <p>
                            Компания Designers Guild предлагает товары, которые создают совершенный стиль жизни. Наша мечта - вдохновлять вас и придавать энергию. 
                            Мы надеемся, что вам понравятся наши коллекции. Закажите образцы обоев и  тканей через наш сайт.
                        </p>
                        <p class='footer'>
                            Спасибо вам за интерес к Designers Guild.
                        </p>";
                            break;
                        default:
                            subject = "Thank you for requesting a trade account with Designers Guild";
                            body = $@"<p class='hello'>
                            Thank you for requesting a trade account with Designers Guild.
                        </p>
                        <p>
                            Designers Guild was established in 1970 by Tricia Guild and designs and wholesales; furnishing fabrics, wallcoverings, 
                            upholstery and bed and bath collections, to over 80 countries worldwide. The company is headed and owned by brother and 
                            sister, Tricia Guild, Founder and Creative Director, and Simon Jeffreys, Group Chief Executive. The Designers Guild philosophy 
                            is to combine creativity and innovation with the highest levels of quality.
                        </p>
                        <p>
                            To start your trade application process, please click on this link <a href='https://www.designersguild.com/{url}/l540?id={upsertResult.LeadID}'>https://www.designersguild.com/{url}/request-a-trade-account/l540</a>
                            and fill out the online form.
                        </p>
                        <p>
                            Please remember to provide us with as much information as possible. This will enable us to quickly and efficiently 
                            assess your application. Once received, your application will be reviewed and one of our representatives will be in touch.
                        </p>
                        <p>
                            In the meantime, why not browse our website <a href='https://www.designersguild.com/{url}/l0'>https://wwww.designersguild.com</a>.
                        </p>
                        <p>
                            At Designers Guild, we pride ourselves on offering the complete lifestyle through our beautiful products and our vision is to inspire and empower you. 
                            We hope you love our collections and remember, you can request a fabric or wallpaper sample via our website.
                        </p>
                        <p class='footer'>
                            Thank you for your interest in Designers Guild.
                        </p>";
                            break;
                    }

                    UserManager.EmailService.SendAsync(new IdentityMessage()
                    {
                        Body = body,
                        Subject = subject,
                        Destination = objEmail.email
                    });
                });
            }
            else
            {
                Response.StatusCode = 500;
                throw new Exception("Failed to create Lead. Trade Account Request Form email not sent.");
            }
            
            return Json(new { }, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult resendTradeAccountRequestFormEmail(PassResendTARFData objEmail)
        {
            var url = PortalDb.CountryLanguages.Where(p => p.CountryID == objEmail.countryId &&
                                                                        p.LanguageID == objEmail.languageId)
                                                            .Select(p => p.URL).Single();

            System.Threading.Tasks.Task.Factory.StartNew(() =>
            {
                var body = "";
                var subject = "";

                switch (objEmail.languageId)
                {
                    case 3:
                        subject = "Merci d'avoir demandé l'ouverture d'un compte professionnel auprès de Designers Guild";
                        body = $@"<p class='hello'>
                        Merci d'avoir demandé l'ouverture d'un compte professionnel auprès de Designers Guild.
                    </p>
                    <p>
                        Designers Guild a été créé en 1970 par Tricia Guild et conçoit et vend des tissus d'ameublement, revêtements muraux, 
                        linges de lit dans plus de 80 pays à travers le monde. La société est dirigée Tricia Guild, fondatrice et directrice de 
                        la création, et son frère, Simon Jeffreys, directeur général du groupe. La philosophie de 
                        Designers Guild est de combiner créativité et innovation avec les plus hauts niveaux de qualité.
                    </p>
                    <p>
                        Afin de demander l'ouverture de compte professionnel, veuillez suivre ce lien 
                        <a href='https://www.designersguild.com/{url}/l540?id={objEmail.leadId}'>https://www.designersguild.com/{url}/request-a-trade-account/l540</a> 
                        et remplir le formulaire en ligne.
                    </p>
                    <p>
                        Afin que votre demande soit traitée le plus rapidement possible, nous vous remercions de bien vouloir renseigner un maximum de champs.
                    </p>
                    <p>
                        Dans l’intervalle, vous pouvez consulter notre site <a href='https://www.designersguild.com/{url}/l0'>https://wwww.designersguild.com</a>.
                    </p>
                    <p>
                        Chez Designers nous sommes fiers de vous offrir de magnifiques produits pour votre intérieur et nous espérons que nos produits 
                        vous inspirent a laisser aller votre créativité. Sachez que vous pouvez commander
                    </p>
                    <p class='footer'>
                        Merci de votre intérêt pour nos produits et nos marques.
                    </p>";
                        break;
                    case 4:
                        subject = "Vielen Dank für Ihr Interesse an einem Designers Guild Händler Konto";
                        body = $@"<p class='hello'>
                        Vielen Dank für Ihr Interesse an einem Designers Guild Händler Konto.
                    </p>
                    <p>
                        Designers Guild wurde 1970 von Tricia Guild gegründet und handelt weltweit mit Bezugstoffen, Tapeten sowie Dekostoffe, Bed & Bath Kollektionen. 
                        Eigentümer und Geschäftsführer des Unternehmens sind die Geschwister Tricia Guild U( Gründerin und Creative Director ) und Simon Jeffreys ( Group Chief Executive). 
                        Die Firmenphilosophie von Designers Guild besteht darin, Kreativität und Innovation in höchster Qualität zu verbinden.
                    </p>
                    <p>
                        Um Ihre Anmeldung zu starten klicken Sie bitte auf den folgenden Link 
                        <a href='https://www.designersguild.com/{url}/l540?id={objEmail.leadId}'>https://www.designersguild.com/{url}/request-a-trade-account/l540</a> 
                        und füllen Sie das online Formular vollständig aus.
                    </p>
                    <p>
                        Bitte denken Sie daran, umso mehr Informationen Sie uns zu Verfügung stellen umso einfacher und schneller können wir Ihre Anfrage bearbeiten. 
                        Nach Bearbeitung Ihrer Anmeldung erhalten Sie eine Rückmeldung von Ihrem zuständigen Außendienst.
                    </p>
                    <p>
                        In der Zwischenzeit können Sie auf unserer schönen Homepage surfen <a href='https://www.designersguild.com/{url}/l0'>https://wwww.designersguild.com</a>.
                    </p>
                    <p>
                        Wir sind stolz darauf mit unseren schönen Produkten Ihnen eine komplette Lifestyle Marke anzubieten. Unsere Vision ist es, Sie zu inspirieren und 
                        Ihnen ein gutes Gefühl zu vermitteln. Wir hoffen, dass Sie unsere Kollektionen lieben und freuen uns auf Ihre Stoff- oder Tapetenmusterbestellung über unsere Homepage.
                    </p>
                    <p class='footer'>
                        Vielen Dank für Ihr Interesse an Designers Guild.
                    </p>";
                        break;
                    case 5:
                        subject = "Gracias por solicitar una apertura de cuenta cliente con Designers Guild";
                        body = $@"<p class='hello'>
                        Gracias por solicitar una apertura de cuenta cliente con Designers Guild.
                    </p>
                    <p>
                        Fundada en 1970 por Tricia Guild, Designers Guild diseña y vende telas de decoración, papeles pintados, mobiliario y accesorios a nivel mundial. 
                        La compañía está dirigida y es propiedad de dos hermanos, Tricia Guild, fundadora y Directora Creativoa y Simon Jeffreys, 
                        Director Ejecutivo del Grupo. La filosofía empresarial Designers Guild es combinar la creatividad y la innovación con los más altos niveles de calidad
                    </p>
                    <p>
                        Para comenzar su solicitud de cuenta, por favor haga click en el siguiente link
                        <a href='https://www.designersguild.com/{url}/l540?id={objEmail.leadId}'>https://www.designersguild.com/{url}/request-a-trade-account/l540</a> 
                        y rellene el formulario 
                    </p>
                    <p>
                        Por favor, recuerde que tiene que proporcionarnos la mayor información posible. Esto nos ayudará a evaluar rápida y eficazmente su solicitud. 
                        Una vez recibida, su solicitud será revisada y uno de nuestros representantes se pondrá en contacto con usted 
                    </p>
                    <p>
                        Mientras tanto, navegue en nuestra página web <a href='https://www.designersguild.com/{url}/l0'>https://wwww.designersguild.com</a>.
                    </p>
                    <p>
                        En Designers Guild, estamos orgullosos de ofrecerles una gama de productos completa para el hogar.  Esperamos inspirarle con nuestras colecciones y recuerde, 
                        puede solicitar muestras de telas o papeles pintados a través de nuestra página web 
                    </p>
                    <p class='footer'>
                        Gracias por su interés en Designers Guild.
                    </p>";
                        break;
                    case 6:
                        subject = "Grazie per aver richiesto un account commerciale con Designers Guild";
                        body = $@"<p class='hello'>
                        Grazie per aver richiesto un account commerciale con Designers Guild.
                    </p>
                    <p>
                        Designers Guild è stata fondata nel 1970 da Tricia Guild e progetta e commercia all'ingrosso; tessuti d'arredamento, rivestimenti murali, 
                        collezioni di tappezzerie , in oltre 80 paesi in tutto il mondo. La società è diretta e di proprietà di fratello e sorella, 
                        Tricia Guild, fondatrice e direttrice creativa, e Simon Jeffreys, amministratore delegato del gruppo. La filosofia di Designers Guild è combinare 
                        creatività e innovazione con i più alti livelli di qualità.
                    </p>
                    <p>
                        Per avviare la procedura di richiesta di iscrizione, fai clic su questo link 
                        <a href='https://www.designersguild.com/{url}/l540?id={objEmail.leadId}'>https://www.designersguild.com/{url}/request-a-trade-account/l540</a>
                        e compila il modulo online.
                    </p>
                    <p>
                        Si Ricordi di fornirci quante più informazioni possibili. Questo ci consentirà di valutare la sua applicazione in modo rapido ed efficiente. 
                        Una volta ricevuta, la domanda verrà esaminata e uno dei nostri rappresentanti si mettera' in contatto.
                    </p>
                    <p>
                        Nel frattempo, perché non visitare il nostro sito <a href='https://www.designersguild.com/{url}/l0'>https://wwww.designersguild.com</a>.
                    </p>
                    <p>
                        A Designers Guild, siamo orgogliosi di offrire lo stile di vita completo attraverso i nostri bellissimi prodotti e la nostra visione è quella di ispirare e potenziarvi. 
                        Speriamo che tu ami le nostre collezioni e ricorda che puoi richiedere un campione di tessuto o carta da parati tramite il nostro sito web.
                    </p>
                    <p class='footer'>
                        Grazie per il vostro interesse in Designers Guild.
                    </p>";
                        break;
                    case 10:
                        subject = "Благодарим вас за запрос на открытие бизнес аккаунта в Designers Guild";
                        body = $@"<p class='hello'>
                        Благодарим вас за запрос на открытие бизнес аккаунта в Designers Guild.
                    </p>
                    <p>
                        В 1970 году Триша Гилд основала компанию Designers Guild, известную уникальным дизайном, которая также занимается оптовыми продажами более чем в 80 странах мира и 
                        представляет декоративные ткани, обои, обивочные ткани, коллекции для спальных комнат и ванных комнат. Компанию возглавляют брат и сестра: Тришей Гилд - учредитель 
                        и креативный директор компании, и Саймоном Джеффри - исполнительный директор группы. Философия Designers Guild - это объединение творского подхода, 
                        новаторства и высокого качества материалов.
                    </p>
                    <p>
                        Пожалуйста, заполните форму по этой ссылке:
                        <a href='https://www.designersguild.com/{url}/l540?id={objEmail.leadId}'>https://www.designersguild.com/{url}/request-a-trade-account/l540</a>
                        и заполните онлайн-форму.
                    </p>
                    <p>
                        Пожалуйста, сообщите как можно более полную информацию. Это поможет нам быстро и эффективно рассмотреть ваше заявление.
                        Как только мы получим и рассмотрим ваше заявление, оно будет рассмотрено и наш представитель свяжется с вами.
                    </p>
                    <p>
                        Пока ваше заявление на рассмотрении, посетите наш сайт <a href='https://www.designersguild.com/{url}/l0'>https://wwww.designersguild.com</a>.
                    </p>
                    <p>
                        Компания Designers Guild предлагает товары, которые создают совершенный стиль жизни. Наша мечта - вдохновлять вас и придавать энергию. 
                        Мы надеемся, что вам понравятся наши коллекции. Закажите образцы обоев и  тканей через наш сайт.
                    </p>
                    <p class='footer'>
                        Спасибо вам за интерес к Designers Guild.
                    </p>";
                        break;
                    default:
                        subject = "Thank you for requesting a trade account with Designers Guild";
                        body = $@"<p class='hello'>
                        Thank you for requesting a trade account with Designers Guild.
                    </p>
                    <p>
                        Designers Guild was established in 1970 by Tricia Guild and designs and wholesales; furnishing fabrics, wallcoverings, 
                        upholstery and bed and bath collections, to over 80 countries worldwide. The company is headed and owned by brother and 
                        sister, Tricia Guild, Founder and Creative Director, and Simon Jeffreys, Group Chief Executive. The Designers Guild philosophy 
                        is to combine creativity and innovation with the highest levels of quality.
                    </p>
                    <p>
                        To start your trade application process, please click on this link <a href='https://www.designersguild.com/{url}/l540?id={objEmail.leadId}'>https://www.designersguild.com/{url}/request-a-trade-account/l540</a>
                        and fill out the online form.
                    </p>
                    <p>
                        Please remember to provide us with as much information as possible. This will enable us to quickly and efficiently 
                        assess your application. Once received, your application will be reviewed and one of our representatives will be in touch.
                    </p>
                    <p>
                        In the meantime, why not browse our website <a href='https://www.designersguild.com/{url}/l0'>https://wwww.designersguild.com</a>.
                    </p>
                    <p>
                        At Designers Guild, we pride ourselves on offering the complete lifestyle through our beautiful products and our vision is to inspire and empower you. 
                        We hope you love our collections and remember, you can request a fabric or wallpaper sample via our website.
                    </p>
                    <p class='footer'>
                        Thank you for your interest in Designers Guild.
                    </p>";
                        break;
                }

                var user = UserManager.FindById(User.Identity.GetUserId<int>());

#pragma warning disable 4014
                ((EmailService)UserManager.EmailService).SendAsyncWithBCC(new IdentityMessage()
                {
                    Body = body,
                    Subject = subject,
                    Destination = objEmail.email
                },
                user.Email);
            });

            return Json(new { }, JsonRequestBehavior.DenyGet);
        }

        [HttpGet]
        public ActionResult MonthRangeSelector()
        {
            var Model = new MonthRangeSelectorViewModel();

            return PartialView("Components/_MonthRangeSelectorComponent", Model);
        }

        [HttpGet]
        public ActionResult OrderProductsComponent()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var selected = user.DefaultTradeAccount;

            var Model = new OrderProductsViewModel(selected, PortalDb);

            return PartialView("Components/_OrderProductsComponent", Model);
        }

        [HttpGet]
        public ActionResult DownloadBespokeRugInformation()
        {
            return File("~/FileDownloads/bespoke-rug-delivery-and-size-restrictions.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "bespoke-rug-delivery-and-size-restrictions.xlsx");
        }
    }
}

/*
 
Designers Guild was established in 1970 by Tricia Guild and designs and wholesales; furnishing fabrics, wallcoverings, upholstery and bed and bath collections, to over 80 countries worldwide. The company is headed and owned by brother and sister, Tricia Guild, Founder and Creative Director, and Simon Jeffreys, Group Chief Executive.  The Designers Guild philosophy is to combine creativity and innovation with the highest levels of quality.
To start your trade application process, please click on this link below
https://www.designersguild.com/request-a-trade-account/l540  and one of our trade representatives will contact you shortly.
Please remember to provide us with as much information as possible.  This will enable us too quickly and efficiently, assess your application and once received, your application will be reviewed, and one of our representatives will be in touch.
In the meantime, why not browse our website www.designersguild.com .
At Designers Guild, we pride ourselves on offering the complete lifestyle through our beautiful products and our vision is to inspire and empower you.  We hope you love our collections and remember, you can request a fabric or wallpaper sample via our website,  
Thank you for your interest in Designers Guild.

     */
