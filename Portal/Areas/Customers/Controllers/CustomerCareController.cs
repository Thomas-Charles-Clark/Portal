using Microsoft.AspNet.Identity;
using Portal.Areas.Customers.ViewModels;
using Portal.Controllers;
using Portal.Models;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Customers.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("customers")]
    [RoutePrefix("care")]
    [Route("{action=index}")]
    public class CareController : BaseController
    {
        public CareController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }
        
        public ActionResult Index()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());
            
            if (Session["selectedTradeAccountId"] == null)
            {
                Session["selectedTradeAccountId"] = user.TradeAccountID;
            }

            var model = new CustomerCareViewModel(
                user.DefaultTradeAccount?.TradeAccountGroupID,
                Session["selectedTradeAccountId"] as int?,
                user.DefaultTradeAccount == null);

            return View("CustomerCare", model);
        }
    }
}