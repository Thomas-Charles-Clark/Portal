using GDPR.Models;
using GDPR.ViewModels;
using Microsoft.AspNet.Identity;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GDPR.Controllers
{
    [DynamicRoleAuthorise]
    public class SurveyController : BaseController
    {
        private GDPRDbContext dbContext { get; set; }

        public SurveyController(ApplicationUserManager UserManager, PortalDbContext PortalDb, GDPRDbContext gdprDbContext) : base(UserManager, PortalDb)
        {
            dbContext = gdprDbContext;
        }

        // GET: GDPR
        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "survey" && p.AreaName == "gdpr" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new GDPRSurveyViewModel(
                dbContext.DataCategories.ToList(),
                dbContext.IndividualCategories.ToList(),
                dbContext.DataStores.ToList(),
                dbContext.DataSources.ToList(),
                dbContext.SupplierCategories.ToList(),
                dbContext.DataTransmissionMethods.ToList(),
                application.Heading,
                application.SubHeading,
                user.GetActiveRoleProperties());
            
            return View("GDPRSurvey", model);
        }
    }
}