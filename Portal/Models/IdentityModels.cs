using System;
using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Security.Principal;
using System.Web;
using Microsoft.AspNet.Identity.Owin;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data.Entity.Infrastructure;
using System.Linq;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Portal.Models
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

        [JsonIgnore]
        public virtual TradeAccount TradeAccount { get; set; }

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
        public ICollection<TradeAccount_CompetitorNote> TradeAccount_CompetitorNotes_Created { get; internal set; }

        [JsonIgnore]
        public ICollection<TradeAccount_CompetitorNote> TradeAccount_CompetitorNotes_Deleted { get; internal set; }

        [JsonIgnore]
        public ICollection<TradeAccountPotential> TradeAccountPotentials_Modified { get; internal set; }

        [JsonIgnore]
        public ICollection<TradeAccountVisit_Member> TradeAccountVisits { get; internal set; }

        [JsonIgnore]
        public virtual ICollection<LeadNote> LeadNotes { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(ApplicationUserManager manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(ApplicationUserManager manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }

        public RoleProperties GetActiveRoleProperties()
        {
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
        public int MemberID { get; set; }

        [Key]
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
                if (this.PortalJSON != null)
                {
                    return JsonConvert.DeserializeObject<RoleProperties>(this.PortalJSON);
                }
                else
                {
                    return null;
                }
            }
            set
            {
                this.PortalJSON = JsonConvert.SerializeObject(value);
            }
        }

        public virtual ICollection<Application_Role> Application_Roles { get; set; }
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
    }
}