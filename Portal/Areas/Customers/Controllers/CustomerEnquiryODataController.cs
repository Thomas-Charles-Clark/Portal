using System.Linq;
using Portal.Controllers;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Models.Products;
using SharedEFClasses;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Query;

namespace Portal.Areas.Customers.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using Microsoft.AspNet.OData.Builder;
    using Microsoft.AspNet.OData.Extensions;
    using Portal.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<ProductTypeGroup>("ProductTypeGroupsOData");
    builder.EntitySet<ProductTypeGroup_Brand_Country>("ProductTypeGroup_Brand_Country"); 
    builder.EntitySet<TradeAccount_Competitor>("TradeAccount_Competitors"); 
    builder.EntitySet<TradeAccountPotential>("TradeAccountPotential"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    
    [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
    public class TradePriceListsController : BaseODataController
    {
        public TradePriceListsController(PortalDbContext portalDb) : base(portalDb) { }

        // GET: odata/TradePriceListsOData
        [EnableQuery(MaxNodeCount = 200)]
        public IQueryable<TradePriceList> GetTradePriceLists()
        {
            return PortalDb.TradePriceLists;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                PortalDb.Dispose();
            }
            base.Dispose(disposing);
        }
    }

    //[EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
    //public class CurrenciesController : BaseODataController
    //{
    //    public CurrenciesController(PortalDbContext portalDb) : base(portalDb) { }

    //    // GET: odata/TradePriceListsOData
    //    [EnableQuery(MaxNodeCount = 200)]
    //    public IQueryable<Currency> GetCurrencies()
    //    {
    //        return portalDb.Currencies;
    //    }

    //    protected override void Dispose(bool disposing)
    //    {
    //        if (disposing)
    //        {
    //            portalDb.Dispose();
    //        }
    //        base.Dispose(disposing);
    //    }
    //}

    //[EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
    //public class BrandsController : BaseODataController
    //{
    //    public BrandsController(PortalDbContext portalDb) : base(portalDb){ }

    //    // GET: odata/BrandsOData
    //    [EnableQuery(MaxNodeCount = 200)]
    //    public IQueryable<Brand> GetBrands()
    //    {
    //        return PortalDb.Brands;
    //    }
    //}

    [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
    public class ProductTypeGroupsController : BaseODataController
    {
        public ProductTypeGroupsController(PortalDbContext portalDb) : base(portalDb) { }

        // GET: odata/ProductTypeGroupsOData
        [EnableQuery(MaxAnyAllExpressionDepth = 2, MaxNodeCount = 200)]
        public IQueryable<ProductTypeGroup> GetProductTypeGroups(ODataQueryOptions options)
        {
            return PortalDb.ProductTypeGroups;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                PortalDb.Dispose();
            }
            base.Dispose(disposing);
        }
    }

    [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
    public class ItemTypesController : BaseODataController
    {
        public ItemTypesController(PortalDbContext portalDb) : base(portalDb) { }

        // GET: odata/ItemTypesOData
        [EnableQuery(MaxNodeCount = 200)]
        public IQueryable<ItemType> GetItemTypes()
        {
            return PortalDb.ItemTypes;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                PortalDb.Dispose();
            }
            base.Dispose(disposing);
        }
    }

    //[EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
    //public class LaunchesController : BaseODataController
    //{
    //    public LaunchesController(PortalDbContext portalDb) : base(portalDb) { }

    //    // GET: odata/ItemTypesOData
    //    [EnableQuery(MaxNodeCount = 200)]
    //    public IQueryable<Launch> GetLaunches()
    //    {
    //        return PortalDb.Launches;
    //    }

    //    protected override void Dispose(bool disposing)
    //    {
    //        if (disposing)
    //        {
    //            PortalDb.Dispose();
    //        }
    //        base.Dispose(disposing);
    //    }
    //}

    [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
    public class SeasonsController : BaseODataController
    {
        public SeasonsController(PortalDbContext portalDb) : base(portalDb) { }

        // GET: odata/ItemTypesOData
        [EnableQuery(MaxAnyAllExpressionDepth = 2, MaxNodeCount = 200)]
        public IQueryable<Season> GetSeasons()
        {
            return PortalDb.Seasons;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                PortalDb.Dispose();
            }
            base.Dispose(disposing);
        }
    }

    //[EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
    //public class ProductsController : BaseODataController
    //{
    //    public ProductsController(PortalDbContext portalDb) : base(portalDb) { }

    //    // GET: odata/PriceCheckerSlicerValueOData
    //    [EnableQuery(MaxNodeCount = 200)]
    //    public IQueryable<Product> GetProducts()
    //    {
    //        return PortalDb.Products;
    //    }

    //    protected override void Dispose(bool disposing)
    //    {
    //        if (disposing)
    //        {
    //            PortalDb.Dispose();
    //        }
    //        base.Dispose(disposing);
    //    }
    //}


    //// GET: odata/ProductTypeGroupsOData(5)
    //[EnableQuery]
    //public SingleResult<ProductTypeGroup> GetProductTypeGroup([FromODataUri] byte key)
    //{
    //    return SingleResult.Create(db.ProductTypeGroups.Where(productTypeGroup => productTypeGroup.ProductTypeGroupID == key));
    //}

    //[EnableQuery]
    //public IQueryable<ProductType> GetProductTypesODataCascade([FromODataUri] byte productTypeGroupId)
    //{
    //    return db.ProductTypes.Where(p => p.ProductTypeGroupID == productTypeGroupId);
    //}

    //// PUT: odata/ProductTypeGroupsOData(5)
    //public async Task<IHttpActionResult> Put([FromODataUri] byte key, Delta<ProductTypeGroup> patch)
    //{
    //    throw new NotImplementedException();

    //    //Validate(patch.GetEntity());

    //    //if (!ModelState.IsValid)
    //    //{
    //    //    return BadRequest(ModelState);
    //    //}

    //    //ProductTypeGroup productTypeGroup = await db.ProductTypeGroups.FindAsync(key);
    //    //if (productTypeGroup == null)
    //    //{
    //    //    return NotFound();
    //    //}

    //    //patch.Put(productTypeGroup);

    //    //try
    //    //{
    //    //    await db.SaveChangesAsync();
    //    //}
    //    //catch (DbUpdateConcurrencyException)
    //    //{
    //    //    if (!ProductTypeGroupExists(key))
    //    //    {
    //    //        return NotFound();
    //    //    }
    //    //    else
    //    //    {
    //    //        throw;
    //    //    }
    //    //}

    //    //return Updated(productTypeGroup);
    //}

    //// POST: odata/ProductTypeGroupsOData
    //public async Task<IHttpActionResult> Post(ProductTypeGroup productTypeGroup)
    //{
    //    throw new NotImplementedException();

    //    //if (!ModelState.IsValid)
    //    //{
    //    //    return BadRequest(ModelState);
    //    //}

    //    //db.ProductTypeGroups.Add(productTypeGroup);

    //    //try
    //    //{
    //    //    await db.SaveChangesAsync();
    //    //}
    //    //catch (DbUpdateException)
    //    //{
    //    //    if (ProductTypeGroupExists(productTypeGroup.ProductTypeGroupID))
    //    //    {
    //    //        return Conflict();
    //    //    }
    //    //    else
    //    //    {
    //    //        throw;
    //    //    }
    //    //}

    //    //return Created(productTypeGroup);
    //}

    //// PATCH: odata/ProductTypeGroupsOData(5)
    //[AcceptVerbs("PATCH", "MERGE")]
    //public async Task<IHttpActionResult> Patch([FromODataUri] byte key, Delta<ProductTypeGroup> patch)
    //{
    //    throw new NotImplementedException();

    //    //Validate(patch.GetEntity());

    //    //if (!ModelState.IsValid)
    //    //{
    //    //    return BadRequest(ModelState);
    //    //}

    //    //ProductTypeGroup productTypeGroup = await db.ProductTypeGroups.FindAsync(key);
    //    //if (productTypeGroup == null)
    //    //{
    //    //    return NotFound();
    //    //}

    //    //patch.Patch(productTypeGroup);

    //    //try
    //    //{
    //    //    await db.SaveChangesAsync();
    //    //}
    //    //catch (DbUpdateConcurrencyException)
    //    //{
    //    //    if (!ProductTypeGroupExists(key))
    //    //    {
    //    //        return NotFound();
    //    //    }
    //    //    else
    //    //    {
    //    //        throw;
    //    //    }
    //    //}

    //    //return Updated(productTypeGroup);
    //}

    //// DELETE: odata/ProductTypeGroupsOData(5)
    //public async Task<IHttpActionResult> Delete([FromODataUri] byte key)
    //{
    //    throw new NotImplementedException();

    //    //ProductTypeGroup productTypeGroup = await db.ProductTypeGroups.FindAsync(key);
    //    //if (productTypeGroup == null)
    //    //{
    //    //    return NotFound();
    //    //}

    //    //db.ProductTypeGroups.Remove(productTypeGroup);
    //    //await db.SaveChangesAsync();

    //    //return StatusCode(HttpStatusCode.NoContent);
    //}

    //// GET: odata/ProductTypeGroupsOData(5)/Brands
    //[EnableQuery]
    //public IQueryable<ProductTypeGroup_Brand_Country> GetBrands([FromODataUri] byte key)
    //{
    //    return db.ProductTypeGroups.Where(m => m.ProductTypeGroupID == key).SelectMany(m => m.Brands);
    //}

    //// GET: odata/ProductTypeGroupsOData(5)/TradeAccount_Competitors
    //[EnableQuery]
    //public IQueryable<TradeAccount_Competitor> GetTradeAccount_Competitors([FromODataUri] byte key)
    //{
    //    return db.ProductTypeGroups.Where(m => m.ProductTypeGroupID == key).SelectMany(m => m.TradeAccount_Competitors);
    //}

    //// GET: odata/ProductTypeGroupsOData(5)/TradeAccountPotential
    //[EnableQuery]
    //public IQueryable<TradeAccountPotential> GetTradeAccountPotential([FromODataUri] byte key)
    //{
    //    return db.ProductTypeGroups.Where(m => m.ProductTypeGroupID == key).SelectMany(m => m.TradeAccountPotential);
    //}

    //protected override void Dispose(bool disposing)
    //{
    //    if (disposing)
    //    {
    //        db.Dispose();
    //    }
    //    base.Dispose(disposing);
    //}

    //private bool ProductTypeGroupExists(byte key)
    //{
    //    return db.ProductTypeGroups.Count(e => e.ProductTypeGroupID == key) > 0;
    //}
    //}
}
