using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Portal.Models;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Portal.Areas.Sales.Controllers
{
    public class OrderEnquiryController : ApiController
    {
        private PortalDbContext portalDb { get; set; }

        public OrderEnquiryController(PortalDbContext portalDbContext)
        {
            this.portalDb = portalDbContext;
        }

        [HttpGet]
        public DataSourceResult OrderSearch(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri] PassOrderEnquirySearch objEnquiry)
        {
            var results = portalDb.TradeOrderEnquirySearch(objEnquiry);

            return results.SearchResults.AsQueryable().ToDataSourceResult(request);
        }
    }
}
