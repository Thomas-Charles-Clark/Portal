using Tasks.Models;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Tasks.ViewModels
{
    public class TasksViewModel : BaseViewModel
    {
        public string UserName { get; set; }
        public List<Project> Projects { get; set; }
        public List<TaskType> TaskTypes { get; set; }
        public List<ExternalCompany> ExternalCompanies { get; set; }
        public string StartingWidget { get; set; }
        public GridTaskDue Preloaded { get; set; }
        public object EmployeeHierarchyData { get; set; }

        public TasksViewModel(
            GridTaskDue taskDue,
            string applicationHeading, 
            string applicationSubHeading,
            string userName,
            List<Project> projects,
            List<ExternalCompany> externalCompanies,
            List<TaskType> taskTypes,
            string startingWidget,
            object employeeHierarchyData,
            RoleProperties roleProperties) 
            : base (roleProperties, applicationHeading, applicationSubHeading)
        {
            Preloaded = taskDue;
            UserName = userName;
            Projects = projects;
            TaskTypes = taskTypes;
            StartingWidget = startingWidget;
            ExternalCompanies = externalCompanies;
            EmployeeHierarchyData = employeeHierarchyData;
        }
    }
}