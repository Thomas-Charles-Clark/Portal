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
        public IHttpActionResult checkViability([FromBody]PassTradeAccountID objTradeAccountId)
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
        public IHttpActionResult refreshTradeEmail([FromBody]MertexerV2SQL.Models.Misc.PassTradeAccountNumber objTrade)
        {
            var tradeDataSourceJson = PortalDb.TradeAccounts.Where(p => p.Code == objTrade.accountNumber).Select(p => p.UniVerseDataSources).Single();

            return Ok(MertexerV2SQL.MiscFunctions.MiscellaneousFunctions.RefreshTradeAccountInvoiceEmailAddress(tradeDataSourceJson, objTrade));
        }
    }
}
