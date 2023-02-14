using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNet.OData;
//using Microsoft.AspNet.OData;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.General;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Portal.Areas.Products.Controllers
{
    [System.Web.Http.Authorize]
    public partial class ProductDeliveryAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public ProductDeliveryAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        public IHttpActionResult FetchDefaultDeliveryServices([FromBody]PassDefaultDeliveryServicesFilters objFilters)
        {
            var results = PortalDb.FetchDefaultDeliveryServices(objFilters);

            return Ok(results);
        }

        public DataSourceResult GetAlternateDeliveryServices([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request, byte? fulfilmentTypeId, string deliveryGroupListId)
        {
            byte? deliveryGroupId = null;

            if (deliveryGroupListId != null)
            {
                deliveryGroupId = Convert.ToByte(deliveryGroupListId.Split(new char[] { '-' })[1]); 
            }

            var results = PortalDb.AlternateDeliveryServices.Where(p => 
                (fulfilmentTypeId == null || p.FulfilmentTypeID == fulfilmentTypeId) &&
                (deliveryGroupId == null || p.DeliveryGroupID == deliveryGroupId)
            ).Include(p => p.DeliveryChargingLogic)
             .Include(p => p.FulfilmentType)
             .Include(p => p.SalesMarket)
             .Include(p => p.DeliveryGroup)
             .Include(p => p.TradeAccountGroup).ToList();

            return results.AsQueryable().ToDataSourceResult(request);
        }

        public IHttpActionResult UpdateAlternativeDeliveryServices(PassAlternateDeliveryServicesSave objSave)
        {
            _ = PortalDb.SaveAlternateDeliveryServices(objSave);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult DeleteAlternativeDeliveryServices(PassAlternateDeliveryServicesSave objDelete)
        {
            _ = PortalDb.DeleteAlternateDeliveryServices(objDelete.models);

            return Ok(new { });
        }

        public DataSourceResult GetTradeDeliveryContractPrices([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request, int? tradeAccountId, short? destinationCountryId, string deliveryGroupListId)
        {
            byte? deliveryGroupId = null;

            if (deliveryGroupListId != null)
            {
                deliveryGroupId = Convert.ToByte(deliveryGroupListId.Split(new char[] { '-' })[1]);
            }

            var results = PortalDb.TradeDeliveryContractPrices.Where(p =>
                (p.Deleted == false) &&
                (tradeAccountId == null || p.TradeAccountID == tradeAccountId) &&
                (destinationCountryId == null || p.DestinationCountryID == destinationCountryId) &&
                (deliveryGroupId == null || p.DeliveryGroupID == deliveryGroupId)
            ).Include(p => p.TradeAccount)
             .Include(p => p.DestinationCountry)
             .Include(p => p.DeliveryGroup)
             .Include(p => p.DeliveryChargingLogic)
             .Include(p => p.DeliveryThresholdType).ToList();

            return results.AsQueryable().ToDataSourceResult(request);
        }

        public IHttpActionResult UpdateTradeDeliveryContractPrices(PassTradeDeliveryContractPricesSave objSave)
        {
            _ = PortalDb.SaveTradeDeliveryContractPrices(objSave);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult DeleteTradeDeliveryContractPrices(PassTradeDeliveryContractPricesSave objDelete)
        {
            _ = PortalDb.DeleteTradeDeliveryContractPrices(objDelete.models);

            return Ok(new { });
        }


        public DataSourceResult GetTransferTypes([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        {
            var results = PortalDb.TransferTypes.ToList();

            return results.AsQueryable().ToDataSourceResult(request);
        }

        public DataSourceResult GetDeliveryChargingLogics([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        {
            var results = PortalDb.DeliveryChargingLogics.Where(p => p.Deleted == false).OrderBy(p => p.DeliveryChargingLogicID).AsQueryable();

            return results.ToDataSourceResult(request);
        }

        public DataSourceResult GetSalesMarkets([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        {
            var results = PortalDb.SalesMarkets.OrderBy(p => p.Name).ToList();

            return results.AsQueryable().ToDataSourceResult(request);
        }

        public DataSourceResult GetCurrencies([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        {
            var results = PortalDb.Currencies.OrderBy(p => p.Name).ToList();

            return results.AsQueryable().ToDataSourceResult(request);
        }

        public DataSourceResult GetDeliveryZones([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request, short? destinationCountryId)
        {
            if (destinationCountryId.HasValue)
            {
                var results = PortalDb.DeliveryZones.Where(p => p.CountryID == destinationCountryId && p.Deleted == false).OrderBy(p => p.DeliveryZoneID).ToList();

                return results.AsQueryable().ToDataSourceResult(request);
            }
            else
            {
                var results = new List<DeliveryZone>();

                return results.AsQueryable().ToDataSourceResult(request);
            }
        }

        public DataSourceResult GetDeliveryThresholdTypes([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        {
            var results = PortalDb.DeliveryThresholdTypes.OrderBy(p => p.DeliveryThresholdTypeID).AsQueryable();

            return results.ToDataSourceResult(request);
        }

        public DataSourceResult GetFulfilmentTypes([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        {
            var results = PortalDb.FulfilmentTypes.OrderBy(p => p.FulfilmentTypeID).AsQueryable();

            return results.ToDataSourceResult(request);
        }

        [HttpPost]
        public IHttpActionResult FetchCarriageCodeMap([FromBody]PassCarriageCodeMapFetch objFetch)
        {
            if (objFetch != null)
            {
                var results = PortalDb.CarriageCodeMaps.Where(p => p.HAULCODE == objFetch.HAULCODE &&
                    p.HaulierServiceCode == objFetch.HaulierServiceCode &&
                    p.ExpressService == objFetch.ExpressService).OrderBy(p => p.SalesMarket.Name).ToList();

                return Ok(results);
            }
            else
            {
                return Ok(new List<CarriageCodeMap>());
            }
        }

        [HttpPost]
        public IHttpActionResult UpsertDeliveryZone([FromBody]PassDeliveryZone objZone)
        {
            var result = PortalDb.UpsertDeliveryZone(objZone);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult UpsertDeliveryGroup([FromBody]PassDeliveryGroup objDeliveryGroup)
        {
            var result = PortalDb.UpsertDeliveryGroup(objDeliveryGroup);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult SaveDefaultDeliveryServices([FromBody]PassDefaultDeliveryServicesSave objSave)
        {
            var result = PortalDb.SaveDefaultDeliveryServices(objSave);

            if (objSave.Removals.Any())
            {
                _ = PortalDb.DeleteDefaultDeliveryServices(objSave.Removals);
            }

            return Ok(result);
        }

        public IHttpActionResult GetDeliveryGroups([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        {
            var results = PortalDb.DeliveryGroups.OrderBy(p => p.Name).ToList();

            return Ok(results);
        }

        public DataSourceResult GetDeliveryGroupsDataSource([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        {
            var results = PortalDb.DeliveryGroups.OrderBy(p => p.Name).AsQueryable();

            return results.ToDataSourceResult(request);
        }

        public DataSourceResult GetCountries([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        {
            var results = PortalDb.Countries.OrderBy(p => p.Name).AsQueryable();

            return results.ToDataSourceResult(request);
        }

        //public DataSourceResult GetTradeAccounts([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        //{
        //    var results = PortalDb.TradeAccounts.Where(p => p.Status == "O").OrderBy(p => p.Name).AsQueryable();

        //    var dataSourceResult = results.ToDataSourceResult(request);

        //    return dataSourceResult;
        //}

        public DataSourceResult GetTradeAccountsWithDeliveryContractPrices([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        {
            var results = PortalDb.TradeAccounts.Where(p => p.TradeDeliveryContractPrices.Any() && p.Status == "O").OrderBy(p => p.Name).AsQueryable();

            var dataSourceResult = results.ToDataSourceResult(request);

            return dataSourceResult;
        }

        [HttpGet]
        [EnableQuery()]

        public IQueryable GetTradeAccounts()
        {
            return PortalDb.TradeAccounts.Where(p => p.Status == "O").AsQueryable();
        }

        [HttpPost]
        public IHttpActionResult TradeAccountValueMapper([FromBody]PassTradeAccountID objTradeAccountId)
        {
            var results = PortalDb.TradeAccounts.Where(p => p.TradeAccountID == objTradeAccountId.tradeAccountId).AsQueryable();

            return Ok(results);
        }
    }
}