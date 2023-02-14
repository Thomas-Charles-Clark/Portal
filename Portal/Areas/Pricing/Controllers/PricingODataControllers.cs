using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Query;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Pricing;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace Portal.Controllers.Pricing
{
    [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
    public class SlicerMarketsController : ODataController
    {
        public IQueryable<SlicerMarket> GetSlicerMarkets(ODataQueryOptions options)
        {
            return PriceCheckerDataSource.GetMarkets().OrderBy(p => p.Name).AsQueryable();
        }

        [HttpGet]
        public IHttpActionResult Filter([FromODataUri]PreSlicerFunctionFilter f1)
        {
            return Ok(PriceCheckerDataSource.GetMarkets(f1).OrderBy(p => p.Name).AsQueryable());
        }
    }

    [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
    public class SlicerTradePriceListsController : ODataController
    {
        public IQueryable<SlicerTradePriceList> GetSlicerMarkets(ODataQueryOptions options)
        {
            return PriceCheckerDataSource.GetTradePriceLists().OrderBy(p => p.Name).AsQueryable();
        }

        [HttpGet]
        public IHttpActionResult Filter([FromODataUri]PreSlicerFunctionFilter f1)
        {
            return Ok(PriceCheckerDataSource.GetTradePriceLists(f1).OrderBy(p => p.Name).AsQueryable());
        }
    }
    
    [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
    public class SlicerCurrenciesController : ODataController
    {
        public IQueryable<SlicerCurrency> GetSlicerCurrencies(ODataQueryOptions options)
        {
            return PriceCheckerDataSource.GetCurrencies().OrderBy(p => p.Currency.Name).AsQueryable();
        }

        [HttpGet]
        public IHttpActionResult Filter([FromODataUri]PreSlicerFunctionFilter f1)
        {
            return Ok(PriceCheckerDataSource.GetCurrencies(f1).OrderBy(p => p.Currency.Name).AsQueryable());
        }
    }

    [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
    public class SlicerBrandsController : ODataController
    {
        public IQueryable<SlicerBrand> GetSlicerBrands(ODataQueryOptions options)
        {
            return new List<SlicerBrand>().AsQueryable();
        }

        [HttpPost]
        public IHttpActionResult Filter([FromODataUri]PricingQueryFilter f1)
        {
            var matrix = PriceCheckerDataSource.GetMatrix(
                f1.TradePriceListID,
                f1.MarketID,
                f1.CurrencyID,
                f1.SearchTerm,
                f1.CollectionID,
                f1.QualityID,
                f1.ProductID,
                f1.BrandID,
                f1.ProductTypeID,
                f1.IncludeSamples,
                f1.IncludeClearance
            )
                .AsQueryable()
                .Where(p => 
                    f1.ProductTypeGroupIDs.Count() > 0 ? f1.ProductTypeGroupIDs.Contains(p.ProductTypeGroupID) : true &&
                    f1.ProductTypeIDs.Count() > 0 ? f1.ProductTypeIDs.Contains(p.ProductTypeID) : true &&
                    f1.ItemTypeIDs.Count() > 0 ? f1.ItemTypeIDs.Contains(p.ItemTypeID) : true &&
                    f1.LaunchIDs.Count() > 0 ? f1.LaunchIDs.Contains(p.LaunchID) : true &&
                    f1.SeasonIDs.Count() > 0 ? f1.SeasonIDs.Contains(p.SeasonID) : true)
                .Select(p => p.BrandID)
                .Distinct();
            
            return Ok(PriceCheckerDataSource.GetBrands(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => matrix.Contains(p.BrandID)).OrderBy(p => p.Name));
        }
    }

    public class SlicerProductTypeGroupsController : ODataController
    {
        public IQueryable<SlicerProductTypeGroup> GetSlicerProductTypeGroups(ODataQueryOptions options)
        {
            return new List<SlicerProductTypeGroup>().AsQueryable();
        }

        [HttpPost]
        public IHttpActionResult Filter([FromODataUri]PricingQueryFilter f1)
        {
            var matrix = PriceCheckerDataSource.GetMatrix(
                f1.TradePriceListID,
                f1.MarketID,
                f1.CurrencyID,
                f1.SearchTerm,
                f1.CollectionID,
                f1.QualityID,
                f1.ProductID,
                f1.BrandID,
                f1.ProductTypeID,
                f1.IncludeSamples,
                f1.IncludeClearance)
                .AsQueryable()
                .Where(p => 
                    f1.BrandIDs.Count() > 0 ? f1.BrandIDs.Contains(p.BrandID) : true &&
                    f1.ProductTypeIDs.Count() > 0 ? f1.ProductTypeIDs.Contains(p.ProductTypeID) : true &&
                    f1.ItemTypeIDs.Count() > 0 ? f1.ItemTypeIDs.Contains(p.ItemTypeID) : true &&
                    f1.LaunchIDs.Count() > 0 ? f1.LaunchIDs.Contains(p.LaunchID) : true &&
                    f1.SeasonIDs.Count() > 0 ? f1.SeasonIDs.Contains(p.SeasonID) : true)
                .Select(p => p.ProductTypeGroupID)
                .Distinct();

            return Ok(PriceCheckerDataSource.GetProductTypeGroups(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => matrix.Contains(p.ProductTypeGroupID)).OrderBy(p => p.Name));
        }
    }
    
    public class SlicerProductTypesController : ODataController
    {
        public IQueryable<SlicerProductType> GetSlicerProductTypes(ODataQueryOptions options)
        {
            return new List<SlicerProductType>().AsQueryable();
        }

        [HttpPost]
        public IHttpActionResult Filter([FromODataUri]PricingQueryFilter f1)
        {
            var matrix = PriceCheckerDataSource.GetMatrix(
                f1.TradePriceListID,
                f1.MarketID,
                f1.CurrencyID,
                f1.SearchTerm,
                f1.CollectionID,
                f1.QualityID,
                f1.ProductID,
                f1.BrandID,
                f1.ProductTypeID,
                f1.IncludeSamples,
                f1.IncludeClearance)
                .AsQueryable()
                .Where(p => f1.BrandIDs.Count() > 0 ? f1.BrandIDs.Contains(p.BrandID) : true &&
                    f1.ProductTypeGroupIDs.Count() > 0 ? f1.ProductTypeGroupIDs.Contains(p.ProductTypeGroupID) : true &&
                    f1.ItemTypeIDs.Count() > 0 ? f1.ItemTypeIDs.Contains(p.ItemTypeID) : true &&
                    f1.LaunchIDs.Count() > 0 ? f1.LaunchIDs.Contains(p.LaunchID) : true &&
                    f1.SeasonIDs.Count() > 0 ? f1.SeasonIDs.Contains(p.SeasonID) : true)
                .Select(p => p.ProductTypeID)
                .Distinct();

            return Ok(PriceCheckerDataSource.GetProductTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => matrix.Contains(p.ProductTypeID)).OrderBy(p => p.Name));
        }
    }

    public class SlicerItemTypesController : ODataController
    {
        public IQueryable<SlicerItemType> GetSlicerItemTypes(ODataQueryOptions options)
        {
            return new List<SlicerItemType>().AsQueryable();
        }

        [HttpPost]
        public IHttpActionResult Filter([FromODataUri]PricingQueryFilter f1)
        {
            var matrix = PriceCheckerDataSource.GetMatrix(
                f1.TradePriceListID,
                f1.MarketID,
                f1.CurrencyID,
                f1.SearchTerm,
                f1.CollectionID,
                f1.QualityID,
                f1.ProductID,
                f1.BrandID,
                f1.ProductTypeID,
                f1.IncludeSamples,
                f1.IncludeClearance)
                .AsQueryable()
                .Where(p => f1.BrandIDs.Count() > 0 ? f1.BrandIDs.Contains(p.BrandID) : true &&
                    f1.ProductTypeGroupIDs.Count() > 0 ? f1.ProductTypeGroupIDs.Contains(p.ProductTypeGroupID) : true &&
                    f1.ProductTypeIDs.Count() > 0 ? f1.ProductTypeIDs.Contains(p.ProductTypeID) : true &&
                    f1.LaunchIDs.Count() > 0 ? f1.LaunchIDs.Contains(p.LaunchID) : true &&
                    f1.SeasonIDs.Count() > 0 ? f1.SeasonIDs.Contains(p.SeasonID) : true)
                .Select(p => p.ItemTypeID)
                .Distinct();

            return Ok(PriceCheckerDataSource.GetItemTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => matrix.Contains(p.ItemTypeID)).OrderBy(p => p.Name));
        }
    }

    public class SlicerLaunchesController : ODataController
    {
        public IQueryable<SlicerLaunch> GetSlicerLaunches(ODataQueryOptions options)
        {
            return new List<SlicerLaunch>().AsQueryable();
        }

        [HttpPost]
        public IHttpActionResult Filter([FromODataUri]PricingQueryFilter f1)
        {
            var matrix = PriceCheckerDataSource.GetMatrix(
                f1.TradePriceListID,
                f1.MarketID,
                f1.CurrencyID,
                f1.SearchTerm,
                f1.CollectionID,
                f1.QualityID,
                f1.ProductID,
                f1.BrandID,
                f1.ProductTypeID,
                f1.IncludeSamples,
                f1.IncludeClearance)
                .AsQueryable()
                .Where(p => 
                    f1.BrandIDs.Count() > 0 ? f1.BrandIDs.Contains(p.BrandID) : true &&
                    f1.ProductTypeGroupIDs.Count() > 0 ? f1.ProductTypeGroupIDs.Contains(p.ProductTypeGroupID) : true &&
                    f1.ProductTypeIDs.Count() > 0 ? f1.ProductTypeIDs.Contains(p.ProductTypeID) : true &&
                    f1.ItemTypeIDs.Count() > 0 ? f1.ItemTypeIDs.Contains(p.ItemTypeID) : true &&
                    f1.SeasonIDs.Count() > 0 ? f1.SeasonIDs.Contains(p.SeasonID) : true)
                .Select(p => p.LaunchID)
                .Distinct();

            return Ok(PriceCheckerDataSource.GetLaunches(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => matrix.Contains(p.LaunchID)).OrderByDescending(p => p.LaunchID));
        }
    }

    public class SlicerSeasonsController : ODataController
    {
        public IQueryable<SlicerSeason> GetSlicerSeasons(ODataQueryOptions options)
        {
            return new List<SlicerSeason>().AsQueryable();
        }
        
        [HttpPost]
        public IHttpActionResult Filter([FromODataUri]PricingQueryFilter f1)
        {
            var matrix = PriceCheckerDataSource.GetMatrix(
                f1.TradePriceListID,
                f1.MarketID,
                f1.CurrencyID,
                f1.SearchTerm,
                f1.CollectionID,
                f1.QualityID,
                f1.ProductID,
                f1.BrandID,
                f1.ProductTypeID,
                f1.IncludeSamples,
                f1.IncludeClearance)
                .AsQueryable()
                .Where(p => 
                    f1.BrandIDs.Count() > 0 ? f1.BrandIDs.Contains(p.BrandID) : true &&
                    f1.ProductTypeGroupIDs.Count() > 0 ? f1.ProductTypeGroupIDs.Contains(p.ProductTypeGroupID) : true &&
                    f1.ProductTypeIDs.Count() > 0 ? f1.ProductTypeIDs.Contains(p.ProductTypeID) : true &&
                    f1.ItemTypeIDs.Count() > 0 ? f1.ItemTypeIDs.Contains(p.ItemTypeID) : true &&
                    f1.LaunchIDs.Count() > 0 ? f1.LaunchIDs.Contains(p.LaunchID) : true)
                .Select(p => p.SeasonID)
                .Distinct();

            return Ok(PriceCheckerDataSource.GetSeasons(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => matrix.Contains(p.SeasonID)).OrderBy(p => p.Name));
        }
    }


    public class SlicerShowClearancesController : ODataController
    {
        public IQueryable<SlicerShowClearance> GetSlicerShowClearances(ODataQueryOptions options)
        {
            return PriceCheckerDataSource.GetClearanceDisplayOptions().AsQueryable();
        }
    }

    public class SlicerIncludeSamplesController : ODataController
    {
        public IQueryable<SlicerIncludeSample> GetSlicerIncludeSamples(ODataQueryOptions options)
        {
            return PriceCheckerDataSource.GetIncludeSamplesOptions().AsQueryable();
        }
    }
}