using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

using Microsoft.AspNet.Identity;

using Portal.Areas.Fenwick.ViewModels;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Fenwick;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Fenwick.Controllers
{
    [DynamicRoleAuthorise(actionNameAgnostic: true)]
    [RouteArea("fenwick")]
    [RoutePrefix("invoicing")]
    public class InvoicingController : BaseController
    {
        public InvoicingController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "invoicing" && p.AreaName == "fenwick" && p.ActionName == "index").FirstOrDefault();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = FenwickInvoicingViewModel.Create(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("FenwickInvoicing", model);
        }
    }
}