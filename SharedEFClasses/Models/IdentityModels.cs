using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

using Newtonsoft.Json;

using SharedEFClasses.Models.Applications;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.Retail;
using SharedEFClasses.Models.StockManagement;
using SharedEFClasses.Models.TradeAccounts;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class Member : IdentityUser<int, Member_Login, Member_Role, Member_Claim>
    {
        public Member()
        {
            Roles = new List<Member_Role>();
        }

        public string FullName { get; set; }

        public int MemberID
        {
            get
            {
                return Id;
            }
        }
        public string DefaultMertexOperatorCode { get; set; }

        public virtual MertexOperator DefaultMertexOperator { get; set; }

        public int? TradeAccountID { get; set; }

        //internal Guid GUID;

        //internal DateTime CreatedDT;

        //internal DateTime? ModifiedDT;

        //internal DateTime? LoginDT;

        public short CountryID { get; set; }

        public byte LanguageID { get; set; }

        //internal String FullName;

        public bool Deleted { get; set; }

        public byte MemberTypeID { get; set; }

        public short MarketingCountryID { get; set; }
        public byte MarketingLanguageID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool InvalidEmail { get; set; }

        public bool TradeAuthenticationComplete { get; set; }

        [JsonIgnore]
        public virtual ICollection<Member_Department> Departments { get; set; }

        //[JsonIgnore]
        //public virtual TradeAccount TradeAccount { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead> LeadsOwned { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead> LeadsOriginated { get; set; }

        [JsonIgnore]
        public override ICollection<Member_Role> Roles { get; }

        //[JsonIgnore]
        //public virtual ICollection<Member_Role> MemberRoles { get; set; }

        [JsonIgnore]
        public virtual ICollection<Member_RecentlyUsedMember> RecentlyUsedMembers { get; set; }

        [JsonIgnore]
        public ICollection<TradeAccountCompetitorNote> TradeAccount_CompetitorNotes_Created { get; internal set; }

        [JsonIgnore]
        public ICollection<TradeAccountCompetitorNote> TradeAccount_CompetitorNotes_Deleted { get; internal set; }

        [JsonIgnore]
        public ICollection<TradeAccountPotential> TradeAccountPotentials_Modified { get; internal set; }

        [JsonIgnore]
        public virtual ICollection<LeadNote> LeadNotes { get; set; }

        [JsonIgnore]
        public virtual ICollection<PortalTask> AuthoredTasks { get; set; }

        [JsonIgnore]
        public virtual ICollection<PortalTask> CurrentlyAssignedTasks { get; set; }

        [JsonIgnore]
        [InverseProperty("AssignedToMember")]
        public virtual ICollection<TaskAssignmentHistory> TasksReceivedHistory { get; set; }

        [JsonIgnore]
        [InverseProperty("AssignedByMember")]
        public virtual ICollection<TaskAssignmentHistory> TasksAssignedToOthersHistory { get; set; }

        [JsonIgnore]
        [InverseProperty("CreatedBy")]
        public virtual ICollection<TaskComment> TaskComments { get; set; }

        [JsonIgnore]
        [InverseProperty("ChasedBy")]
        public virtual ICollection<TaskChase> TaskChases { get; set; }

        [JsonIgnore]
        [InverseProperty("UploadedByMember")]
        public virtual ICollection<Task_Attachment> TaskAttachmentsUploaded { get; set; }

        [JsonIgnore]
        [InverseProperty("Member")]
        public virtual ICollection<Member_TradeAccount> TradeAccounts { get; set; }

        [JsonIgnore]
        [InverseProperty("Author")]
        public virtual ICollection<Project> AuthoredProjects { get; set; }

        [JsonIgnore]
        [InverseProperty("Owner")]
        public virtual ICollection<Project> CurrentlyAssignedProjects { get; set; }

        [JsonIgnore]
        [InverseProperty("Author")]
        public virtual ICollection<ProjectNote> ProjectNotes { get; set; }

        [JsonIgnore]
        [InverseProperty("Author")]
        public virtual ICollection<ProjectStakeholder> CreatedProjectStakeholders { get; set; }

        [JsonIgnore]
        [InverseProperty("Author")]
        public virtual ICollection<TradeAccountNote> TradeAccountNotes { get; set; }

        [JsonIgnore]
        [InverseProperty("Member")]
        public virtual ICollection<ProjectStakeholder> ProjectStakeholdings { get; set; }

        [JsonIgnore]
        [InverseProperty("UploadedByMember")]
        public virtual ICollection<Project_Attachment> ProjectAttachmentsUploaded { get; set; }

        [JsonIgnore]
        [InverseProperty("Loser")]
        public virtual ICollection<Project> ProjectsDeclaredLost { get; set; }

        [JsonIgnore]
        [InverseProperty("Completer")]
        public virtual ICollection<Project> ProjectsDeclaredComplete { get; set; }

        [JsonIgnore]
        [InverseProperty("Owner")]
        public virtual ICollection<Member_Basket> Baskets { get; set; }

        [JsonIgnore]
        [InverseProperty("LockedByMember")]
        public virtual ICollection<Basket> LockingBaskets { get; set; }

        [JsonIgnore]
        [NotMapped]
        public TradeAccount DefaultTradeAccount
        {
            get
            {
                return TradeAccounts?.Where(p => p.Default == true).SingleOrDefault()?.TradeAccount;
            }
        }

        // This for Tasks... because DropDownTree has to filter by properties of the same name.
        [NotMapped]
        public string Name
        {
            get
            {
                return FullName;
            }
            set
            {
                FullName = value;
            }
        }

        [JsonIgnore]
        [InverseProperty("CreatedMember")]
        public virtual ICollection<RingFencePreAllocation> RingFencePreAllocationsCreated { get; set; }

        [JsonIgnore]
        [InverseProperty("ModifiedMember")]
        public virtual ICollection<RingFencePreAllocation> RingFencePreAllocationsModified { get; set; }

        [JsonIgnore]
        [InverseProperty("LastModifiedBy")]
        public virtual ICollection<MarketingBudget> MarketingBudgetRecordsModified { get; set; }

        [JsonIgnore]
        [InverseProperty("MixedBy")]
        public virtual ICollection<MixingSession> MixingSessions { get; set; }

        [JsonIgnore]
        [InverseProperty("TransferredByMember")]
        public virtual ICollection<MixingSession> MixingSessionsTransferred { get; set; }

        [JsonIgnore]
        [InverseProperty("LockedBy")]
        public virtual ICollection<PaintOrderHead> LockingPaintOrders { get; set; }

        [JsonIgnore]
        [InverseProperty("LastModifiedBy")]
        public virtual ICollection<RetailStoreMember> RetailStoreMembersEdited { get; set; }

        [JsonIgnore]
        [InverseProperty("MarketManager")]
        public virtual ICollection<SalesMarket> SalesMarketsManaged { get; set; }

        [JsonIgnore]
        [InverseProperty("LastModifiedBy")]
        public virtual ICollection<Branch> BranchesModified { get; set; }

        [JsonIgnore]
        [InverseProperty("LastModifiedBy")]
        public virtual ICollection<BranchGroup> BranchGroupsModified { get; set; }

        [JsonIgnore]
        [InverseProperty("LastModifiedBy")]
        public virtual ICollection<Branch_BranchGroup> BranchGroupsAssignmentsModified { get; set; }

        [JsonIgnore]
        [InverseProperty("LastModifiedBy")]
        public virtual ICollection<Range> RetailBranchRangesModified { get; set; }

        [JsonIgnore]
        [InverseProperty("LastModifiedBy")]
        public virtual ICollection<BranchStockLocation> BranchStockLocationsModified { get; set; }

        [JsonIgnore]
        [InverseProperty("ModifiedByMember")]
        public virtual ICollection<Fenwick.FenwickBranch> ModifiedFenwickBranches { get; set; }

        [JsonIgnore]
        [InverseProperty("SignedOffByMember")]
        public virtual ICollection<Fenwick.SelfBillInvoice> SignedOffFenwicksInvoices { get; set; }

        [JsonIgnore]
        [InverseProperty("LastModifiedBy")]
        public virtual ICollection<Maintenance.MaintenanceBuyer> BuyersModified { get; set; }

        [JsonIgnore]
        [InverseProperty("LastModifiedBy")]
        public virtual ICollection<Maintenance.MaintenanceSupplier> SuppliersModified { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(ApplicationUserManager manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            ClaimsIdentity userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(ApplicationUserManager manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            ClaimsIdentity userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }

        public RoleProperties GetActiveRoleProperties()
        {
            List<Role> r = Roles.Select(p => p.Role).OrderBy(p => p.Precedence).ToList();

            Role ra = r.FirstOrDefault();

            RoleProperties rap = ra?.Properties;

            return Roles?.Select(p => p.Role).OrderBy(p => p.Precedence).FirstOrDefault()?.Properties;
        }
    }

    // New derived classes
    public class Member_Role : IdentityUserRole<int> // user belonging to a role
    {
        public virtual Member Member { get; set; }
        public virtual Role Role { get; set; }
    }

    public class Member_RecentlyUsedMember
    {
        [Key]
        [Column(Order = 1)]
        public int MemberID { get; set; }

        [Key]
        [Column(Order = 2)]
        public int OtherMemberID { get; set; }

        public DateTime UsedDT { get; set; }

        public virtual Member Member { get; set; }

        public virtual Member OtherMember { get; set; }
    }

    public class Member_Claim : IdentityUserClaim<int> // one specific user claim
    {
    }

    public class Member_Login : IdentityUserLogin<int> // type for a user's login (i.e. facebook, google)
    {
    }

    public class Role : IdentityRole<int, Member_Role> // a role entity
    {
        public Role()
        {
        }
        public Role(string name)
        {
            Name = name;
        }

        public int Precedence { get; set; }

        public string PortalJSON { get; set; }

        public RoleProperties Properties
        {
            get
            {
                return this.PortalJSON != null ? JsonConvert.DeserializeObject<RoleProperties>(this.PortalJSON) : null;
            }
            set
            {
                this.PortalJSON = JsonConvert.SerializeObject(value);
            }
        }

        public virtual ICollection<Application_Role> Application_Roles { get; set; }
    }

    public class Application_Role
    {
        [Key]
        [Column(Order = 1)]
        public short ApplicationID { get; set; }
        [Key]
        [Column(Order = 2)]
        public int RoleID { get; set; }
        public short? SortOrder { get; set; }

        public virtual Role Role { get; set; }
        public virtual Application Application { get; set; }
    }

    public class UserStore : UserStore<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public UserStore(PortalDbContext context) : base(context)
        {
        }
    }

    public class RoleStore : RoleStore<Role, int, Member_Role>
    {
        public RoleStore(PortalDbContext context) : base(context)
        {
        }
    }

    [NotMapped]
    public class RoleProperties
    {
        public bool Order_Returnables { get; set; }
        public bool Order_ShowDespatchOptions { get; set; }
        public bool Order_PriceOverride { get; set; }
        public bool Order_ShowPayOnline { get; set; }
        public bool Order_ShowOrderTaker { get; set; }
        public bool ProductSearch_ShowStock { get; set; }
        public int? Sampling_MaxOrderQuantity { get; set; }
        public int? Sampling_MaxSKUQuantity { get; set; }
        public bool Sampling_ShowFollowUpPreference { get; set; }
        public bool Sampling_CanOverridePricing { get; set; }
        public bool ProductSearch_ShowPrices { get; set; }
        public bool Account_ShowAddressBook { get; set; }
        public bool ProductSearch_ShowDiscontinued { get; set; }
        public bool AccountSelector_CanSearch { get; set; }
        public bool Account_MertexLoginCheck { get; set; }
        public string Application_ButtonClass { get; set; }
        public string Application_PanelClass { get; set; }
        public string OrderEntry_DefaultMode { get; set; }
        public LeadsPermissions LeadsPermissions { get; set; }
        public IEnumerable<int> BranchIDs { get; set; }
    }

    public class LeadsPermissions
    {
        public bool MayViewOthersLeads { get; set; }
    }
}