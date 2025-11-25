using Microsoft.AspNet.Identity;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Portal.Areas.Customers.Controllers
{
    [Authorize]
    public class TradeAccountContactsAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public TradeAccountContactsAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.PortalDb = portalDbContext;
            this.UserManager = userManager;
        }

        [HttpPost]
        public async Task<IHttpActionResult> TradeAccountSearch([FromBody] TradeAccountMaintenance_TradeAccount_Search_DTO dto)
        {
            return Ok(await PortalDb.TradeAccountMaintenance_TradeAccount_Search(dto));
		}

		[HttpPost]
		public async Task<IHttpActionResult> FetchContacts([FromBody] TradeAccountMaintenance_TradeAccount_Member_Select_DTO dto)
		{
			return Ok(await PortalDb.TradeAccountMaintenance_TradeAccount_Member_Select(dto));
		}

        [HttpPost]
        public async Task<IHttpActionResult> SaveChanges([FromBody] TradeAccountMaintenance_TradeAccount_Member_Save_DTO dto)
        {
            await Task.Run(() => { });

            return Ok(new { });
        }
	}
}
