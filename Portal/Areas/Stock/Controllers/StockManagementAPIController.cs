using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.StockManagement;
using System.Threading.Tasks;

namespace Portal.Areas.Stock.Controllers
{
    [System.Web.Http.Authorize]
    public class StockManagementController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public StockManagementController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        /// <summary>
        /// The Launch check is BS
        /// </summary>
        /// <param name="objDto"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IHttpActionResult> FetchProducts([FromBody]StockManagementProductFetchDto objDto)
        {
            var results = await PortalDb.StockManagementProductSearch(objDto);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveBranchRangeChanges([FromBody]StockManagementBranchRangeSave objDto)
        {
            System.Threading.Thread.Sleep(3000);

            var results = await PortalDb.StockManagementBranchRangeSave(objDto);

            return Ok(new { });
        }
    }
}
