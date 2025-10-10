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
using SharedEFClasses;
using SharedEFClasses.Models.General;
using Microsoft.AspNet.OData.Routing;
using SharedEFClasses.Models.Documents;
using Microsoft.AspNet.OData.Query;
using SharedEFClasses.Models.Mertex;

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
    [ODataRoutePrefix("Documents")]
    public class DocumentsController : BaseODataController
    {
        public DocumentsController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/TradeAccounts
        [EnableQuery]
        public IQueryable<Document> GetDocuments()
        {
            return PortalDb.Documents.AsQueryable();
        }

        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<Document> DocumentsValueMapper(short documentId)
        {
            return PortalDb.Documents.Where(h =>
                h.Deleted == false &&
                h.DocumentID == documentId
            ).AsQueryable();
        }
    }
}
