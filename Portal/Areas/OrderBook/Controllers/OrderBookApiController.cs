using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Portal.Models;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.OrderBook;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Portal.Areas.Sales.Controllers
{
    [DynamicRoleAuthorise]
    public class OrderBookController : ApiController
    {
        private PortalDbContext PortalDB { get; set; }

        public OrderBookController(PortalDbContext portalDbContext)
        {
            this.PortalDB = portalDbContext;
        }

        public async Task<IHttpActionResult> FetchMainSummary([FromBody]PassOrderBookMainParams dto)
        {
            var result = await PortalDB.FetchOrderBookMainSummary(dto);

            return Ok(result);
        }
    }
}
