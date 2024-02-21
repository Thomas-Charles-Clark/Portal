using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using System.Web.Http.ModelBinding;
using Portal.Areas.Retail.Models;
using DocumentFormat.OpenXml.EMMA;
using SharedEFClasses.Models.Retail;
using Microsoft.AspNet.Identity;

namespace Portal.Areas.Press.Controllers
{
    public class PressContactsAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public PressContactsAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpGet]
        public DataSourceResult FetchMembers(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            return PortalDb.PressContacts.Where(rsm => rsm.Deleted == false).AsQueryable().ToDataSourceResult(request);
        }

        //[HttpPost]
        //public IHttpActionResult CreateMembers([DataSourceRequest] DataSourceRequest request, [FromBody] PassRetailStoreMembersCreationBatchDto objUpdate)
        //{
        //    var user = UserManager.FindById(User.Identity.GetUserId<int>());

        //    objUpdate.models.ForEach(m =>
        //    {
        //        var ex = PortalDb.RetailStoreMembers.SingleOrDefault(e => e.Email == m.Email);

        //        if (ex != null)
        //        {
        //            ModelState.AddModelError("Email", "Sorry, emails must be unique.");
        //        }
        //    });

        //    if (ModelState.IsValid)
        //    {
        //        var approvedDt = DateTime.Now;

        //        objUpdate.models.ForEach(m =>
        //        {
        //            var rec = new RetailStoreMember()
        //            {
        //                Email = m.Email,
        //                Name = m.Name,
        //                Store = m.Store,
        //                SaleRepresentative = m.SaleRepresentative,
        //                Status = m.Status,
        //                ModifiedMemberID = user.Id
        //            };

        //            PortalDb.RetailStoreMembers.Add(rec);
        //        });

        //        PortalDb.SaveChanges();
        //    }

        //    return Ok(PortalDb.RetailStoreMembers.AsQueryable().ToDataSourceResult(request, ModelState));
        //}

        //[HttpPost]
        //public IHttpActionResult UpdateMembers([DataSourceRequest] DataSourceRequest request, [FromBody] PassRetailStoreMembersBatchDto objUpdate)
        //{
        //    var user = UserManager.FindById(User.Identity.GetUserId<int>());

        //    objUpdate.models.ForEach(m =>
        //    {
        //        var ex = PortalDb.RetailStoreMembers.SingleOrDefault(e => e.Email == m.Email);

        //        if (ex != null)
        //        {
        //            ModelState.AddModelError("Email", "Sorry, emails must be unique.");
        //        }
        //    });

        //    if (ModelState.IsValid)
        //    {
        //        var approvedDt = DateTime.Now;

        //        objUpdate.models.ForEach(m =>
        //        {
        //            var rec = PortalDb.RetailStoreMembers.SingleOrDefault(p => p.RetailStoreMemberID == m.RetailStoreMemberID);

        //            if (rec != null)
        //            {
        //                rec.Email = m.Email;
        //                rec.Name = m.Name;
        //                rec.Store = m.Store;
        //                rec.SaleRepresentative = m.SaleRepresentative;
        //                rec.Status = m.Status;
        //                rec.ModifiedMemberID = user.Id;
        //                rec.DeletedDT = m.Deleted ? DateTime.Now : (DateTime?)null;
        //            }
        //        });

        //        PortalDb.SaveChanges();
        //    }

        //    return Ok(PortalDb.RetailStoreMembers.AsQueryable().ToDataSourceResult(request, ModelState));
        //}
    }
}
