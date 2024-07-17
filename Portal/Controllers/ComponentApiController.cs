using Kendo.Mvc;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

using Microsoft.AspNet.Identity;
using Microsoft.AspNet.SignalR;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Applications;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Mertexer;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.Samples;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.SignalR.Hubs;
using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.ServiceModel;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.Results;

namespace Portal.Controllers
{
    [System.Web.Http.Authorize]
    public class ComponentApiController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public ComponentApiController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpPost]
        public IHttpActionResult AccountNumberAutocomplete([FromBody] PassAutocompleteTerm objAutocomplete)
        {
            if (objAutocomplete.marketId == -1)
                objAutocomplete.marketId = null;

            var results = PortalDb.TradeAccountNumber_Autocomplete(objAutocomplete.term, User.Identity.GetUserId<int>(), null, objAutocomplete.marketId).ToList();

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchTradeAccountSampleOrderConfirmationText([FromBody]PassTradeAccountID dto)
        {
            var result = await PortalDb.FetchSampleOrderConfirmationTopText(dto);

            return Ok(result);
        }

        [HttpPost]
        public DataSourceResult VisitSearch(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromBody] PassVisitSearch objVisitSearch)
        {
            var result = PortalDb.CustomerVisitSearch(objVisitSearch);

            return result.Results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpPost]
        public IHttpActionResult CreditTermsAutocomplete([FromBody] PassPaymentTermsSearch objSearch)
        {
            var result = PortalDb.FetchPaymentTerms(objSearch);

            return Ok(result.Results);
        }

        [HttpPost]
        public IHttpActionResult SalesRepresentativeAutocomplete([FromBody] PassSalesMarketDependentAutocomplete objAutocomplete)
        {
            var results = PortalDb.SalesRepresentatives.Where(p => ((p.SalesRepresentative_SalesMarkets.Select(q => q.SalesMarketID).Contains(objAutocomplete.salesMarket.SalesMarketID))) &&
                                                                    (String.IsNullOrEmpty(objAutocomplete.term) ||
                                                                    (p.Code.Contains(objAutocomplete.term) ||
                                                                     p.Name.Contains(objAutocomplete.term))))
                                                       .OrderBy(p => p.Name)
                                                       .ToList();

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult SalesAgentAutocomplete([FromBody] PassSalesMarketDependentAutocomplete objAutocomplete)
        {
            var results = PortalDb.SalesAgents.Where(p => ((p.SalesMarketID == objAutocomplete.salesMarket.SalesMarketID)) &&
                                                           (String.IsNullOrEmpty(objAutocomplete.term) ||
                                                                    (p.Code.Contains(objAutocomplete.term) ||
                                                                     p.Name.Contains(objAutocomplete.term))))
                                                       .OrderBy(p => p.Name)
                                                       .ToList();

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult SalesAreaAutocomplete([FromBody] PassSalesMarketDependentAutocomplete objAutocomplete)
        {
            var results = PortalDb.SalesAreas.Where(p => ((p.SalesMarketID == objAutocomplete.salesMarket.SalesMarketID)) &&
                                                          (String.IsNullOrEmpty(objAutocomplete.term) ||
                                                                    (p.Code.Contains(objAutocomplete.term) ||
                                                                     p.Name.Contains(objAutocomplete.term))))
                                                       .OrderBy(p => p.Name)
                                                       .ToList();

            return Json(results);
        }

        [HttpPost]
        public IHttpActionResult TradePriceListAutocomplete([FromBody] PassSalesMarketDependentAutocomplete objAutocomplete)
        {
            var results = PortalDb.TradePriceLists.Where(p => (
                                                                (p.Deleted == false) &&
                                                                (p.SalesMarketID == objAutocomplete.salesMarket.SalesMarketID)) &&
                                                               (String.IsNullOrEmpty(objAutocomplete.term) ||
                                                                    (p.Code.Contains(objAutocomplete.term) ||
                                                                     p.Name.Contains(objAutocomplete.term))))
                                                       .OrderBy(p => p.Name)
                                                       .ToList();
            results.ForEach(c =>
            {
                c.Name = $"{c.Code} - {c.Name}";

            });

            return Json(results);
        }

        [HttpPost]
        public IHttpActionResult OperatorAutocomplete([FromBody] PassAutocompleteTerm objAutocomplete)
        {
            var results = PortalDb.MertexOperators.Where(p => p.Name.StartsWith(objAutocomplete.term) || p.Code.StartsWith(objAutocomplete.term)).Distinct().ToList();

            if (results.Count == 0)
            {
                results = PortalDb.MertexOperators.Where(p => p.Name.Contains(objAutocomplete.term) || p.Code.Contains(objAutocomplete.term)).Distinct().ToList();
            }

            return Json(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> ProductCodeAutocompleteSamples([FromBody] PassProductCodeAutoComplete objAutocomplete)
        {
            var results = await PortalDb.ProductCode_Autocomplete_Samples(objAutocomplete);

            return Json(results);
        }

        [HttpPost]
        public IHttpActionResult ProductCodeAutocompleteAlternatives([FromBody] PassProductCodeAutoComplete objAutocomplete)
        {
            var results = PortalDb.ProductCode_Autocomplete_Alternatives(objAutocomplete.term, objAutocomplete.tradePriceListId);

            return Json(results);
        }

        [HttpPost]
        public IHttpActionResult RepSearch(PassMemberSearch objMemberSearch)
        {
            var results = PortalDb.SalesRepresentatives.Where(p =>
                                                    (p.Visible == true) &&
                                                    (p.Name.StartsWith(objMemberSearch.term) || p.Email.StartsWith(objMemberSearch.term))
                                                    ).ToList();

            if (results.Count == 0)
            {
                results = PortalDb.SalesRepresentatives.Where(p =>
                                                    (p.Visible == true) &&
                                                    (p.Name.Contains(objMemberSearch.term) || p.Email.Contains(objMemberSearch.term))
                                                    ).ToList();
            }

            var result = new RepSearchViewResult()
            {
                Members = results
            };

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult TagAutocomplete(PassAutocompleteTerm objAutocomplete)
        {
            var results = PortalDb.Tags.Where(p =>
                p.Deleted == false &&
                p.Name.StartsWith(objAutocomplete.term ?? objAutocomplete.searchTerm)
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

            if (PortalDb.Tags.Any(p => p.Name == objName.Name && p.Deleted == false))
            {
                var c = PortalDb.Tags.Where(p => p.Name == objName.Name).First();

                return Ok(new { c.TagID, objName.Name });
            }
            else
            {
                var c = PortalDb.Tags.Add(new Tag() { Name = objName.Name });

                PortalDb.SaveChanges();

                return Ok(new { c.TagID, objName.Name });
            }
        }

        [HttpGet]
        public DataSourceResult GetCountries([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, bool includeEU = true)
        {
            var results = PortalDb.Countries.Where(p => p.IsCountry == true && p.DeletedDT == null &&
                ((includeEU == true ? true : p.EU == false))).OrderBy(p => p.Name).ToList();

            return results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public DataSourceResult GetDeliveryGroups([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            var results = PortalDb.DeliveryGroups.OrderBy(p => p.Name).ToList();

            return results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public DataSourceResult GetProductFilterGroups([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            var results = PortalDb.ProductFilterGroups.OrderBy(p => p.Name).ToList();

            return results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public DataSourceResult GetTreatmentProducts([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            var results = PortalDb.Products.Where(p => p.Status != "D" && p.Deleted == false && p.Code.StartsWith("BAC")).OrderBy(p => p.Name).ToList();

            return results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public DataSourceResult GetLanguages([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            // This processing is all in order to cascade from a selected country's ProxyCountryID.
            // This needs taking to dbo.Country, where it will give you a CountryID, which you can then take to dbo.Country_Language 
            // in order to find all the LanguageIDs our site serves for that particular CountryID.
            var results = PortalDb.CountryLanguages.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList();

            short? proxyCountryId = null;

            short? desiredCountryId = null;

            if (request.Filters != null)
            {
                if (request.Filters.Count == 1)
                {
                    if (request.Filters[0] is FilterDescriptor descriptor)
                    {
                        if (descriptor.Member == "Country.ProxyCountryID")
                        {
                            proxyCountryId = Convert.ToInt16(descriptor.Value);
                        }
                    }
                }
            }

            if (proxyCountryId != null)
            {
                request.Filters.Clear();

                desiredCountryId = PortalDb.Countries.Where(p => p.CountryID == proxyCountryId).Select(p => p.ProxyCountryID).SingleOrDefault();

                results = results.Where(p => p.CountryID == desiredCountryId).ToList();
            }
            // End of ProxyCountryID processing.

            return results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public IHttpActionResult GetCurrencies()
        {
            return Ok(PortalDb.Currencies.ToList());
        }

        [HttpPost]
        public IHttpActionResult SalesRepresentativeSlicerEndpoint()
        {
            var data = PortalDb.SalesRepresentatives.ToList();

            return Ok(data);
        }

        // 20/01/2021 this appears to be defunct: portal.TradePromotionCode_Select for all your PromoCode needs
        //[HttpPost]
        //public IHttpActionResult TradePromoCodeAutocomplete([FromBody]PassGenericAutocomplete objTerm)
        //{
        //    var results = PortalDb.TradePromotionCodes.Where(p => p.FOC == true &&
        //        (
        //            p.Code.StartsWith(objTerm.searchTerm) ||
        //            p.Description.StartsWith(objTerm.searchTerm)
        //        )
        //    ).ToList();

        //    return Ok(results);
        //}

        [HttpPost]
        public IHttpActionResult FetchTechInfo([FromBody] PassProductID objProductId)
        {
            var results = PortalDb.FetchTechInfo(objProductId);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchCollectionImages([FromBody] PassProductID objProductId)
        {
            var results = PortalDb.FetchCollectionImages(objProductId);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchProductPageImages([FromBody] PassStockViewerLoad objLoad)
        {
            var results = PortalDb.FetchProductPageImages(objLoad);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult ProductSearchFilters([FromBody] PassProductSearchFilter objFilter)
        {
            var results = PortalDb.FetchProductSearchFilters(objFilter);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult ProductSearch([FromBody] PassProductSearch objSearch)
        {
            var result = PortalDb.ProductSearch(objSearch);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult ProductSearch_QuickDisplay([FromBody] PassProductSearchFilter objFilter)
        {
            var results = PortalDb.ProductSearchQuickDisplay(objFilter);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult ProductSearch_QuickDisplay_Select([FromBody] PassQuickDisplayProductSelect objFilter)
        {
            var results = PortalDb.QuickDisplay_Select(objFilter);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult ProductSearchKeywordAutocomplete([FromBody] PassProductSearch objSearch)
        {
            var results = PortalDb.ProductSearchKeywordAutocomplete(objSearch);

            var ti = System.Threading.Thread.CurrentThread.CurrentUICulture.TextInfo;

            var adjustedResults = new List<SharedEFClasses.Models.Products.ProductSearchKeyword>();

            results.ForEach(c =>
            {
                var b = c;
                b.Suggestion = ti.ToTitleCase(b.Suggestion);
                adjustedResults.Add(b);
            });

            return Ok(adjustedResults);
        }

        [HttpPost]
        public IHttpActionResult FetchItemTypes([FromBody] PassProductSearch objSearch)
        {
            var results = PortalDb.ItemTypeSelect(objSearch);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchProductsByQuality([FromBody] PassProductFetchByQuality objQuality)
        {
            objQuality.qualityId = PortalDb.QualitySelectByCode(objQuality);

            var results = PortalDb.ProductSelectByQuality(objQuality);

            // RIGHT... for the sake of bespoke builders, I also need to test if this design... BY CODE...
            // has a /W part number.
            // now... designs do not hold their Code; SELECT * FROM dbo.Design
            // so... I'll have to 

            // A) Hope that there is at least one result from ProductSelectByDesign
            // B) Take that product's code and parse it for the chunk before the first forward slash
            // C) Append /W to that
            // D) Perform a stock check with the result against the HD stock location
            // E) If there ever was stock, or if there is incoming stock, permit a standardised waterfall
            // F) If not, still permit a BESPOKE waterfall for shelf samples only.

            var waterfallPermitted = false;

            if (results.Count >= 1)
            {
                try
                {
                    var waterfallCode = results[0].Code.Split(new char[] { '/' }, StringSplitOptions.None)[0];

                    waterfallCode += "/W";

                    waterfallPermitted = await PortalDb.WaterfallCheck(waterfallCode);
                }
                catch
                {

                }
            }

            return Ok(new { results, waterfallPermitted });
        }

        [HttpPost]
        public IHttpActionResult FetchBasketParameters([FromBody] PassBasketID objBasket)
        {
            var result = PortalDb.FetchBasketParameters(objBasket);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult FetchFulfilmentOptions([FromBody] PassFulfilmentOptionsSelect objTradeAccount)
        {
            var result = PortalDb.FetchFulfilmentOptions(objTradeAccount);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchSupplierDetails([FromBody] SharedEFClasses.Models.Orders.PassProductCode objProductCode)
        {
            return Ok(await PortalDb.SupplierList(objProductCode));
        }

        [HttpPost]
        public IHttpActionResult BasketShippingRestrictionCheck([FromBody] PassBasketID objBasketId)
        {
            var results = PortalDb.BasketShippingRestrictionCheck(objBasketId);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult BasketStatusCheck([FromBody] PassBasketPhaseChange objBasketId)
        {
            var userId = User.Identity.GetUserId<int>();

            var results = PortalDb.BasketStatusCheck(objBasketId, userId);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchBespokeOptions([FromBody] PassStockViewerLoad objLoad)
        {
            var result = PortalDb.FetchBespokeOptions(objLoad);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult SaveBasket([FromBody] PassBasket objBasket)
        {
            var result = PortalDb.UpdateBasket(objBasket);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult DeleteBasket([FromBody] PassBasket objBasket)
        {
            var userId = User.Identity.GetUserId<int>();

            var result = PortalDb.DeleteBasket(objBasket, userId);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult EditTransaction([FromBody] PassTransactionID objTransactionId)
        {
            var userId = User.Identity.GetUserId<int>();

            var result = PortalDb.TransactionEdit(objTransactionId.TransactionID, userId);

            return Ok(result);
        }

        [HttpGet]
        public IHttpActionResult FetchMemberBaskets([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, int? memberId)
        {
            var mid = memberId ?? User.Identity.GetUserId<int>();

            var results = PortalDb.FetchMemberBaskets(mid, "M");

            var response = results.AsQueryable().ToDataSourceResult(request);

            foreach (var v in response.Data.Cast<BasketSelectResult>().ToList())
            {
                v.TradeAccount = PortalDb.TradeAccounts.Where(p => p.Code == v.CustomerCode).Single();

                v.BasketItems = PortalDb.BasketItems.Where(p => p.BasketID == v.BasketID && p.Deleted == false).ToList();
                v.BasketItemLineMemos = PortalDb.BasketItemLineMemos.Where(p => p.BasketItem.BasketID == v.BasketID).ToList();

                v.BasketItemLineMemos.ForEach(d =>
                {
                    d.LineMemoType = PortalDb.LineMemoTypes.Where(p => p.LineMemoTypeID == d.LineMemoTypeID).Single();
                });
            }

            return Ok(results.AsQueryable().ToDataSourceResult(request));
        }

        [HttpGet]
        public IHttpActionResult FetchImportedBaskets([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, int? memberId)
        {
            var mid = memberId ?? User.Identity.GetUserId<int>();

            var results = PortalDb.FetchMemberBaskets(mid, "W");

            var response = results.AsQueryable().ToDataSourceResult(request);

            foreach (var v in response.Data.Cast<BasketSelectResult>().ToList())
            {
                v.TradeAccount = PortalDb.TradeAccounts.Where(p => p.Code == v.CustomerCode).Single();

                v.BasketItems = PortalDb.BasketItems.Where(p => p.BasketID == v.BasketID && p.Deleted == false).ToList();
                v.BasketItemLineMemos = PortalDb.BasketItemLineMemos.Where(p => p.BasketItem.BasketID == v.BasketID).ToList();

                v.BasketItemLineMemos.ForEach(d =>
                {
                    d.LineMemoType = PortalDb.LineMemoTypes.Where(p => p.LineMemoTypeID == d.LineMemoTypeID).Single();
                });
            }

            return Ok(results.AsQueryable().ToDataSourceResult(request));
        }

        [HttpGet]
        public IHttpActionResult FetchFoCDeliveryBaskets([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, int? memberId)
        {
            var mid = memberId ?? User.Identity.GetUserId<int>();

            var results = PortalDb.FetchMemberBaskets(mid, "D");

            var response = results.AsQueryable().ToDataSourceResult(request);

            foreach (var v in response.Data.Cast<BasketSelectResult>().ToList())
            {
                v.TradeAccount = PortalDb.TradeAccounts.Where(p => p.Code == v.CustomerCode).Single();

                v.BasketItems = PortalDb.BasketItems.Where(p => p.BasketID == v.BasketID && p.Deleted == false).ToList();
                v.BasketItemLineMemos = PortalDb.BasketItemLineMemos.Where(p => p.BasketItem.BasketID == v.BasketID).ToList();

                v.BasketItemLineMemos.ForEach(d =>
                {
                    d.LineMemoType = PortalDb.LineMemoTypes.Where(p => p.LineMemoTypeID == d.LineMemoTypeID).Single();
                });
            }

            return Ok(results.AsQueryable().ToDataSourceResult(request));
        }

        [HttpGet]
        public IHttpActionResult FetchCustomerHeldBaskets([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, int? memberId)
        {
            var mid = memberId ?? User.Identity.GetUserId<int>();

            var results = PortalDb.FetchMemberBaskets(mid, "CH");

            var response = results.AsQueryable().ToDataSourceResult(request);

            foreach (var v in response.Data.Cast<BasketSelectResult>().ToList())
            {
                v.TradeAccount = PortalDb.TradeAccounts.Where(p => p.Code == v.CustomerCode).Single();

                v.BasketItems = PortalDb.BasketItems.Where(p => p.BasketID == v.BasketID && p.Deleted == false).ToList();
                v.BasketItemLineMemos = PortalDb.BasketItemLineMemos.Where(p => p.BasketItem.BasketID == v.BasketID).ToList();

                v.BasketItemLineMemos.ForEach(d =>
                {
                    d.LineMemoType = PortalDb.LineMemoTypes.Where(p => p.LineMemoTypeID == d.LineMemoTypeID).Single();
                });
            }

            return Ok(results.AsQueryable().ToDataSourceResult(request));
        }

        [HttpGet]
        public IHttpActionResult FetchHeldOrdersManagement([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            var memberId = User.Identity.GetUserId<int>();

            var results = PortalDb.FetchHeldOrdersManagement(memberId);

            var response = results.AsQueryable().ToDataSourceResult(request);

            foreach (var v in response.Data.Cast<HeldOrderSelectResult>().ToList())
            {
                v.TradeAccount = PortalDb.TradeAccounts.Where(p => p.Code == v.CustomerCode).Single();

                v.BasketItems = PortalDb.BasketItems.Where(p => p.BasketID == v.BasketID && p.Deleted == false).ToList();
                v.BasketItemLineMemos = PortalDb.BasketItemLineMemos.Where(p => p.BasketItem.BasketID == v.BasketID).ToList();

                v.BasketItemLineMemos.ForEach(d =>
                {
                    d.LineMemoType = PortalDb.LineMemoTypes.Where(p => p.LineMemoTypeID == d.LineMemoTypeID).Single();
                });

                v.MertexMarket = PortalDb.Markets.Where(p => p.Code == v.Market).SingleOrDefault();
            }

            return Ok(results.AsQueryable().ToDataSourceResult(request));
        }

        [HttpGet]
        public IHttpActionResult FetchHeldOrdersOperator([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            var memberId = User.Identity.GetUserId<int>();

            var results = PortalDb.FetchHeldOrdersOperator(memberId);

            var response = results.AsQueryable().ToDataSourceResult(request);

            foreach (var v in response.Data.Cast<HeldOrderSelectResult>().ToList())
            {
                v.TradeAccount = PortalDb.TradeAccounts.Where(p => p.Code == v.CustomerCode).Single();

                v.BasketItems = PortalDb.BasketItems.Where(p => p.BasketID == v.BasketID && p.Deleted == false).ToList();
                v.BasketItemLineMemos = PortalDb.BasketItemLineMemos.Where(p => p.BasketItem.BasketID == v.BasketID).ToList();

                v.BasketItemLineMemos.ForEach(d =>
                {
                    d.LineMemoType = PortalDb.LineMemoTypes.Where(p => p.LineMemoTypeID == d.LineMemoTypeID).Single();
                });

                v.MertexMarket = PortalDb.Markets.Where(p => p.Code == v.Market).SingleOrDefault();
            }

            return Ok(results.AsQueryable().ToDataSourceResult(request));
        }


        [HttpPost]
        public IHttpActionResult ReleaseBasket([FromBody] PassBasketID objBasketId)
        {
            var memberId = User.Identity.GetUserId<int>();

            return Ok(PortalDb.ReleaseBasket(memberId, objBasketId));
        }

        [HttpPost]
        public IHttpActionResult ReleaseTransaction([FromBody] PassTransactionID objTransactionId)
        {
            var memberId = User.Identity.GetUserId<int>();

            return Ok(PortalDb.ReleaseTransaction(memberId, objTransactionId));
        }

        [HttpPost]
        public IHttpActionResult FetchDispatchInfo([FromBody] PassBasketSplit objBasket)
        {
            var results = PortalDb.Basket_DeliveryService_Select(objBasket, User.Identity.GetUserId<int>());

            results.DeliveryServices.ForEach(c =>
            {
                c.DemandMobilePhoneNumber = PortalDb.TradeHauliers.Where(p => p.HAULCODE == c.HaulierCode).Select(p => p.DemandMobilePhoneNumber).FirstOrDefault();
            });

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult SubmitBasket([FromBody] PassBasketID objBasketId)
        {
            var b = PortalDb.Baskets.Where(p => p.BasketID == objBasketId.BasketID).Single();
            var memberId = User.Identity.GetUserId<int>();

            //if (b.HeldForManagementApproval == false)
            //{
            //    var heldCheckResult = PortalDb.BasketApprovalCheck(objBasketId);

            //    if (heldCheckResult.json == null)
            //    {
            return Ok(PortalDb.SubmitBasket(memberId, objBasketId));
            //    }
            //    else
            //    {
            //        return Ok(new { managerHeldReasons = heldCheckResult.json });
            //    }
            //}
            //else
            //{
            //    return Ok(PortalDb.SubmitBasket(objBasketId));
            //}
        }

        [HttpPost]
        public IHttpActionResult GetPieceLevelStockInfo([FromBody] PassFetchProductStockInfo objProductIds)
        {
            var result = PortalDb.FetchStockInfo(objProductIds);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult FetchCoordinatingProducts([FromBody] PassStockViewerLoad objProduct)
        {
            var result = PortalDb.FetchCoordinatingProducts(objProduct);

            return Ok(result);
        }


        [HttpPost]
        public IHttpActionResult FetchAlsoLookAts([FromBody] PassStockViewerLoad objProduct)
        {
            var result = PortalDb.FetchAlsoLookAts(objProduct);

            return Ok(result);
        }


        [HttpPost]
        public IHttpActionResult FetchAlternateProducts([FromBody] PassStockViewerLoad objProduct)
        {
            var result = PortalDb.FetchAlternateProducts(objProduct);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult FetchAlternateColourways([FromBody] PassStockViewerLoad objProduct)
        {
            var result = PortalDb.FetchAlternateColourways(objProduct);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult FetchUSPs([FromBody] PassStockViewerLoad objProduct)
        {
            var result = PortalDb.FetchUSPs(objProduct);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult FetchTreatmentOptions([FromBody] PassProductID objProduct)
        {
            var results = PortalDb.FetchTreatmentOptions(objProduct);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchBasketItemTreatments([FromBody] PassBasketItemID objBasketItemId)
        {
            var results = PortalDb.FetchBasketItemTreatments(objBasketItemId);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> SendProductInfoEmail([FromBody] PassSendProductInfo objSend)
        {
            var member = UserManager.FindById(User.Identity.GetUserId<int>());

            var stockInfo = PortalDb.FetchStockInfoSingular(new PassFetchProductStockInfoSingular()
            {
                TradeAccountID = objSend.tradeAccountId.Value,
                ProductCode = objSend.product.Code
            });

            //var stockInfo = await PortalDb.StockEnquiry(objSend.product.Code);

            //MertexerV2SQL.Stock.StockFunctions.PerformStockEnquiry(objSend.product.Code);

            //if ((String.IsNullOrEmpty(stockInfo.TotalStock) || stockInfo.TotalStock == "0") && (
            //        String.IsNullOrEmpty(stockInfo.TotalPurchaseOrderLength) ||
            //        stockInfo.TotalPurchaseOrderLength == "0"))
            //{
            //    stockInfo = MertexerV2SQL.Stock.StockFunctions.FinishedProductStockEnquiry(objSend.product.Code);
            //}

            var inkyMarkup = $@"
                <style type=""text/css"">
                    {PortalFramework.FoundationEmailCSS}
                </style>
                <meta name=""x-apple-disable-message-reformatting""/>
                <container>
	                <row>
		                <columns>
			                <img width=""640"" height=""54"" style=""margin: 15px 0 0 0"" alt='Designers Guild' src='https://www.designersguild.com/_assets/email_images/logos/header-logo.jpg' title='Designers Guild' />
		                </columns>
	                </row>
	                <row>
		                <columns>
			                <p class=""text-left"" style=""margin-top: 0"">
				                Dear Customer,
			                </p>
		                </columns>
	                </row>
	                <row>
		                <columns>
			                <p>
				                Please see the beneath detailed stock information, accurate as at {DateTime.Now.ToString("dd/MM/yyyy")}.
			                </p>
		                </columns>
	                </row>
	                <row>
		                <columns small=""2"" large=""3"">
			                <p>
				                <strong>
					                {objSend.product.Code}
				                </strong>
			                </p>
		                </columns>
		                <columns small=""8"" large=""9"">
			                <p>
				                {objSend.product.OrderFormName}
			                </p>
		                </columns>
	                </row>
	                <row>
		                <columns small=""2"" large=""3"">
			                <p>
				                <strong>
					                Status
				                </strong>
			                </p>
		                </columns>
		                <columns small=""8"" large=""9"">
			                <p>
				                {objSend.product.StockStatus}
			                </p>
		                </columns>
	                </row>
	                <row>
		                <columns>
			                <img src=""https://www.designersguild.com/image-nonwebp/600/{objSend.product.ImageID}"" width=""600"" height=""600"" />
		                </columns>
	                </row>
	                <spacer size=""10""></spacer>
	                <row>
		                <columns>
			                <h6>
				                Stock Info
			                </h6>
			                <hr/>
		                </columns>
	                </row>
	                <row>
		                <columns small=""3"" large=""3"">
			                <strong>Available Stock</strong>
		                </columns>
		                <columns small=""8"" large=""9"">
			                <span>{stockInfo.stockResults.Select(s => s.AvailableNowQuantity).Sum()?.ToString($"N{objSend.product.QuantityPrecisionA}")} {objSend.product.Units}</span>
		                </columns>
	                </row>
	                <row>
		                <columns small=""3"" large=""3"">
			                <strong>Incoming Stock</strong>
		                </columns>
		                <columns small=""8"" large=""9"">
			                <span>{stockInfo.stockResults.Select(s => s.DueInQuantity).Sum().ToString($"N{objSend.product.QuantityPrecisionA}")} {objSend.product.Units}</span>
		                </columns>
	                </row>";

            var batchInky = "";

            if (stockInfo.stockResults.Select(s => s.Batch).Distinct().Count() > 1)
            {
                batchInky = $@"
	                <spacer size=""30""></spacer>
	                <row>
		                <columns>
			                <h6>
				                Batches
			                </h6>
			                <hr/>
		                </columns>
	                </row>
	                <row>
		                <columns small=""2"">
			                <p class=""text-left"">
				                <strong>
					                Batch No.
				                </strong>
			                </p>
		                </columns>
		                <columns small=""2"">
			                <p class=""text-right"">
				                <strong>
					                Piece No.
				                </strong>
			                </p>
		                </columns>
		                <columns small=""3"">
			                <p class=""text-right"">
				                <strong>
					                Length
				                </strong>
			                </p>
		                </columns>
		                <columns small=""3"">
			                <p class=""text-right"">
				                <strong>
					                Total
				                </strong>
			                </p>
		                </columns>
	                </row>";

                foreach (var batch in stockInfo.stockResults.Where(s => s.AvailableNowQuantity > 0).GroupBy(s => s.Batch))
                {
                    foreach (var piece in batch)
                    {
                        if (piece == batch.First())
                        {
                            batchInky += $@"
	                            <row>
		                            <columns small=""2"">
			                            <p class=""text-left"">
				                            {batch.Key}
			                            </p>
		                            </columns>
		                            <columns small=""2"">
			                            <p class=""text-right"">
                                            {(String.IsNullOrEmpty(piece.Piece?.Trim()) ? "-" : piece.Piece)}
			                            </p>
		                            </columns>
		                            <columns small=""3"">
			                            <p class=""text-right"">
				                            {piece.AvailableNowQuantity?.ToString($"N{objSend.product.QuantityPrecisionA}")} {objSend.product.Units}
			                            </p>
		                            </columns>
		                            <columns small=""3"">
			                            <p class=""text-right"">
				                            {(1 * Convert.ToDecimal(piece.AvailableNowQuantity)).ToString($"N{objSend.product.QuantityPrecisionA}")} {objSend.product.Units}
			                            </p>
		                            </columns>
	                            </row>";
                        }
                        else
                        {
                            batchInky += $@"
	                            <row>
		                            <columns small=""2"">
			                            <p class=""text-left"">

			                            </p>
		                            </columns>
		                            <columns small=""2"">
			                            <p class=""text-right"">
                                            {(String.IsNullOrEmpty(piece.Piece?.Trim()) ? "-" : piece.Piece)}
			                            </p>
		                            </columns>
		                            <columns small=""3"">
			                            <p class=""text-right"">
				                            {piece.AvailableNowQuantity?.ToString($"N{objSend.product.QuantityPrecisionA}")} {objSend.product.Units}
			                            </p>
		                            </columns>
		                            <columns small=""3"">
			                            <p class=""text-right"">
				                            {(1 * Convert.ToDecimal(piece.AvailableNowQuantity)).ToString($"N{objSend.product.QuantityPrecisionA}")} {objSend.product.Units}
			                            </p>
		                            </columns>
	                            </row>";
                        }
                    }
                }

                batchInky += $@"
	                <row>
		                <columns small=""2"">
		
		                </columns>
		                <columns small=""2"">
			                <p class=""text-right"">
				                <strong>

				                </strong>
			                </p>
		                </columns>
		                <columns small=""3"">
		
		                </columns>
		                <columns small=""3"">
			                <p class=""text-right"">
				                <strong>
					                {stockInfo.stockResults.Select(p => Convert.ToDecimal(p.AvailableNowQuantity)).Sum().ToString($"N{objSend.product.QuantityPrecisionA}")} {objSend.product.Units}
				                </strong>
			                </p>
		                </columns>
	                </row>
	                <spacer size=""30""></spacer>";
            }

            var poInky = "";

            if (stockInfo.stockResults.Where(s => s.DueInQuantity > 0).Any())
            {
                poInky = $@"
	            <row>
		            <columns>
			            <h6>
				            Purchase Orders
			            </h6>
			            <hr/>
		            </columns>
	            </row>
	            <row>
		            <columns small=""4"" large=""4"">
			            <p class=""text-left"">
				            <strong>
					            Purchase Order No.
				            </strong>
			            </p>
		            </columns>
		            <columns small=""3"" large=""4"">
			            <p class=""text-right"">
				            <strong>
					            Due Date
				            </strong>
			            </p>
		            </columns>
		            <columns small=""3"" large=""4"">
			            <p class=""text-right"">
				            <strong>
					            Quantity
				            </strong>
			            </p>
		            </columns>
	            </row>";

                foreach (var po in stockInfo.stockResults.Where(s => s.DueInQuantity > 0))
                {
                    poInky += $@"
	                    <row>
		                    <columns small=""4"" large=""4"">
			                    <p class=""text-left"">
				                    {po.DueInMessage}
			                    </p>
		                    </columns>
		                    <columns small=""3"" large=""4"">
			                    <p class=""text-right"">
				                    {po.DueInDate}
			                    </p>
		                    </columns>
		                    <columns small=""3"" large=""4"">
			                    <p class=""text-right"">
				                    {Convert.ToDecimal(po.DueInQuantity).ToString($"N{objSend.product.QuantityPrecisionA}")} {objSend.product.Units}
			                    </p>
		                    </columns>
	                    </row>";
                }

                poInky += $@"
	                    <row>
		                    <columns small=""4"" large=""4"">
			                    <p class=""text-left"">

			                    </p>
		                    </columns>
		                    <columns small=""3"" large=""4"">
			                    <p class=""text-right"">

			                    </p>
		                    </columns>
		                    <columns small=""3"" large=""4"">
			                    <p class=""text-right"">
				                    <strong>
				                        {stockInfo.stockResults.Where(s => s.DueInQuantity > 0).Select(p => Convert.ToDecimal(p.DueInQuantity)).Sum().ToString($"N{objSend.product.QuantityPrecisionA}")} {objSend.product.Units}
                                    </strong>
			                    </p>
		                    </columns>
	                    </row>";
            }

            inkyMarkup += $@"{batchInky}{poInky}
	            <row>
		            <columns small=""12"">
			            <spacer size=""30""></spacer>
		            </columns>
	            </row>
	            <row>
		            <columns small=""12"">
			            <p class=""text-left smaller"">
				            Thank you for your interest in Designers Guild.
			            </p>
		            </columns>
	            </row>
            </container>";

            using (var client = new HttpClient())
            {
                var content = new StringContent(inkyMarkup);

                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

                var result = await client.PostAsync(PortalFramework.InkyEndpoint, content);

                inkyMarkup = await result.Content.ReadAsStringAsync();
            }

#pragma warning disable 4014
            System.Threading.Tasks.Task.Factory.StartNew(() =>
            {
                var body = "";
                var subject = "";

                subject = $"{objSend.product.Code} -  Product Info Designers Guild";

                body = inkyMarkup;

                ((EmailService)UserManager.EmailService).SendFoundationEmailAsync(new IdentityMessage()
                {
                    Body = body,
                    Subject = subject,
                    Destination = objSend.recipient
                });
            });
#pragma warning restore 4014

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult SendPatternBookDiscoEmail([FromBody] PassSendPatternBookDiscoInfo objSend)
        {
            var member = UserManager.FindById(User.Identity.GetUserId<int>());

            var limitedProducts = objSend.limitedDiscoItems.Where(p => p.Status == "L").OrderBy(p => p.Code).ToList();

            var limitedProductsInky = "";

            if (limitedProducts.Count > 0)
            {
                limitedProductsInky = $@"<row><columns><hr/></columns></row><spacer size=""10""></spacer><row><columns><h6>The following products are of <strong>Limited Availability</strong>.</h6></columns></row><spacer size=""10""></spacer>";

                var requireExtraRow = limitedProducts.Count % 3 > 0;

                var rowCount = (int)Math.Floor(limitedProducts.Count / 3m);

                if (requireExtraRow)
                    rowCount++;

                var ctr = 0;

                for (var i = 1; i <= rowCount; i++)
                {
                    limitedProductsInky += "<row>";

                    for (var j = 0; j < 3; j++)
                    {
                        if (ctr < limitedProducts.Count)
                        {
                            var rec = limitedProducts[ctr];

                            limitedProductsInky += $@"
<columns small=""12"" large=""3"" valign=""top"" style=""vertical-align: top;"">
    <center>
        <img width=""192"" height=""192"" src=""https://www.designersguild.com/image/239/{rec.ImageID}"" alt=""{rec.BasketName}""/>
    </center>
    <p class=""product-name text-center small-text-center"">
        {rec.BasketName}
    </p>
    <p class=""text-center small-text-center"">
        {rec.Code}
    </p>
    <p class=""text-center small-text-center"">
        {rec.StockLocationA_Available.ToString($"N{rec.QuantityPrecisionA}")} {rec.Units} available
    </p>
    <p class=""text-center small-text-center"">
        {(rec.RRP.HasValue ? @"RRP: " + rec.RRP.Value.ToString("C") : "&nbsp;")}
    </p>
</columns>";
                        }
                        else
                        {
                            //limitedProductsInky += $@"<columns small=""12"" large=""3""></columns>";
                        }

                        ctr++;
                    }

                    limitedProductsInky += "</row>";
                }
            }

            var discoProducts = objSend.limitedDiscoItems.Where(p => p.Status == "D").OrderBy(p => p.Code).ToList();

            var discoProductsInky = "";

            if (discoProducts.Count > 0)
            {
                discoProductsInky = @"<row><columns><hr/></columns></row><spacer size=""10""></spacer><row><columns><h6 class=""red-text"">The following products are <strong>Discontinued</strong> and cannot be ordered.</h6></columns></row><spacer size=""10""></spacer>";

                var requireExtraRow = discoProducts.Count % 3 > 0;

                var rowCount = (int)Math.Floor(discoProducts.Count / 3m);

                if (requireExtraRow)
                    rowCount++;

                var ctr = 0;

                for (var i = 1; i <= rowCount; i++)
                {
                    discoProductsInky += "<row>";

                    for (var j = 0; j < 3; j++)
                    {
                        if (ctr < discoProducts.Count)
                        {
                            var rec = discoProducts[ctr];

                            discoProductsInky += $@"
<columns small=""12"" large=""3"" valign=""top"" style=""vertical-align: top;"">
    <center>
        <img width=""192"" height=""192"" src=""https://www.designersguild.com/image/239/{rec.ImageID}"" alt=""{rec.BasketName}"">
    </center>
    <p class=""product-name text-center small-text-center"">
        {rec.BasketName}
    </p>
    <p class=""text-center small-text-center"">
        {rec.Code}
    </p>
</columns>";
                        }
                        else
                        {
                            //discoProductsInky += $@"<columns small=""12"" large=""3""></columns>";
                        }

                        ctr++;
                    }

                    discoProductsInky += " </row>";
                }
            }

            var inkyMarkup = $@"<style>
            {PortalFramework.FoundationEmailCSS}
            </style>
            <meta name=""x-apple-disable-message-reformatting""/>
            <container>
                <row>
                    <columns>
                        <img width=""640"" height=""54"" style=""margin: 15px 0 0 0"" alt='Designers Guild' src='https://www.designersguild.com/_assets/email_images/logos/header-logo.jpg' title='Designers Guild' />
                        <p class=""text-left"" style=""margin-top: 0"">
                            Dear Customer,
                        </p>
                        <p>
                            One or more products in Pattern Book {objSend.patternBookCode}, ""{objSend.patternBookName}"" are limited or discontinued. Please see the list below.
                        </p>
                        <p>
                            Stock levels stated were accurate as at {DateTime.Now.ToString("dd/MM/yyyy")}.
                        </p>
                    </columns>
                </row>
                    {limitedProductsInky}
                    {discoProductsInky}
                <row>
                    <columns>
                        <spacer height=""10""></spacer>
                        <p class=""text-center small-text-center"">Thank you for your interest in Designers Guild.</span>
                    </columns>
                </row>
            </container>";

            //var inkyResult = inkyFunc(inkyMarkup) as Task<object>;

            //inkyResult.Wait();

            //var inkyOutput = inkyResult.Result as string;

#pragma warning disable 4014
            System.Threading.Tasks.Task.Factory.StartNew(async () =>
            {
                using (var client = new HttpClient())
                {
                    var content = new StringContent(inkyMarkup);

                    ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

                    var result = await client.PostAsync(PortalFramework.InkyEndpoint, content);

                    inkyMarkup = await result.Content.ReadAsStringAsync();
                }

                var body = "";
                var subject = "";

                subject = $"{objSend.patternBookCode} - Limited / Discontinued Product Info";

                body = inkyMarkup;

                ((EmailService)UserManager.EmailService).SendFoundationEmailAsync(new IdentityMessage()
                {
                    Body = body,
                    Subject = subject,
                    Destination = objSend.recipient
                });
            });
#pragma warning restore 4014

            return Ok(new { });
        }


        [HttpPost]
        public IHttpActionResult SendPatternBookCurrentEmail([FromBody] PassSendPatternBookCurrentInfo objSend)
        {
            var member = UserManager.FindById(User.Identity.GetUserId<int>());

            var currentProducts = objSend.currentItems.OrderBy(p => p.Code).ToList();

            var currentProductsInky = "";

            if (currentProducts.Count > 0)
            {
                currentProductsInky = $@"
<row>
    <columns>
        <hr/>
    </columns>
</row>
<spacer size=""10""></spacer>
<row>
    <columns>
        <h6>The following products are Currently Available.</h6>
    </columns>
</row>
<spacer size=""10""></spacer>";

                var requireExtraRow = currentProducts.Count % 3 > 0;

                var rowCount = (int)Math.Floor(currentProducts.Count / 3m);

                if (requireExtraRow)
                    rowCount++;

                var ctr = 0;

                for (var i = 1; i <= rowCount; i++)
                {
                    currentProductsInky += "<row>";

                    for (var j = 0; j < 3; j++)
                    {
                        if (ctr < currentProducts.Count)
                        {
                            var rec = currentProducts[ctr];

                            currentProductsInky += $@"
<columns small=""12"" large=""3"" valign=""top"" style=""vertical-align: top;"">
    <center>
        <img width=""192"" height=""192"" src=""https://www.designersguild.com/image-nonwebp/239/{rec.ImageID}"" alt=""{rec.BasketName}""/>
    </center>
    <p class=""product-name text-center small-text-center"">
        {rec.BasketName}
    </p>
    <p class=""text-center small-text-center"">
        {rec.Code}
    </p>
    <p class="" text-center small-text-center"">
        {rec.StockLocationA_Available.ToString($"N{rec.QuantityPrecisionA}")} {rec.Units} available
    </p>
    <p class=""text-center small-text-center"">
        {(rec.RRP.HasValue ? @"RRP: " + rec.RRP.Value.ToString("C") : "&nbsp;")}
    </p>
</columns>";
                        }
                        else
                        {
                            //currentProductsInky += $@"<columns small=""12"" large=""3""></columns>";
                        }

                        ctr++;
                    }

                    currentProductsInky += "</row>";
                }
            }

            var inkyMarkup = $@"<style>
            {PortalFramework.FoundationEmailCSS}
            </style>
            <meta name=""x-apple-disable-message-reformatting""/>
            <container>
                <row>
                    <columns>
                        <img style=""margin: 15px 0 0 0"" alt='Designers Guild' src='https://www.designersguild.com/_assets/email_images/logos/header-logo.jpg' title='Designers Guild' />
                        <p class=""text-left"" style=""margin-top: 0"">
                            Dear Customer,
                        </p>
                        <p>
                            Please find below the currently available products in Pattern Book {objSend.patternBookCode}, ""{objSend.patternBookName.Trim()}"".
                        </p>
                        <p>
                            Stock levels stated were accurate as at {DateTime.Now.ToString("dd/MM/yyyy")}.
                        </p>
                    </columns>
                </row>
                    {currentProductsInky}
                <row>
                    <columns>
                        <spacer height=""10""></spacer>
                        <p class=""text-center small-text-center"">Thank you for your interest in Designers Guild.</span>
                    </columns>
                </row>
            </container>";

            //var inkyResult = inkyFunc(inkyMarkup) as Task<object>;

            //inkyResult.Wait();

            //var inkyOutput = inkyResult.Result as string;

#pragma warning disable 4014
            System.Threading.Tasks.Task.Factory.StartNew(async () =>
            {
                using (var client = new HttpClient())
                {
                    var content = new StringContent(inkyMarkup);

                    ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

                    var result = await client.PostAsync(PortalFramework.InkyEndpoint, content);

                    inkyMarkup = await result.Content.ReadAsStringAsync();
                }

                var body = "";
                var subject = "";

                subject = $"{objSend.patternBookCode} - Current Product Info";

                body = inkyMarkup;

                ((EmailService)UserManager.EmailService).SendFoundationEmailAsync(new IdentityMessage()
                {
                    Body = body,
                    Subject = subject,
                    Destination = objSend.recipient
                });
            });
#pragma warning restore 4014

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult FetchSamplingOptions([FromBody] PassStockViewerLoad objProduct)
        {
            var results = PortalDb.FetchSamplingOptions(objProduct);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchPatternBookContents([FromBody] PassStockViewerLoad objProduct)
        {
            var results = PortalDb.FetchPatternBookContents(objProduct);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchBespokeStockedHanger([FromBody] PassStockViewerLoad objProduct)
        {
            var results = PortalDb.FetchBesokeStockedHanger(objProduct);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchRugShape([FromBody] PassStockViewerLoad objProduct)
        {
            var result = PortalDb.FetchRugShape(objProduct);

            return Ok(result);
        }

        /*
         * "BespokeSize" is a property we must arrive at for each of the bespoke types:
         
         Bespoke Fabric Hanger
            = Length

         Bespoke Fabric Showlength
            = Length

         Bespoke Wallpaper Showlength
            = Length

         Bespoke Rug
            = l * w 
            ||
            = pi.r.^2

         Bespoke Furniture
            = don't know.

        Wonderful!

             */

        [HttpPost]
        public IHttpActionResult FetchBespokeProductPrice([FromBody] PassBespokeProductSize objBespoke)
        {
            var result = PortalDb.FetchBespokeProductPrice(objBespoke);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult FetchTreatments([FromBody] PassProductFilter objFilter)
        {
            var results = PortalDb.FetchTreatments(objFilter);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult SaveTreatments([FromBody] PassBasketItemTreatmentSave objSave)
        {
            var results = PortalDb.SaveTreatments(objSave);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchBasketItemMemos([FromBody] PassBasketItemID objBasketItemId)
        {
            var results = PortalDb.FetchBasketItemMemos(objBasketItemId);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult SaveBasketItemMemos([FromBody] PassBasketItemMemoSave objSave)
        {
            var result = PortalDb.SaveBasketItemMemos(objSave);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult FetchSizes([FromBody] PassProductFilter objFilter)
        {
            var results = PortalDb.FetchSizeOptions(objFilter);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchVisitOrders([FromBody] PassTradeAccountVisit objVisit)
        {
            var results = PortalDb.FetchTradeAccountVisitOrders(objVisit);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult CreateBasket([FromBody] PassBasketCreation objCreate)
        {
            objCreate.MemberID = User.Identity.GetUserId<int>();

            var basketId = PortalDb.CreateBasket(objCreate);

            var basket = PortalDb.Baskets.Where(p => p.BasketID == basketId).Single();

            PortalDb.SaveChanges();

            return Ok(basket);
        }

        [HttpPost]
        public IHttpActionResult AddBasketItem([FromBody] PassBasketItemAdd objAdd)
        {
            objAdd.MemberID = User.Identity.GetUserId<int>();

            var addResult = PortalDb.AddBasketItem(objAdd);

            var stages = new List<BasketItemAdvancedOrderStepResult>();

            var notifications = new DatabaseJSONResult();

            if (addResult.BasketItemID.HasValue)
            {
                stages = PortalDb.FetchBasketItemStageInformation(addResult.BasketItemID.Value, objAdd.TradeAccountID);
                notifications = PortalDb.FetchBasketItemNotifications(addResult.BasketItemID.Value);
            }

            return Ok(new { addResult, notifications, stages });
        }

        [HttpPost]
        public IHttpActionResult FetchBasketItemForEdit([FromBody] PassBasketItemEditFetch objBasketItem)
        {
            var searchResults = PortalDb.FetchBasketItemForEdit(objBasketItem);

            var stagesResult = PortalDb.FetchBasketItemStageInformation(objBasketItem.BasketItemID, objBasketItem.TradeAccountID);

            return Ok(new { searchResults, stages = stagesResult });
        }

        [HttpPost]
        public IHttpActionResult FetchBasketItemAllocation([FromBody] PassBasketItemAllocationFetch objFetch)
        {
            var result = PortalDb.FetchBasketItemAllocation(objFetch);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult SaveBasketItemAllocationDetails([FromBody] PassBasketItemAllocationSave objSave)
        {
            var result = PortalDb.SaveBasketItemAllocationDetails(objSave);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult FetchBasketItemAllocationStock([FromBody] PassBasketItemAllocationFetch objFetch)
        {
            var results = PortalDb.FetchBasketItemAllocationStock(objFetch);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult TestBasketValidity([FromBody] PassBasketID objBasket)
        {
            var b = PortalDb.Baskets.Where(p => p.BasketID == objBasket.BasketID).SingleOrDefault();

            // Baskets awaiting Retail Payment Information

            if (b == null)
            {
                return Ok(new { success = false, message = "Your basket does not exist. Would you like to create a new one?" });
            }

            if (b.ExpiryDT < DateTime.Now)
            {
                return Ok(new { success = false, message = "Your basket has expired. Would you like to create a new one?" });
            }
            else if (b.DeletedDT != null)
            {
                return Ok(new { success = false, message = "Your basket has been deleted. Would you like to create a new one?" });
            }
            else if (b.LockedByMemberID != null)
            {
                if (b.LockedByMemberID != User.Identity.GetUserId<int>())
                    return Ok(new { locked = true, success = false, message = $"This basket is currently being locked by {b.LockedByMember.FullName}." });
                else
                    //return Ok(new { success = true });
                    // can't do this: you're already set by the exchange of basket between users, so... ugh.
                    return Ok(new { locked = true, mutiny = true, success = false, message = $"You have this basket open on another tab or device." });
            }
            else
            {
                var user = UserManager.FindById(User.Identity.GetUserId<int>());

                b.OwnerMemberID = user.Id;

                b.LockedByMemberID = user.Id;

                b.OrderTaker = user.DefaultMertexOperatorCode;

                PortalDb.SaveChanges(); // This basket is now locked by the member requesting access to it.

                PortalDb.BasketReload(user.Id, objBasket.BasketID);

                b = PortalDb.Baskets.Where(p => p.BasketID == objBasket.BasketID).SingleOrDefault();

                GlobalHost.ConnectionManager.GetHubContext<BasketLockHub>()
                   .Clients.All.receiveOrderProductsGridViewRefresh();
                //var lines = PortalDb.FetchBasket(objBasket);

                // should I be fetching VAT Numbers fresh from Mertex at this point?

                return Ok(new { success = true, basket = b });
            }
        }

        //Defunct? 15/02/2021
        [HttpPost]
        public IHttpActionResult TakeoverBasket([FromBody] PassBasketID objBasket)
        {
            var b = PortalDb.Baskets.Where(p => p.BasketID == objBasket.BasketID).Single();

            if (b.LockedByMemberID.HasValue)
            {
                GlobalHost.ConnectionManager.GetHubContext<BasketLockHub>()
                   .Clients.User($"{b.LockedByMemberID}").receiveTakeoverRequest(b.LockedByMemberID.Value, User.Identity.GetUserId<int>(), objBasket.BasketID,
                    $"{User.Identity.Name} is requesting takeover of a basket you are locking: BasketID {b.BasketID}, Order Reference {b.OrderReference}.");
            }

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult UnlockBasket([FromBody] PassBasketUnlock objBasket)
        {
            var b = PortalDb.Baskets.Where(p => p.BasketID == objBasket.BasketID).Single();

            b.LockedByMemberID = null;

            PortalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult CreateBasketItemAllocation([FromBody] PassBasketItemAllocation objAlloc)
        {
            objAlloc.MemberID = User.Identity.GetUserId<int>();

            var result = PortalDb.InsertBasketItemPreAllocation(objAlloc);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult UpdateBasketItemAllocation([FromBody] PassBasketItemAllocation objAlloc)
        {
            objAlloc.MemberID = User.Identity.GetUserId<int>();

            var result = PortalDb.UpdateBasketItemPreAllocation(objAlloc);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult DeleteBasketItemAllocation([FromBody] PassBasketItemAllocation objAlloc)
        {
            objAlloc.MemberID = User.Identity.GetUserId<int>();

            var result = PortalDb.DeleteBasketItemPreAllocation(objAlloc);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult ChangeBasketItemStockLocation([FromBody] PassBasketItem objBasketItem)
        {
            objBasketItem.MemberID = User.Identity.GetUserId<int>();

            var result = PortalDb.ClearBasketItemPreAllocations(new PassBasketItemAllocation()
            {
                MemberID = objBasketItem.MemberID,
                BasketItemID = objBasketItem.BasketItemID
            });

            if (result.PreAllocationErrorIDs.Count == 0)
            {
                if (PortalDb.BasketItemUpdate(objBasketItem))
                {
                    return Ok(result);
                }
                else
                {
                    throw new Exception("Failed to update Stock Location");
                }
            }

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult BasketItemReviewPrices([FromBody] PassBasketItemReviewPricesSelect objBasketItem)
        {
            var result = PortalDb.BasketItemReviewPrices(objBasketItem);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult BasketItemReviewPricesCalculateFinalPrice([FromBody] PassBasketItemReviewPricesSave objSave)
        {
            if (objSave.Discounts == null)
            {
                objSave.Discounts = new List<PassBasketItemDiscount>();
            }

            var result = PortalDb.BasketItemReviewPricesCalculateFinalPrice(objSave);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult SaveBasketItemReviewPrices([FromBody] PassBasketItemReviewPricesSave objPrices)
        {
            if (objPrices.Discounts == null)
            {
                objPrices.Discounts = new List<PassBasketItemDiscount>();
            }

            var result = PortalDb.BasketItemReviewPricesSave(objPrices);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult CancelBasketItem([FromBody] PassBasketItemID objBasketItem)
        {
            _ = PortalDb.CancelBasketItem(new PassBasketItemAllocation()
            {
                MemberID = User.Identity.GetUserId<int>(),
                BasketItemID = objBasketItem.BasketItemID
            });

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult UpdateBasketItem([FromBody] PassBasketItem objBasketItem)
        {
            objBasketItem.MemberID = User.Identity.GetUserId<int>();

            PortalDb.BasketItemUpdate(objBasketItem);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult FetchBasket([FromBody] PassBasketFetch objBasket)
        {
            var results = PortalDb.FetchBasket(objBasket);

            //string jsonRes = Newtonsoft.Json.JsonConvert.SerializeObject(results);

            //var resp = new HttpResponseMessage();

            //resp.Content = new StringContent(jsonRes, System.Text.Encoding.UTF32, "application/json");

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult PartBackOrderBasketLine([FromBody] PassBasketItem objBasketItem)
        {
            // "I just think 'Program it however the hell you want'" - M. Romanski

            // shouldn't need to alter the allocations I don't believe...
            // because what is being presented as quantity should all be allocated by now, and backOrderQuantity
            // doesn't get an allocation...
            PortalDb.BasketItemUpdate(objBasketItem);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult BackOrderEntireBasketLine([FromBody] PassBasketItem objBasketItem)
        {
            var result = PortalDb.ClearBasketItemPreAllocations(new PassBasketItemAllocation()
            {
                MemberID = objBasketItem.MemberID,
                BasketItemID = objBasketItem.BasketItemID
            });

            objBasketItem.BackOrder = true;

            if (result.PreAllocationErrorIDs.Count == 0)
            {
                if (PortalDb.BasketItemUpdate(objBasketItem))
                {
                    return Ok(result);
                }
                else
                {
                    throw new Exception("Failed to Back Order basket item");
                }
            }

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult ToggleBatchCuttingExpress([FromBody] PassBatchCuttingExpressIndicator objIndicator)
        {
            return Ok(PortalDb.ToggleBatchCuttingExpress(objIndicator, User.Identity.GetUserId<int>()));
        }

        [HttpPost]
        public IHttpActionResult CancelBackOrdering([FromBody] PassBasketItem objBasketItem)
        {
            objBasketItem.BackOrder = false;

            var result = PortalDb.BasketItemUpdate(objBasketItem);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult FetchBasketDeliveryAddresses(PassBasketTradeAccount objBasket)
        {
            var basketAddressResult = PortalDb.FetchBasketDeliveryAddress(objBasket);

            var tradeAccountAddressResult = PortalDb.FetchTradeAccountAddresses(objBasket.TradeAccountNumber);

            //var b = MertexerV2DAL.FetchTradeAccountAddresses(objBasket.TradeAccountNumber, PortalDb);

            var restrictions = PortalDb.FetchBasketDeliveryRestrictions(objBasket.BasketID, tradeAccountAddressResult.InvoiceAddress.CountryCode, tradeAccountAddressResult.InvoiceAddress.Postcode,
                null, null);

            var ba = PortalDb.Baskets.Where(p => p.BasketID == objBasket.BasketID).Single();

            var ta = PortalDb.TradeAccounts.Where(p => p.TradeAccountID == objBasket.TradeAccountID).Single();

            //var endCustomerCusRefs = new List<string>();

            //var endCustomers = new List<TradeAccount>();

            //if (results.IsParentAccount)
            //{
            //    endCustomerCusRefs = MertexerV2DAL.EndCustomerList(ta.Code);
            //    endCustomers = PortalDb.TradeAccounts.Where(p => endCustomerCusRefs.Contains(p.Code)).ToList();
            //}

            SharedEFClasses.Models.TradeAccounts.TradeAccount endCustomer = null;

            if (!String.IsNullOrEmpty(ba.EndCustomerTradeAccountCode))
            {
                endCustomer = PortalDb.TradeAccounts.Where(p => p.Code == ba.EndCustomerTradeAccountCode).Single();

                if (tradeAccountAddressResult.InvoiceAddress != null)
                {
                    if (tradeAccountAddressResult.InvoiceAddress.DeliveryReference == "C")
                    {
                        tradeAccountAddressResult.InvoiceAddress.DeliveryReference = ba.EndCustomerTradeAccountCode;
                    }
                }

                if (tradeAccountAddressResult.DefaultDeliveryAddress != null)
                {
                    if (tradeAccountAddressResult.DefaultDeliveryAddress.Key == "C")
                    {
                        tradeAccountAddressResult.DefaultDeliveryAddress = new DeliveryAddress(
                            ba.EndCustomerTradeAccountCode, tradeAccountAddressResult.DefaultDeliveryAddress
                        );
                    }
                }
            }

            return Ok(new
            {
                basketAddress = basketAddressResult.DeliveryAddress,
                miscInvoiceAddress = basketAddressResult.MiscInvoiceAddress,
                DefaultDeliveryAddress = tradeAccountAddressResult.DefaultDeliveryAddress,
                tradeAccountAddressResult.InvoiceAddress,
                IsParentAccount = ta.HasEndCustomers,
                endCustomer,
                ForbiddenDestinationCountries = restrictions
            });
        }

        [HttpPost]
        public IHttpActionResult EndCustomerAutocomplete(PassAutocompleteTerm objTerm)
        {
            var tradeDataSourceJson = PortalDb.TradeAccounts.Where(p => p.Code == objTerm.tradeAccountCode).Select(p => p.UniVerseDataSources).Single();

            var endCustomerCusRefs = new List<string>();

            var endCustomers = new List<SharedEFClasses.Models.TradeAccounts.TradeAccount>();

            endCustomerCusRefs = PortalDb.FetchTradeAccountEndCustomers(objTerm).ToList();

            endCustomerCusRefs.Sort();

            endCustomers = PortalDb.TradeAccounts.Where(p => endCustomerCusRefs.Contains(p.Code)).Take(50).ToList();

            return Ok(endCustomers);
        }

        [HttpPost]
        public IHttpActionResult SaveBasketDeliveryAddress(PassBasketAddressCleanse objAddress)
        {
            var tradeDataSourceJson = PortalDb.TradeAccounts.Where(p => p.Code == objAddress.tradeAccountCode).Select(p => p.UniVerseDataSources).Single();

            var dataSources = JsonConvert.DeserializeObject<TradeAccountDataSourceInfo>(tradeDataSourceJson);

            var dataSource = dataSources.EnquiryTypes.Where(p => p.EnquiryType == SharedEFClasses.Models.Mertexer.EnquiryType.Address)
                .Single()
                .DataSources
                .Single();

            // exit early if necessary
            if (!objAddress.skipDeliveryRestrictions)
            {
                var restrictions = PortalDb.FetchBasketDeliveryRestrictions(objAddress.basketId,
                    objAddress.invoiceAddressCountryCode, objAddress.invoiceAddressPostcode,
                    objAddress.deliveryCountryCode, objAddress.deliveryPostcode);

                var forbid = restrictions.Where(p => p.CountryID == objAddress.deliveryCountryId).FirstOrDefault();

                if (forbid != null)
                {
                    return Ok(new { forbid });
                }
            }

            objAddress.tradeAccountCode = PortalFramework.RemoveDiacritics(objAddress.tradeAccountCode)?.ToUpperInvariant();
            objAddress.endCustomerCode = PortalFramework.RemoveDiacritics(objAddress.endCustomerCode)?.ToUpperInvariant();
            objAddress.endCustomerName = PortalFramework.RemoveDiacritics(objAddress.endCustomerName)?.ToUpperInvariant();
            objAddress.deliveryCompanyName = PortalFramework.RemoveDiacritics(objAddress.deliveryCompanyName)?.ToUpperInvariant();
            objAddress.deliveryName = PortalFramework.RemoveDiacritics(objAddress.deliveryName)?.ToUpperInvariant();
            objAddress.deliveryAddressLine1 = PortalFramework.RemoveDiacritics(objAddress.deliveryAddressLine1)?.ToUpperInvariant();
            objAddress.deliveryAddressLine2 = PortalFramework.RemoveDiacritics(objAddress.deliveryAddressLine2)?.ToUpperInvariant();
            objAddress.deliveryTown = PortalFramework.RemoveDiacritics(objAddress.deliveryTown)?.ToUpperInvariant();
            objAddress.deliveryCounty = PortalFramework.RemoveDiacritics(objAddress.deliveryCounty)?.ToUpperInvariant();
            objAddress.deliveryPostcode = PortalFramework.RemoveDiacritics(objAddress.deliveryPostcode)?.ToUpperInvariant();
            objAddress.deliveryCountryCode = PortalFramework.RemoveDiacritics(objAddress.deliveryCountryCode)?.ToUpperInvariant();
            objAddress.email = PortalFramework.RemoveDiacritics(objAddress.email)?.ToUpperInvariant();
            objAddress.deliveryPhoneNumber = PortalFramework.RemoveDiacritics(objAddress.deliveryPhoneNumber)?.ToUpperInvariant();

            var address = new DeliveryAddress(
                    tradeAccountCode: objAddress.endCustomerCode ?? objAddress.tradeAccountCode, // we might be dealing with an end customer, if so we want to write to THEIR address book.
                    addressLine1: objAddress.deliveryAddressLine1,
                    addressLine2: objAddress.deliveryAddressLine2,
                    town: objAddress.deliveryTown,
                    county: objAddress.deliveryCounty,
                    postcode: objAddress.deliveryPostcode,
                    countryCode: objAddress.deliveryCountryCode,
                    contactName: objAddress.deliveryName,
                    companyName: objAddress.deliveryCompanyName,
                    phoneNumber: objAddress.deliveryPhoneNumber,
                    email: objAddress.email,
                    deliveryReference: objAddress.deliveryReference,
                    domesticOrTrade: null,
                    haulierCode: null,
                    carriageCode: null,
                    usStateCode: null,
                    usCountyCode: null,
                    usTaxExemptionCertificateReference: null,
                    isDefaultDeliveryAddress: objAddress.isDefaultDeliveryAddress);

            // do the stupid name / company name switcheroo
            if (String.IsNullOrWhiteSpace(objAddress.deliveryCompanyName) && !String.IsNullOrWhiteSpace(objAddress.deliveryName))
            {
                objAddress.deliveryCompanyName = objAddress.deliveryName;
            }
            if (!String.IsNullOrWhiteSpace(objAddress.deliveryCompanyName) && String.IsNullOrWhiteSpace(objAddress.deliveryName))
            {
                objAddress.deliveryName = objAddress.deliveryCompanyName;
            }
            address.ContactName = objAddress.deliveryName;
            address.CompanyName = objAddress.deliveryCompanyName;

            // Do we have a Delivery Reference?
            if (String.IsNullOrEmpty(objAddress.deliveryReference))
            {
                // No we don't have a delivery reference
                if (!objAddress.skipDedupe)
                {
                    // and we haven't been instructed to skip the de-duplication process

                    // get a collection of DELADD records which match this one (before... stupidly doctoring the names and companynames around...)
                    var extantDelrefs = PortalDb.DeliveryAddressExists(dataSource.CustomerReference, address);

                    // if we have any extant DELADD records which match the details of the address we're trying to save
                    if (extantDelrefs.Any())
                    {
                        // prefer the default if it's returned
                        var defaultDeliveryReference = extantDelrefs.SingleOrDefault(p => p.IsDefault);

                        if (defaultDeliveryReference != null)
                        {
                            objAddress.deliveryReference = defaultDeliveryReference.DeliveryReference;
                        }
                        else
                        {
                            // if the default is not returned,
                            // take the lowest ID and use that as the defacto 
                            objAddress.deliveryReference = extantDelrefs.OrderBy(p => p.DeliveryReference).Select(p => p.DeliveryReference).First();
                        }

                        var now = DateTime.Now;

                        // iterate over the other DELADD records
                        foreach (var dr in extantDelrefs.Where(p => p.DeliveryReference != objAddress.deliveryReference))
                        {
                            // check for a TradeAccountAddressCleanse
                            var taac = PortalDb.TradeAccountAddressCleanses.Where(p => 
                                p.TradeAccountCode == objAddress.tradeAccountCode && 
                                p.DeliveryReference == dr.DeliveryReference).SingleOrDefault();

                            // if there is one
                            if (taac != null)
                            {
                                // flag it as deleted
                                if (taac.DeletedDT == null)
                                {
                                    taac.DeletedDT = now;
                                    taac.ModifiedDT = now;
                                }
                            }
                            else
                            {
                                // if there isn't one
                                var a = new TradeAccountAddressCleanse()
                                {
                                    // create one and set it to deleted
                                    TradeAccountCode = objAddress.tradeAccountCode,
                                    DeliveryReference = dr.DeliveryReference,
                                    SourceAddressHash = objAddress.md5Hash,
                                    SourceAddress = JsonConvert.SerializeObject(objAddress),
                                    Status = null,
                                    CreatedDT = now,
                                    ModifiedDT = now,
                                    LookupDT = null,
                                    DeletedDT = now
                                };
                            }
                        }

                        // Save any changes thus far to the database
                        PortalDb.SaveChanges();
                    }
                }

                // Do we have a Delivery Reference yet?
                if (String.IsNullOrEmpty(objAddress.deliveryReference))
                {
                    // No? Well, that's because we need to create a new DELADD record.
                    objAddress.deliveryReference = PortalDb.DeliveryAddressUpsert(dataSource.CustomerReference, address);
                }

                // Right. Have we got a TAAC for the DELREF at play?
                var cleanse = PortalDb.TradeAccountAddressCleanses.Where(p => p.TradeAccountCode == (objAddress.endCustomerCode ?? objAddress.tradeAccountCode) && p.DeliveryReference == objAddress.deliveryReference).SingleOrDefault();

                if (cleanse == null)
                {   // nope, create a TAAC for this address
                    var now = DateTime.Now;

                    cleanse = new TradeAccountAddressCleanse()
                    {
                        TradeAccountCode = objAddress.endCustomerCode ?? objAddress.tradeAccountCode,
                        DeliveryReference = objAddress.deliveryReference,
                        SourceAddressHash = objAddress.md5Hash,
                        SourceAddress = JsonConvert.SerializeObject(new
                        {
                            Type = objAddress.manual ? "Manual" : "Loqate",
                            DeliveryReferenceID = objAddress.deliveryReference,
                            DeliveryReference = objAddress.deliveryReference,
                            TradeAccountCode = objAddress.endCustomerCode ?? objAddress.tradeAccountCode,
                            Label = objAddress.label,
                            Name = objAddress.deliveryName,
                            Company = objAddress.deliveryCompanyName,
                            Line1 = objAddress.deliveryAddressLine1,
                            Line2 = objAddress.deliveryAddressLine2,
                            City = objAddress.deliveryTown,
                            Province = objAddress.deliveryCounty,
                            PostalCode = objAddress.deliveryPostcode,
                            Email = objAddress.email,
                            Phone = objAddress.deliveryPhoneNumber,
                            Country = objAddress.deliveryCountryCode,
                            MD5Hash = objAddress.md5Hash
                        }),
                        Status = objAddress.status,
                        CreatedDT = now,
                        LookupDT = objAddress.loqateLookupPerformed ? now : (DateTime?)null,
                        DeletedDT = null,
                        LastUsedDT = now
                    };

                    PortalDb.TradeAccountAddressCleanses.Add(cleanse);

                    PortalDb.SaveChanges();
                }
                else
                {
                    // we did find a TAAC for this delivery address
                    if (cleanse.SourceAddressHash != objAddress.md5Hash)
                    {
                        // if the address info needs updating, update it
                        cleanse.SourceAddressHash = objAddress.md5Hash;
                        cleanse.SourceAddress = JsonConvert.SerializeObject(new
                        {
                            Type = objAddress.manual ? "Manual" : "Loqate",
                            DeliveryReferenceID = objAddress.deliveryReference,
                            DeliveryReference = objAddress.deliveryReference,
                            TradeAccountCode = objAddress.endCustomerCode ?? objAddress.tradeAccountCode,
                            Label = objAddress.label,
                            Name = objAddress.deliveryName,
                            Company = objAddress.deliveryCompanyName,
                            Line1 = objAddress.deliveryAddressLine1,
                            Line2 = objAddress.deliveryAddressLine2,
                            City = objAddress.deliveryTown,
                            Province = objAddress.deliveryCounty,
                            PostalCode = objAddress.deliveryPostcode,
                            Email = objAddress.email,
                            Phone = objAddress.deliveryPhoneNumber,
                            Country = objAddress.deliveryCountryCode,
                            MD5Hash = objAddress.md5Hash,
                        });
                        cleanse.LastUsedDT = DateTime.Now;
                    }
                    else
                    {
                        cleanse.LastUsedDT = DateTime.Now;
                    }
                    PortalDb.SaveChanges();
                }
            }
            else
            {
                if (address.Key != "C")
                {
                    // Are we dealing with them having selected the Default Delivery Address (and having left it unchanged)?
                    if (address.IsDefaultDeliveryAddress)
                    {
                        // If so, we need do nothing: no changes were made by the user to the default delivery address which was
                        // loaded out from portal.TradeAccount_Address_Select
                    }
                    else
                    {
                        var extantDelrefs = PortalDb.DeliveryAddressExists(dataSource.CustomerReference, address);

                        if (extantDelrefs.Any())
                        {
                            // prefer the default if it's returned
                            var defaultDeliveryReference = extantDelrefs.SingleOrDefault(p => p.IsDefault);

                            if (defaultDeliveryReference != null)
                            {
                                objAddress.deliveryReference = defaultDeliveryReference.DeliveryReference;
                            }
                            else
                            {
                                // if the default is not returned,
                                // take the lowest ID and use that as the defacto 
                                objAddress.deliveryReference = extantDelrefs.OrderBy(p => p.DeliveryReference).Select(p => p.DeliveryReference).First();
                            }

                            var now = DateTime.Now;

                            foreach (var dr in extantDelrefs)
                            {
                                if (dr.DeliveryReference != objAddress.deliveryReference)
                                {
                                    var taac = PortalDb.TradeAccountAddressCleanses.Where(p =>
                                        p.TradeAccountCode == objAddress.tradeAccountCode && 
                                        p.DeliveryReference == dr.DeliveryReference).SingleOrDefault();

                                    if (taac != null)
                                    {
                                        if (taac.DeletedDT == null)
                                        {
                                            taac.DeletedDT = now;
                                            taac.ModifiedDT = now;
                                        }
                                    }
                                    else
                                    {
                                        var a = new TradeAccountAddressCleanse()
                                        {
                                            TradeAccountCode = objAddress.tradeAccountCode,
                                            DeliveryReference = dr.DeliveryReference,
                                            SourceAddressHash = objAddress.md5Hash,
                                            SourceAddress = JsonConvert.SerializeObject(objAddress),
                                            Status = null,
                                            CreatedDT = now,
                                            ModifiedDT = now,
                                            LookupDT = null,
                                            DeletedDT = now
                                        };
                                    }
                                }
                            }

                            PortalDb.SaveChanges();
                        }

                        // Right. Have we got a TAAC for the DELREF at play?
                        var cleanse = PortalDb.TradeAccountAddressCleanses.Where(p => p.TradeAccountCode == (objAddress.endCustomerCode ?? objAddress.tradeAccountCode) && p.DeliveryReference == objAddress.deliveryReference).SingleOrDefault();

                        if (cleanse == null)
                        {   // nope, create a TAAC for this address
                            var now = DateTime.Now;

                            cleanse = new TradeAccountAddressCleanse()
                            {
                                TradeAccountCode = objAddress.endCustomerCode ?? objAddress.tradeAccountCode,
                                DeliveryReference = objAddress.deliveryReference,
                                SourceAddressHash = objAddress.md5Hash,
                                SourceAddress = JsonConvert.SerializeObject(new
                                {
                                    Type = objAddress.manual ? "Manual" : "Loqate",
                                    DeliveryReferenceID = objAddress.deliveryReference,
                                    DeliveryReference = objAddress.deliveryReference,
                                    TradeAccountCode = objAddress.endCustomerCode ?? objAddress.tradeAccountCode,
                                    Label = objAddress.label,
                                    Name = objAddress.deliveryName,
                                    Company = objAddress.deliveryCompanyName,
                                    Line1 = objAddress.deliveryAddressLine1,
                                    Line2 = objAddress.deliveryAddressLine2,
                                    City = objAddress.deliveryTown,
                                    Province = objAddress.deliveryCounty,
                                    PostalCode = objAddress.deliveryPostcode,
                                    Email = objAddress.email,
                                    Phone = objAddress.deliveryPhoneNumber,
                                    Country = objAddress.deliveryCountryCode,
                                    MD5Hash = objAddress.md5Hash
                                }),
                                Status = objAddress.status,
                                CreatedDT = now,
                                LastUsedDT = now,
                                LookupDT = objAddress.loqateLookupPerformed ? now : (DateTime?)null,
                                DeletedDT = null
                            };

                            PortalDb.TradeAccountAddressCleanses.Add(cleanse);

                            PortalDb.SaveChanges();
                        }
                        else
                        {
                            // we did find a TAAC for this delivery address
                            if (cleanse.SourceAddressHash != objAddress.md5Hash)
                            {
                                // if the address info needs updating, update it
                                cleanse.SourceAddressHash = objAddress.md5Hash;
                                cleanse.SourceAddress = JsonConvert.SerializeObject(new
                                {
                                    Type = objAddress.manual ? "Manual" : "Loqate",
                                    DeliveryReferenceID = objAddress.deliveryReference,
                                    DeliveryReference = objAddress.deliveryReference,
                                    TradeAccountCode = objAddress.endCustomerCode ?? objAddress.tradeAccountCode,
                                    Label = objAddress.label,
                                    Name = objAddress.deliveryName,
                                    Company = objAddress.deliveryCompanyName,
                                    Line1 = objAddress.deliveryAddressLine1,
                                    Line2 = objAddress.deliveryAddressLine2,
                                    City = objAddress.deliveryTown,
                                    Province = objAddress.deliveryCounty,
                                    PostalCode = objAddress.deliveryPostcode,
                                    Email = objAddress.email,
                                    Phone = objAddress.deliveryPhoneNumber,
                                    Country = objAddress.deliveryCountryCode,
                                    MD5Hash = objAddress.md5Hash
                                });
                                cleanse.LastUsedDT = DateTime.Now;
                            }
                            else
                            {
                                var now = DateTime.Now;
                                cleanse.LastUsedDT = now;
                                cleanse.LookupDT = objAddress.loqateLookupPerformed ? now : (DateTime?)null;
                                cleanse.Status = objAddress.status;
                            }

                            PortalDb.SaveChanges();
                        }

                        // No DELADD records match on this address's details - update the DELADD record having this DELREF.
                        PortalDb.DeliveryAddressUpsert(dataSource.CustomerReference, address);
                    }
                }
                else
                {
                    // We're dealing with using the Customer Invoice Address as the Delivery Address: no need for TradeAccountAddressCleanse records, or anything fancy.
                }
            }

            var b = PortalDb.Baskets.Where(p => p.BasketID == objAddress.basketId).Single();

            if (objAddress.loqateLookupPerformed && objAddress.status == "Declined")
            {
                b.UserRefusedAddressRecommendation = true;
            }

            if (objAddress.loqateLookupPerformed && objAddress.status == "Accepted")
            {
                b.UserRefusedAddressRecommendation = false;
            }

            PortalDb.SaveChanges();

            var result = PortalDb.SaveBasketDeliveryAddress(objAddress);

            return Ok(new { objAddress.deliveryReference });
        }

        [HttpPost]
        public IHttpActionResult SaveBasketMiscInvoiceAddress(PassMiscellaneousInvoiceAddress objAddress)
        {
            var result = PortalDb.SaveBasketMiscInvoiceAddress(objAddress);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult SaveBasketSplitDeliveryOptions(PassDispatchFactorySave objService)
        {
            var result = PortalDb.SaveBasketSplitDeliveryOption(objService);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult FetchOrderClauses([FromBody] PassBasketID objBasketId)
        {
            var results = PortalDb.FetchOrderClauses(objBasketId);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult SaveOrderClauses([FromBody] PassOrderClauses objSave)
        {
            var result = PortalDb.SaveOrderClauses(objSave);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult FetchAdditionalProducts([FromBody] PassAdditionalProductsFetch objAdditional)
        {
            var results = PortalDb.FetchAdditionalProducts(objAdditional);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchBasketComments([FromBody] PassBasketID objBasket)
        {
            var results = PortalDb.FetchBasketComments(objBasket);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchBasketNotes([FromBody] PassBasketID objBasket)
        {
            var results = PortalDb.FetchBasketNotes(objBasket);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult SaveBasketComments([FromBody] PassBasketCommentSave objSave)
        {
            var result = PortalDb.SaveBasketComments(objSave);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult SaveBasketNotes([FromBody] PassBasketNoteSave objSave)
        {
            var result = PortalDb.SaveBasketNotes(objSave);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult SaveBasketDetails([FromBody] PassBasketParameters objParams)
        {
            var results = PortalDb.SaveBasketDetails(objParams);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult SaveBasketEUExitDetails([FromBody] PassBasketEUExitParameters objParams)
        {
            var results = PortalDb.SaveBasketEUExitDetails(objParams);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult CustomerCareRecordAutocomplete([FromBody] PassAutocompleteTerm objTerm)
        {
            var tradeDataSourceJson = PortalDb.TradeAccounts.Where(p => p.Code == objTerm.tradeAccountCode).Select(p => p.UniVerseDataSources).Single();

            var results = PortalDb.ClaimHeads
                .Where(p => p.TradeAccountCode == objTerm.tradeAccountCode &&
                      (String.IsNullOrEmpty(objTerm.searchTerm) || (p.OrderID.StartsWith(objTerm.searchTerm) || p.ClaimID.StartsWith(objTerm.searchTerm))))
                .ToList()
                .OrderByDescending(p => p.ClaimID)
                .Skip(0)
                .Take(20)
                .Select(p => (p.ClaimID, p.Label))
                .ToList();

            //var results = MertexerV2SQL.MiscFunctions.MiscellaneousFunctions.CCRAutocomplete(tradeDataSourceJson, objTerm);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult HeldForSalesAutocomplete([FromBody] PassAutocompleteTerm objTerm)
        {
            var results = PortalDb.HeldForSalesReasonAutocomplete(objTerm);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> LineDuplicateCheck([FromBody] PassDuplicateLineCheck objCheck)
        {
            var tradeDataSourceJson = PortalDb.TradeAccounts.Where(p => p.Code == objCheck.tradeAccountCode).Select(p => p.UniVerseDataSources).Single();

            //var result = MertexerV2SQL.MiscFunctions.MiscellaneousFunctions.LineDuplicateCheck(tradeDataSourceJson, objCheck);

            var result = await PortalDb.OrderLineDuplicateCheck(tradeDataSourceJson, objCheck);

            var basketItemResult = PortalDb.BasketItems.Where(p => p.BasketID == objCheck.basketId &&
                                                                   p.ProductID == objCheck.productId &&
                                                                   p.Quantity == objCheck.quantity &&
                                                                   p.Deleted == false
                                                            //p.LineReference == objCheck.lineReference
                                                            ).ToList();

            if (basketItemResult.Count > 0)
            {
                result.isCurrentBasketDuplicate = true;
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<IHttpActionResult> UniqueOrderReferenceCheck([FromBody] PassOrderReference objOrderReference)
        {
            var tradeDataSourceJson = PortalDb.TradeAccounts.Where(p => p.Code == objOrderReference.tradeAccountCode).Select(p => p.UniVerseDataSources).Single();

            var result = await PortalDb.OrderReferenceDuplicateCheck(tradeDataSourceJson, objOrderReference);

            return Ok(result.orderNumbers);
        }

        [HttpPost]
        public IHttpActionResult ProductCodeAutocompleteBespoke([FromBody] PassBespokeAutocomplete objFetch)
        {
            var data = PortalDb.ProductCodeAutocompleteBespoke(objFetch);

            return Ok(data);
        }

        //Defunct? 15/03/2023
        //[HttpPost]
        //public IHttpActionResult RefreshTradeAccountInvoiceAddress([FromBody]PassTradeAccountNumber objTradeAccount)
        //{
        //    var tradeDataSourceJson = PortalDb.TradeAccounts.Where(p => p.Code == objTradeAccount.accountNumber).Select(p => p.UniVerseDataSources).Single();

        //    var invoiceAddress = PortalDb.FetchTradeAccountAddresses(objTradeAccount.accountNumber);

        //    return Ok(invoiceAddress.InvoiceAddress);
        //}


        [HttpPost]
        public async Task<IHttpActionResult> RefreshTradeAccountInvoiceTerms([FromBody] PassTradeAccountNumber objTradeAccount)
        {
            var tradeDataSourceJson = PortalDb.TradeAccounts.Where(p => p.Code == objTradeAccount.accountNumber).Select(p => p.UniVerseDataSources).Single();

            var paymentTermsCode = await PortalDb.FetchPaymentTerms(objTradeAccount.accountNumber);

            if (paymentTermsCode != null)
            {
                return Ok(PortalDb.PaymentTerms.Where(p => p.Code == paymentTermsCode).Single());
            }
            else
            {
                throw new Exception("Failed to refresh Payment Terms");
            }
        }

        [HttpPost]
        public IHttpActionResult RefreshTradeAccountVATNumbers([FromBody] PassBasketID objBasketId)
        {
            var data = PortalDb.VATNumberLookup(objBasketId);

            return Ok(data);
        }

        [HttpPost]
        public async Task<IHttpActionResult> RefreshTradeAccountEORINumber([FromBody] PassTradeAccountNumber objTradeAccount)
        {
            var tradeDataSourceJson = PortalDb.TradeAccounts.Where(p => p.Code == objTradeAccount.accountNumber).Select(p => p.UniVerseDataSources).Single();

            var result = await PortalDb.FetchEORINumber(objTradeAccount.accountNumber);

            if (result != null)
            {
                return Ok(new { EORINumber = result });
            }

            return Ok(new { EORINumber = (string)null });
        }

        [HttpPost]
        // This can fail for various reasons - the service may be unavailable.
        public async Task<IHttpActionResult> ValidateVATNumber([FromBody] PassVATNumber objVATNumber)
        {
            try
            {
                var country = PortalDb.Countries.Where(p => p.Code == objVATNumber.countryCode).Single();

                if (objVATNumber.countryCode == "GB")
                {
                    using (var client = new HttpClient())
                    {
                        var gbResponse = await client.GetAsync($"https://api.service.hmrc.gov.uk/organisations/vat/check-vat-number/lookup/{objVATNumber.vatNumber}");

                        if (gbResponse.IsSuccessStatusCode)
                        {
                            var response = JsonConvert.DeserializeObject<hmrcVatResponse>(await gbResponse.Content.ReadAsStringAsync());

                            return Ok(new { Body = new { valid = true, traderName = response.target.name }, countryName = country.Name });
                        }
                        else
                        {
                            return Ok(new { Body = new { valid = false }, countryName = country.Name });
                        }
                    }
                }
                else
                {
                    if (country.Code == "GR")
                        country.Code = "EL";

                    var response = new VAT_Lookup.checkVatApproxResponse();

                    using (var client = new VAT_Lookup.checkVatPortTypeClient())
                    {
                        response = await client.checkVatApproxAsync(
                            country.Code,
                            objVATNumber.vatNumber,
                            null, null, null, null, null,
                            objVATNumber.requesterCountryCode ?? "NL",
                            objVATNumber.requesterVATNumber ?? "801821654B01");

                        return Ok(new { response.Body, countryName = country.Name });
                    }
                }
            }
            catch (Exception ex)
            {
                PortalFramework.LogErrorToDatabase(ex, User.Identity.GetUserId<int>());

                // market, customer no., name, eori, basketid
//                System.Threading.Tasks.Task.Run(() =>
//                {
//                    PortalDb.QueueAndSendEmail("itsupport@designersguild.com", "VAT Number Validation Exception", $@"<p>
//    An exception was raised while attempting to validate a VAT Number.
//</p>
//<p><strong>Basket ID: </strong>{objVATNumber.basketId}</p>
//<p><strong>Customer: </strong>{objVATNumber.tradeAccountLabel}</p>
//<p><strong>Market: </strong>{objVATNumber.market}</p>
//<p><strong>Requester Country: </strong>{objVATNumber.requesterCountryCode}</p>
//<p><strong>VAT Country: </strong>{objVATNumber.countryCode}</p>
//<p><strong>VAT Number: </strong>{objVATNumber.vatNumber}</p>
//<p>Please check the VAT number manually if you can.</p>
//<p>The user has been allowed to proceed with the basket and might have already submitted it to Mertex.</p>", 0, null);
//                });

                var exceptionResult = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent("The EU VAT site cannot currently validate this VAT registration number. We will assume the number is valid and notify credit control.")
                };

                return ResponseMessage(exceptionResult);
            }
        }

        [HttpPost]
        // This can fail for various reasons - the service may be unavailable.
        public IHttpActionResult ValidateEORINumberEU([FromBody] PassEORINumber objEORINumber)
        {
            try
            {
                var response = Portal.Utilities.EU_EORI_Lookup.Validate(objEORINumber.eoriNumber);

                return Ok(new
                {
                    valid = response.statusDescr == "Valid",
                    name = response.name
                });
            }
            catch (Exception ex)
            {
                PortalFramework.LogErrorToDatabase(ex, User.Identity.GetUserId<int>());

                // 01/07/2024 - at Sarah's request, this email notification has been disabled

//                // market, customer no., name, eori, basketid
//                System.Threading.Tasks.Task.Run(() =>
//                {
//                    PortalDb.QueueAndSendEmail("itsupport@designersguild.com", "EORI Number Validation Skipped", $@"<p>
//    An exception was raised while attempting to validate an EU EORI Number.
//</p>
//<p><strong>Basket ID: </strong>{objEORINumber.basketId}</p>
//<p><strong>Customer: </strong>{objEORINumber.tradeAccountLabel}</p>
//<p><strong>Market: </strong>{objEORINumber.market}</p>
//<p><strong>EORI: </strong>{objEORINumber.eoriNumber}</p>
//<p>Please check the EORI number manually if you can.</p>
//<p>The user has been allowed to proceed with the basket and might have already submitted it to Mertex.</p>", 0);
//                });

                var exceptionResult = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent("Failed to valdiate EORI Number. Please try again later.")
                };

                return ResponseMessage(exceptionResult);
            }
        }


        [HttpPost]
        // This can fail for various reasons - the service may be unavailable.
#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
        public async Task<IHttpActionResult> ValidateEORINumberGB([FromBody] PassEORINumber objEORINumber)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
        {
            try
            {
                using (var client = new WebClient())
                {
                    client.Headers.Clear();
                    client.Headers.Add(HttpRequestHeader.Accept, "application/vnd.hmrc.1.0+json");
                    client.Headers.Add(HttpRequestHeader.ContentType, "application/json");

                    var response = client.UploadString(new Uri("https://api.service.hmrc.gov.uk/customs/eori/lookup/check-multiple-eori"), JsonConvert.SerializeObject(
                        new
                        {
                            eoris = new List<string>() { objEORINumber.eoriNumber }
                        }
                    ));

                    var result = JsonConvert.DeserializeObject<List<GBEORIResult>>(response).FirstOrDefault();

                    if (result == null)
                    {
                        throw new Exception($"No result from UK EORI Checker for {objEORINumber.eoriNumber}");
                    }

                    return Ok(new
                    {
                        valid = result.valid,
                        name = result.companyDetails?.name
                    });
                }
            }
            catch (Exception ex)
            {
                // 01/07/2024 - at Sarah's request, this email notification has been disabled

                PortalFramework.LogErrorToDatabase(ex, User.Identity.GetUserId<int>());

                //                // market, customer no., name, eori, basketid
                //#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                //                System.Threading.Tasks.Task.Run(() =>
                //                {
                //                    PortalDb.QueueAndSendEmail("itsupport@designersguild.com", "EORI Number Validation Skipped", $@"<p>
                //    An exception was raised while attempting to validate an GB EORI Number.
                //</p>
                //<p><strong>Basket ID: </strong>{objEORINumber.basketId}</p>
                //<p><strong>Customer: </strong>{objEORINumber.tradeAccountLabel}</p>
                //<p><strong>Market: </strong>{objEORINumber.market}</p>
                //<p><strong>EORI: </strong>{objEORINumber.eoriNumber}</p>
                //<p>Please check the EORI number manually if you can.</p>
                //<p>The user has been allowed to proceed with the basket and might have already submitted it to Mertex.</p>", 0);
                //                });
                //#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed

                return Ok(new
                {
                    valid = false,
                    name = (string)null
                });
            }
        }

        [HttpPost]
        public IHttpActionResult RefreshDeliveryServicesList([FromBody] PassDeliveryServiceOptions objOptions)
        {
            var results = PortalDb.RefreshDeliveryServicesList(objOptions);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult SaveCustomerTransportAccountNumber([FromBody] PassCustomerTransportAccountNumber objAccount)
        {
            var result = PortalDb.SaveCustomerTransportAccountNumber(objAccount);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult SaveBasketReason([FromBody] PassSaveBasketReason objReason)
        {
            var result = PortalDb.SaveBasketReason(objReason);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult MertexAddressSearch([FromBody] PassPCAPredictFind objSearch)
        {
            var tradeDataSourceJson = PortalDb.TradeAccounts.Where(p => p.Code == objSearch.tradeAccountCode).Select(p => p.UniVerseDataSources).Single();

            // "countries" is the country code. Could be useful.
            //var mertexResults = MertexerV2SQL.MiscFunctions.MiscellaneousFunctions.AddressBookSearch(tradeDataSourceJson, objSearch);

            var mertexResults = PortalDb.DeliveryAddressSearch(objSearch.tradeAccountCode, objSearch.text).ToList();

            mertexResults.ForEach(mr =>
            {
                var country = PortalDb.Countries.Where(p => p.Code == mr.CountryCode).SingleOrDefault();

                if (country != null)
                {
                    mr.CountryID = country.CountryID;
                }
            });

            mertexResults = mertexResults.GroupBy(p => p.MD5Hash).Select(p => 
                p.FirstOrDefault(q => q.IsDefaultDeliveryAddress == true) ?? p.OrderBy(q => q.Key).First()
            ).ToList();

            var removeMarkedAsDeleted = new List<DeliveryAddress>();

            mertexResults.ForEach(c =>
            {
                var extantCleanse = PortalDb.TradeAccountAddressCleanses.Where(p =>
                    p.TradeAccountCode == c.TradeAccountCode &&
                    p.DeliveryReference == c.Key).SingleOrDefault();

                if (extantCleanse != null)
                {
                    // + if all the address fields still match between c and extantCleanse,
                    // we can safely check extantCleanse.DeletedDT and exclude this Mertex result if its TradeAccountAddressCleanse record is deleted.

                    if (c.MD5Hash == extantCleanse.SourceAddressHash)
                    {
                        if (extantCleanse.DeletedDT != null)
                        {
                            removeMarkedAsDeleted.Add(c);
                        }
                    }
                    else
                    {
                        // + if not all the address fields match, update extantCleanse to the new fields and clear DeletedDT
                        extantCleanse.SourceAddress = JsonConvert.SerializeObject(c);

                        extantCleanse.SourceAddressHash = c.MD5Hash;
                        extantCleanse.ModifiedDT = DateTime.Now;
                        extantCleanse.DeletedDT = null;
                        extantCleanse.LookupDT = null;
                        extantCleanse.Status = null;

                        PortalDb.SaveChanges();
                    }
                }
                else
                {
                    var a = new TradeAccountAddressCleanse()
                    {
                        TradeAccountCode = c.TradeAccountCode,
                        DeliveryReference = c.Key,
                        SourceAddressHash = c.MD5Hash,
                        SourceAddress = JsonConvert.SerializeObject(c),
                        Status = null,
                        CreatedDT = DateTime.Now,
                        ModifiedDT = null,
                        LookupDT = null,
                        DeletedDT = null
                    };

                    PortalDb.TradeAccountAddressCleanses.Add(a);

                    PortalDb.SaveChanges();
                }
            });

            mertexResults = mertexResults.Except(removeMarkedAsDeleted).ToList();

            try
            {
                if (objSearch.id == null)
                {
                    var clientv1_10 = new PCAFind_v1_10.PostcodeAnywhere_SoapClient();

                    //var client = new PCAFind.PostcodeAnywhere_SoapClient();

                    //var results = new PCAFind.Capture_Interactive_Find_v1_00_ArrayOfResults();
                    var results = new PCAFind_v1_10.Capture_Interactive_Find_v1_10_ArrayOfResults();

                    if (!String.IsNullOrEmpty(objSearch.text))
                    {
                        //results = client.Capture_Interactive_Find_v1_00(
                        //    Key: ConfigurationManager.AppSettings["PCA-API-Portal"],
                        //    Text: objSearch.text,
                        //    Container: objSearch.container,
                        //    Origin: objSearch.origin,
                        //    Countries: objSearch.countries,
                        //    Limit: 12,
                        //    Language: "en-GB"
                        //);

                        results = clientv1_10.Capture_Interactive_Find_v1_10(
                            Key: ConfigurationManager.AppSettings["PCA-API-Portal"],
                            Text: objSearch.text,
                            Container: objSearch.container,
                            Origin: objSearch.origin,
                            Countries: objSearch.countries,
                            IsMiddleware: true,
                            Bias: false,
                            Limit: 12,
                            Filters: null,
                            GeoFence: null,
                            Language: "en-GB"
                        );
                    }

                    return Ok(new { mertexResults, results });
                }
                else
                {
                    var client = new PCARetrieve_v1_10.PostcodeAnywhere_SoapClient();

                    //var client = new PCARetrieve.PostcodeAnywhere_SoapClient();

                    var results = client.Capture_Interactive_Retrieve_v1_20(
                        Key: ConfigurationManager.AppSettings["PCA-API-Portal"],
                        Id: objSearch.id,
                        Field1Format: null,
                        Field2Format: null,
                        Field3Format: null,
                        Field4Format: null,
                        Field5Format: null,
                        Field6Format: null,
                        Field7Format: null,
                        Field8Format: null,
                        Field9Format: null,
                        Field10Format: null,
                        Field11Format: null,
                        Field12Format: null,
                        Field13Format: null,
                        Field14Format: null,
                        Field15Format: null,
                        Field16Format: null,
                        Field17Format: null,
                        Field18Format: null,
                        Field19Format: null,
                        Field20Format: null
                    );

                    return Ok(new { mertexResults, results });
                }
            }
            catch (Exception ex)
            {
                var exceptionResult = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent("The Address Lookup call failed: " + ex.ToString())
                };

                return ResponseMessage(exceptionResult);
            }
        }

        [HttpPost]
        public IHttpActionResult FetchBasketReview([FromBody] PassBasketID objBasketId)
        {
            var result = PortalDb.FetchBasketReview(objBasketId);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult SaveBasketReview([FromBody] PassBasketReviewSave objSave)
        {
            var results = PortalDb.SaveBasketReview(objSave);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchBasketItemPreAllocations([FromBody] PassBasketItemID objBasketItem)
        {
            var results = PortalDb.FetchBasketItemPreAllocations(objBasketItem);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult UpdateBasketPhase([FromBody] PassBasketPhase objPhase)
        {
            var basket = PortalDb.Baskets.Where(p => p.BasketID == objPhase.BasketID).Single();

            basket.LastPhaseVisited = objPhase.Phase;

            PortalDb.Database.CommandTimeout = 120;

            PortalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchLinkedDocuments([FromBody] SharedEFClasses.Models.Orders.PassProductCode objProductCode)
        {
            var results = await PortalDb.FetchLinkedDocuments(objProductCode);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchDeliveryGroup_BulkDiscount([FromBody] PassBasketDeliveryGroup objDeliveryGroup)
        {
            var results = PortalDb.FetchDeliveryGroup_BulkDiscount(objDeliveryGroup);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> CleanseAddress([FromBody] PassBasketAddressCleanse objAddress)
        {
            /*
                What are we going to be doing here.
                If the user has selected a Mertex address book address, we want to check to see if that delivery reference 
                has been checked already. 

                If this reference has not been checked yet, check it against the Loqate API and, if there is a result,
                present the result to the user and offer the user the option to replace the delivery address data held by this reference
                with the results of the cleanse.
                
                If there was a result from Loqate, we want to store the fact that the lookup has been performed for this delivery reference.
                Store that in [portal].[TradeAccountAddressCleanse]
                
                If the cleanse was performed and no match returned, then i think it is worth telling the operator that no match 
                could be found for that address. If they change something about the address then you could give them a button to 
                retry the cleanse.

                Present the result to the user, 
                and record what the user does with the result.

                If this delivery reference has been checked already, have the results of that check been utilised?
                That resides on [portal].[TradeAccountAddressCleanse].[Status] column.

                If the user has utilised the results of the lookup for this delivery address... assume that the results were
                saved into the delivery address record, and don't automatically perform a cleanse.
                Offer the user the ability to manually call out for the cleanse.

                If the user has NOT utilised the results of the lookup for this delivery address, perform the lookup.
            */

            if (objAddress.isLoqateAddress)
            {
                return Ok(new { cleansedAddress = true });
            }

            var performCleanse = false;

            if (objAddress.forceCleanse)
            {
                performCleanse = true;
            }

            try
            {
                var cleanseRecord = PortalDb.TradeAccountAddressCleanses.Where(p => p.TradeAccountCode == objAddress.tradeAccountCode &&
                                                                                    p.DeliveryReference == objAddress.deliveryReference).SingleOrDefault();

                if (cleanseRecord != null)
                {
                    if (cleanseRecord.SourceAddressHash != objAddress.md5Hash)
                    {
                        performCleanse = true;
                    }

                    if (cleanseRecord.Status == "Accepted" && !performCleanse)
                    {
                        return Ok(new { cleansedAddress = true });
                    }
                }

                var returnValue = new List<AddressCleanseResult>();

                using (var client = new HttpClient())
                {
                    var result = client.PostAsJsonAsync("https://api.addressy.com/Cleansing/International/Batch/v1.00/json4.ws", new
                    {
                        Key = "KC24-PX69-WK55-CF88",
                        Geocode = false,
                        Addresses = new List<AddressCleanseInput>()
                        {
                            new AddressCleanseInput {
                                Address1 = objAddress.deliveryAddressLine1,
                                Address2 = objAddress.deliveryAddressLine2,
                                Address3 = objAddress.deliveryTown,
                                Address4 = objAddress.deliveryCounty,
                                Country = objAddress.deliveryCountryCode,
                                PostalCode = objAddress.deliveryPostcode
                            }
                        }
                    }).Result.Content.ReadAsStringAsync().Result;

                    returnValue = JsonConvert.DeserializeObject<List<AddressCleanseResult>>(result);
                }

                if (cleanseRecord != null)
                {
                    cleanseRecord.LookupDT = DateTime.Now;
                    PortalDb.SaveChanges();
                }

                if (returnValue.Any())
                {
                    if (returnValue.First().Matches.Where(p => p.AQI == "A" || p.AQI == "B").Any())
                    {
                        var cleanseResult = returnValue.First().Matches.Where(p => p.AQI == "A" || p.AQI == "B").First();

                        cleanseResult.Address1 = cleanseResult.Address1?.ToUpperInvariant();
                        cleanseResult.Address2 = cleanseResult.Address2?.ToUpperInvariant();
                        cleanseResult.Locality = cleanseResult.Locality?.ToUpperInvariant();
                        cleanseResult.AdministrativeArea = cleanseResult.AdministrativeArea?.ToUpperInvariant();
                        cleanseResult.PostalCode = cleanseResult.PostalCode?.ToUpperInvariant();

                        objAddress.deliveryAddressLine1 = objAddress.deliveryAddressLine1?.ToUpperInvariant();
                        objAddress.deliveryAddressLine2 = objAddress.deliveryAddressLine2?.ToUpperInvariant();
                        objAddress.deliveryTown = objAddress.deliveryTown?.ToUpperInvariant();
                        objAddress.deliveryCounty = objAddress.deliveryCounty?.ToUpperInvariant();
                        objAddress.deliveryPostcode = objAddress.deliveryPostcode?.ToUpperInvariant();

                        if (cleanseResult.Address2 == cleanseResult.Locality)
                        {
                            cleanseResult.Address2 = null;
                        }

                        if (cleanseResult.Locality == null)
                        {
                            cleanseResult.Locality = objAddress.deliveryTown;
                        }

                        if (cleanseResult.Address1 == objAddress.deliveryAddressLine1 &&
                            cleanseResult.Address2 == objAddress.deliveryAddressLine2 &&
                            cleanseResult.Locality == objAddress.deliveryTown &&
                            cleanseResult.AdministrativeArea == objAddress.deliveryCounty &&
                            cleanseResult.PostalCode == objAddress.deliveryPostcode)
                        {
                            return Ok(new { cleansedAddress = true });
                        }

                        if (objAddress.deliveryReference == "C")
                        {
                            var invoiceAddressJson = JsonConvert.SerializeObject(new
                            {
                                AddressLine1 = objAddress.deliveryAddressLine1,
                                AddressLine2 = objAddress.deliveryAddressLine2,
                                Town = objAddress.deliveryTown,
                                County = objAddress.deliveryCounty,
                                Postcode = objAddress.deliveryPostcode,
                                CountryCode = objAddress.deliveryCountryCode
                            });

                            var suggestedAddressJson = JsonConvert.SerializeObject(new
                            {
                                AddressLine1 = cleanseResult.Address1,
                                AddressLine2 = cleanseResult.Address2,
                                Town = cleanseResult.Locality,
                                County = cleanseResult.AdministrativeArea,
                                Postcode = cleanseResult.PostalCode,
                                CountryCode = objAddress.deliveryCountryCode
                            });

                            var epoch = DateTime.Parse("2021/07/02");
                            var age = DateTime.Now.AddDays(-14);

                            var extantSuggestion = PortalDb.TradeAccountInvoiceAddressLoqateSuggestions.Where(p =>
                                p.TradeAccountID == objAddress.tradeAccountId &&
                                p.InvoiceAddressJSON == invoiceAddressJson &&
                                p.SuggestedAddressJSON == suggestedAddressJson &&
                                p.CreatedDT > epoch &&
                                p.CreatedDT < age).FirstOrDefault();

                            if (extantSuggestion == null)
                            {
                                // We have a cleanse suggestion for an invoice address. Add an email to portal.Email, sending it to the result of pub.DesignersGuild
                                var contactDetail = PortalDb.FetchContactDetails(objAddress.tradeAccountId, "CC");

                                var tradeAccount = PortalDb.TradeAccounts.Where(p => p.TradeAccountID == objAddress.tradeAccountId).Single();

                                var email = JObject.FromObject(contactDetail.json).SelectToken("$.contactDetails[0].email").Value<string>();

                                string cc = null;

#if DEBUG
                                email = "tclark@designersguild.com";
                                cc = "mchristie@designersguild.com";
#endif

                                var inkyMarkup = $@"
                <meta name=""x-apple-disable-message-reformatting""/>
                <container>
	                <row>
		                <columns>
			                <p class=""text-left"" style=""margin-top: 0"">
				                Hello,
			                </p>
		                </columns>
	                </row>
                    <spacer size=""15""></spacer>
	                <row>
		                <columns>
			                <p>
				                Loqate have an Invoice Address improvement suggestion for <strong>{objAddress.tradeAccountCode}</strong>. Please review this suggestion and apply it as appropriate.
			                </p>
                        </columns>
                    </row>
                    <spacer size=""15""></spacer>
                    <row>
                        <columns>
                            <p>
                                Should you wish to contact them about this change, the main email address we have on file for them is: <a href=""mailto:{tradeAccount.Email}"">{tradeAccount.Email}</a>
                            </p>
		                </columns>
	                </row>
	                <spacer size=""15""></spacer>
	                <row>
		                <columns small=""12"" large=""12"">
			                <p>
				                <strong>
					                Original Address
				                </strong>
			                </p>
		                </columns>
                    </row>
                    <spacer size=""5""></spacer>
                    <row>
                        <columns small=""4"" large=""4"">
                            <p class=""text-right"">
                                <strong>
                                    Address Line 1<br/>
                                    Address Line 2<br/>
                                    Town<br/>
                                    County<br/>
                                    Postcode<br/>
                                    Country Code
                                </strong>
                            </p>
                        </columns>
		                <columns small=""8"" large=""8"">
			                <p>
				                {(String.IsNullOrEmpty(objAddress.deliveryAddressLine1) ? "<br/>" : objAddress.deliveryAddressLine1 + "<br/>")}
				                {(String.IsNullOrEmpty(objAddress.deliveryAddressLine2) ? "<br/>" : objAddress.deliveryAddressLine2 + "<br/>")}
				                {(String.IsNullOrEmpty(objAddress.deliveryTown) ? "<br/>" : objAddress.deliveryTown + "<br/>")}
				                {(String.IsNullOrEmpty(objAddress.deliveryCounty) ? "<br/>" : objAddress.deliveryCounty + "<br/>")}
				                {(String.IsNullOrEmpty(objAddress.deliveryPostcode) ? "<br/>" : objAddress.deliveryPostcode + "<br/>")}
				                {(String.IsNullOrEmpty(objAddress.deliveryCountryCode) ? "<br/>" : objAddress.deliveryCountryCode + "<br/>")}
			                </p>
		                </columns>
	                </row>
	                <spacer size=""20""></spacer>
	                <row>
		                <columns small=""12"" large=""12"">
			                <p>
				                <strong>
					                Suggested Address
				                </strong>
			                </p>
		                </columns>
                    </row>
                    <spacer size=""5""></spacer>
                    <row>
                        <columns small=""4"" large=""4"">
                            <p class=""text-right"">
                                <strong>
                                    Address Line 1<br/>
                                    Address Line 2<br/>
                                    Town<br/>
                                    County<br/>
                                    Postcode<br/>
                                    Country Code
                                </strong>
                            </p>
                        </columns>
		                <columns small=""8"" large=""8"">
			                <p>
				                {(String.IsNullOrEmpty(cleanseResult.Address1) ? "<br/>" : cleanseResult.Address1 + "<br/>")}
				                {(String.IsNullOrEmpty(cleanseResult.Address2) ? "<br/>" : cleanseResult.Address2 + "<br/>")}
				                {(String.IsNullOrEmpty(cleanseResult.Locality) ? "<br/>" : cleanseResult.Locality + "<br/>")}
				                {(String.IsNullOrEmpty(cleanseResult.AdministrativeArea) ? "<br/>" : cleanseResult.AdministrativeArea + "<br/>")}
				                {(String.IsNullOrEmpty(cleanseResult.PostalCode) ? "<br/>" : cleanseResult.PostalCode + "<br/>")}
				                {(String.IsNullOrEmpty(objAddress.deliveryCountryCode) ? "<br/>" : objAddress.deliveryCountryCode + "<br/>")}
			                </p>
			                </p>
		                </columns>
	                </row>
                    <spacer size=""40""></spacer>
	                <row>
		                <columns small=""12"">
			                <p class=""footer"">
				                Thanks,<br/>
                                Designers Guild Portal
			                </p>
                            <spacer size=""15""></spacer>
		                </columns>
	                </row>
                </container>";

                                using (var client = new HttpClient())
                                {
                                    var content = new StringContent(inkyMarkup);

                                    ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

                                    var result = await client.PostAsync(PortalFramework.InkyEndpoint, content);

                                    inkyMarkup = await result.Content.ReadAsStringAsync();
                                }

                                var notificationEmailId = PortalDb.QueueAndSendEmail(email,
                                    $"{objAddress.deliveryCountryCode.ToUpperInvariant()} - {objAddress.tradeAccountCode} Invoice Address Change Suggestion",
                                    inkyMarkup,
                                    24,
                                    cc,
                                    null,
                                    4);

                                PortalDb.TradeAccountInvoiceAddressLoqateSuggestions.Add(new TradeAccount_InvoiceAddress_LoqateSuggestion()
                                {
                                    TradeAccountID = objAddress.tradeAccountId,
                                    BasketID = objAddress.basketId,
                                    InvoiceAddressJSON = invoiceAddressJson,
                                    SuggestedAddressJSON = suggestedAddressJson,
                                    NotificationEmailID = notificationEmailId,
                                    CreatedDT = DateTime.Now
                                });

                                PortalDb.SaveChanges();
                            }
                        }

                        return Ok(new { cleanseResult });
                    }

                    return Ok(new { offerManualCleanse = false, noBetterMatch = true });
                }

                return Ok(new { offerManualCleanse = false });
            }
            catch (Exception ex)
            {
                PortalFramework.LogErrorToDatabase(ex, User.Identity.GetUserId<int>());

                var exceptionResult = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent("The Loqate Cleanse API call failed.")
                };

                return ResponseMessage(exceptionResult);
            }
        }

        //        [HttpPost]
        //        public IHttpActionResult RecordUserInteractionAddressCleanseResult([FromBody]PassBasketAddressCleanse objAddress)
        //        {
        //            var basket = PortalDb.Baskets.Where(p => p.BasketID == objAddress.basketId).SingleOrDefault();

        //            basket.UserRefusedAddressRecommendation = objAddress.isLoqateAddress ? objAddress.status == "Declined" : false;

        //            var b = PortalDb.TradeAccountAddressCleanses.Where(p => p.TradeAccountCode == (objAddress.endCustomerCode ?? objAddress.tradeAccountCode) && p.DeliveryReference == objAddress.deliveryReference).SingleOrDefault();

        //            if (b != null && b.DeliveryReference != "C")
        //            {
        //                b.Status = objAddress.status;
        //                b.LookupDT = objAddress.isLoqateAddress ? DateTime.Now : (DateTime?)null;

        //                // Do the stupid freaking name / companyName switcheroo
        //                if (String.IsNullOrWhiteSpace(objAddress.deliveryCompanyName) && !String.IsNullOrWhiteSpace(objAddress.deliveryName))
        //                {
        //                    objAddress.deliveryCompanyName = objAddress.deliveryName;
        //                }
        //                if (!String.IsNullOrWhiteSpace(objAddress.deliveryCompanyName) && String.IsNullOrWhiteSpace(objAddress.deliveryName))
        //                {
        //                    objAddress.deliveryName = objAddress.deliveryCompanyName;
        //                }

        //                b.SourceAddressHash = objAddress.md5Hash;

        //                b.SourceAddress = JsonConvert.SerializeObject(new
        //                {
        //                    Type = objAddress.manual ? "Manual" : "Loqate",
        //                    DeliveryReferenceID = objAddress.deliveryReference,
        //                    DeliveryReference = objAddress.deliveryReference,
        //                    TradeAccountCode = objAddress.endCustomerCode ?? objAddress.tradeAccountCode,
        //                    Label = objAddress.label,
        //                    Name = objAddress.deliveryName,
        //                    Company = objAddress.deliveryCompanyName,
        //                    Line1 = objAddress.deliveryAddressLine1,
        //                    Line2 = objAddress.deliveryAddressLine2,
        //                    City = objAddress.deliveryTown,
        //                    Province = objAddress.deliveryCounty,
        //                    PostalCode = objAddress.deliveryPostcode,
        //                    Email = objAddress.email,
        //                    Phone = objAddress.deliveryPhoneNumber,
        //                    Country = objAddress.deliveryCountryCode,
        //                    MD5Hash = objAddress.md5Hash
        //                });

        //                PortalDb.SaveChanges();
        //            }
        //            else
        //            {
        //#pragma warning disable 4014
        //                System.Threading.Tasks.Task.Factory.StartNew(async () =>
        //                {
        //                    var body = "";
        //                    var subject = "RecordUserInteractionAddressCleanseResult - ComponentAPIController - Line 2950";

        //                    body = $"Uh oh! TradeAccount {objAddress.tradeAccountCode}, DeliveryReference {objAddress.deliveryReference} - could not find a [portal].[TradeAccountAddressCleanse] record to update. This shouldn't be possible at this stage.";

        //                    ((EmailService)UserManager.EmailService).SendFoundationEmailAsync(new IdentityMessage()
        //                    {
        //                        Body = body,
        //                        Subject = subject,
        //                        Destination = "tclark@designersguild.com"
        //                    });
        //                });
        //#pragma warning restore 4014
        //            }

        //            return Ok(new { });
        //        }

        [HttpPost]
        public IHttpActionResult DeleteTradeAccountAddressCleanseRecord([FromBody] PassTradeAccountCodeDeliveryReference objRecord)
        {
            var b = PortalDb.TradeAccountAddressCleanses.Where(p => p.TradeAccountCode == (objRecord.tradeAccountCode) &&
                                                                    p.DeliveryReference == objRecord.deliveryReference).Single();

            b.DeletedDT = DateTime.Now;

            PortalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchSupplierInfo([FromBody] PassProductID objProductId)
        {
            var result = await PortalDb.FetchSupplierInfo(objProductId);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult FetchFurnitureDesigns([FromBody] PassFurnitureThing objFurniture)
        {
            var results = PortalDb.FetchFurnitureDesigns(objFurniture);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchFurnitureModels([FromBody] PassFurnitureDesign objDesign)
        {
            var results = PortalDb.FetchFurnitureModels(objDesign);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchFurnitureSuppliers([FromBody] PassFurnitureModel objModel)
        {
            var results = PortalDb.FetchFurnitureSuppliers(objModel);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchFurnitureModelOptions([FromBody] PassFurnitureSupplier objSupplier)
        {
            var results = PortalDb.FetchFurnitureModelOptions(objSupplier);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult FetchFurnitureMaterialBreakdown([FromBody] PassFurnitureSupplier objSupplier)
        {
            var results = PortalDb.FetchFurnitureMaterialBreakdown(objSupplier);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult SaveBespokeFurnitureJson([FromBody] PassFurnitureJSON objJson)
        {
            var results = PortalDb.SaveFurnitureJSON(objJson);

            return Ok(objJson);
        }

        [HttpPost]
        public IHttpActionResult BespokeFurnitureMaterialSearch([FromBody] PassFurnitureSearch objSearch)
        {
            var results = PortalDb.BespokeFurnitureMaterialSearch(objSearch);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult BespokeFurnitureBasketItemSelect([FromBody] PassBasketItemID objBasketItemId)
        {
            var results = PortalDb.BespokeFurnitureBasketItemSelect(objBasketItemId);

            return Ok(results);
        }

        [HttpGet]
        public IHttpActionResult GetDefaultImages([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            return Ok(PortalDb.Images.Where(p => ((p.PerspectiveID == 1 && p.Deleted == false) || (p.PerspectiveID == 0 && p.ImageID == 117989))).AsQueryable().ToDataSourceResult(request));
        }

        [HttpPost]
        public IHttpActionResult DefaultImageModelValueMapper([FromBody] PassImageID objImageId)
        {
            return Ok(PortalDb.Images.Where(p => p.ImageID == objImageId.imageId).AsQueryable());
        }

        [HttpPost]
        public IHttpActionResult CountryValueMapper([FromBody] PassCountryID objCountryId)
        {
            return Ok(PortalDb.Countries.Where(p => p.CountryID == objCountryId.CountryID).AsQueryable());
        }

        [HttpPost]
        public IHttpActionResult SaveBasketLastChanceModal([FromBody] PassLastChanceModalSave objSave)
        {
            var b = PortalDb.Baskets.Where(p => p.BasketID == objSave.basketId).Single();

            b.DeliveryAlertLandlinePhoneNumber = objSave.landline;
            b.DeliveryAlertLandlinePhoneCountryCode = objSave.landlineCountryCode;
            b.DeliveryAlertMobilePhoneNumber = objSave.mobile;
            b.DeliveryAlertMobilePhoneCountryCode = objSave.mobileCountryCode;
            b.DeliveryAlertEmail = objSave.email;
            b.EORI = objSave.eori;
            b.DeliveryContactName = objSave.contactName;
            b.IsDeliveryAddressTrade = objSave.isDeliveryAddressTrade;

            PortalDb.SaveChanges();

            /*
             
        public string DeliveryAlertLandlinePhoneNumber { get; set; }
        public string DeliveryAlertMobilePhoneNumber { get; set; }
        public string DeliveryAlertEmail { get; set; }

             */
            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult TradeAccountPreBasketNotifications([FromBody] PassTradeAccountID objTradeAccountId)
        {
            return Ok(PortalDb.BasketTradeAccountCheck(objTradeAccountId));
        }

        [HttpPost]
        public async Task<IHttpActionResult> DeleteBasketSplitDeliveryService([FromBody] PassBasketSplit objBasketSplit)
        {
            _ = await PortalDb.DeleteBasketSplitDeliveryService(objBasketSplit);

            return Ok(new { });
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchBasketItemSplitSelect([FromBody] PassBasketID objBasketId)
        {
            var results = await PortalDb.FetchBasketItemSplitResults(objBasketId);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> SplitBasket([FromBody] PassBasketSplitRequest objSplit)
        {
            var resultantBasketId = await PortalDb.SplitBasket(objSplit);

            return Ok(resultantBasketId);
        }
    }

    public class hmrcVatResponse
    {
        public hmrcVatResponseTarget target { get; set; }
        public DateTime processingDate { get; set; }
    }

    public class hmrcVatResponseTarget
    {
        public string name { get; set; }
        public string vatNumber { get; set; }
        public hmrcVatResponseAddress address { get; set; }
    }

    public class hmrcVatResponseAddress
    {
        public string line1 { get; set; }
        public string postcode { get; set; }
        public string countryCode { get; set; }
    }
}