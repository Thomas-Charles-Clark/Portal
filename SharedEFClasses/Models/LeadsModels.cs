using Newtonsoft.Json;

using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Mertexer;
using SharedEFClasses.Models.TradeAccounts;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Linq;

namespace SharedEFClasses.Models.Leads
{
    [Table("PaymentOption", Schema = "portal")]
    public class PaymentOption
    {
        [Key]
        public byte PaymentOptionID { get; set; }
        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<Lead> Leads { get; set; }
    }

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

    public class PassTradeAccountContactID
    {
        public long TradeAccountContactID { get; set; }
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
        public string LeadStatusReason { get; set; }
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
        public byte? WillBuyPatternBooks { get; set; }
        public string VATNumber { get; set; }
        public string VATNumberDisplay { get; set; }
        public string EORI { get; set; }
        public string CompanyNumber { get; set; }
        public long? DefaultInvoiceLeadAddressID { get; set; }
        public long? DefaultDeliveryLeadAddressID { get; set; }
        public long? DefaultVisitLeadAddressID { get; set; }
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
        public byte? PaymentOptionID { get; set; }
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
        public byte? HasPatternBookLibrary { get; set; }
        public byte? HasShowroom { get; set; }
        public byte? ShowroomByAppointmentOnly { get; set; }
        public bool SellOnline { get; set; }
        public short? NumberOfPatternBooksPurchased { get; set; }
        public decimal? FirstOrderValue { get; set; }
        public bool? JoinedPatternBookScheme { get; set; }
        public string OrderConfirmationsEmail { get; set; }
        public string InvoiceStatementsEmail { get; set; }
        public string ProductNewsEventsEmail { get; set; }
        public string PricelistsEmail { get; set; }
        public string PaymentTermsNotes { get; set; }

        public string CreatedSince { get; set; }
        public string ModifiedSince { get; set; }
        public string AssignedSince { get; set; }
        public byte? TradingSinceID { get; set; }
        public decimal? TotalPotential { get; set; }
        public string RetailAppointmentShop { get; set; }
        public string RetailAppointmentTime { get; set; }
        public byte? RetailAppointmentTypeID { get; set; }
        public byte? RetailAppointmentAgendaID { get; set; }
        public DateTime? RetailAppointmentDate { get; set; }

        //public byte? RetailAppointmentActualAgendaID { get; set; }
        public byte? RetailAppointmentActualTypeID { get; set; }
        public string RetailAppointmentActualShop { get; set; }
        public string RetailAppointmentActualTime { get; set; }
        public DateTime? RetailAppointmentActualDate { get; set; }
        public string RetailAppointmentActualAssistant { get; set; }

        public string MertexLanguageCode { get; set; }
        public string TradeAccountClassCode { get; set; }
        public string BankCode { get; set; }
        public int? InsuredCreditLimit { get; set; }
        public byte? PurchaseOrderRequired { get; set; }
        public string TradeAccountGroupCode { get; set; }
        public string HaulierCode { get; set; }
        public string CarriageCode { get; set; }
        public string SampleHaulierCode { get; set; }
        public string SampleCarriageCode { get; set; }
        public string SalesDivisionCode { get; set; }
        public string CreditControllerCode { get; set; }
        public string DeliveryTermsCode { get; set; }
        public short? VATCountryID { get; set; }
        public string TaxID { get; set; } // Swiss only

        public byte? ShouldSendPricelists { get; set; }
        public byte? BelongToGroupAccount { get; set; }


        [JsonIgnore]
        public byte[] USSalesTaxExemptionCertificate { get; set; }
        public string USSalesTaxExemptionCertificateFileType { get; set; }

        [JsonIgnore]
        public byte[] OrderDocument { get; set; }
        public string OrderDocumentFileType { get; set; }

        [NotMapped]
        public string OrderDocumentMimeType
        {
            get
            {
                switch (OrderDocumentFileType)
                {
                    case "jpg":
                    case "jpeg":
                        return "image/jpeg";
                    case "pdf":
                        return "application/pdf";
                    case "xls":
                        return "application/vnd.ms-excel";
                    case "xlsx":
                        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    case "doc":
                        return "application/msword";
                    case "docx":
                        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    default:
                        return "text/plain";
                }
            }
        }

        [NotMapped]
        public string OrderDocumentBase64
        {
            get
            {
                if (OrderDocument == null)
                {
                    return null;
                }
                else
                {
                    return $"data:{OrderDocumentMimeType};base64,{Convert.ToBase64String(OrderDocument)}";
                }
            }
        }

        [NotMapped]
        public string USSalesTaxExemptionCertificateBase64
        {
            get
            {
                if (USSalesTaxExemptionCertificate == null)
                {
                    return null;
                }
                else
                {
                    return $"data:{USSalesTaxExemptionCertificateMimeType};base64,{Convert.ToBase64String(USSalesTaxExemptionCertificate)}";
                }
            }
        }

        [NotMapped]
        public string USSalesTaxExemptionCertificateMimeType
        {
            get
            {
                switch (USSalesTaxExemptionCertificateFileType) {
                    case "jpg":
                    case "jpeg":
                        return "image/jpeg";
                    case "pdf":
                        return "application/pdf";
                    default:
                        return "text/plain";
                }
            }
        }

        public bool? TradeAccountCreationEmail_DisplayAccountManager { get; set; }
        public bool? TradeAccountCreationEmail_DisplayCustomerService { get; set; }
        public bool? TradeAccountCreationEmail_DisplayCreditControl { get; set; }
        public bool? TradeAccountCreationEmail_DisplayB2BRegistration { get; set; }
        public bool? TradeAccountCreationEmail_DisplayLookbook { get; set; }

        // Does setting computed conflict with manually setting the thing?
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool ShouldSendTradeAccountCreationEmail { get; set; }

        [NotMapped]
        public DateTime LoadedDT
        {
            get
            {
                return DateTime.Now;
            }
        }

        [ForeignKey("RetailAppointmentAgendaID")]
        public virtual RetailAppointmentAgenda RetailAppointmentAgenda { get; set; }

        [ForeignKey("RetailAppointmentTypeID")]
        public virtual RetailAppointmentType RetailAppointmentType { get; set; }

        [ForeignKey("RetailAppointmentActualTypeID")]
        public virtual RetailAppointmentType RetailAppointmentActualType { get; set; }

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

        [ForeignKey("DefaultInvoiceLeadAddressID")]
        public virtual LeadAddress InvoiceAddress { get; set; }

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
        public virtual PaymentOption PaymentOption { get; set; }
        public virtual SalesMarket SalesMarket { get; set; }
        public virtual SalesRepresentative SalesRepresentative { get; set; }
        public virtual SalesRepresentative SalesAgent { get; set; }
        public virtual SalesArea SalesArea { get; set; }
        public virtual TradePriceList TradePriceList { get; set; }
        public virtual AccountType AccountType { get; set; }
        public virtual CustomerType CustomerType { get; set; }
        public virtual ICollection<Lead_Tag> Tags { get; set; }

        [JsonIgnore]
        [InverseProperty("Lead")]
        public virtual ICollection<ProjectStakeholder> ProjectStakeholdings { get; set; }

        [InverseProperty("Lead")]
        public virtual ICollection<Lead_TradeAccountCreationEmailAttachment> TradeAccountCreationEmailAttachments { get; set; }
    }

    [Table("RetailAppointmentAgenda", Schema = "dbo")]
    public class RetailAppointmentAgenda
    {
        [Key]
        public byte RetailAppointmentAgendaID { get; set; }
        public string Name { get; set; }
        public byte SortOrder { get; set; }

        [JsonIgnore]
        [InverseProperty("RetailAppointmentAgenda")]
        public virtual ICollection<Lead> Leads { get; set; }
    }

    [Table("RetailAppointmentType", Schema = "dbo")]
    public class RetailAppointmentType
    {
        [Key]
        public byte RetailAppointmentTypeID { get; set; }
        public string Name { get; set; }
        public byte SortOrder { get; set; }

        [JsonIgnore]
        [InverseProperty("RetailAppointmentType")]
        public virtual ICollection<Lead> Leads { get; set; }

        [JsonIgnore]
        [InverseProperty("RetailAppointmentActualType")]
        public virtual ICollection<Lead> ActualLeads { get; set; }
    }

    public class SalesMarket
    {
        public byte SalesMarketID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public short? CountryID { get; set; }
        public byte? LanguageID { get; set; }
        public byte CurrencyID { get; set; }

        public int? MarketManagerMemberID { get; set; }

        [ForeignKey("CurrencyID")]
        public virtual Currency Currency { get; set; }

        [JsonIgnore]
        [InverseProperty("SalesMarket")]
        public virtual ICollection<CarriageCodeMap> CarriageCodeMaps { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead> Leads { get; set; }

        [JsonIgnore]
        public virtual ICollection<SalesArea> SalesAreas { get; set; }

        //[JsonIgnore]
        //public virtual ICollection<SalesRepresentative> SalesRepresentatives { get; set; }

        [JsonIgnore]
        public virtual ICollection<SalesAgent> SalesAgents { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradePriceList> TradePriceLists { get; set; }

        [JsonIgnore]
        public virtual ICollection<PaymentTerms> PaymentTerms { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }

        [JsonIgnore]
        public virtual ICollection<SalesRepresentative_SalesMarket> SalesRepresentative_SalesMarkets { get; set; }

        [JsonIgnore]
        [InverseProperty("SalesMarket")]
        public virtual ICollection<AlternateDeliveryService> AlternateDeliveryServices { get; set; }

        [JsonIgnore]
        [InverseProperty("SalesMarket")]
        public virtual ICollection<Bank_SalesMarket> MertexBanks { get; set; }

        [JsonIgnore]
        [InverseProperty("SalesMarket")]
        public virtual ICollection<TradeAccountCreationEmail> TradeAccountCreationEmails { get; set; }

        [JsonIgnore]
        [InverseProperty("SalesMarket")]
        public virtual ICollection<CreditControlRegion_SalesMarket> CreditControlRegions { get; set; }

        [ForeignKey("MarketManagerMemberID")]
        public virtual Member MarketManager { get; set; }

        [NotMapped]
        public string Label
        {
            get
            {
                return $"{Name} - {Code}";
            }
        }
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
        [Key]
        [Column(Order = 1)]
        public long LeadID { get; set; }
        [Key]
        [Column(Order = 2)]
        public byte BrandID { get; set; }
        [Key]
        [Column(Order = 3)]
        public byte ProductTypeGroupID { get; set; }
        [JsonIgnore]
        public virtual Lead Lead { get; set; }
    }

    public class Lead_Competitor
    {
        [Key]
        [Column(Order = 2)]
        public short CompetitorID { get; set; }

        public virtual Competitor Competitor { get; set; }

        [Key]
        [Column(Order = 1)]
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

        [JsonIgnore]
        [ForeignKey("LeadID")]
        public virtual Lead Lead { get; set; }

        [JsonIgnore]
        [InverseProperty("InvoiceAddress")]
        public virtual ICollection<Lead> InvoiceAddressForLeads { get; set; }
        
        public override string ToString()
        {
            var result = $"{AddressLine1}{(String.IsNullOrEmpty(AddressLine2) ? "" : ",\r\n" + AddressLine2 )}";
            result += $"{(String.IsNullOrEmpty(Town) ? "" : ",\r\n" + Town)}";
            result += $"{(String.IsNullOrEmpty(County) ? "" : ",\r\n" + County)}";
            result += $"{(String.IsNullOrEmpty(PostCode) ? "" : ",\r\n" + PostCode)}";
            result += $"{(String.IsNullOrEmpty(Country?.Name) ? "" : ",\r\n" + Country.Name)}";

            return result;
        }

        public string HTMLDisplay
        {
            get
            {
                var result = $"{AddressLine1}{(String.IsNullOrEmpty(AddressLine2) ? "" : ",<br/>" + AddressLine2)}";
                result += $"{(String.IsNullOrEmpty(Town) ? "" : ",<br/>" + Town)}";
                result += $"{(String.IsNullOrEmpty(County) ? "" : ",<br/>" + County)}";
                result += $"{(String.IsNullOrEmpty(PostCode) ? "" : ",<br/>" + PostCode)}";
                result += $"{(String.IsNullOrEmpty(Country?.Name) ? "" : ",<br/>" + Country.Name)}";

                return result;
            }
        }
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

        [JsonIgnore]
        [InverseProperty("LeadContact")]
        public virtual ICollection<ProjectStakeholder> ProjectStakeholdings { get; set; }
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
        public string RetailAppointmentShop { get; set; }
        public string RetailAppointmentTime { get; set; }
        public DateTime? RetailAppointmentDate { get; set; }
        public string RetailAppointmentActualShop { get; set; }
        public string RetailAppointmentActualTime { get; set; }
        public DateTime? RetailAppointmentActualDate { get; set; }
        public DateTime? TransferredToCreditControlDT { get; set; }
        public string TransferredToCCSince { get; set; }
        public string TradeAccountCode { get; set; }
    }
    
    public class CustomerSearchViewResult
    {
        public List<CustomerResult> Customers { get; set; }
        public int TotalResultsCount { get; set; }
    }
    
    public class CustomerResult
    {
        public long LeadID { get; set; }
        public int? TradeAccountID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Contact { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public long? InvoiceLeadAddressID { get; set; }
        public LeadAddress InvoiceAddress { get; set; }
        public long? VisitLeadAddressID { get; set; }
        public LeadAddress VisitAddress { get; set; }
        public string Website { get; set; }
        public string Market { get; set; }
        public string Area { get; set; }
        public string Rep { get; set; }
        public string Agent { get; set; }
        public string Type { get; set; }
        public string PriceList { get; set; }
        public string CreditTerms { get; set; }
        public string Tags { get; set; }
        public object tags
        {
            get
            {
                return JsonConvert.DeserializeObject(Tags ?? "[]");
            }
        }
    }

    public class MiscCustomerSearchViewResult
    {
        public List<MiscCustomerResult> Customers { get; set; }
        public int TotalResultsCount { get; set; }
    }

    public class MiscCustomerResult
    {
        public int? TradeAccountID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int? LatestOrderNumber { get; set; }
        public DateTime? LastOrderDate { get; set; }
        
        public string DeliveryAddressLine1 { get; set; }
        public string DeliveryAddressLine2 { get; set; }
        public string DeliveryAddressLine3 { get; set; }
        public string DeliveryAddressLine4 { get; set; }
        public string DeliveryPostcode { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }

        //public decimal? SalesLast1Months { get; set; }
        //public decimal? SalesLast3Months { get; set; }
        //public decimal? SalesLast6Months { get; set; }
        public decimal? SalesLast12Months { get; set; }
        //public decimal? SalesLast24Months { get; set; }
        public decimal? SalesLast48Months { get; set; }

        //public int? OrderCountLast1Months { get; set; }
        //public int? OrderCountLast3Months { get; set; }
        //public int? OrderCountLast6Months { get; set; }
        public int? OrderCountLast12Months { get; set; }
        //public int? OrderCountLast24Months { get; set; }
        public int? OrderCountLast48Months { get; set; }

        public string HTMLDisplay
        {
            get
            {
                var result = $"{DeliveryAddressLine1}{(String.IsNullOrEmpty(DeliveryAddressLine2) ? "" : ",<br/>" + DeliveryAddressLine2)}";
                result += $"{(String.IsNullOrEmpty(DeliveryAddressLine3) ? "" : ",<br/>" + DeliveryAddressLine3)}";
                result += $"{(String.IsNullOrEmpty(DeliveryAddressLine4) ? "" : ",<br/>" + DeliveryAddressLine4)}";
                result += $"{(String.IsNullOrEmpty(DeliveryPostcode) ? "" : ",<br/>" + DeliveryPostcode)}";

                return result;
            }
        }
        public string Tags { get; set; }
        public object tags
        {
            get
            {
                return JsonConvert.DeserializeObject(Tags ?? "[]");
            }
        }
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
        public DateTime LoadedDT { get; set; }
        public string LeadStatusReason { get; set; }
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
        public short? VATCountryID { get; set; }
        public string VATNumberDisplay { get; set; }
        public string EORINumber { get; set; }
        public byte? CompanyTypeID { get; set; }
        public byte? TradingSinceID { get; set; }
        public byte? WillBuyPatternBooks { get; set; }
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
        public byte? PaymentOptionID { get; set; }
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
        public List<Tag> Tags { get; set; }
        public List<PassLeadInterest> LeadInterests { get; set; }
        public PassLeadContactUpsert LeadContact { get; set; }
        public PassLeadAddress LeadAddress { get; set; }
        public byte? AccountTypeID { get; set; }
        public byte? CustomerTypeID { get; set; }
        public byte? HasPatternBookLibrary { get; set; }
        public byte? HasShowroom { get; set; }
        public byte? ShowroomByAppointmentOnly { get; set; }
        public bool SellOnline { get; set; }
        public short? NumberOfPatternBooksPurchased { get; set; }
        public decimal? FirstOrderValue { get; set; }
        public bool? JoinedPatternBookScheme { get; set; }
        public string paymentTermsNotes { get; set; }

        public short? miscSalesRepId { get; set; }
        public int? miscTradeAccountId { get; set; }

        public string TradeAccountClass { get; set; }
        public string CreditController { get; set; }
        public string BankCode { get; set; }
        public int? InsuredCreditLimit { get; set; }
        public byte? PurchaseOrderRequired { get; set; }
        public string TradeAccountGroup { get; set; }
        public string SalesDivision { get; set; }
        public string DeliveryTerms { get; set; }
        public string TaxID { get; set; }
        public string MertexLanguageCode { get; set; }

        public bool? ShouldSendTradeAccountCreationEmail { get; set; }

        public bool? TradeAccountCreationEmail_DisplayAccountManager { get; set; }
        public bool? TradeAccountCreationEmail_DisplayCustomerService { get; set; }
        public bool? TradeAccountCreationEmail_DisplayCreditControl { get; set; }
        public bool? TradeAccountCreationEmail_DisplayB2BRegistration { get; set; }
        public bool? TradeAccountCreationEmail_DisplayLookbook { get; set; }

        public List<TradeAccountCreationEmailAttachmentDto> TradeAccountCreationEmail_Attachments { get; set; }

        public byte[] OrderDocument { get; set; }

        public string OrderDocumentFileType { get; set; }

        public byte? ShouldSendPricelists { get; set; }
        public byte? BelongToGroupAccount { get; set; }

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
        public string website { get; set; }
        public string facebook { get; set; }
        public string twitter { get; set; }
        public string pinterest { get; set; }
        public string youTube { get; set; }
        public string instagram { get; set; }
    }

    public class PassTradeAccountContactUpsert
    {
        public int TradeAccountID { get; set; }
        public long? TradeAccountContactID { get; set; }
        public byte? TradeAccountContactTypeID { get; set; }
        public byte? TitleID { get; set; }
        public bool? DecisionMaker { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string HomePhone { get; set; }
        public string WorkPhone { get; set; }
        public string MobilePhone { get; set; }
        public DateTime? Birthday { get; set; }
        public string LinkedIn { get; set; }
        public string SkypeID { get; set; }
        public string WhatsApp { get; set; }
        public string Notes { get; set; }
        public string Website { get; set; }
        public string Facebook { get; set; }
        public string Twitter { get; set; }
        public string Pinterest { get; set; }
        public string YouTube { get; set; }
        public string Instagram { get; set; }
        public string Role { get; set; }
        public bool ReceiveOrderConfirmations { get; set; }
        public bool ReceiveMarketing { get; set; }
        public bool ReceiveFinancial { get; set; }
        public bool ReceivePricelists { get; set; }
    }


    public class LeadContactUpsertResult
    {
        public long LeadContactID { get; set; }
    }

    public class TradeContactUpsertResult
    {
        public long TradeAccountContactID { get; set; }
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

    public class PassNewTradeAccountAddress
    {
        public long? tradeAccountAddressId { get; set; }
        public int tradeAccountId { get; set; }
        public string label { get; set; }
        public string name { get; set; }
        public string addressLine1 { get; set; }
        public string addressLine2 { get; set; }
        public string town { get; set; }
        public string county { get; set; }
        public string postcode { get; set; }
        public short countryId { get; set; }
        public bool setAsDefaultDelivery { get; set; }
        public List<TradeAccountAddress_Tag> tags { get; set; }
    }

    public class LeadAddressUpsertResult
    {
        public long LeadAddressID { get; set; }
    }

    public class LeadPotential
    {
        [Key]
        public long LeadPotentialID { get; set; }
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
        public int TradeAccountFormRedirect { get; set; }
        public int New { get; set; }
        public int Awaiting { get; set; }
        public int Active { get; set; }
        public int Stagnant { get; set; }
        public int Misc { get; set; }
        public int Lost { get; set; }
        public int Junk { get; set; }
        public int Created { get; set; }
        public int Unassigned { get; set; }
        public int Open { get; set; }
        public int Won { get; set; }
        public int Declined { get; set; }
        public int Distributor { get; set; }
        public int ReviewLead { get; set; }
        public int CompleteApplication { get; set; }
        public int SpecifyPaymentTerms { get; set; }
        public decimal TradeAccountFormRedirectWorth { get; set; }
        public decimal NewWorth { get; set; }
        public decimal AwaitingWorth { get; set; }
        public decimal ActiveWorth { get; set; }
        public decimal StagnantWorth { get; set; }
        public decimal MiscWorth { get; set; }
        public decimal LostWorth { get; set; }
        public decimal JunkWorth { get; set; }
        public decimal CreatedWorth { get; set; }
        public decimal UnassignedWorth { get; set; }
        public decimal OpenWorth { get; set; }
        public decimal WonWorth { get; set; }
        public decimal DeclinedWorth { get; set; }
        public decimal DistributorWorth { get; set; }
        public decimal ReviewLeadWorth { get; set; }
        public decimal CompleteApplicationWorth { get; set; }
        public decimal SpecifyPaymentTermsWorth { get; set; }
    }
    
    public class CustomerDashboardSelectResult
    {
        public int All { get; set; }
        public int New { get; set; }
        public int Top { get; set; }
        public int Active { get; set; }
        public int Lapsing { get; set; }
        public int Lapsed { get; set; }
        public int Stop { get; set; }
        public int Specifier { get; set; }

        public decimal AllWorth { get; set; }
        public decimal NewWorth { get; set; }
        public decimal TopWorth { get; set; }
        public decimal ActiveWorth { get; set; }
        public decimal LapsingWorth { get; set; }
        public decimal LapsedWorth { get; set; }
        public decimal StopWorth { get; set; }
        public decimal SpecifierWorth { get; set; }
        
        public decimal AllWorthCurr { get; set; }
        public decimal NewWorthCurr { get; set; }
        public decimal TopWorthCurr { get; set; }
        public decimal ActiveWorthCurr { get; set; }
        public decimal LapsingWorthCurr { get; set; }
        public decimal LapsedWorthCurr { get; set; }
        public decimal StopWorthCurr { get; set; }
        public decimal SpecifierWorthCurr { get; set; }
    }

    public class MiscCustomerDashboardSelectResult
    {
        public int All { get; set; }
        public int Zero { get; set; }
        public int OneOff { get; set; }
        public int Consider { get; set; }
        public decimal AllWorth { get; set; }
        public decimal ZeroWorth { get; set; }
        public decimal OneOffWorth { get; set; }
        public decimal ConsiderWorth { get; set; }
    }

    public class ProductTypeGroup_Brand_Country
    {
        [Key]
        [Column(Order = 1)]
        public byte ProductTypeGroupID { get; set; }
        public virtual ProductTypeGroup ProductTypeGroup { get; set; }
        [Key]
        [Column(Order = 2)]
        public byte BrandID { get; set; }
        public virtual Brand Brand { get; set; }
        [Key]
        [Column(Order = 3)]
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
        public string AccountType { get; set; }
        public string SalesRepresentative { get; set; }
    }

    public class PassLeadProximitySelect
    {
        public long leadId { get; set; }
        public short proximity { get; set; }
        public short? countryId { get; set; }
        public int? memberId { get; set; }
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

    public class LeadStageInformation
    {
        public byte LeadStageID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime? StartDT { get; set; }
        public DateTime? EndDT { get; set; }
        public int? MemberID { get; set; }
        public string FullName { get; set; }
        public string TimeInStage { get; set; }
    }

    public class LeadStageLeadStatus
    {
        public byte LeadStatusID { get; set; }
        public byte SortOrder { get; set; }
        public bool AssignToCreditControl { get; set; }
        public string Name { get; set; }
        public bool Visible { get; set; }
    }

    public class LeadStage_SelectResult
    {
        public List<LeadStageInformation> LeadStages { get; set; }
        
        public List<LeadStageLeadStatus> LeadStageStatuses { get; set; } 

        public byte? CurrentStage { get; set; }

        public LeadStage_SelectResult(List<LeadStageInformation> leadStages,
            List<LeadStageLeadStatus> leadStageStatuses)
        {
            LeadStages = leadStages;
            LeadStageStatuses = leadStageStatuses;
            var stage = LeadStages.Where(p => p.StartDT != null && p.EndDT == null).SingleOrDefault();

            if (stage != null)
            {
                CurrentStage = stage.LeadStageID;
            }

            LeadStages.ForEach(c => {
                if (c.LeadStageID == CurrentStage)
                {
                    c.TimeInStage = Utilities.PortalFramework.DateTimeDistanceBetweenString(c.StartDT, null, true, false);
                }
                else
                {
                    c.TimeInStage = Utilities.PortalFramework.DateTimeDistanceBetweenString(c.StartDT, c.EndDT, true, false);
                }
            });
        }
    }

    public class Lead_Tag
    {
        [Key]
        [Column(Order = 1)]
        public long LeadID { get; set; }

        [Key]
        [Column(Order = 2)]
        public int TagID { get; set; }
        
        [JsonIgnore]
        public virtual Lead Lead { get; set; }
        public virtual Tag Tag { get; set; }
    }

    public class PassCustomerSlicerGroupFilters
    {
        public byte? SalesMarketID { get; set; }
        public short? SalesAreaID { get; set; }
        public short? TradeAccountTypeID { get; set; }
        public int? TradeAccountGroupID { get; set; }
        public bool CurrencyDisplay { get; set; }
    }

    public class PassSalesRepresentativeID 
    {
        public int? SalesRepresentativeID { get; set; }
    }

    public class PassTradeAccountContactFilters
    {
        public string term { get; set; }
        public int TradeAccountID { get; set; }
    }

    public class PassLaunchID
    {
        public short LaunchID { get; set; }
    }

    public class PassProductSearchAutocompleteFilters
    {
        public byte? ProductGroupID { get; set; }
        public byte? ProductGroupID2 { get; set; }
        public short? ItemTypeID { get; set; }
        public string SearchTerm { get; set; }
    }

    public class PassTradeAccountVisitID
    {
        public long TradeAccountVisitID { get; set; }
    }

    public class PassCustomerPatternBook
    {
        public int TradeAccountID { get; set; }
        public string SearchTerm { get; set; }
        public bool? Held { get; set; }
        public byte? ProductFilterID { get; set; }
        public bool? InStock { get; set; }
        public byte? BrandID { get; set; }
    }
}