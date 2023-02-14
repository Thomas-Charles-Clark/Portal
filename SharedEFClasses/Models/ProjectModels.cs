using Newtonsoft.Json;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("Project", Schema = "portal")]
    public class Project
    {
        [Key]
        public int ProjectID { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public DateTime ModifiedDT { get; set; }

        public int OwnerMemberID { get; set; }

        public int AuthorMemberID { get; set; }

        public short? ProjectCategoryID { get; set; }

        public byte? ProjectStatusID { get; set; }

        public byte ProjectTypeID { get; set; }

        public short? CountryID { get; set; }

        public byte? CurrencyID { get; set; }

        public decimal? EstimatedValue { get; set; }

        public DateTime? FirstEnquiryDate { get; set; }
        public short? ExpectedCompletionYear { get; set; }
        public byte? ExpectedCompletionMonth { get; set; }
        public DateTime? ExpectedCompletionDate { get; set; }
        public byte? TradeMarketID { get; set; }
        public DateTime? LostDT { get; set; }
        public string LostComment { get; set; }
        public int? LostByMemberID { get; set; }

        public DateTime? CompletedDT { get; set; }
        public string CompletedComment { get; set; }
        public int? CompletedByMemberID { get; set; }


        [JsonIgnore]
        [ForeignKey("LostByMemberID")]
        public virtual Member Loser { get; set; }
        
        [JsonIgnore]
        [ForeignKey("CompletedByMemberID")]
        public virtual Member Completer { get; set; }

        [JsonIgnore]
        [ForeignKey("AuthorMemberID")]
        public virtual Member Author { get; set; }

        [JsonIgnore]
        [ForeignKey("OwnerMemberID")]
        public virtual Member Owner { get; set; }
        
        [ForeignKey("ProjectCategoryID")]
        public virtual ProjectCategory ProjectCategory { get; set; }

        [ForeignKey("ProjectStatusID")]
        public virtual ProjectStatus ProjectStatus { get; set; }

        [ForeignKey("ProjectTypeID")]
        public virtual ProjectType ProjectType { get; set; }

        [ForeignKey("CountryID")]
        public virtual Country Country { get; set; }

        [ForeignKey("CurrencyID")]
        public virtual Currency Currency { get; set; }

        [ForeignKey("TradeMarketID")]
        public virtual TradeMarket TradeMarket { get; set; }
        
        public virtual ICollection<Task> Tasks { get; set; }
        
        [NotMapped]
        public List<TaskDue> TaskDues
        {
            get
            {
                return Tasks?.SelectMany(q => q.TaskDues).ToList();
            }
        }

        public virtual ICollection<ProjectNote> ProjectNotes { get; set; }
        
        public virtual ICollection<ProjectStakeholder> ProjectStakeholders { get; set; }
        
        public virtual ICollection<Project_Competitor> ProjectCompetitors { get; set; }

        public virtual ICollection<Project_Tag> Tags { get; set; }

        public virtual ICollection<Project_Attachment> Attachments { get; set; } 
    }

    [Table("Project_Attachment", Schema = "portal")]
    public class Project_Attachment
    {
        [Key]
        public int ProjectAttachmentID { get; set; }
        public int ProjectID { get; set; }
        public string Name { get; set; }
        public string FilePath { get; set; }
        public int UploadedByMemberID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }
        
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual Project Project { get; set; }

        [ForeignKey("UploadedByMemberID")]
        public virtual Member UploadedByMember { get; set; }
    }

    [Table("ProjectCategory", Schema = "portal")]
    public class ProjectCategory
    {
        [Key]
        public short ProjectCategoryID { get; set; }
        public string Name { get; set; }
        public int AuthorMemberID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<Project> Projects { get; set; }
    }

    [Table("ProjectNote", Schema = "portal")]
    public class ProjectNote
    {
        [Key]
        public long ProjectNoteID { get; set; }

        public int ProjectID { get; set; }

        public string Note { get; set; }

        public int AuthorMemberID { get; set; }
        
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
        
        [ForeignKey("ProjectID")]
        [JsonIgnore]
        public virtual Project Project { get; set; }
        
        [ForeignKey("AuthorMemberID")]
        public Member Author { get; set; }
    }

    [Table("ProjectStatus", Schema = "portal")]
    public class ProjectStatus
    {
        [Key]
        public byte ProjectStatusID { get; set; }

        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<Project> Projects { get; set; }
    }

    [Table("Project_Competitor", Schema = "portal")]
    public class Project_Competitor
    {
        [Key]
        [Column(Order = 1)]
        public int ProjectID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short CompetitorID { get; set; }
        

        [ForeignKey("ProjectID")]
        [JsonIgnore]
        public virtual Project Project { get; set; }

        [ForeignKey("CompetitorID")]
        public virtual Competitor Competitor { get; set; }
        
        public virtual ICollection<Project_CompetitorQuote> Quotes { get; set; }

        [NotMapped]
        public string Name
        {
            get
            {
                return Competitor?.Name;
            }
        }
    }

    [Table("Project_CompetitorQuote", Schema = "portal")]
    public class Project_CompetitorQuote
    {
        [Key]
        public long ProjectCompetitorQuoteID { get; set; }

        [ForeignKey("Project")]
        [Column(Order = 0)]
        public int ProjectID { get; set; }

        [ForeignKey("Project")]
        [Column(Order = 1)]
        public short CompetitorID { get; set; }

        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public byte? CurrencyID { get; set; }
        public decimal? Price { get; set; }
        public decimal? Quantity { get; set; }
        public string Comment { get; set; }

        [JsonIgnore]
        public virtual Project_Competitor Project { get; set; }

        [ForeignKey("CurrencyID")]
        public virtual Currency Currency { get; set; }
    }


    [Table("Project_Tag", Schema = "portal")]
    public class Project_Tag
    {
        [Key]
        [Column(Order = 1)]
        public int ProjectID { get; set; }

        [Key]
        [Column(Order = 2)]
        public int TagID { get; set; }


        [ForeignKey("ProjectID")]
        [JsonIgnore]
        public virtual Project Project { get; set; }

        [ForeignKey("TagID")]
        public virtual Tag Tag { get; set; }

        [NotMapped]
        public string Name
        {
            get
            {
                return Tag?.Name;
            }
        }
    }

    [Table("ProjectType", Schema = "portal")]
    public class ProjectType
    {
        [Key]
        public byte ProjectTypeID { get; set; }

        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<Project> Projects { get; set; }
    }

    ///This belongs elsewhere, Tom... and sort out which you're supposed to use: adm.Mertex_Market or portal.TradeMarket
    ///Ugh.
    [Table("TradeMarket", Schema = "portal")]
    public class TradeMarket
    {
        [Key]
        public byte TradeMarketID { get; set; }

        public string Name { get; set; }

        public string Code { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<Project> Projects { get; set; }

        [JsonIgnore]
        public virtual ICollection<Country> Countries { get; set; }
    }

    public class TradeMarketStub
    {
        public short? TradeMarketID { get; set; }
        public string Name { get; set; }
    }

    [Table("ProjectStakeholder", Schema = "portal")]
    public class ProjectStakeholder
    {
        [Key]
        public long ProjectStakeholderID { get; set; }

        public short? ProjectStakeholderTypeID { get; set; }

        public int ProjectID { get; set; }

        public string Name { get; set; }

        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Website { get; set; }
        public string CompanyName { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }
        public string Postcode { get; set; }
        public short? CountryID { get; set; }
        public bool DecisionMaker { get; set; }
        public int AuthorMemberID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public int? MemberID { get; set; }
        public int? TradeAccountID { get; set; }
        public long? LeadID { get; set; }
        public long? LeadContactID { get; set; }
        
        [ForeignKey("ProjectStakeholderTypeID")]
        public virtual ProjectStakeholderType ProjectStakeholderType { get; set; }

        [JsonIgnore]
        [ForeignKey("ProjectID")]
        public virtual Project Project { get; set; }

        [JsonIgnore]
        [ForeignKey("CountryID")]
        public virtual Country Country { get; set; }
        
        [JsonIgnore]
        [ForeignKey("AuthorMemberID")]
        public virtual Member Author { get; set; } // Why the heck do we need to store who created this stakeholder...?

        [JsonIgnore]
        [ForeignKey("MemberID")]
        public virtual Member Member { get; set; }
        
        [ForeignKey("TradeAccountID")]
        public virtual TradeAccount TradeAccount { get; set; }

        [JsonIgnore]
        [ForeignKey("LeadID")]
        public virtual Lead Lead { get; set; }

        [JsonIgnore]
        [ForeignKey("LeadContactID")]
        public virtual LeadContact LeadContact { get; set; }

        [NotMapped]
        public string Phone
        {
            get
            {
                return PhoneNumber;
            }
        }

        [NotMapped]
        public PassAddress Address
        {
            get
            {
                return new PassAddress()
                {
                    addressLine1 = AddressLine1,
                    addressLine2 = AddressLine2,
                    town = Town,
                    county = County,
                    postcode = Postcode,
                    countryId = CountryID
                };
            }
        }

        [NotMapped]
        public string Code
        {
            get
            {
                return TradeAccount?.Code;
            }
        }

        [NotMapped]
        public string Class
        {
            get
            {
                if (this.MemberID != null)
                    return "list-group-item-success";
                else if (this.TradeAccountID != null)
                    return "list-group-item-info";
                else if (this.LeadID != null)
                    return "list-group-item-warning";
                else if (this.LeadContactID != null)
                    return "list-group-item-warning";
                else
                    return "list-group-item-success";
            }
        }

        [NotMapped]
        public string Type
        {
            get
            {
                if (this.MemberID != null)
                    return "PERSON";
                else if (this.TradeAccountID != null)
                    return "TRADE ACCOUNT";
                else if (this.LeadID != null)
                    return "LEAD";
                else if (this.LeadContactID != null)
                    return "LEAD CONTACT";
                else
                    return "STAKEHOLDER";
            }
        }
    }

    [Table("ProjectStakeholderType", Schema = "portal")]
    public class ProjectStakeholderType
    {
        [Key]
        public short ProjectStakeholderTypeID { get; set; }

        public string Name { get; set; }
        public int AuthorMemberID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<ProjectStakeholder> ProjectStakeholders { get; set; }
    }
}
