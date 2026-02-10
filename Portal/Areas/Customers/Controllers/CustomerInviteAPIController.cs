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
    public class CustomerInviteController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public CustomerInviteController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.PortalDb = portalDbContext;
            this.UserManager = userManager;
        }

        [HttpPost]
        public IHttpActionResult checkViability([FromBody]PassTradeAccountIDAndCode objTradeAccountId)
        {
            var viability = PortalDb.CheckTradeAccountInviteViability(objTradeAccountId);

//#if DEBUG
//            if (User.Identity.GetUserId<int>() == 8)
//                viability.Viable = true;
//#endif

            return Ok(new
            {
                viability = viability,
                tradeAccountModel = PortalDb.CheckTradeAccountUsers(objTradeAccountId, viability.CountryID, viability.LanguageID, null)
            });
        }

        [HttpPost]
        public IHttpActionResult inviteCustomer([FromBody]PassCustomerInvite objInvite)
        {
            return Ok(PortalDb.TradeAccount_InviteToB2B(objInvite, User.Identity.GetUserId<int>(), true));
        }

        [HttpPost]
        public IHttpActionResult resendUserInvite([FromBody]PassResendB2BInvite objInvite)
        {
            return Ok(PortalDb.TradeAccountUser_ResendInvite(objInvite, User.Identity.GetUserId<int>()));
        }

        [HttpPost]
        public IHttpActionResult resendAdminInvite([FromBody]PassResendB2BInvite objInvite)
        {
            return Ok(PortalDb.TradeAccountAdmin_ResendInvite(objInvite, User.Identity.GetUserId<int>()));
        }

        [HttpPost]
        public async Task<IHttpActionResult> refreshTradeEmail([FromBody]PassTradeAccountNumber objTrade)
        {
            return Ok(await PortalDb.FetchTradeAccountInvoiceEmailAddress(objTrade.accountNumber));
        }
    }
}
