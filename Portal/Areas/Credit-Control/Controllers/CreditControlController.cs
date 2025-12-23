using Microsoft.AspNet.Identity;
using Newtonsoft.Json;

using Portal.Areas.CreditControl.ViewModels;
using Portal.Areas.Orders.ViewModels;
using Portal.Controllers;
using Portal.Models;
using Portal.Utilities.Document;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Documents;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Portal.Areas.Orders.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("credit-control")]
    [RoutePrefix("")]
    [Route("{action=index}")]
    public class CreditControlController : BaseController
    {
        public CreditControlController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        public async Task<ActionResult> Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "" && p.AreaName == "credit-control" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await StatementsViewModel.CreateAsync(
				user.Id,
				user.GetActiveRoleProperties(),
                application.Heading, 
                application.SubHeading);

            return View("CreditControl", model);
        }
    }
}