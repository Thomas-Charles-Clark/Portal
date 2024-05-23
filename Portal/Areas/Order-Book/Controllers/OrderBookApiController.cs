using DocumentFormat.OpenXml.Spreadsheet;

using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

using Newtonsoft.Json.Linq;

using Portal.Models;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.OrderBook;

using System;
using System.Collections.Generic;
using System.Dynamic;
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

        public async Task<IHttpActionResult> Refresh([FromBody] PassOrderBookBaseParams dto)
        {
            var dateFilters = await PortalDB.FetchOrderBookDateSummaries(dto);
            var preDefinedFilters = JArray.Parse(await PortalDB.FetchOrderBookPreDefinedSummaries(dto));
            var mainResult = await PortalDB.FetchOrderBookMainSummary(dto);

            var result = new
            {
                dateFilters,
                preDefinedFilters,
                mainResult
            };

            return Ok(result);
        }

        public async Task<IHttpActionResult> DetailRefresh([FromBody]ExpandoObject dto)
        {
            var mainResult = await PortalDB.FetchOrderBookDetail((string)dto.FirstOrDefault(kvp => kvp.Key == "procedure").Value, dto);

            return Ok(mainResult);
        }
    }
}
