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
//using System.Web.Http;

namespace Portal.Areas.Retail.Controllers
{
    [DynamicRoleAuthorise(actionNameAgnostic: true)]
    [RouteArea("retail")]
    [System.Web.Mvc.RoutePrefix("storemembers")]
    public class StoreMembersController : BaseController
    {
        public StoreMembersController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        public async Task<ActionResult> Index(string mixingLocation)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "storemembers" && p.AreaName == "retail" && p.ActionName == "index").FirstOrDefault();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await RetailStoreMembersViewModel.CreateAsync(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("RetailStoreMembers", model);
        }

        [System.Web.Mvc.AcceptVerbs(HttpVerbs.Post)]
        public ActionResult CreateMembers([DataSourceRequest] DataSourceRequest request, [FromBody] PassRetailStoreMembersCreationBatchDto objUpdate)
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

                return Content(JsonConvert.SerializeObject(PortalDb.RetailStoreMembers.AsQueryable().ToDataSourceResult(request, ModelState)));
            }

            var extantEmailsString = new List<string>();

            objUpdate.models.ForEach(m =>
            {
                var ex = PortalDb.RetailStoreMembers.SingleOrDefault(e => e.Email == m.Email);

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
                var approvedDt = DateTime.Now;

                objUpdate.models.ForEach(m =>
                {
                    var rec = new RetailStoreMember()
                    {
                        Email = m.Email,
                        Title = m.Title,
                        FirstName = m.FirstName,
                        LastName = m.LastName,
                        PersonalisationName = m.PersonalisationName,
                        Store = m.Store,
                        SaleRepresentative = m.SaleRepresentative,
                        Status = m.Status,
                        ModifiedMemberID = user.Id
                    };

                    PortalDb.RetailStoreMembers.Add(rec);
                });

                PortalDb.SaveChanges();
            } 

            return Content(JsonConvert.SerializeObject(PortalDb.RetailStoreMembers.AsQueryable().ToDataSourceResult(request, ModelState)));
        }

        [System.Web.Mvc.AcceptVerbs(HttpVerbs.Post)]
        public ActionResult UpdateMembers([DataSourceRequest] DataSourceRequest request, [FromBody]PassRetailStoreMembersBatchDto objUpdate)
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

                return Content(JsonConvert.SerializeObject(PortalDb.RetailStoreMembers.AsQueryable().ToDataSourceResult(request, ModelState)));
            }

            if (ModelState.IsValid)
            {
                var approvedDt = DateTime.Now;

                objUpdate.models.ForEach(m =>
                {
                    var rec = PortalDb.RetailStoreMembers.SingleOrDefault(p => p.RetailStoreMemberID == m.RetailStoreMemberID);

                    if (rec != null)
                    {
                        rec.Email = m.Email;
                        rec.Title = m.Title;
                        rec.FirstName = m.FirstName;
                        rec.LastName = m.LastName;
                        rec.PersonalisationName = m.PersonalisationName;
                        rec.Store = m.Store;
                        rec.SaleRepresentative = m.SaleRepresentative;
                        rec.Status = m.Status;
                        rec.ModifiedMemberID = user.Id;
                        rec.DeletedDT = m.Deleted ? DateTime.Now : (DateTime?)null;
                    }
                });

                PortalDb.SaveChanges();
            }

            return Content(JsonConvert.SerializeObject(PortalDb.RetailStoreMembers.AsQueryable().ToDataSourceResult(request, ModelState)));
        }
    }
}