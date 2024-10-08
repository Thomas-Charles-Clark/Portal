using Microsoft.AspNet.Identity;

using Portal.Areas.Products.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Products.Controllers
{
    [DynamicRoleAuthorise(actionNameAgnostic: true)]
    [RouteArea("products")]
    [RoutePrefix("pattern-books")]
    [Route("{action=index}")]
    public class PatternBooksController : BaseController
    {
        public PatternBooksController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        // GET: Products/Order
        public ActionResult Index(string model)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "patternbooks" && p.AreaName == "products" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var viewModel = new PatternBooksViewModel(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("PatternBooks", viewModel);
        }
    }
}