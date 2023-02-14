using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using Portal.Areas.Customers.ViewModels;
using Portal.Controllers;
using Portal.Utilities.DynamicRoles;
using Portal.Utilities.ModelBinderAttributes;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Customers;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Customers.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("customers")]
    [RoutePrefix("enquiry")]
    [Route("{action=index}")]
    public class EnquiryController : BaseController
    {
        public EnquiryController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }
        
        public ActionResult Index(int? tradeAccountId)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "enquiry" && p.AreaName == "customers" && p.ActionName == "index").Single();

            CustomerEnquiryViewResult result = null;

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (tradeAccountId != null)
            {
                result = PortalDb.CustomerEnquirySearch(tradeAccountId);
            }

            TradeAccountNumber_AutocompleteResult preselected = null;

            if (tradeAccountId != null)
            {
                preselected = PortalDb.TradeAccountNumber_Autocomplete(null, user.Id, tradeAccountId).FirstOrDefault();
            }
            var model = new CustomerEnquiryViewModel(
                result, 
                user.DefaultTradeAccount?.TradeAccountGroupID,
                tradeAccountId,
                preselected,
                PortalDb.Competitors.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList(),
                PortalDb.ProductTypeGroups.OrderBy(p => p.SortOrder).ToList(),
                PortalDb.Brands.OrderBy(p => p.SortOrder).ToList(),
                PortalDb.Currencies.Where(p => p.ISO_4217 != "NZD" && p.ISO_4217 != "AUD").ToList(),
                PortalFramework.GetNextFiveFinancialYears(),
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("CustomerEnquiry", model);
        }

        [HttpPost]
        public ActionResult loadCustomerDetails(PassTradeAccountID objTradeAccountId)
        {
            var result = PortalDb.CustomerEnquirySearch(objTradeAccountId.tradeAccountId);

            return Json(result, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult saveTradeAccountAddressLatLng(PassTradeAccountAddressCoordinates objCoords)
        {
            PortalDb.TradeAccountAddress_UpdateLatLng(objCoords);

            return Json(new { }, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult loadCompetitors(PassTradeAccountID objTradeAccountId)
        {
            var results = PortalDb.TradeAccount_Competitors.Where(p => p.TradeAccountID == objTradeAccountId.tradeAccountId).ToList();

            return Content(JsonConvert.SerializeObject(
                new
                {
                    Competitors = results
                },
                new JsonSerializerSettings()
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                    PreserveReferencesHandling = PreserveReferencesHandling.None
                }
            ));
        }

        [HttpPost]
        public ActionResult saveCompetitorProductTypeGroups(PassCompetitorProductTypeGroups objCompetitor)
        {
            PortalDb.TradeAccount_Competitor_Update(User.Identity.GetUserId<int>(), objCompetitor);

            return Json(new { }, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult loadSummary(PassTradeAccountSummaryFilters objFilters)
        {
            var netSalesResults = PortalDb.TradeAccount_Summary(objFilters);

            return Content(JsonConvert.SerializeObject(
                new
                {
                    netSales = netSalesResults
                },
                new JsonSerializerSettings()
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                    PreserveReferencesHandling = PreserveReferencesHandling.None
                }
            ));
        }

        [HttpPost]
        public ActionResult loadTradeAccountPotential(PassTradeAccountID objTradeAccountId)
        {
            var result = new LoadTradeAccountPotentialResult(); 

            result.Potentials = PortalDb.TradeAccountPotential.Where(p => p.TradeAccountID == objTradeAccountId.tradeAccountId).ToList();

            foreach (var po in result.Potentials)
            {
                po.NoPotentialSince = PortalFramework.DateTimeDistanceString(po.NoPotentialDT, true, true);
            }

            result.TotalPotential = result.Potentials.Select(p => p.Value).Sum();
            
            var countryId = PortalDb.TradeAccounts.Where(p => p.TradeAccountID == objTradeAccountId.tradeAccountId).Single().CountryID;

            result.ProductTypeGroups = PortalDb.ProductTypeGroup_Brand_Country.Where(p => p.CountryID == countryId).ToList();

            result.ExistingSales = PortalDb.TradeAccount_SalesBy_ProductTypeGroup_Brand(objTradeAccountId.tradeAccountId, "Fiscal Calendar " + DateTime.Now.AddYears(1).ToString("yyyy")).Sales;

            result.ExistingTradeAdvertisers = PortalDb.TradeAccount_TradeAdvertisers.Where(p => p.TradeAccountID == objTradeAccountId.tradeAccountId).ToList();

            return Content(JsonConvert.SerializeObject(
                result,
                new JsonSerializerSettings()
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                    PreserveReferencesHandling = PreserveReferencesHandling.None
                }
            ));
        }

        [HttpPost]
        public ActionResult upsertTradeAccountPotential(PassTradeAccountPotential objTradeAccountPotential)
        {
            TradeAccountPotentialUpsertResult result = PortalDb.UpsertTradeAccountPotential(User.Identity.GetUserId<int>(), objTradeAccountPotential);

            return Content(JsonConvert.SerializeObject(result));
        }
        
        public ActionResult GetProductTypeGroups()
        {
            return Json(PortalDb.ProductTypeGroups.Select(p => new { ProductTypeGroupID = p.ProductTypeGroupID, Name = p.Name }), JsonRequestBehavior.AllowGet);
        }
        
        public ActionResult GetProductTypes(string productTypeGroupId)
        {
            return Json(PortalDb.ProductTypes.Where(p => p.ProductTypeGroupID == Convert.ToByte(productTypeGroupId)).Select(p => new { ProductTypeID = p.ProductTypeID, Name = p.Name }), JsonRequestBehavior.AllowGet);
        }
    }
}