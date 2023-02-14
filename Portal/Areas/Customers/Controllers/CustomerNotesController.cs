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
    [RoutePrefix("notes")]
    [Route("{action=ordering}")]
    public class NotesController : BaseController
    {
        public NotesController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }
        
        public ActionResult Ordering()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var application = PortalDb.Applications.Where(p => p.ControllerName == "notes" && p.AreaName == "customers" && p.ActionName == "ordering").Single();

            var model = new CustomerOrderingNotesViewModel(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("OrderingNotes", model);
        }
    }
}