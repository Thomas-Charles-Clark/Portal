using Microsoft.AspNet.Identity;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.General;
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
    public class CustomerNotesController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public CustomerNotesController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.PortalDb = portalDbContext;
            this.UserManager = userManager;
        }

        [HttpPost]
        public IHttpActionResult SaveOrderingNote([FromBody]PassTradeAccountOrderingNote objNote)
        {
            var ta = PortalDb.TradeAccounts.Where(p => p.TradeAccountID == objNote.tradeAccountId).Single();

            if (String.IsNullOrEmpty(objNote.orderingNote?.Trim()))
            {
                objNote.orderingNote = null;
            }

            ta.BeforeOrderNotification = objNote.orderingNote;

            PortalDb.SaveChanges();

            return Ok(new { });
        }
    }
}
