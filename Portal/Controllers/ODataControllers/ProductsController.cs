using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Models;
using Microsoft.AspNet.OData;
using SharedEFClasses.Models.Products;
using SharedEFClasses;

namespace Portal.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using SharedEFClasses.Models.TradeAccounts;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<TradeAccount>("TradeAccounts");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [System.Web.Http.Authorize]
    public class ProductsController : BaseODataController
    {
        public ProductsController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/Products
        [EnableQuery(MaxNodeCount = 200)]
        public IQueryable<Product> GetProducts()
        {
            return PortalDb.Products.Where(p => p.Status != "D" && p.Deleted == false).AsQueryable();
        }

        // GET: odata/Products
        [EnableQuery(MaxNodeCount = 200)]
        public IQueryable<Product> GetRingFenceableProducts()
        {
            // Limit by adm.Mertex_ProductGroup, to AC 'Finished Product', FA 'Fabric', and PA 'Wallpaper'
            return PortalDb.Products.Where(p => p.Status != "D" && p.Deleted == false &&
                (p.ProductGroupID == 2 || p.ProductGroupID == 8 || p.ProductGroupID == 16)).AsQueryable();
        }

        // GET: odata/Products
        [EnableQuery(MaxNodeCount = 200)]
        public IQueryable<Product> GetProductsForOrderBookSummary()
        {
            // Who cares about samples anyway?
            return PortalDb.Products.Where(p => p.ProductTypeID != 55 && p.ProductTypeID != 56).AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<Product> ProductValueMapper(int? productId)
        {
            return PortalDb.Products.Where(p =>
                p.Status != "D" && 
                p.ProductID == productId &&
                p.Deleted == false &&
                (p.ProductGroupID == 2 || p.ProductGroupID == 8 || p.ProductGroupID == 16)
            ).AsQueryable();
        }
    }
}
