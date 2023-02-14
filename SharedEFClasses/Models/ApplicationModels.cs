using Microsoft.AspNet.OData.Builder;
using Newtonsoft.Json;
using SharedEFClasses.Models.General;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models.Applications
{
    public class Application
    {
        public Application() { }

        public short ApplicationID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        public byte ApplicationStatusID { get; set; }
        public DateTime? LaunchDate { get; set; }
        public DateTime? LastModified { get; set; }
        public DateTime? EndDate { get; set; }
        public string ActionName { get; set; }
        public string ControllerName { get; set; }
        public string AreaName { get; set; }
        public string ExternalURL { get; set; }
        public string InlineJavascript { get; set; }
        public string Heading { get; set; }
        public string SubHeading { get; set; }
        public virtual ApplicationStatus Status { get; set; }
        public short SortOrder { get; set; }

        public byte? ApplicationGroupID { get; set; }

        public string ButtonFadeColourTop { get; set; }
        public string ButtonFadeColourBottom { get; set; }
        public string ButtonBorderColour { get; set; }
        public string ButtonBackgroundColour { get; set; }
        public string ButtonHoverBackgroundColour { get; set; }


        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ApplicationGroup ApplicationGroup { get; set; }

        [JsonIgnore]
        public virtual ICollection<Application_Role> Application_Roles { get; set; }
    }

    [Table("ApplicationGroup", Schema = "app")]
    public class ApplicationGroup
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public byte ApplicationGroupID { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public string ButtonFadeColourTop { get; set; }
        public string ButtonFadeColourBottom { get; set; }
        public string ButtonBorderColour { get; set; }
        public string ButtonBackgroundColour { get; set; }
        public string ButtonHoverBackgroundColour { get; set; }

        public byte SortOrder { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public virtual ICollection<Application> Applications { get; set; }
    }

    public class ApplicationStatus
    {
        public byte ApplicationStatusID { get; set; }
        public string Name { get; set; }
        public string CssClass { get; set; }
    }

    public class MemberSearchViewResult
    {
        public List<MemberSearchResult> Members { get; set; }
        public int TotalResultsCount { get; set; }
    }

    public class MemberSearchResult
    {
        public int? MemberID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }

    public class RepSearchViewResult
    {
        public List<SalesRepresentative> Members { get; set; }
        public int TotalResultsCount { get; set; }
    }
}