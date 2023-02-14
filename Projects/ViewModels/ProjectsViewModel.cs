using Projects.Models;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.ViewModels
{
    public class ProjectsViewModel : BaseViewModel
    {
        public string UserName { get; set; }
        public List<Competitor> Competitors { get; set; }
        public List<Tag> Tags { get; set; }
        public List<ProjectCategory> ProjectCategories { get; set; }
        public List<ProjectStakeholderType> ProjectStakeholderTypes { get; set; }
        public object EmployeeHierarchyData { get; set; }
        public List<TaskType> TaskTypes { get; set; }
        public List<ExternalCompany> ExternalCompanies { get; set; }

        public ProjectsViewModel(
            string applicationHeading, 
            string applicationSubHeading,
            string userName,
            List<Competitor> competitors,
            List<Tag> tags,
            List<ProjectCategory> projectCategories,
            List<ProjectStakeholderType> projectStakeholderTypes, 
            object employeeHierarchyData,
            List<TaskType> taskTypes,
            List<ExternalCompany> externalCompanies,
            RoleProperties roleProperties) 
            : base (roleProperties, applicationHeading, applicationSubHeading)
        {
            UserName = userName;
            Competitors = competitors;
            Tags = tags;
            ProjectCategories = projectCategories;
            ProjectStakeholderTypes = projectStakeholderTypes;
            EmployeeHierarchyData = employeeHierarchyData;
            TaskTypes = taskTypes;
            ExternalCompanies = externalCompanies;
        }
    }
}