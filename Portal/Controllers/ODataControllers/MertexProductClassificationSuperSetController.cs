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
using SharedEFClasses.Models.General;
using Microsoft.AspNet.OData;
using SharedEFClasses.Models.Mertex;
using SharedEFClasses;
using SharedEFClasses.Models.Products;
using Microsoft.AspNet.OData.Extensions;
using System.Web.Mvc;

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

    //[System.Web.Http.Authorize]
    public class MertexProductClassificationSuperSetController : BaseODataController
    {
        public MertexProductClassificationSuperSetController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        [OutputCache(NoStore = true, Location = System.Web.UI.OutputCacheLocation.None)]
        [EnableQuery]
        public IQueryable<MertexProductClassificationSuperSet> GetMertexProductClassificationSuperSet()
        {
            Request.GetWriterSettings().Validations = Microsoft.OData.ValidationKinds.None;

            return PortalDb.MertexProductClassificationSuperSet.AsQueryable();
        }

        //[EnableQuery]
        //public IQueryable<ProductGroup> GetProductGroups()
        //{
        //    return PortalDb.MertexProductClassificationSuperSet.Select(s => s.ProductGroup).OrderBy(b => b.Name).AsQueryable();
        //}

        //[EnableQuery]
        //public IQueryable<ItemType> GetItemTypes()
        //{
        //    return PortalDb.MertexProductClassificationSuperSet.Select(s => s.ItemType).OrderBy(b => b.Name).AsQueryable();
        //}

        //[EnableQuery]
        //public IQueryable<Collection> GetCollections()
        //{
        //    return PortalDb.MertexProductClassificationSuperSet.Select(s => s.Collection).OrderBy(b => b.Name).AsQueryable();
        //}

        //[EnableQuery]
        //public IQueryable<Launch> GetLaunches()
        //{
        //    return PortalDb.MertexProductClassificationSuperSet.Select(s => s.Launch).OrderByDescending(b => b.LaunchID).AsQueryable();
        //}

        //[EnableQuery]
        //public IQueryable<Quality> GetQualities()
        //{
        //    return PortalDb.MertexProductClassificationSuperSet.Select(s => s.Quality).OrderBy(b => b.Name).AsQueryable();
        //}
    }
}
