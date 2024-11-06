using Microsoft.AspNet.Identity;

using Portal.Areas.Email.ViewModels;
using Portal.Areas.Orders.ViewModels;

using SharedEFClasses;
using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Email.Controllers
{
    [DynamicRoleAuthorise]
    [RouteArea("email")]
    [RoutePrefix("contacts")]
    public class ContactsController : BaseController
    {
        public ContactsController(ApplicationUserManager userManager, PortalDbContext dbContext) : base(userManager, dbContext)
        {

        }

        // GET: Email/Contacts
        public async Task<ActionResult> Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "contacts" && p.AreaName == "email" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await EmailContactsViewModel.CreateAsync(
                user.DefaultMertexOperatorCode,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("EmailContacts", model);
        }
    }
}