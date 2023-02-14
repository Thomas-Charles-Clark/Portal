using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

using MertexerV2SQL.Models.Misc;

using Microsoft.AspNet.Identity;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;

using System;
using System.Collections;
using System.Linq;

using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;

using Unity.Interception.Utilities;

namespace Portal.Areas.Products.Controllers
{
    [System.Web.Http.Authorize]
    public partial class BasketStatusAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public BasketStatusAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchBasketStatuses([FromBody]PassBasketStatusEnquiry objEnquiry)
        {
            var results = await PortalDb.FetchBasketStatuses(objEnquiry);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> OrderDetails([FromBody]FetchOrderDetail objEnquiry)
        {
            return Ok(await PortalDb.FetchBasketStatusOrderDetail(objEnquiry));
        }

        [HttpPost]
        public async Task<IHttpActionResult> ImportDetails([FromBody]FetchImportDetail objEnquiry)
        {
            return Ok(await PortalDb.FetchBasketStatusImportDetail(objEnquiry));
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchTradeAccount([FromBody]PassTradeAccountID objEnquiry)
        {
            return Ok(PortalDb.TradeAccounts.Single(ta => ta.TradeAccountID == objEnquiry.tradeAccountId));
        }
    }
}
