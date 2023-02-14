using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.OData;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Products;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Portal.Areas.Products.Controllers
{
    [System.Web.Http.Authorize]
    public partial class RingFenceAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public RingFenceAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpPost]
        public IHttpActionResult StockCheck([FromBody]PassStockBatchPiece objStock)
        {
            return Ok(PortalDb.FetchStockBatchPiece(objStock).Results);
        }

        [HttpPost]
        public IHttpActionResult CreateRingFence([FromBody]PassCreateRingFence objCreation)
        {
            var memberId = User.Identity.GetUserId<int>();

            foreach (var p in objCreation.pieces)
            {
                PortalDb.CreateRingFence(memberId, objCreation, p);
            }

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult DeleteRingFence([FromBody]PassDeleteRingFence objDeletion)
        {
            var memberId = User.Identity.GetUserId<int>();

            return Ok(PortalDb.DeleteRingFence(memberId, objDeletion));
        }
    }
}