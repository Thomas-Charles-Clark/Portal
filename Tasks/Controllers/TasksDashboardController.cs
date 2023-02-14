using Tasks.Models;
using Tasks.ViewModels;
using Microsoft.AspNet.Identity;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Tasks.Controllers
{
    [DynamicRoleAuthorise]
    public class DashboardController : BaseController
    {
        private TasksDbContext dbContext { get; set; }

        public DashboardController(ApplicationUserManager UserManager, PortalDbContext PortalDb, TasksDbContext tasksDbContext) : base(UserManager, PortalDb)
        {
            dbContext = tasksDbContext;
        }

        public ActionResult Index(long? i)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "dashboard" && p.AreaName == "tasks" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var results = dbContext.TaskDashboard(new PassTaskDashboardFilters()
            {
                AssignedToMemberID = user.Id
            });

            string startingWidget = null;
            
            if (results.Unread > 0)
            {
                startingWidget = "Unread";
            }
            else if (results.Chased > 0)
            {
                startingWidget = "Chased";
            }
            else if (results.Urgent > 0)
            {
                startingWidget = "Urgent";
            }
            else if (results.Overdue > 0)
            {
                startingWidget = "Overdue";
            }
            else
            {
                startingWidget = "DueToday";
            }

            GridTaskDue preLoad = null;

            if (i != null)
            {
                var td = PortalDb.TaskDues.Where(p => 
                    p.Deleted == false &&
                    p.TaskDueID == i).SingleOrDefault();
                preLoad = new GridTaskDue(td);
            }
            
            var hierarchyData = PortalDb.Locations.ToList();

            hierarchyData.ForEach(p =>
            {
                p.Departments = p.Departments.Where(q => q.Deleted == false).ToList();
            });

            var model = new TasksViewModel(
                preLoad,
                application.Heading,
                application.SubHeading,
                user.FullName,
                PortalDb.Projects.Where(p => 
                    p.Deleted == false && 
                    p.Tasks.Where(q =>
                        q.TaskDues.Any() &&
                        q.TaskDues.OrderBy(t => t.Due).FirstOrDefault().CompletedDT == null
                    ).Any()).ToList(),
                PortalDb.ExternalCompanies.ToList(),
                PortalDb.TaskTypes.OrderBy(p => p.Name).ToList(),
                startingWidget,
                hierarchyData,
                user.GetActiveRoleProperties());

            // If the user has any Unread tasks, that's what you should display
            // If the user has any Chased tasks, that's... also what you should... display
            // If the user has neither, then display Today's tasks.
            // If the user has none of them, then display This Week's tasks...?

            // Why can't we just always load This Week's tasks...
            
            return View("TasksDashboard", model);
        }
    }
}