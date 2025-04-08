using Microsoft.AspNet.OData.Builder;
using Newtonsoft.Json;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Mertexer;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.StockManagement;
using SharedEFClasses.ReturnModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.RegularExpressions;

namespace SharedEFClasses.Models.TradeAccounts
{
    // This was removed 30/08/2018 - I can't imagine why I put it in there in the first place.
    // Leaves properties with k__backingField when delivered as JSON.
    //[Serializable]
    public class TradeAccount
    {
        public int TradeAccountID { get; set; }
        public int? TradeAccountGroupID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public string CountryCode { get; set; }
        public string Market { get; set; }
        public short TradePriceListID { get; set; }
        public string Email { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string AddressLine4 { get; set; }
        public string Postcode { get; set; }
        public string HAULCODE { get; set; }
        public string CARRCODE { get; set; }
        public string SampleHAULCODE { get; set; }
        public string SampleCARRCODE { get; set; }
        public string VATCode { get; set; }
        public string VATNumber { get; set; }
        public string SampleLetterLanguageCode { get; set; }
        public string PhoneNumber { get; set; }

        [NotMapped]
        public string Phone
        {
            get
            {
                return PhoneNumber;
            }
        }

        public DateTime? SalesLastUpdatedDT { get; set; }
        public decimal? SalesLY_FullMonth { get; set; }
        public decimal? GrowthLY_FullMonth { get; set; }
        public decimal? SalesTY_FullMonth { get; set; }
        public decimal? GrowthTY_FullMonth { get; set; }
        public decimal? SalesLY_MonthToDate { get; set; }
        public decimal? GrowthLY_MonthToDate { get; set; }
        public decimal? SalesTY_MonthToDate { get; set; }
        public decimal? GrowthTY_MonthToDate { get; set; }
        public decimal? SalesLY_FullFinancialYear { get; set; }
        public decimal? GrowthLY_FullFinancialYear { get; set; }
        public decimal? SalesTY_FullFinancialYear { get; set; }
        public decimal? GrowthTY_FullFinancialYear { get; set; }
        public decimal? SalesLY_FinancialYearToDate { get; set; }
        public decimal? GrowthLY_FinancialYearToDate { get; set; }
        public decimal? SalesTY_FinancialYearToDate { get; set; }
        public decimal? GrowthTY_FinancialYearToDate { get; set; }
        public decimal? SalesLY_FullCalendarYear { get; set; }
        public decimal? GrowthLY_FullCalendarYear { get; set; }
        public decimal? SalesTY_FullCalendarYear { get; set; }
        public decimal? GrowthTY_FullCalendarYear { get; set; }
        public decimal? SalesLY_CalendarYearToDate { get; set; }
        public decimal? GrowthLY_CalendarYearToDate { get; set; }
        public decimal? SalesTY_CalendarYearToDate { get; set; }
        public decimal? GrowthTY_CalendarYearToDate { get; set; }
        public short? SalesRepresentativeID { get; set; }
        public short? SalesAgentID { get; set; }
        public DateTime? SalesCurrLastUpdatedDT { get; set; }
        public decimal? SalesCurrLY_FullMonth { get; set; }
        public decimal? GrowthCurrLY_FullMonth { get; set; }
        public decimal? SalesCurrTY_FullMonth { get; set; }
        public decimal? GrowthCurrTY_FullMonth { get; set; }
        public decimal? SalesCurrLY_MonthToDate { get; set; }
        public decimal? GrowthCurrLY_MonthToDate { get; set; }
        public decimal? SalesCurrTY_MonthToDate { get; set; }
        public decimal? GrowthCurrTY_MonthToDate { get; set; }
        public decimal? SalesCurrLY_FullFinancialYear { get; set; }
        public decimal? GrowthCurrLY_FullFinancialYear { get; set; }
        public decimal? SalesCurrTY_FullFinancialYear { get; set; }
        public decimal? GrowthCurrTY_FullFinancialYear { get; set; }
        public decimal? SalesCurrLY_FinancialYearToDate { get; set; }
        public decimal? GrowthCurrLY_FinancialYearToDate { get; set; }
        public decimal? SalesCurrTY_FinancialYearToDate { get; set; }
        public decimal? GrowthCurrTY_FinancialYearToDate { get; set; }
        public decimal? SalesCurrLY_FullCalendarYear { get; set; }
        public decimal? GrowthCurrLY_FullCalendarYear { get; set; }
        public decimal? SalesCurrTY_FullCalendarYear { get; set; }
        public decimal? GrowthCurrTY_FullCalendarYear { get; set; }
        public decimal? SalesCurrLY_CalendarYearToDate { get; set; }
        public decimal? GrowthCurrLY_CalendarYearToDate { get; set; }
        public decimal? SalesCurrTY_CalendarYearToDate { get; set; }
        public decimal? GrowthCurrTY_CalendarYearToDate { get; set; }
        public byte? CurrencyID { get; set; }
        public int? SalesRepresentativeRank { get; set; }
        public int? SalesRepresentativeAccounts { get; set; }
        public int? MarketRank { get; set; }
        public int? MarketAccounts { get; set; }
        public byte? SalesMarketID { get; set; }
        public short? SalesAreaID { get; set; }
        public int? GlobalRank { get; set; }
        public int? GlobalAccounts { get; set; }
        public string Website { get; set; }
        public decimal? CreditLimit { get; set; }
        public DateTime? OpenedDate { get; set; }
        public short TradeAreaID { get; set; }
        public byte? LanguageID { get; set; }
        public short? TradeAccountTypeID { get; set; }
        public decimal? SalesLast12Months { get; set; }
        public DateTime? LastOrderDate { get; set; }
        public bool AllowTradePrice { get; set; }
        public byte? MarginBoosterPercentage { get; set; }
        public byte? RetailOnlyDiscountPercentage { get; set; }
        public short CountryID { get; set; }
        public decimal? Longitude { get; set; }
        public decimal? Latitude { get; set; }
        public bool Open { get; set; }
        public DateTime? AddressUpdatedDT { get; set; }
        public DateTime? CoordinatesUpdatedDT { get; set; }
        public string Memo { get; set; }
        public string SampleOwnHaulierAccNo { get; set; }
        public string DeliveryType { get; set; }
        public string UPSAccountNumber { get; set; }
        public string DHLAccountNumber { get; set; }
        public long? DefaultTradeAccountContactID { get; set; }
        public byte? PaymentTermsID { get; set; }
        public long? DefaultInvoiceTradeAccountAddressID { get; set; }
        public long? DefaultDeliveryTradeAccountAddressID { get; set; }
        public long? DefaultVisitTradeAccountAddressID { get; set; }
        public bool MiscellaneousAccount { get; set; }
        public bool HasEndCustomers { get; set; }
        public bool RetailTill { get; set; }

        public string BeforeOrderNotification { get; set; }

        public string UniVerseDataSources { get; set; }

        public bool RetailCustomer { get; set; }

        public bool PurchaseOrderLineNumberRequired { get; set; }

        [Column("CreditStop")]
        public bool CreditStopped { get; set; }







        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [NotMapped]
        public string Label
        {
            get
            {
                return $"{Code} - {Name} - (Rep: {(SalesRepresentative?.Name ?? "Unknown Rep")})";
            }
        }


        [NotMapped]
        public string ShortLabel
        {
            get
            {
                return $"{Code} - {Name}{(CreditStopped ? " (On Stop)" : "")}";
            }
        }

        [ForeignKey("DefaultInvoiceTradeAccountAddressID")]
        public virtual TradeAccountAddress DefaultInvoiceAddress { get; set; }

        [ForeignKey("DefaultDeliveryTradeAccountAddressID")]
        public virtual TradeAccountAddress DefaultDeliveryAddress { get; set; }

        [ForeignKey("DefaultVisitTradeAccountAddressID")]
        public virtual TradeAccountAddress DefaultVisitAddress { get; set; }

        [ForeignKey("TradeAccountGroupID")]
        public virtual TradeAccountGroup TradeAccountGroup { get; set; }

        public virtual TradePriceList TradePriceList { get; set; }

        public virtual SalesRepresentative SalesRepresentative { get; set; }

        public virtual SalesAgent SalesAgent { get; set; }

        public virtual Currency Currency { get; set; }

        public virtual TradeArea TradeArea { get; set; }

        public virtual Language Language { get; set; }

        public virtual TradeAccountType TradeAccountType { get; set; }

        public virtual Country Country { get; set; }

        public virtual TradeLanguage TradeLanguage { get; set; }

        public virtual PaymentTerms PaymentTerms { get; set; }

        public virtual SalesMarket SalesMarket { get; set; }

        [NotMapped]
        public string CompanyName
        {
            get
            {
                return Name;
            }
        }

        [NotMapped]
        public string CurrencyCulture
        {
            get
            {
                return Currency?.FormattingCulture;
            }
        }

        [NotMapped]
        public string CurrencyCode
        {
            get
            {
                return Currency?.Code;
            }
        }

        //[JsonIgnore]
        //public virtual ICollection<Member> Members { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount_Competitor> Competitors { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<TradeAccountPotential> TradeAccountPotential { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount_TradeAdvertiser> TradeAdvertisers { get; set; }
        
        public virtual ICollection<TradeAccountVisit> Visits { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount_Tag> Tags { get; set; }

        [JsonIgnore]
        [InverseProperty("TradeAccount")]
        public virtual ICollection<Member_TradeAccount> RelatedMembers { get; set; }

        [JsonIgnore]
        [InverseProperty("TradeAccount")]
        public virtual ICollection<ProjectStakeholder> ProjectStakeholdings { get; set; }

        public virtual ICollection<TradeAccountNote> Notes { get; set; }
        
        [InverseProperty("TradeAccount")]
        public virtual ICollection<TradeAccountContact> Contacts { get; set; }
        
        [ForeignKey("DefaultTradeAccountContactID")]
        public virtual TradeAccountContact DefaultContact { get; set; }
        
        [JsonIgnore]
        [InverseProperty("TradeAccount")]
        public virtual ICollection<SalesRepresentative_TradeAccount> MiscellaneousTradeAccounts { get; set; }

        [JsonIgnore]
        [InverseProperty("TradeAccount")]
        public virtual ICollection<Member_Basket> Member_Baskets { get; set; }

        [NotMapped]
        public string AdScheme
        {
            get
            {
                return "Pattern book lite [Dummy Data]";
            }
        }

        [JsonIgnore]
        [InverseProperty("TradeAccount")]
        public virtual ICollection<Basket> Baskets { get; set; }

        [JsonIgnore]
        [InverseProperty("TradeAccount")]
        public virtual ICollection<TradeDeliveryContractPrice> TradeDeliveryContractPrices { get; set; }

        [JsonIgnore]
        [InverseProperty("TradeAccount")]
        public virtual ICollection<TradeAccount_TradeHaulier_Override> TradeHaulierOverrides { get; set; }

        [JsonIgnore]
        [InverseProperty("TradeAccount")]
        public virtual ICollection<RingFencePreAllocation> RingFencePreAllocations { get; set; }

        [JsonIgnore]
        [InverseProperty("TradeAccount")]
        public virtual ICollection<Return> Returns { get; set; }

        [JsonIgnore]
        [InverseProperty("TradeAccount")]
        public virtual ICollection<Tuffnells.TuffnellsConsignment> TuffnellsConsignments { get; set; }

        [JsonIgnore]
        [InverseProperty("TradeAccount")]
        public virtual ICollection<Branch> RetailBranches { get; set; }

        [JsonIgnore]
        [InverseProperty("WarehouseToBranchTransferTradeAccount")]
        public virtual ICollection<BranchStockLocation> BranchStockLocationsWarehouseToBranch { get; set; }

        [JsonIgnore]
        [InverseProperty("BranchToWarehouseTransferTradeAccount")]
        public virtual ICollection<BranchStockLocation> BranchStockLocationsBranchToWarehouse { get; set; }

        [JsonIgnore]
        [InverseProperty("TradeAccount")]
        public virtual ICollection<Fenwick.Invoice> FenwickInvoices { get; set; }
    }
    
    [Table("TradeAccountAddress_Tag", Schema = "dbo")]
    public class TradeAccountAddress_Tag
    {
        [Key]
        [Column(Order = 1)]
        public long TradeAccountAddressID { get; set; }

        [Key]
        [Column(Order = 2)]
        public int TagID { get; set; }

        [JsonIgnore]
        [ForeignKey("TradeAccountAddressID")]
        public virtual TradeAccountAddress TradeAccountAddress { get; set; }

        public virtual Tag Tag { get; set; }
    }

    public class TradeAccount_Tag
    {
        [Key]
        [Column(Order = 1)]
        public int TradeAccountID { get; set; }

        [Key]
        [Column(Order = 2)]
        public int TagID { get; set; }

        public virtual TradeAccount TradeAccount { get; set; }
        public virtual Tag Tag { get; set; }
    }

    [Table("TradeAccountNote", Schema = "dbo")]
    public class TradeAccountNote
    {
        [Key]
        public long TradeAccountNoteID { get; set; }
        public int TradeAccountID { get; set; }
        public string Note { get; set; }
        public int AuthorMemberID { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public int? DeletedByMemberID { get; set; }

        [JsonIgnore]
        public virtual TradeAccount TradeAccount { get; set; }

        [ForeignKey("AuthorMemberID")]
        public virtual Member Author { get; set; }
    }

    public class TradeLanguage
    {
        [Key]
        public string LanguageCode { get; set; }
        public string Name { get; set; }
        public byte? LanguageID { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }
    }

    public class TradePriceList
    {
        [Key]
        public short TradePriceListID { get; set; }

        public string Code { get; set; }
        public string Name { get; set; }
        public byte? PriceListID { get; set; }
        public bool FreeSamples { get; set; }
        public short? RetailPriceListID { get; set; }
        public byte TradePriceListTypeID { get; set; }
        public bool VATInclusive { get; set; }
        public byte MarginBoosterPercentage { get; set; }
        public byte RetailOnlyDiscountPercentage { get; set; }
        public byte? MarketID { get; set; }
        public byte? CurrencyID { get; set; }
        public bool Deleted { get; set; }
        public byte? SalesMarketID { get; set; }

        public virtual PriceList PriceList { get; set; }
        //public virtual RetailPriceList RetailPriceList { get; set; }
        public virtual TradePriceListType TradePriceListType { get; set; }
        public virtual Market Market { get; set; }
        public virtual Currency Currency { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead> Leads { get; set; }
        [JsonIgnore]
        public virtual SalesMarket SalesMarket { get; set; }
    }

    public class TradePriceListType
    {
        [Key]
        public byte TradePriceListTypeID { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradePriceList> TradePriceLists { get; set; }
    }

    // This was removed 30/08/2018 - I can't imagine why I put it in there in the first place.
    // Leaves properties with k__backingField when delivered as JSON.
    //[Serializable]
    public class TradeAccountGroup
    {
        public int TradeAccountGroupID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        //[NotMapped]
        //public string ShortLabel
        //{
        //    get
        //    {
        //        return $"{Code} - {Name}";
        //    }
        //}

        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }

        [JsonIgnore]
        [InverseProperty("TradeAccountGroup")]
        public virtual ICollection<AlternateDeliveryService> AlternateDeliveryServices { get; set; }

        [JsonIgnore]
        [InverseProperty("TradeAccountGroup")]
        public virtual ICollection<RingFencePreAllocation> RingFencePreAllocations { get; set; }

        [JsonIgnore]
        [InverseProperty("TradeAccountGroup")]
        public virtual ICollection<MertexTradeAccountClassificationSuperSet> MertexTradeAccountClassificationSuperSetRecords { get; set; }
    }

    public class TradeAccountVisit
    {
        [Key]
        public long TradeAccountVisitID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public int TradeAccountID { get; set; }

        public string Notes { get; set; }

        public DateTime VisitDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public bool OrderConfirmed { get; set; }

        public DateTime? OrderEmailedDT { get; set; }

        public string OrderEmailRecipient { get; set; }

        [JsonIgnore]
        public virtual TradeAccount TradeAccount { get; set; }

        public virtual List<TradeAccountVisit_TradeAccountContact> Attendees { get; set; }

        [InverseProperty("TradeAccountVisit")]
        public virtual List<TradeAccountVisit_Product> ProductsOrdered { get; set; } 
    }

    [Table("TradeAccountVisit_Product", Schema = "dbo")]
    public class TradeAccountVisit_Product
    {
        [Key]
        [Column(Order = 1)]
        public long TradeAccountVisitID { get; set; }

        [Key]
        [Column(Order = 2)]
        public int ProductID { get; set; }

        public short Quantity { get; set; }

        public bool Display { get; set; }

        [JsonIgnore]
        public virtual TradeAccountVisit TradeAccountVisit { get; set; }
        
        public virtual Products.Product Product { get; set; }
    }

    [Table("TradeAccountVisit_TradeAccountContact", Schema = "dbo")]
    public class TradeAccountVisit_TradeAccountContact
    {
        [Key]
        [Column(Order = 1)]
        public long TradeAccountVisitID { get; set; }

        [Key]
        [Column(Order = 2)]
        public long TradeAccountContactID { get; set; }
        
        [JsonIgnore]
        public virtual TradeAccountVisit TradeAccountVisit { get; set; }
        
        public virtual TradeAccountContact TradeAccountContact { get; set; }
    }

    public class MertexOperator
    {
        [Key]
        public string Code { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Member> Members { get; set; }

        [JsonIgnore]
        public virtual ICollection<Basket> Baskets { get; set; }
    }

    public class TradeAccountType
    {
        [Key]
        public short TradeAccountTypeID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }


        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }

        [JsonIgnore]
        [InverseProperty("TradeAccountType")]
        public virtual ICollection<MertexTradeAccountClassificationSuperSet> MertexTradeAccountClassificationSuperSetRecords { get; set; }
    }

    public class TradeArea
    {
        [Key]
        public short TradeAreaID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }
    }

    public class TradeAccountPotential
    {
        [Key]
        public long PotentialID { get; set; }
        public int TradeAccountID { get; set; }
        public byte BrandID { get; set; }
        public byte ProductTypeGroupID { get; set; }
        public short? FinancialYear { get; set; }
        public DateTime CreatedDT { get; set; }
        public bool Potential { get; set; }
        public DateTime? NoPotentialDT { get; set; }
        public decimal? Value { get; set; }
        public string Note { get; set; }
        public int ModifiedMemberID { get; set; }

        [JsonIgnore]
        public virtual TradeAccount TradeAccount { get; set; }

        [JsonIgnore]
        public virtual Brand Brand { get; set; }

        [JsonIgnore]
        public virtual ProductTypeGroup ProductTypeGroup { get; set; }

        [JsonIgnore]
        public virtual Member LastModifiedBy { get; set; }

        public string NoPotentialSince { get; set; }
    }

    public class PassTradeAccountAddressCoordinates
    {
        public int tradeAccountId { get; set; }
        public decimal lat { get; set; }
        public decimal lng { get; set; }
    }

    public class PassTradeAccountPotential
    {
        public int tradeAccountId { get; set; }
        public byte editingBrandId { get; set; }
        public byte editingProductTypeGroupId { get; set; }
        public byte? editingCurrencyId { get; set; }
        public long? editingPotentialId { get; set; }
        public short? editingFinancialYear { get; set; }
        public bool editingPotential { get; set; }
        public string editingNote { get; set; }
        public decimal? editingValue { get; set; }
    }

    public class TradeAccountPotentialUpsertResult
    {
        public long PotentialID { get; set; }
        public string NoPotentialSince { get; set; }
    }

    public class LoadTradeAccountPotentialResult
    {
        public List<TradeAccountPotential> Potentials { get; set; }
        public List<ProductTypeGroup_Brand_Country> ProductTypeGroups { get; set; }
        public decimal? TotalPotential { get; set; }
        public List<TradeAccount_ProductTypeGroup_Brand_Sales> ExistingSales { get; set; }
        public List<TradeAccount_TradeAdvertiser> ExistingTradeAdvertisers { get; set; }
    }

    public class TradeAccount_SalesBy_ProductTypeGroup_Brand_Result
    {
        public int TradeAccountID { get; set; }
        public string Period { get; set; }
        public List<TradeAccount_ProductTypeGroup_Brand_Sales> Sales { get; set; }
    }

    public class TradeAccount_ProductTypeGroup_Brand_Sales
    {
        public byte BrandID { get; set; }
        public byte ProductTypeGroupID { get; set; }
        public decimal? Value { get; set; }
    }

    public class TradeAdvertiser
    {
        [Key]
        public string AdvertiserCode { get; set; }
        public string Description { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount_TradeAdvertiser> TradeAccounts { get; set; }
    }

    public class TradeAccount_TradeAdvertiser
    {
        [Key]
        [Column(Order = 1)]
        public int TradeAccountID { get; set; }
        [Key]
        [Column(Order = 2)]
        public string AdvertiserCode { get; set; }
        public byte Position { get; set; }
        public bool Participation { get; set; }
     
        public virtual TradeAdvertiser Advertiser { get; set; }
           
        [JsonIgnore]
        public virtual TradeAccount TradeAccount { get; set; }
    }

    public class PassTradeAccountSummaryFilters
    {
        public int tradeAccountId { get; set; }
        public byte? brandId { get; set; }
        public byte? productTypeGroupId { get; set; }
    }

    public class TradeAccount_Summary_Result
    {
        public decimal? NetSales_FM { get; set; }
        public decimal? NetSales_LYFM { get; set; }
        public decimal? NetCredits_FM { get; set; }
        public decimal? NetCredits_LYFM { get; set; }
        public int? OrderCount_FM { get; set; }
        public int? OrderCount_LYFM { get; set; }
        public int? SampleOrderCount_FM { get; set; }
        public int? SampleOrderCount_LYFM { get; set; }
        public string NetSalesVariance_FM_LYFM { get; set; }
        public string NetSalesVariance_LYFM_PLYFM { get; set; }
        public string NetCreditsVariance_FM_LYFM { get; set; }
        public string NetCreditsVariance_LYFM_PLYFM { get; set; }
        public string OrderCountVariance_FM_LYFM { get; set; }
        public string OrderCountVariance_LYFM_PLYFM { get; set; }
        public string SampleOrderCountVariance_FM_LYFM { get; set; }
        public string SampleOrderCountVariance_LYFM_PLYFM { get; set; }
        

        public decimal? NetSales_MTD { get; set; }
        public decimal? NetSales_LYMTD { get; set; }
        public decimal? NetCredits_MTD { get; set; }
        public decimal? NetCredits_LYMTD { get; set; }
        public int? OrderCount_MTD { get; set; }
        public int? OrderCount_LYMTD { get; set; }
        public int? SampleOrderCount_MTD { get; set; }
        public int? SampleOrderCount_LYMTD { get; set; }
        public string NetSalesVariance_MTD_LYMTD { get; set; }
        public string NetSalesVariance_LYMTD_PLYMTD { get; set; }
        public string NetCreditsVariance_MTD_LYMTD { get; set; }
        public string NetCreditsVariance_LYMTD_PLYMTD { get; set; }
        public string OrderCountVariance_MTD_LYMTD { get; set; }
        public string OrderCountVariance_LYMTD_PLYMTD { get; set; }
        public string SampleOrderCountVariance_MTD_LYMTD { get; set; }
        public string SampleOrderCountVariance_LYMTD_PLYMTD { get; set; }

        


        public decimal? NetSales_FY { get; set; }
        public decimal? NetSales_LFY { get; set; }
        public decimal? NetCredits_FY { get; set; }
        public decimal? NetCredits_LFY { get; set; }
        public int? OrderCount_FY { get; set; }
        public int? OrderCount_LFY { get; set; }
        public int? SampleOrderCount_FY { get; set; }
        public int? SampleOrderCount_LFY { get; set; }
        public string NetSalesVariance_FY_LFY { get; set; }
        public string NetSalesVariance_LFY_PLFY { get; set; }
        public string NetCreditsVariance_FY_LFY { get; set; }
        public string NetCreditsVariance_LFY_PLFY { get; set; }
        public string OrderCountVariance_FY_LFY { get; set; }
        public string OrderCountVariance_LFY_PLFY { get; set; }
        public string SampleOrderCountVariance_FY_LFY { get; set; }
        public string SampleOrderCountVariance_LFY_PLFY { get; set; }


        public decimal? NetSales_FYTD { get; set; }
        public decimal? NetSales_LFYTD { get; set; }
        public decimal? NetCredits_FYTD { get; set; }
        public decimal? NetCredits_LFYTD { get; set; }
        public int? OrderCount_FYTD { get; set; }
        public int? OrderCount_LFYTD { get; set; }
        public int? SampleOrderCount_FYTD { get; set; }
        public int? SampleOrderCount_LFYTD { get; set; }

        public string NetSalesVariance_FYTD_LFYTD { get; set; }
        public string NetSalesVariance_LFYTD_PLFYTD { get; set; }
        public string NetCreditsVariance_FYTD_LFYTD { get; set; }
        public string NetCreditsVariance_LFYTD_PLFYTD { get; set; }
        public string OrderCountVariance_FYTD_LFYTD { get; set; }
        public string OrderCountVariance_LFYTD_PLFYTD { get; set; }
        public string SampleOrderCountVariance_FYTD_LFYTD { get; set; }
        public string SampleOrderCountVariance_LFYTD_PLFYTD { get; set; }

        
        public decimal? NetSales_CY { get; set; }
        public decimal? NetSales_LCY { get; set; }
        public decimal? NetCredits_CY { get; set; }
        public decimal? NetCredits_LCY { get; set; }
        public int? OrderCount_CY { get; set; }
        public int? OrderCount_LCY { get; set; }
        public int? SampleOrderCount_CY { get; set; }
        public int? SampleOrderCount_LCY { get; set; }

        public string NetSalesVariance_CY_LCY { get; set; }
        public string NetSalesVariance_LCY_PLCY { get; set; }
        public string NetCreditsVariance_CY_LCY { get; set; }
        public string NetCreditsVariance_LCY_PLCY { get; set; }
        public string OrderCountVariance_CY_LCY { get; set; }
        public string OrderCountVariance_LCY_PLCY { get; set; }
        public string SampleOrderCountVariance_CY_LCY { get; set; }
        public string SampleOrderCountVariance_LCY_PLCY { get; set; }
        

        public decimal? NetSales_CYTD { get; set; }
        public decimal? NetSales_LCYTD { get; set; }
        public decimal? NetCredits_CYTD { get; set; }
        public decimal? NetCredits_LCYTD { get; set; }
        public int? OrderCount_CYTD { get; set; }
        public int? OrderCount_LCYTD { get; set; }
        public int? SampleOrderCount_CYTD { get; set; }
        public int? SampleOrderCount_LCYTD { get; set; }

        public string NetSalesVariance_CYTD_LCYTD { get; set; }
        public string NetSalesVariance_LCYTD_PLCYTD { get; set; }
        public string NetCreditsVariance_CYTD_LCYTD { get; set; }
        public string NetCreditsVariance_LCYTD_PLCYTD { get; set; }
        public string OrderCountVariance_CYTD_LCYTD { get; set; }
        public string OrderCountVariance_LCYTD_PLCYTD { get; set; }
        public string SampleOrderCountVariance_CYTD_LCYTD { get; set; }
        public string SampleOrderCountVariance_LCYTD_PLCYTD { get; set; }
    }

    public class PassPriceCheck
    {
        public int tradeAccountId { get; set; }

        public byte? marketId { get; set; }
        public short? tradePriceListId { get; set; }
        public byte? currencyId { get; set; }

        public short? quantity { get; set; }
        public List<int> productIDs { get; set; }

        public PassPriceCheck()
        {
            productIDs = new List<int>();
        }
    }

    public class PassPriceListPriceCheck
    {
        public byte? marketId { get; set; }
        public short? tradePriceListId { get; set; }
        public byte? currencyId { get; set; }
        //public List<int> productIDs { get; set; }

        //public PassPriceListPriceCheck()
        //{
        //    productIDs = new List<int>();
        //}
    }

    public class PassSpecialPriceCheck
    {
        public int? tradeAccountId { get; set; }
        public byte? marketId { get; set; }
        public short? tradePriceListId { get; set; }
        public byte? currencyId { get; set; }
        public List<int> productIDs { get; set; }

        public PassSpecialPriceCheck()
        {
            productIDs = new List<int>();
        }
    }

    public class PassSpecialPriceAgreementCheck
    {
        public int? tradeAccountId { get; set; }
        public byte? marketId { get; set; }
        public short? tradePriceListId { get; set; }
        public byte? currencyId { get; set; }
    }
    
    public class CustomerPrice_EnquiryResult
    {
        public long? ImageID { get; set; }
        public int? ProductPageID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal? RRP { get; set; }
        public decimal? ListPrice { get; set; }
        public decimal? CustomerPrice { get; set; }
        public bool Clearance { get; set; }
        public decimal? Discount { get; set; }
        public short? QtyBreak { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public decimal? Cost { get; set; }
        public decimal? TargetMargin { get; set; }
        public decimal? GrossMargin { get; set; }
        public short LaunchID { get; set; }
        public byte BrandID { get; set; }
        public byte ProductTypeID { get; set; }
        public short? ItemTypeID { get; set; }
        public string PricingLevel { get; set; }
        public string AgreementType { get; set; }
        public long DefaultSortOrder { get; set; }
        public byte CurrencyID { get; set; }
        public short TradePriceListID { get; set; }

        // Determined after the query
        public string Launch { get; set; }
        public string Brand { get; set; }
        public string ProductType { get; set; }
        public string ItemType { get; set; }
        public string ClearanceString { get; set; }
        public byte MarginDisparity { get; set; } // 5 = below target, 10 == on target or above.
        public string Currency { get; set; }
        public string CurrencyFormattingCulture { get; set; }
        public string CurrencyCode { get; set; }
        public string TradePriceList { get; set; }
    }

    public class CustomerPriceResult
    {
        public List<CustomerPrice_EnquiryResult> Results { get; set; }
    }
    
    public class ListPriceResult
    {
        public List<ListPrice_EnquiryResult> Results { get; set; }
    }

    public class ListPrice_EnquiryResult
    {
        public long? ImageID { get; set; }
        public int? ProductPageID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal? RRP { get; set; }
        public decimal? ListPrice { get; set; }
        public bool Clearance { get; set; }
        public decimal? Cost { get; set; }
        public decimal? TargetMargin { get; set; }
        public decimal? GrossMargin { get; set; }
        public short LaunchID { get; set; }
        public byte BrandID { get; set; }
        public byte ProductTypeID { get; set; }
        public short? ItemTypeID { get; set; }
        public byte? MarketID { get; set; }
        public byte CurrencyID { get; set; }
        public short TradePriceListID { get; set; }
        public string PricingLevel { get; set; }
        public long DefaultSortOrder { get; set; }

        // Determined after the query
        public string Launch { get; set; }
        public string Brand { get; set; }
        public string ProductType { get; set; }
        public string ItemType { get; set; }
        public string Market { get; set; }
        public string TradePriceList { get; set; }
        public string Currency { get; set; }
        public string ClearanceString { get; set; }
        public byte MarginDisparity { get; set; }
        public string CurrencyFormattingCulture { get; set; }
        public string CurrencyCode { get; set; }
    }

    public class ContractPriceResult
    {
        public List<ContractPrice_EnquiryResult> Results { get; set; }
    }

    public class ContractPrice_EnquiryResult
    {
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
        public long? ImageID { get; set; }
        public int? ProductPageID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal? RRP { get; set; }
        public decimal? ListPrice { get; set; }
        public decimal? CustomerPrice { get; set; }
        public bool Clearance { get; set; }
        public decimal? Discount { get; set; }
        public short? QtyBreak { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public decimal? Cost { get; set; }
        public decimal? TargetMargin { get; set; }
        public decimal? GrossMargin { get; set; }
        public short LaunchID { get; set; }
        public byte BrandID { get; set; }
        public byte ProductTypeID { get; set; }
        public short? ItemTypeID { get; set; }
        public byte? MarketID { get; set; }
        public byte CurrencyID { get; set; }
        public short TradePriceListID { get; set; }
        public string PricingLevel { get; set; }
        public string AgreementType { get; set; }
        public long DefaultSortOrder { get; set; }

        // Determined after the query
        public string Launch { get; set; }
        public string Brand { get; set; }
        public string ProductType { get; set; }
        public string ItemType { get; set; }
        public string Market { get; set; }
        public string TradePriceList { get; set; }
        public string Currency { get; set; }
        public string ClearanceString { get; set; }
        public byte MarginDisparity { get; set; }
        public string CurrencyFormattingCulture { get; set; }
        public string CurrencyCode { get; set; }
    }

    public class ContractAgreementResult
    {
        public List<ContractAgreement_EnquiryResult> Results { get; set; }
    }

    public class ContractAgreement_EnquiryResult
    {
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
        public decimal? CustomerPrice { get; set; }
        public decimal? Discount { get; set; }
        public short QtyBreak { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public string Status { get; set; }
        public int? ProductID { get; set; }
        public short? QualityID { get; set; }
        public byte? BrandID { get; set; }
        public short? ItemTypeID { get; set; }
        public byte? ProductGroupID { get; set; }
        public byte? MarketID { get; set; }
        public byte CurrencyID { get; set; }
        public short TradePriceListID { get; set; }
        public string PricingLevel { get; set; }
        public string AgreementType { get; set; }
        public long DefaultSortOrder { get; set; }

        // Determined after the query
        public string Product { get; set; }
        public string Quality { get; set; }
        public string Brand { get; set; }
        public string ItemType { get; set; }
        public string ProductGroup { get; set; }
        public string Market { get; set; }
        public string Currency { get; set; }
        public string TradePriceList { get; set; }
        public string ClearanceString { get; set; }
        public string CurrencyFormattingCulture { get; set; }
        public string CurrencyCode { get; set; }
    }

    public class ProductNoPricesResult
    {
        public List<ProductNoPrices_EnquiryResult> Results { get; set; }
    }

    public class ProductNoPrices_EnquiryResult
    {
        public long? ImageID { get; set; }
        public int? ProductPageID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal? RRP { get; set; }
        public bool Clearance { get; set; }
        public decimal? Cost { get; set; }
        public decimal? TargetMargin { get; set; }
        public short LaunchID { get; set; }
        public byte BrandID { get; set; }
        public byte ProductTypeID { get; set; }
        public short? ItemTypeID { get; set; }
        public byte? MarketID { get; set; }
        public byte CurrencyID { get; set; }
        public short TradePriceListID { get; set; }
        public string PricingLevel { get; set; }
        public long DefaultSortOrder { get; set; }
        
        // Determined after the query
        public string Launch { get; set; }
        public string Brand { get; set; }
        public string ProductType { get; set; }
        public string ItemType { get; set; }
        public string Market { get; set; }
        public string Currency { get; set; }
        public string TradePriceList { get; set; }
        public string ClearanceString { get; set; }
        public string CurrencyFormattingCulture { get; set; }
        public string CurrencyCode { get; set; }
    }

    public class LowMarginResult
    {
        public List<LowMargin_EnquiryResult> Results { get; set; }
    }

    public class LowMargin_EnquiryResult
    {
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
        public int? ProductPageID { get; set; }
        public long? ImageID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal? RRP { get; set; }
        public decimal? ListPrice { get; set; }
        public decimal? CustomerPrice { get; set; }
        public bool Clearance { get; set; }
        public decimal? Discount { get; set; }
        public short? QtyBreak { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public decimal? Cost { get; set; }
        public decimal? TargetMargin { get; set; }
        public decimal? GrossMargin { get; set; }
        public short LaunchID { get; set; }
        public byte BrandID { get; set; }
        public byte ProductTypeID { get; set; }
        public short? ItemTypeID { get; set; }
        public byte? MarketID { get; set; }
        public byte CurrencyID { get; set; }
        public short TradePriceListID { get; set; }
        public string PricingLevel { get; set; }
        public string AgreementType { get; set; }
        public long DefaultSortOrder { get; set; }
        
        // Determined after the query
        public string Launch { get; set; }
        public string Brand { get; set; }
        public string ProductType { get; set; }
        public string ItemType { get; set; }
        public string Market { get; set; }
        public string Currency { get; set; }
        public string TradePriceList { get; set; }
        public string ClearanceString { get; set; }
        public byte MarginDisparity { get; set; }
        public string CurrencyFormattingCulture { get; set; }
        public string CurrencyCode { get; set; }
    }
    
    public class Market
    {
        [Key]
        public byte MarketID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public short? CountryID { get; set; }
        public byte? LanguageID { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradePriceList> TradePriceLists { get; set; }
    }

    [Table("TradeAccountRelationshipType", Schema = "dbo")]
    public class TradeAccountRelationshipType
    {
        [Key]
        public byte TradeAccountRelationshipTypeID { get; set; }

        public string Name { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<Member_TradeAccount> Relationships { get; set; }
    }

    [Table("Member_TradeAccount", Schema = "mbr")]
    public class Member_TradeAccount
    {
        [Key]
        [Column(Order = 1)]
        public int MemberID { get; set; }

        [Key]
        [Column(Order = 2)]
        public int TradeAccountID { get; set; }

        public byte TradeAccountRelationshipTypeID { get; set; }

        public bool Default { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [ForeignKey("MemberID")]
        public virtual Member Member { get; set; }

        [JsonIgnore]
        [ForeignKey("TradeAccountID")]
        public virtual TradeAccount TradeAccount { get; set; }

        [JsonIgnore]
        [ForeignKey("TradeAccountRelationshipTypeID")]
        public virtual TradeAccountRelationshipType TradeAccountRelationshipType { get; set; }
    }
    
    [Table("Filter_TradeAccount", Schema = "portal")]
    public class TradeAccountFilter
    {
        [Key]
        public long TradeAccountFilterID { get; set; }
        public byte SalesMarketID { get; set; }
        public short SalesAreaID { get; set; }
        public short? SalesAgentID { get; set; }
        public short SalesRepresentativeID { get; set; }
        public string SalesMarketName { get; set; }
        public string SalesAreaName { get; set; }
        public string SalesAgentName { get; set; }
        public string SalesRepresentativeName { get; set; }
        public byte CurrencyID { get; set; }
        public string CurrencyName { get; set; }
    }
    
    public class TradeAccountFilterSelectResult
    {
        public byte SalesMarketID { get; set; }
        public short? SalesAreaID { get; set; }
        public short? SalesAgentID { get; set; }
        public short SalesRepresentativeID { get; set; }
        public string SalesMarketName { get; set; }
        public string SalesAreaName { get; set; }
        public string SalesAgentName { get; set; }
        public string SalesRepresentativeName { get; set; }
        public byte? CurrencyID { get; set; }
        public string CurrencyName { get; set; }
        public string CurrencyCode { get; set; }
        public string FormattingCulture { get; set; }
    }

    public class PassTradeAccountFilterParams
    {
        public bool IncludeArea { get; set; }
        public bool IncludeCurrency { get; set; }
    }
    
    public class SalesMarketSlicerTuple
    {
        public string Name { get; set; }
        public byte SalesMarketID { get; set; }
        public byte? CurrencyID { get; set; }
        public string CurrencyName { get; set; }
        public string CurrencyCode { get; set; }
        public string FormattingCulture { get; set; }
    }

    public class SalesMarketTupleComparer : IEqualityComparer<SalesMarketSlicerTuple>
    {
        public bool Equals(SalesMarketSlicerTuple x, SalesMarketSlicerTuple y)
        {
            return (x.Name == y.Name) &&
                   (x.SalesMarketID == y.SalesMarketID) &&
                   (x.CurrencyID == y.CurrencyID) &&
                   (x.CurrencyName == y.CurrencyName);
            // CurrencyCode and FormattingCulture are excluded from this doohickey for very good reasons
            // I'll document them as soon as I remember what they are....
            // Wait doesn't that mean that... when we... distinct we're collapsing what might be multiple... yes
            // necessarily it does 
            // but we don't CARE what the CurrencyCode or FormattingCulture is if we've got Sterling selected.
            // In fact we're very much interested in discarding that information entirely; when Sterling is seleceted
            // that's what you're formatting as.
        }

        public int GetHashCode(SalesMarketSlicerTuple obj)
        {
            unchecked
            {
                int hash = 27;

                hash = (13 * hash) + ((obj.Name == null) ? 0 : obj.Name.GetHashCode());
                hash = (13 * hash) + obj.SalesMarketID.GetHashCode();
                hash = (13 * hash) + ((obj.CurrencyID == null) ? 0 : obj.CurrencyID.Value.GetHashCode());
                hash = (13 * hash) + ((obj.CurrencyName == null) ? 0 : obj.CurrencyName.GetHashCode());

                return hash;
            }
        }
    }
    
    [Table("TradeAccountContact", Schema = "dbo")]
    public class TradeAccountContact
    {
        [Key]
        public long TradeAccountContactID { get; set; }

        public byte? TradeAccountContactTypeID { get; set; }

        [ForeignKey("TradeAccountContactTypeID")]
        public virtual LeadContactType TradeAccountContactType { get; set; }

        public bool? DecisionMaker { get; set; }

        public int TradeAccountID { get; set; }

        [JsonIgnore]
        [ForeignKey("TradeAccountID")]
        public virtual TradeAccount TradeAccount { get; set; }

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

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public int? MemberID { get; set; }
        
        [JsonIgnore]
        public virtual Member Member { get; set; }
        
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Converted { get; set; }

        [JsonIgnore]
        public ICollection<TradeAccountVisit_TradeAccountContact> TradeAccountVisits { get; internal set; }
        
        [InverseProperty("TradeAccountContact")]
        public ICollection<TradeAccountContact_Tag> Tags { get; set; }
    }

    [Table("TradeAccountContact_Tag", Schema = "dbo")]
    public class TradeAccountContact_Tag
    {
        [Key]
        [Column(Order = 1)]
        public long TradeAccountContactID { get; set; }

        [Key]
        [Column(Order = 2)]
        public int TagID { get; set; }
        
        [JsonIgnore]
        [ForeignKey("TradeAccountContactID")]
        public virtual TradeAccountContact TradeAccountContact { get; set; }
        
        public virtual Tag Tag { get; set; }
    }

    public class PatternBookSaturation_EnquiryResult
    {
        public long SortOrder { get; set; }
        public string Code { get; set; }
        public string ProductStatus { get; set; }
        public short Quantity { get; set; }
        public DateTime? LastPurchasedDT { get; set; }
        public string Name { get; set; }
        public string Launch { get; set; }
        public string Brand { get; set; }
        public string StockStatus { get; set; }
        public decimal? FreeStock { get; set; }
        public decimal? POFreeStock { get; set; }
        public DateTime? PODueDate { get; set; }
    }
    
    [Table("TradeAccountAddress", Schema = "dbo")]
    public class TradeAccountAddress
    {
        [Key]
        public long TradeAccountAddressID { get; set; }

        public int TradeAccountID { get; set; }

        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }
        public string Postcode { get; set; }
        public short CountryID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }
        public DateTime ModifiedDT { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public DateTime? CoordinateModifiedDT { get; set; }
        public string Label { get; set; }
        public string GooglePanoramaLink { get; set; }
        public DateTime? GooglePanoramaModifiedDT { get; set; }
        public bool Editable { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        [ForeignKey("TradeAccountID")]
        public virtual TradeAccount TradeAccount { get; set; }

        [JsonIgnore]
        [InverseProperty("DefaultInvoiceAddress")]
        public virtual ICollection<TradeAccount> TradeAccountsInvoice { get; set; }

        [JsonIgnore]
        [InverseProperty("DefaultDeliveryAddress")]
        public virtual ICollection<TradeAccount> TradeAccountsDelivery { get; set; }

        [JsonIgnore]
        [InverseProperty("DefaultVisitAddress")]
        public virtual ICollection<TradeAccount> TradeAccountsVisit { get; set; }
        
        [InverseProperty("TradeAccountAddress")]
        public virtual ICollection<TradeAccountAddress_Tag> Tags { get; set; }
    }
    
    public class TradeAccountContactType
    {
        public byte TradeAccountContactTypeID { get; set; }
        public string Name { get; set; }
    }

    [Table("TradeAccount_TradeHaulier_Override", Schema = "adm")]
    public class TradeAccount_TradeHaulier_Override
    {
        [Key]
        public int TradeAccountTradeHaulierOverrideID { get; set; }

        public int TradeAccountID { get; set; }

        public string HAULCODE { get; set; }

        public string HaulierTransportAccountCode { get; set; }

        public string HaulierDutyTaxAccountCode { get; set; }

        [JsonIgnore]
        [ForeignKey("TradeAccountID")]
        [AutoExpand]
        public virtual TradeAccount TradeAccount { get; set; }
    }

    public class TradeAdminInviteViabilityResult
    {
        public short? CountryID { get; set; }
        public byte? LanguageID { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string RegistrationStatus { get; set; }
        public bool Viable { get; set; }
        public List<string> UnviabilityReasons { get; set; }

        public TradeAdminInviteViabilityResult()
        {
            UnviabilityReasons = new List<string>();
        }
    }

    public class InviteToB2BResult
    {
        public B2BInviteInitialState InitialState { get; set; }
        public B2BInviteProblems InviteErrors { get; set; }
        public B2BInviteEmailParts EmailParts { get; set; }
    }

    public class ResendInviteResult
    {
        public string sendResult { get; set; }
        public int daysRemainingToRegister { get; set; }
    }

    public class B2BInviteInitialState
    {
        public int TradeAccountID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string AccountEmail { get; set; }
        public short TradePriceListID { get; set; }
        public bool GoodToGo { get; set; }
        public string ExtantPermissionsOnAccount { get; set; }
    }

    public class B2BInviteProblems
    {
        public int TradeAccountID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public short TradePriceListID { get; set; }
        public bool GoodToGo { get; set; }
        public string ExtantPermissionsOnAccount { get; set; }
        public bool InvalidAccount { get; set; }
        public bool CurrencyMismatch { get; set; }
        public bool InvalidMarket { get; set; }
        public string TradeAccountMarket { get; set; }
        public string PriceListMismatch { get; set; }
        public string TradeAccountCurrency { get; set; }
        public string PriceListCurrency { get; set; }
        public string ErrorMessage { get; set; }
    }

    public class B2BInviteEmailParts
    {
        public string EmailSubject { get; set; }
        public string EmailContents { get; set; }

        [NotMapped]
        public string EmailSubjectPlainText
        {
            get
            {
                return Regex.Replace(Regex.Replace(Regex.Replace(EmailSubject ?? "", "/<\\/p>/ig", "%0D%0A"), "/(<([^>]+)>)/ig", ""), "\\s/ig", "%20");
            }
            set { }
        }

        [NotMapped]
        public string EmailContentsPlainText
        {
            get
            {
                return Regex.Replace(Regex.Replace(Regex.Replace(Regex.Replace(Regex.Replace(Regex.Replace(EmailContents ?? "", "<\\/a><\\/p>", "</a>%0D%0A%0D%0A"), "\\.<\\/p>", ".%0D%0A%0D%0A"), ",<\\/p>", ",%0D%0A%0D%0A"), "<\\/p>", "%0D%0A"), "(<([^>]+)>)", ""), "\\s", "%20");
            }
            set { }
        }
    }

    public class tradeAccountUsersModel
    {
        public tradeAccountDetail tradeAccountDetail { get; set; }
        public List<tradeAccountAdmin> administrators { get; set; }
        public List<tradeAccountUser> users { get; set; }
        public bool userIsAdmin { get; set; }
    }

    public class tradeAccountDetail
    {
        public int TradeAccountID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string AddressLine4 { get; set; }
        public string Postcode { get; set; }
        public string CountryCode { get; set; }
        public string PhoneNumber { get; set; }
        public string CustomerServicesPhoneNumber { get; set; }
        public string CustomerServicesEmail { get; set; }
        public string CreditControlPhoneNumber { get; set; }
        public string SalesRepresentativeName { get; set; }
        public string SalesRepresentativeEmail { get; set; }
        public short TradeAccountTypeID { get; set; }
    }

    public class tradeAccountAdmin
    {
        public int MemberID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public bool TradePermissionAccountAdmin { get; set; }
        public bool TradePermissionPlaceOrder { get; set; }
        public bool TradePermissionRequestSample { get; set; }
        public bool TradePermissionViewAccounts { get; set; }
        public bool TradePermissionDownloadPricelistsBrochures { get; set; }
        public bool TradePermissionDownloadProductFeeds { get; set; }
        public bool ReadOnly { get; set; }
        public bool TradeAuthenticationComplete { get; set; }
        public int DaysRemainingToRegister { get; set; }
        public bool DisplayTradePrice { get; set; }
    }

    public class tradeAccountUser
    {
        public int MemberID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public bool TradePermissionAccountAdmin { get; set; }
        public bool TradePermissionPlaceOrder { get; set; }
        public bool TradePermissionRequestSample { get; set; }
        public bool TradePermissionViewAccounts { get; set; }
        public bool TradePermissionDownloadPricelistsBrochures { get; set; }
        public bool TradePermissionDownloadProductFeeds { get; set; }
        public bool ReadOnly { get; set; }
        public bool TradeAuthenticationComplete { get; set; }
        public int DaysRemainingToRegister { get; set; }
        public bool DisplayTradePrice { get; set; }
    }

    public class PassCustomerInvite
    {
        public int tradeAccountId { get; set; }
        public string name { get; set; }
        public string email { get; set; }
    }

    public class PassResendB2BInvite
    {
        public int memberId { get; set; }
    }

    public class TradeAccountVATNumber
    {
        public string VATNumber { get; set; }
        public string CountryCode { get; set; }
        public bool Errored { get; set; }
    }

    public class TradeAccountAddressResponse
    {
        public InvoiceAddress InvoiceAddress { get; set; }
        public DeliveryAddress DefaultDeliveryAddress { get; set; }
        public List<DeliveryAddress> DeliveryAddresses { get; set; } 

        public TradeAccountAddressResponse()
        {
            InvoiceAddress = new InvoiceAddress();
            DefaultDeliveryAddress = new DeliveryAddress();
            DeliveryAddresses = new List<DeliveryAddress>();
        }
    }

    /*
    
        Dated stuff from MertexerV2SQL

     */

    public class tradeAccountEmailsModel
    {
        public string OrderConfirmations { get; set; }
        public string InvoicesStatements { get; set; }
        public string ProductNewsEvents { get; set; }
        public string Pricelists { get; set; }
    }


    public class MiscellaneousInvoiceAddress
    {
        public string FullName { get; set; }
        public string CompanyName { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }
        public string Postcode { get; set; }
        public string PhoneNumber { get; set; }
        public short? CountryID { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; }
        public string PotentialCountryCode { get; set; }
        public string Email { get; set; }
    }

    public class PassPCAPredictFind
    {
        public string id { get; set; }
        public string text { get; set; }
        public string container { get; set; }
        public string origin { get; set; }
        public string countries { get; set; }
        public string limit { get; set; }
        public string language { get; set; }
        public string tradeAccountCode { get; set; }
        public string endCustomerTradeAccountCode { get; set; }
    }

    public class MertexPCALookupResult
    {
        public readonly string Type = "Mertex";

        public int DeliveryReferenceID { get; set; }

        public string DeliveryReference { get; set; }

        public string TradeAccountCode { get; set; }

        public string Label
        {
            get
            {
                var lines = new List<string>()
                {
                    Name,
                    Company,
                    Line1,
                    Line2,
                    City,
                    Province,
                    PostalCode
                }.ToList();

                lines.RemoveAll(c => String.IsNullOrEmpty(c));

                var displayLine = String.Join(", ", lines);

                return $"{DeliveryReference} - {displayLine}";
            }
        }

        public string Name { get; set; }
        public string Company { get; set; }
        public string Line1 { get; set; }
        public string Line2 { get; set; }
        public string City { get; set; }
        public string Province { get; set; } // County
        public string PostalCode { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Country { get; set; }
        public short? CountryID { get; set; }

        public string MD5Hash
        {
            get
            {
                string result = null;

                using (var md5 = System.Security.Cryptography.MD5.Create())
                {
                    void addString(System.Security.Cryptography.ICryptoTransform transform, string inputString)
                    {
                        var buff = System.Text.Encoding.UTF8.GetBytes(inputString);
                        transform.TransformBlock(buff, 0, buff.Length, buff, 0);
                    }

                    addString(md5, String.IsNullOrEmpty(TradeAccountCode) ? "|" : $"{TradeAccountCode}|");
                    addString(md5, String.IsNullOrEmpty(Name) ? "|" : $"{Name}|");
                    addString(md5, String.IsNullOrEmpty(Company) ? "|" : $"{Company}|");
                    addString(md5, String.IsNullOrEmpty(Line1) ? "|" : $"{Line1}|");
                    addString(md5, String.IsNullOrEmpty(Line2) ? "|" : $"{Line2}|");
                    addString(md5, String.IsNullOrEmpty(City) ? "|" : $"{City}|");
                    addString(md5, String.IsNullOrEmpty(Province) ? "|" : $"{Province}|");
                    addString(md5, String.IsNullOrEmpty(PostalCode) ? "|" : $"{PostalCode}|");
                    addString(md5, $"{Country}");

                    md5.TransformFinalBlock(new byte[0], 0, 0);

                    var sb = new System.Text.StringBuilder();

                    foreach (var b in md5.Hash)
                    {
                        sb.Append(b.ToString("x2"));
                    }

                    result = sb.ToString();
                }

                return result;
            }
        }
    }

    public class PassAutocompleteTerm
    {
        [StringLength(50)]
        public string term { get; set; }
        public string searchTerm { get; set; }
        public int? tradeAccountId { get; set; }
        public string tradeAccountCode { get; set; }
        public short? marketId { get; set; }
        public short? tradePriceListId { get; set; }
        public byte? currencyId { get; set; }
        public bool includePreLaunch { get; set; }
    }

    public class PassDuplicateLineCheck
    {
        public long basketId { get; set; }
        public string tradeAccountCode { get; set; }
        public string lineReference { get; set; }
        public int productId { get; set; }
        public string productCode { get; set; }
        public decimal quantity { get; set; }
    }

    public class PassOrderReference
    {
        public string tradeAccountCode { get; set; }
        public string OrderReference { get; set; }
    }

    public class TradeAccountInvoiceTerms
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class PassVATNumber
    {
        public long basketId { get; set; }
        public string tradeAccountLabel { get; set; }
        public string market { get; set; }

        public string vatNumber { get; set; }
        public string countryCode { get; set; }

        public string requesterVATNumber { get; set; }
        public string requesterCountryCode { get; set; }
    }

    public class PassEORINumber
    {
        public string tradeAccountLabel { get; set; }
        public string market { get; set; }
        public long basketId { get; set; }
        public string eoriNumber { get; set; }
    }

    public class TradeAccountAddressReturn
    {
        public TradeAccountInvoiceAddress InvoiceAddress { get; set; }
        public TradeAccountPrimaryAddress PrimaryAddress { get; set; }
        public List<TradeAccountPrimaryAddress> PrimaryAddresses { get; set; } // this retained because the sample ordering app uses it...
        public List<TradeAccountSecondaryAddress> SecondaryAddresses { get; set; }

        public TradeAccountAddressReturn()
        {
            InvoiceAddress = new TradeAccountInvoiceAddress();
            PrimaryAddress = new TradeAccountPrimaryAddress();
            PrimaryAddresses = new List<TradeAccountPrimaryAddress>();
        }
    }

    public class TradeAccountPrimaryAddress
    {
        public string DeliveryReference { get; set; }
        public string CompanyName { get; set; }
        public string Name { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string AddressLine4 { get; set; }
        public string Postcode { get; set; }
        public string Country { get; set; }
        public string CountryCode { get; set; }
        public short? CountryID { get; set; }
        public bool? EU { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }

    public class TradeAccountSecondaryAddress : TradeAccountPrimaryAddress
    {
        public bool Default { get; set; }
    }

    public class TradeAccountInvoiceAddress : TradeAccountPrimaryAddress
    {

    }

    public class EndCustomerAddress : TradeAccountPrimaryAddress
    {
        public int TradeAccountID { get; set; }
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
    }

    public class PassTradeAccountNumber
    {
        public string accountNumber { get; set; }
    }
}