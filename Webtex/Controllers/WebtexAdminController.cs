using Webtex.Models;
using Webtex.ViewModels;
using Microsoft.AspNet.Identity;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Webtex.Controllers
{
    [DynamicRoleAuthorise]
    public class WebtexController : BaseController
    {
        private WebtexDbContext dbContext { get; set; }

        public WebtexController(ApplicationUserManager UserManager, PortalDbContext portalDb, WebtexDbContext webtexDbContext) : base(UserManager, portalDb)
        {
            dbContext = webtexDbContext;
        }

        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "customers" && p.AreaName == "tagging" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());
            
            var model = new WebtexAdminViewModel(
                application.Heading,
                application.SubHeading,
                //portalDb.Tags.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList(),
                user.GetActiveRoleProperties());
            
            return View("index", model);
        }
    }
}