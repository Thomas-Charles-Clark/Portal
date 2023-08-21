using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Portal.Areas.Stock.Models;

namespace Portal.Areas.Stock.Controllers
{
    [System.Web.Http.Authorize]
    public class StockManagementAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public StockManagementAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpGet]
        public IHttpActionResult FetchProducts([FromUri]StockManagementProductFetchDto objDto)
        {
            return Ok(new { });
        }
    }
}
