using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Portal.Models
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
        public string Heading { get; set; }
        public string SubHeading { get; set; }
        public virtual ApplicationStatus Status { get; set; }
        public short SortOrder { get; set; }
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<Application_Role> Application_Roles { get; set; }
    }

    public class ApplicationStatus
    {
        public byte ApplicationStatusID { get; set; }
        public string Name { get; set; }
        public string CssClass { get; set; }
    }

    public class Application_Role
    {
        public short ApplicationID { get; set; }
        public int RoleID { get; set; }
        public short? SortOrder { get; set; }

        public virtual Role Role { get; set; }
        public virtual Application Application { get; set; }
    }


    public class TradeAccountAddressReturn
    {
        public List<TradeAccountPrimaryAddress> PrimaryAddresses { get; set; }
        public List<TradeAccountSecondaryAddress> SecondaryAddresses { get; set; }
    }

    public class TradeAccountPrimaryAddress
    {
        public string Name { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string AddressLine4 { get; set; }
        public string Postcode { get; set; }
        public string Country { get; set; }
        public string CountryCode { get; set; }
        public short? CountryID { get; set; }
    }

    public class TradeAccountSecondaryAddress
    {
        public string DeliveryReference { get; set; }
        public string Name { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string AddressLine4 { get; set; }
        public string Postcode { get; set; }
        public string Country { get; set; }
        public string CountryCode { get; set; }
        public short? CountryID { get; set; }
    }

    public class MemberSearchViewResult
    {
        public List<MemberSearchResult> Members { get; set; }
        public int TotalResultsCount { get; set; }
    }

    public class MemberSearchResult
    {
        public int MemberID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}