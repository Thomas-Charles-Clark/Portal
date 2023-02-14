using Newtonsoft.Json;
using Portal.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Data;

namespace Portal.Models
{
    public class PassPanoramaLink
    {
        public long LeadAddressID { get; set; }
        public string GooglePanoramaLink { get; set; }
    }
    
    public class PassLeadID
    {
        public long leadId { get; set; }
    }

    public class PassLeadAndContactIDs
    {
        public long leadId { get; set; }
        public long leadContactId { get; set; }
    }

    public class PassLeadContactID
    {
        public long leadContactId { get; set; }
    }

    public class PassLeadAndAddressIDs
    {
        public long leadId { get; set; }
        public long leadAddressId { get; set; }
    }

    public class PassLeadAddressID
    {
        public long leadAddressId { get; set; }
    }

    public class Lead
    {
        [Key]
        public long LeadID { get; set; }
        public byte LeadStatusID { get; set; }
        public byte LeadSourceID { get; set; }
        public byte? LeadTypeID { get; set; }
        public long? LeadContactID { get; set; }
        public byte? StarRating { get; set; }
        public byte? LeadMagnitudeID { get; set; }
        public int SourceMemberID { get; set; }
        public int? OwnerMemberID { get; set; }
        public DateTime? AssignedDT { get; set; }
        public byte ChannelID { get; set; }
        //public string Description { get; set; }
        public decimal? AnnualRevenue { get; set; }
        public byte? CurrencyID { get; set; }
        public string CompanyName { get; set; }
        public short CountryID { get; set; }
        public byte? LanguageID { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? ModifiedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        public bool Deleted { get; set; }
        public long? OwnerRank { get; set; }
        public long? GlobalRank { get; set; }
        public int? TradeAccountID { get; set; }
        public bool Converted { get; set; }
        public long? LeadAddressID { get; set; }
        public DateTime? TradingSince { get; set; }
        public byte? CompanyTypeID { get; set; }
        public bool? WillBuyPatternBooks { get; set; }
        public string VATNumber { get; set; }
        public string CompanyNumber { get; set; }
        public long? DefaultInvoiceLeadAddressID { get; set; }
        public long? DefaultDeliveryLeadAddressID { get; set; }
        public string BankName { get; set; }
        public string BankAddressLine1 { get; set; }
        public string BankAddressLine2 { get; set; }
        public string BankTown { get; set; }
        public string BankCounty { get; set; }
        public string BankPostcode { get; set; }
        public short? BankCountryID { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankSortCode { get; set; }
        public string BankIBAN { get; set; }
        public byte? PaymentTermsID { get; set; }
        public byte? RequestedPaymentTermsID { get; set; }
        public decimal? CreditLimit { get; set; }
        public decimal? RequestedCreditLimit { get; set; }
        public bool CompanyLetterHeadChecked { get; set; }
        public byte? SalesMarketID { get; set; }
        public short? SalesRepresentativeID { get; set; }
        public short? SalesAgentID { get; set; }
        public short? SalesAreaID { get; set; }
        public short? TradePriceListID { get; set; }
        public bool ImmediateOrderRequested { get; set; }
        public byte? AccountTypeID { get; set; }
        public byte? CustomerTypeID { get; set; }
        public bool? HasPatternBookLibrary { get; set; }
        public bool? HasShowroom { get; set; }
        public bool? ShowroomByAppointmentOnly { get; set; }

        public string CreatedSince { get; set; }
        public string ModifiedSince { get; set; }
        public string AssignedSince { get; set; }
        public byte? TradingSinceID { get; set; }
        public decimal? TotalPotential { get; set; }    
        public List<Competitor> Competitors { get; set; }
        
        public virtual LeadType LeadType { get; set; }
        public virtual LeadStatus Status { get; set; }
        public virtual LeadSource LeadSource { get; set; }
        public virtual LeadContact LeadContact { get; set; }
        public virtual LeadMagnitude Magnitude { get; set; }
        public virtual Member SourceMember { get; set; }
        public virtual Member OwnerMember { get; set; }
        public virtual ICollection<LeadContact> SecondaryContacts { get; set; }
        public virtual ICollection<LeadAddress> LeadAddresses { get; set; }
        public virtual Channel Channel { get; set; }
        public virtual Currency Currency { get; set; }
        public virtual Country Country { get; set; }
        public virtual Language Language { get; set; }
        public virtual ICollection<LeadPotential> Potentials { get; set; }
        public virtual ICollection<Lead_Competitor> BrandsWorkedWith { get; set; }
        public virtual CompanyType CompanyType { get; set; }
        public virtual ICollection<LeadInterest> LeadInterests { get; set; }
        public virtual ICollection<LeadNote> LeadNotes { get; set; }
        public virtual PaymentTerms PaymentTerms { get; set; }
        public virtual PaymentTerms RequestedPaymentTerms { get; set; }
        public virtual SalesMarket SalesMarket { get; set; }
        public virtual SalesRepresentative SalesRepresentative { get; set; }
        public virtual SalesRepresentative SalesAgent { get; set; }
        public virtual SalesArea SalesArea { get; set; }
        public virtual TradePriceList TradePriceList { get; set; }
        public virtual AccountType AccountType { get; set; }
        public virtual CustomerType CustomerType { get; set; }
    }

    public class SalesMarket
    {
        public byte SalesMarketID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public short? CountryID { get; set; }
        public byte? LanguageID { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead> Leads { get; set; }

        [JsonIgnore]
        public virtual ICollection<SalesArea> SalesAreas { get; set; }

        [JsonIgnore]
        public virtual ICollection<SalesRepresentative> SalesRepresentatives { get; set; }

        [JsonIgnore]
        public virtual ICollection<SalesAgent> SalesAgents { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradePriceList> TradePriceLists { get; set; }

        [JsonIgnore]
        public virtual ICollection<PaymentTerms> PaymentTerms { get; set; }
    }

    public class LeadType
    {
        [Key]
        public byte LeadTypeID { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead> Leads { get; set; }
    }

    public class LeadNote
    {
        public long LeadNoteID { get; set; }
        public long LeadID { get; set; }
        public string Note { get; set; }
        public DateTime CreatedDT { get; set; }
        public int MemberID { get; set; }

        public virtual Member CreatedBy { get; set; }

        [JsonIgnore]
        public virtual Lead Lead { get; set; }
    }

    public class LeadInterest
    {
        public long LeadID { get; set; }
        public byte BrandID { get; set; }
        public byte ProductTypeGroupID { get; set; }
        [JsonIgnore]
        public virtual Lead Lead { get; set; }
    }

    public class Lead_Competitor
    {
        public short CompetitorID { get; set; }

        public virtual Competitor Competitor { get; set; }

        public long LeadID { get; set; }

        [JsonIgnore]
        public virtual Lead Lead { get; set; }
    }

    public class LeadAddress
    {
        public long LeadAddressID { get; set; }
        public long LeadID { get; set; }
        public string Label { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }
        public string PostCode { get; set; }
        public short CountryID { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? ModifiedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        public bool Deleted { get; set; }
        public string AppleMapsButton { get; set; }
        public string WazeButton { get; set; }
        public string GoogleStreetViewButton { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string GooglePanoramaLink { get; set; }

        public virtual Country Country { get; set; }
    }

    public class LeadMagnitude
    {
        [Key]
        public byte LeadMagnitudeID { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool Deleted { get; set; }
    }

    public class LeadSource
    {
        [Key]
        public byte LeadSourceID { get; set; }

        public byte LeadSourceGroupID { get; set; }

        public virtual LeadSourceGroup LeadSourceGroup { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead> Leads { get; set; }
    }

    public class LeadSourceGroup
    {
        [Key]
        public byte LeadSourceGroupID { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<LeadSource> LeadSources { get; set; }
    }

    public class LeadStatus
    {
        [Key]
        public byte LeadStatusID { get; set; }

        public byte LeadStatusGroupID { get; set; }

        public virtual LeadStatusGroup LeadStatusGroup { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public byte SortOrder { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool Deleted { get; set; }

        public bool Visible { get; set; }
    }

    public class LeadStatusGroup
    {
        [Key]
        public byte LeadStatusGroupID { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool Deleted { get; set; }
    }

    public class LeadContact
    {
        [Key]
        public long LeadContactID { get; set; }

        public byte? LeadContactTypeID { get; set; }

        public virtual LeadContactType LeadContactType { get; set; }

        public bool? DecisionMaker { get; set; }

        public long LeadID { get; set; }

        [JsonIgnore]
        public virtual Lead Lead { get; set; }

        public byte? TitleID { get; set; }

        public virtual FormalTitle Title { get; set; }

        [StringLength(50)]
        public string FullName { get; set; }

        [StringLength(256)]
        public string Email { get; set; }

        [StringLength(20)]
        public string HomePhone { get; set; }

        [StringLength(20)]
        public string WorkPhone { get; set; }

        [StringLength(20)]
        public string MobilePhone { get; set; }

        public DateTime? Birthday { get; set; }

        [StringLength(256)]
        public string LinkedIn { get; set; }

        [StringLength(256)]
        public string SkypeID { get; set; }

        [StringLength(256)]
        public string WhatsApp { get; set; }

        [StringLength(256)]
        public string Website { get; set; }

        [StringLength(256)]
        public string Facebook { get; set; }

        [StringLength(256)]
        public string Twitter { get; set; }

        [StringLength(256)]
        public string Pinterest { get; set; }

        [StringLength(256)]
        public string YouTube { get; set; }

        [StringLength(256)]
        public string Instagram { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool Deleted { get; set; }

        public int? MemberID { get; set; }

        public virtual Member Member { get; set; }

        public bool Converted { get; set; }
    }

    public class LeadContactType
    {
        [Key]
        public byte LeadContactTypeID { get; set; }

        public string Name { get; set; }

        public DateTime CreatedDT { get; set; }
    }



    public class LeadSearchViewResult
    {
        public List<LeadSearchResult> Leads { get; set; }
        public int TotalResultsCount { get; set; }
    }

    public class LeadSearchResult
    {
        public long LeadID { get; set; }
        public string FullName { get; set; }
        public string CompanyName { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }
        public string Status { get; set; }
        public int? TradeAccountID { get; set; }
        public bool Converted { get; set; }
        public string OwnedBy { get; set; }
        public string OwnedByInitials { get; set; }
        public string LeadSource { get; set; }
        public string SourcedBy { get; set; }
        public string SourcedByInitials { get; set; }
        public DateTime CreatedDT { get; set; }
        public string OpenSince { get; set; }
        public DateTime? ModifiedDT { get; set; }
        public string Modified { get; set; }
        public string CountryCode { get; set; }
        public string Market { get; set; }
        public string County { get; set; }
        public string CurrencyFormattingCulture { get; set; }
        public string CurrencyCode { get; set; }
        public decimal? Potential { get; set; }
        public bool ImmediateOrderRequested { get; set; }
        public string AccountType { get; set; }
    }

    public class PassLeadCheck
    {
        public byte languageId { get; set; }
        public string fullName { get; set; }
        public string email { get; set; }
        public string companyName { get; set; }
        public string postcode { get; set; }
        public int existingLeadsPageSize { get; set; }
        public int existingLeadsPageNumber { get; set; }
        public int existingTradeAccountsPageSize { get; set; }
        public int existingTradeAccountsPageNumber { get; set; }
    }

    public class LeadCheckResult
    {
        public List<LeadCheckExistingLeadResult> existingLeads { get; set; }
        public int totalLeadResults { get; set; }

        public List<LeadCheckExistingTradeAccountResult> existingTradeAccounts { get; set; }
        public int totalTradeAccountResults { get; set; }
    }

    public class LeadCheckExistingLeadResult
    {
        public long LeadID { get; set; }
        public string FullName { get; set; }
        public string CompanyName { get; set; }
        public string Postcode { get; set; }
        public string Email { get; set; }
        public string Status { get; set; }
        public bool Converted { get; set; }
        public string OwnedBy { get; set; }
        public string SourcedBy { get; set; }
        public DateTime? CreatedDT { get; set; }
        public string Market { get; set; }
        public string OpenSince { get; set; }
    }

    public class LeadCheckExistingTradeAccountResult
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string CompanyName { get; set; }
        public string Postcode { get; set; }
        public string Email { get; set; }
        public string Status { get; set; }
        public bool Converted { get; set; }
        public string OwnedBy { get; set; }
        public string SourcedBy { get; set; }
        public DateTime? CreatedDT { get; set; }
        public string Market { get; set; }
        public string OpenSince { get; set; }
    }

    public class PassLeadUpsert
    {
        public long? LeadID { get; set; }
        public byte? LeadStatusID { get; set; }
        public byte? LeadSourceID { get; set; }
        public byte? LeadTypeID { get; set; }
        public byte? StarRating { get; set; }
        public byte? LeadMagnitudeID { get; set; }
        public long? OwnerMemberID { get; set; }
        public byte ChannelID { get; set; }
        public string Description { get; set; }
        public decimal? AnnualRevenue { get; set; }
        public Currency CompanyCurrency { get; set; }
        public string CompanyName { get; set; }
        public short CountryID { get; set; }
        public byte? LanguageID { get; set; }
        public string CompanyRegistration { get; set; }
        public string CompanyVATNumber { get; set; }
        public byte? CompanyTypeID { get; set; }
        public byte? TradingSinceID { get; set; }
        public bool? WillBuyPatternBooks { get; set; }
        public string BankName { get; set; }
        public string BankAddressLine1 { get; set; }
        public string BankAddressLine2 { get; set; }
        public string BankTown { get; set; }
        public string BankCounty { get; set; }
        public string BankPostcode { get; set; }
        public short? BankCountryID { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankSortCode { get; set; }
        public string BankIBAN { get; set; }
        public byte? PaymentTermsID { get; set; }
        public byte? RequestedPaymentTermsID { get; set; }
        public decimal? CreditLimit { get; set; }
        public decimal? RequestedCreditLimit { get; set; }
        public bool CompanyLetterHeadChecked { get; set; }
        public byte? SalesMarketID { get; set; }
        public short? SalesRepresentativeID { get; set; }
        public short? SalesAgentID { get; set; }
        public short? SalesAreaID { get; set; }
        public short? TradePriceListID { get; set; }
        public bool ShouldUpdateTradingSince { get; set; }
        public string Note { get; set; }
        public List<Competitor> BrandsWorkedWith { get; set; }
        public List<PassLeadInterest> LeadInterests { get; set; }
        public PassLeadContactUpsert LeadContact { get; set; }
        public PassLeadAddress LeadAddress { get; set; }
        public byte? AccountTypeID { get; set; }
        public byte? CustomerTypeID { get; set; }
        public bool? HasPatternBookLibrary { get; set; }
        public bool? HasShowroom { get; set; }
        public bool? ShowroomByAppointmentOnly { get; set; }

        //public long? leadContactId { get; set; }
        //public byte? editContactTitleId { get; set; } //
        //public string editContactFullName { get; set; }
        //public bool editContactDecisionMaker { get; set; }
        //public string editContactEmail { get; set; }
        //public string editContactHomePhone { get; set; }
        //public string editContactWorkPhone { get; set; }
        //public string editContactMobilePhone { get; set; }
        //public DateTime? editContactBirthday { get; set; }
        //public string editContactLinkedIn { get; set; }
        //public string editContactSkype { get; set; }
        //public string editContactWhatsApp { get; set; }
        //public string editContactNotes { get; set; }
        //public string editContactWebsiteHref { get; set; }
        //public string editContactFacebook { get; set; }
        //public string editContactTwitter { get; set; }
        //public string editContactPinterest { get; set; }
        //public string editContactYouTube { get; set; }
        //public string editContactInstagram { get; set; }
        //public List<PassLeadContactUpsert> existingLeadContacts { get; set; }
    }

    public class PassLeadPotential
    {
        public long editingLeadId { get; set; }
        public byte editingBrandId { get; set; }
        public byte editingProductTypeGroupId { get; set; }
        public byte? editingCurrencyId { get; set; }
        public long? editingPotentialId { get; set; }
        public short? editingFinancialYear { get; set; }
        public bool editingPotential { get; set; }
        public string editingNote { get; set; }
        public decimal? editingValue { get; set; }
    }

    public class PassLeadInterest
    {
        public byte brandId { get; set; }
        public byte productTypeGroupId { get; set; }
    }

    public class LeadUpsertResult
    {
        public long? LeadID { get; set; }
    }

    public class PassLeadContactUpsert
    {
        public long? leadId { get; set; }
        public long? leadContactId { get; set; }
        public byte? leadContactTypeId { get; set; }
        public byte? titleId { get; set; }
        public bool? decisionMaker { get; set; }
        public string fullName { get; set; }
        public string email { get; set; }
        public string homePhone { get; set; }
        public string workPhone { get; set; }
        public string mobilePhone { get; set; }
        public DateTime? birthday { get; set; }
        public string linkedIn { get; set; }
        public string skypeId { get; set; }
        public string whatsApp { get; set; }
        public string notes { get; set; }
        public string websiteHref { get; set; }
        public string facebook { get; set; }
        public string twitter { get; set; }
        public string pinterest { get; set; }
        public string youTube { get; set; }
        public string instagram { get; set; }
    }

    public class LeadContactUpsertResult
    {
        public long LeadContactID { get; set; }
    }

    public class PassLeadAddress
    {
        public long? leadAddressId { get; set; }
        public long? leadId { get; set; }
        public string label { get; set; }
        public string line1 { get; set; }
        public string line2 { get; set; }
        public string town { get; set; }
        public string county { get; set; }
        public string postcode { get; set; }
        public short countryId { get; set; }
        public bool defaultInvoiceAddress { get; set; }
        public bool defaultDeliveryAddress { get; set; }
    }

    public class LeadAddressUpsertResult
    {
        public long LeadAddressID { get; set; }
    }

    public class LeadPotential
    {
        public long? PotentialID { get; set; }
        public long LeadID { get; set; }
        public byte BrandID { get; set; }
        public byte ProductTypeGroupID { get; set; }
        public short? FinancialYear { get; set; }
        public DateTime CreatedDT { get; set; }
        public string CreatedSince { get; set; }
        public bool Potential { get; set; }
        public DateTime? NoPotentialDT { get; set; }
        public string NoPotentialSince { get; set; }
        public decimal? Value { get; set; }
        public string Note { get; set; }

        [JsonIgnore]
        public virtual Lead Lead { get; set; }
    }

    public class LeadPotentialUpsertResult
    {
        public long LeadPotentialID { get; set; }
        public string NoPotentialSince { get; set; }
    }

    public class LeadDashboardSelectResult 
    {
        public int New { get; set; }
        public int Active { get; set; }
        public int Stagnant { get; set; }
        public int Won { get; set; }
        public int Lost { get; set; }
        public int Junk { get; set; }
        public int Created { get; set; }
        public int Unassigned { get; set; }
        public int Open { get; set; }
        public int Declined { get; set; }
        public decimal NewWorth { get; set; }
        public decimal ActiveWorth { get; set; }
        public decimal StagnantWorth { get; set; }
        public decimal WonWorth { get; set; }
        public decimal LostWorth { get; set; }
        public decimal JunkWorth { get; set; }
        public decimal CreatedWorth { get; set; }
        public decimal UnassignedWorth { get; set; }
        public decimal OpenWorth { get; set; }
        public decimal DeclinedWorth { get; set; }
    }
    
    public class ProductTypeGroup_Brand_Country
    {
        public byte ProductTypeGroupID { get; set; }
        public virtual ProductTypeGroup ProductTypeGroup { get; set; }
        public byte BrandID { get; set; }
        public virtual Brand Brand { get; set; }
        public short CountryID { get; set; }
        public bool Available { get; set; }
    }

    public class Lead_TradeAccount_ProximityCheckResult
    {
        public List<Lead_TradeAccountProximity> Results { get; set; }
    }

    public class Lead_TradeAccountProximity
    {
        public long SortOrder { get; set; }
        public decimal Distance { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string AddressLine4 { get; set; }
        public string Postcode { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public byte? CurrencyID { get; set; }
        public decimal? SalesLY_FullFinancialYear { get; set; }
        public decimal? SalesTY_FullFinancialYear { get; set; }
    }

    public class PassLeadProximitySelect
    {
        public long leadId { get; set; }
        public short proximity { get; set; }
        public short? countryId { get; set; }
    }

    public class PassLeadAddressCoordinates
    {
        public long leadAddressId { get; set; }
        public decimal lat { get; set; }
        public decimal lng { get; set; }
    }

    public class PassLeadNote
    {
        public long LeadID { get; set; }
        public string Note { get; set; }
    }

    public class AccountType
    {
        [Key]
        public byte AccountTypeID { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead> Leads { get; set; }
    }
}