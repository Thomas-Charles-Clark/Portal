using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Models
{
    public class PassProjectDashboardFilters
    {
        public short? ProjectCategoryID { get; set; }
        public byte? ProjectTypeID { get; set; }
        public byte? TradeMarketID { get; set; }
        public short? CountryID { get; set; }
        public int? OwnerMemberID { get; set; }
    }

    public class PassProjectGridFilters : PassProjectDashboardFilters
    {
        public string Widget { get; set; }
        public byte? ProjectStatusID { get; set; }
        public int? AuthorMemberID { get; set; }
        public string SearchTerm { get; set; }
        public bool ShowCompleted { get; set; }
    }

    public class PassProjectSave
    {
        public int? ProjectID { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public short? ProjectCategoryID { get; set; }
        public short? CountryID { get; set; }
        public int OwnerMemberID { get; set; }
        public byte? CurrencyID { get; set; }
        public decimal? EstimatedValue { get; set; }
        public DateTime? FirstEnquiryDate { get; set; }
        public short? ExpectedCompletionYear { get; set; }
        public byte? ExpectedCompletionMonth { get; set; }
        public DateTime? ExpectedCompletionDate { get; set; }

        public byte? TradeMarketID { get; set; }
        public List<PassProjectTag> Tags { get; set; }

        public List<PassProjectStakeholder> Stakeholders { get; set; }

        public List<PassProjectCompetitor> Competitors { get; set; }

        // Don't need to be saving all notes at once, do we? also don't need to add more than
        // one note at a time. So therefore... 
        //public List<PassProjectNote> Notes { get; set; }
        public string Note { get; set; }

        public string UploadGUID { get; set; }
        public List<string> Attachments { get; set; }

        public PassProjectSave()
        {
            Tags = new List<PassProjectTag>();
            Stakeholders = new List<PassProjectStakeholder>();
            Competitors = new List<PassProjectCompetitor>();
            Attachments = new List<string>();
        }
    }

    public class PassProjectStakeholder
    {
        public long? ProjectStakeholderID { get; set; }
        public PassProjectStakeholderType ProjectStakeholderType { get; set; }
        public bool DecisionMaker { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Website { get; set; }
        public string CompanyName { get; set; }
        public int? MemberID { get; set; }
        public int? TradeAccountID { get; set; }
        public long? LeadID { get; set; }
        public long? LeadContactID { get; set; }
        public PassAddress Address { get; set; }
    }

    public class PassProjectStakeholderType
    {
        public short ProjectStakeholderTypeID { get; set; }
    }

    public class PassProjectCompetitor
    {
        public short CompetitorID { get; set; }
        public List<PassCompetitorQuote> ProductQuotes { get; set; }
    }

    public class PassCompetitorQuote
    {
        public long? ProjectCompetitorQuoteID { get; set; }
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public PassCurrency Currency { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Price { get; set; }
        public string Comment { get; set; }
    }

    public class PassProjectTag
    {
        public int TagID { get; set; }
    }

    public class PassProjectNote
    {
        public string Note { get; set; }
    }

    public class PassProjectLost
    {
        public int ProjectID { get; set; }
        public string Comment { get; set; }
    }

    public class PassProjectCompleted
    {
        public int ProjectID { get; set; }
        public string Comment { get; set; }
    }

    public class PassProjectAttachmentID
    {
        public int ProjectAttachmentID { get; set; }
    }
}