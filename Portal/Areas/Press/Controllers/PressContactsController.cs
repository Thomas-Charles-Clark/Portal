using Microsoft.AspNet.Identity;
using Portal.Areas.Products.ViewModels;
using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Portal.Areas.Retail.Models;
using System.Web.Http;
using SharedEFClasses.Models.Retail;
using Kendo.Mvc.UI;
using OpenXmlPowerTools;
using Kendo.Mvc.Extensions;
using Newtonsoft.Json;
using Portal.Areas.Press.ViewModels;
using Portal.Areas.Press.Models;
using SharedEFClasses.Models.Press;
//using System.Web.Http;

namespace Portal.Areas.Press.Controllers
{
    [RouteArea("press")]
    [System.Web.Mvc.RoutePrefix("contacts")]
    [System.Web.Mvc.Route("{action=index}")]
    public class PressContactsController : BaseController
    {
        public PressContactsController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        public async Task<ActionResult> Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "contacts" && p.AreaName == "press" && p.ActionName == "index").FirstOrDefault();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await PressContactsViewModel.CreateAsync(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("Contacts", model);
        }

        [System.Web.Mvc.AcceptVerbs(HttpVerbs.Post)]
        public ActionResult CreateMembers([DataSourceRequest] DataSourceRequest request, [FromBody] PassPressContactsCreationBatchDto objUpdate)
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (objUpdate.models.Select(m => m.Email).Distinct().Count() < objUpdate.models.Count())
            {
                var nonUniqueEmails = objUpdate
                    .models
                    .GroupBy(m => m.Email)
                    .Where(g => g.Count() > 1)
                    .Select(k => new { email = k.Key, count = k.Count() });

                ModelState.AddModelError("Email", $"Emails be unique.<br/>You provided the following duplicates:<br/><br>{String.Join("<br/>", nonUniqueEmails.Select(nue => $"{nue.email} &times; {nue.count}"))}");

                return Content(JsonConvert.SerializeObject(PortalDb.PressContacts.AsQueryable().ToDataSourceResult(request, ModelState)));
            }

            var extantEmailsString = new List<string>();

            objUpdate.models.ForEach(m =>
            {
                var ex = PortalDb.PressContacts.SingleOrDefault(e => e.Email == m.Email);

                if (ex != null)
                {
                    extantEmailsString.Add(ex.Email);
                }
            });

            if (extantEmailsString.Any())
            {
                ModelState.AddModelError("Emails", $"Emails must be unique.<br/>The following emails are already stored in this table:<br/><br/>{String.Join("<br/>", extantEmailsString)}");
            }

            if (ModelState.IsValid)
            {
                var createdDt = DateTime.Now;

                objUpdate.models.ForEach(m =>
                {
                    var rec = new PressContact()
                    {
                        Email = m.Email,
                        Title = m.Title,
                        FirstName = m.FirstName,
                        LastName = m.LastName,
                        PersonalisationName = m.PersonalisationName,
                        Segment = m.Segment,
                        Market = m.Market,
                        Status = m.Status,
                        ModifiedMemberID = user.Id,
                        CreatedDT = createdDt,
                        ModifiedDT = createdDt
                    };

                    PortalDb.PressContacts.Add(rec);
                });

                PortalDb.SaveChanges();
            } 

            return Content(JsonConvert.SerializeObject(PortalDb.PressContacts.AsQueryable().ToDataSourceResult(request, ModelState)));
        }

        [System.Web.Mvc.AcceptVerbs(HttpVerbs.Post)]
        public ActionResult UpdateMembers([DataSourceRequest] DataSourceRequest request, [FromBody]PassPressContactsBatchDto objUpdate)
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (objUpdate.models.Select(m => m.Email).Distinct().Count() < objUpdate.models.Count())
            {
                var nonUniqueEmails = objUpdate
                    .models
                    .GroupBy(m => m.Email)
                    .Where(g => g.Count() > 1)
                    .Select(k => new { email = k.Key, count = k.Count() });

                ModelState.AddModelError("Email", $"Emails be unique.<br/>You provided the following duplicates:<br/><br>{String.Join("<br/>", nonUniqueEmails.Select(nue => $"{nue.email} &times; {nue.count}"))}");

                return Content(JsonConvert.SerializeObject(PortalDb.PressContacts.AsQueryable().ToDataSourceResult(request, ModelState)));
            }

            if (ModelState.IsValid)
            {
                var modifiedDt = DateTime.Now;

                objUpdate.models.ForEach(m =>
                {
                    var rec = PortalDb.PressContacts.SingleOrDefault(p => p.PressContactID == m.PressContactID);

                    if (rec != null)
                    {
                        rec.Email = m.Email;
                        rec.Title = m.Title;
                        rec.FirstName = m.FirstName;
                        rec.LastName = m.LastName;
                        rec.PersonalisationName = m.PersonalisationName;
                        rec.Segment = m.Segment;
                        rec.Market = m.Market;
                        rec.Status = m.Status;
                        rec.ModifiedMemberID = user.Id;
                        rec.ModifiedDT = modifiedDt;
                        rec.DeletedDT = m.Deleted ? DateTime.Now : (DateTime?)null;
                    }
                });

                PortalDb.SaveChanges();
            }

            return Content(JsonConvert.SerializeObject(PortalDb.PressContacts.AsQueryable().ToDataSourceResult(request, ModelState)));
        }
    }
}