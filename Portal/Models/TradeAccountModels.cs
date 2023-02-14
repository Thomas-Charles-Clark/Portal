using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portal.Models
{
    [Serializable]
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
        public string SampleLetterLanguageCode { get; set; }
        public string PhoneNumber { get; set; }
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

        public virtual TradeAccountGroup TradeAccountGroup { get; set; }
        public virtual TradePriceList TradePriceList { get; set; }
        public virtual SalesRepresentative SalesRepresentative { get; set; }
        public virtual Currency Currency { get; set; }
        public virtual TradeArea TradeArea { get; set; }
        public virtual Language Language { get; set; }
        public virtual TradeAccountType TradeAccountType { get; set; }
        public virtual Country Country { get; set; }
        public virtual TradeLanguage TradeLanguage { get; set; }

        [JsonIgnore]
        public virtual ICollection<Member> Members { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount_Competitor> Competitors { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<TradeAccountPotential> TradeAccountPotential { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount_TradeAdvertiser> TradeAdvertisers { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccountVisit> Visits { get; set; }
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

    [Serializable]
    public class TradeAccountGroup
    {
        public int TradeAccountGroupID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }
    }

    public class TradeAccountVisit
    {
        [Key]
        public long TradeAccountVisitID { get; set; }
        public DateTime CreatedDT { get; set; }
        public int TradeAccountID { get; set; }
        public string Notes { get; set; }
        public DateTime VisitDT { get; set; }

        [JsonIgnore]
        public virtual TradeAccount TradeAccount { get; set; }

        [JsonIgnore]
        public virtual List<TradeAccountVisit_Member> Attendees { get; set; }
    }

    public class TradeAccountVisit_Member
    {
        public long TradeAccountVisitID { get; set; }
        public int MemberID { get; set; }

        public virtual TradeAccountVisit TradeAccountVisit { get; set; }
        public virtual Member Member { get; set; }
    }

    public class MertexOperator
    {
        [Key]
        public string Code { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Member> Members { get; set; }
    }

    public class TradeAccountType
    {
        [Key]
        public short TradeAccountTypeID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }
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
        public List<TradeAccountPotential> Potentials { get; internal set; }
        public List<ProductTypeGroup_Brand_Country> ProductTypeGroups { get; internal set; }
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

    internal class TradeAccount_Summary_Result
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
    
    internal class CustomerPrice_EnquiryResult
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

    internal class CustomerPriceResult
    {
        public List<CustomerPrice_EnquiryResult> Results { get; set; }
    }
    
    internal class ListPriceResult
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

    internal class ContractPriceResult
    {
        public List<ContractPrice_EnquiryResult> Results { get; set; }
    }

    internal class ContractPrice_EnquiryResult
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

    internal class ContractAgreementResult
    {
        public List<ContractAgreement_EnquiryResult> Results { get; set; }
    }

    internal class ContractAgreement_EnquiryResult
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

    internal class ProductNoPricesResult
    {
        public List<ProductNoPrices_EnquiryResult> Results { get; set; }
    }

    internal class ProductNoPrices_EnquiryResult
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

    internal class LowMarginResult
    {
        public List<LowMargin_EnquiryResult> Results { get; set; }
    }

    internal class LowMargin_EnquiryResult
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
}