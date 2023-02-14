using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Portal.Models;
using Portal.ViewModels;
using Portal.Utilities.DynamicRoles;
using Portal.Utilities.HelperEnums;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Applications;

namespace Portal.Controllers
{
    [Authorize]
    public class HomeController : BaseController
    {

        public HomeController(ApplicationUserManager _userManager, PortalDbContext _mainDbContext) : base(_userManager, _mainDbContext)
        {
        
        }

        public ActionResult Index()
        {
            var user = UserManager.FindById(Convert.ToInt32(User.Identity.GetUserId()));

            var userId = User.Identity.GetUserId<int>();

            //var availableApplications = new List<Application>();
            //var permittedApplications = new List<Application>();

            //if (user.Roles != null)
            //{
            //    var myRoles = user.Roles.Select(p => p.Role).ToList();

            //    permittedApplications = myRoles.SelectMany(p => p.Application_Roles).OrderBy(p => p.SortOrder ?? p.Application.SortOrder).Select(q => q.Application).ToList();

            //    if (myRoles.Select(p => p.Id).ToList().Contains(1))
            //    {
            //        // Super Admin detected.
            //        permittedApplications = PortalDb.Applications.Where(p => p.Deleted == false).ToList();
            //    }
            //}

            var model = new HomeViewModel(
                PortalDb.FetchApplications(userId).ToList(),
                PortalDb.ApplicationGroups.Where(p => p.Deleted == false).ToList(),
                applicationButtonClass: user.GetActiveRoleProperties()?.Application_ButtonClass);
            
            return View(model);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [AllowAnonymous]
        [ActionName("major-error")]
        public ActionResult Error()
        {
            return View();
        }

        public ActionResult AccountConfigurationIssue(AccountConfigurationIssue issue)
        {
            ViewData["Issue"] = AccountConfigurationEnumHelper.FetchText(issue);

            return View("Errors/ConfigurationIssue");
        }

        public ActionResult SessionPersist()
        {
            return Content("OK");
        }

        public ActionResult TestBed()
        {
            var user = UserManager.FindById(Convert.ToInt32(User.Identity.GetUserId()));

            if (user.Id == 8)
            {
                return View();
            }
            else
            {
                return RedirectToAction("index");
            }
        }
    }
}