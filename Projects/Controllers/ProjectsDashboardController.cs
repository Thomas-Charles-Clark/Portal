using Projects.Models;
using Projects.ViewModels;
using Microsoft.AspNet.Identity;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;

namespace Projects.Controllers
{
    [DynamicRoleAuthorise]
    public class DashboardController : BaseController
    {
        private ProjectsDbContext dbContext { get; set; }

        public DashboardController(ApplicationUserManager UserManager, PortalDbContext PortalDb, ProjectsDbContext ProjectsDbContext) : base(UserManager, PortalDb)
        {
            dbContext = ProjectsDbContext;
        }

        public ActionResult Index(long? i)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "dashboard" && p.AreaName == "projects" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var results = dbContext.ProjectDashboard(new PassProjectDashboardFilters()
            {
                OwnerMemberID = user.Id
            });

            var hierarchyData = PortalDb.Locations.ToList();

            hierarchyData.ForEach(p => 
            {
                p.Departments = p.Departments.Where(q => q.Deleted == false).ToList();
            });

            var model = new ProjectsViewModel(
                application.Heading,
                application.SubHeading,
                user.FullName,
                PortalDb.Competitors.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList(),
                PortalDb.Tags.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList(),
                PortalDb.ProjectCategories.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList(),
                PortalDb.ProjectStakeholderTypes.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList(),
                hierarchyData,
                PortalDb.TaskTypes.OrderBy(p => p.Name).ToList(),
                PortalDb.ExternalCompanies.ToList(),
                user.GetActiveRoleProperties());
            
            return View("ProjectsDashboard", model);
        }
    }
}