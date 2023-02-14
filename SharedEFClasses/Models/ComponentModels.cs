using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SharedEFClasses.Models.Components
{
    public class PassSalesMarketDependentAutocomplete
    {
        public string term { get; set; }
        public SalesMarket salesMarket { get; set; }
    }

    public class PassTradeAccountID
    {
        public int tradeAccountId { get; set; }
    }

    public class PassTradeAccountIDs
    {
        public List<int> tradeAccountIds { get; set; }
    }

    public class PassFulfilmentOptionsSelect
    {
        public long basketId { get; set; }
        public int? productId { get; set; }
        public int tradeAccountId { get; set; }
        public byte operatorTypeId { get; set; }
    }

    public class PassTradeAccountNote
    {
        public long? tradeAccountNoteId { get; set; }
        public int tradeAccountId { get; set; }
        public string note { get; set; }
    }

    public class PassOutstandingOrderLoad
    {
        public int tradeAccountId { get; set; }
        public byte orderLineStatusGroupId { get; set; }
    }

    public class OutstandingOrderResult
    {
        public long SortOrder { get; set; }
        public string LineStatus { get; set; }
        public string TradeAccountName { get; set; }
        public DateTime OrderDate { get; set; }
        public int OrderNumber { get; set; }
        public string ProductName { get; set; }
        public string Code { get; set; }
        public decimal Quantity { get; set; }
        public decimal LineValueCurr { get; set; }
        public DateTime? ExtraDate { get; set; }
    }

    /// <summary>
    /// This should be reduced to simply: TradeAccountID, Code, PriceListID, Name and possibly Email.
    /// </summary>
    public class TradeAccountNumber_AutocompleteResult
    {
        public int TradeAccountID { get; set; }
        public int? TradeAccountGroupID { get; set; }
        public short TradePriceListID { get; set; }
        public string Label { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string CountryCode { get; set; }
        public short CountryID { get; set; }
        public string Email { get; set; }
        public string SampleHAULCODE { get; set; }
        public string SampleCARRCODE { get; set; }
        public string PriceList { get; set; }
        public byte? MarketID { get; set; }
        public byte? CurrencyID { get; set; }
        public string CurrencySymbol { get; set; }
        public string CurrencyCulture { get; set; }
        public string CurrencyCode { get; set; }
        public string MertexCurrencyCode { get; set; }
        public string VATNumber { get; set; }
        public byte? OrderConfirmationLanguageID { get; set; }
        public string Memo { get; set; }
        public decimal? CreditLimit { get; set; }
        public string CreditStatus { get; set; }
        public string SampleOrderConfirmationTopText { get; set; }
        public string SampleOrderConfirmationTopTextReadOnly { get; set; }
        public string SampleOwnHaulierAccNo { get; set; }
        public string DeliveryType { get; set; }
        public string UPSAccountNumber { get; set; }
        public string DHLAccountNumber { get; set; }

        public string PaymentTerms { get; set; }
        public byte? PaymentTermsID { get; set; }

        public string TradePriceList { get; set; }
        public string TradePriceListType { get; set; }

        public byte? SalesMarketID { get; set; }

        public string SalesRepresentative { get; set; }
        public short? SalesRepresentativeID { get; set; }

        public string AdScheme { get; set; }
        public bool MiscellaneousAccount { get; set; }
        public bool RetailTill { get; set; }
        public string BeforeOrderNotification { get; set; }

        public string TradeDataSourceJSON { get; set; }

        public bool PurchaseOrderLineNumberRequired { get; set; }

        public Currency Currency { get; set; }
    }


    public class PassProductCodeAutoComplete
    {
        [StringLength(50)]
        public string term { get; set; }
        public short? tradePriceListId { get; set; }
        public decimal? exactlyRRP { get; set; }
        public decimal? lessThanRRP { get; set; }
        public byte? productTypeId { get; set; }
    }

    public class ProductCode_Autocomplete_Samples_Result
    {
        public int ProductID { get; set; }
        public byte? ProductGroupID { get; set; }
        public short? ItemTypeID { get; set; }
        public byte? BrandID { get; set; }
        public byte? ColourID { get; set; }
        public byte? PatternID { get; set; }
        public byte? StockStatusID { get; set; }
        public short LaunchID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public long? ImageID { get; set; }
        public int? ProductPageID { get; set; }
        public string Status { get; set; }
        public int? CuttingProductID { get; set; }
        public string CuttingCode { get; set; }
        public byte? CuttingSSID { get; set; }
        public decimal? CuttingStock { get; set; }
        public string CuttingStatus { get; set; }
        public decimal? CuttingPrice { get; set; }
        public int? ReturnableProductID { get; set; }
        public string ReturnableCode { get; set; }
        public byte? ReturnableSSID { get; set; }
        public decimal? ReturnableStock { get; set; }
        public string ReturnableStatus { get; set; }
        public decimal? ReturnablePrice { get; set; }
        public string RRP { get; set; }
        public decimal? RRPValue { get; set; }
        public string ListPrice { get; set; }
        public decimal? ListPriceValue { get; set; }
        public string ProductType { get; set; }
        public string StockStatus { get; set; }
        public string FreeStock { get; set; }
        public decimal? FreeStockValue { get; set; }
        public string Units { get; set; }
    }

    public class ProductCode_Autocomplete_AlternativesReturn
    {
        public List<ProductCode_Autocomplete_Alternatives_Result> SearchResults { get; set; }
        public List<ProductCode_Autocomplete_Samples_Result> Alternatives { get; set; }
    }

    public class ProductCode_Autocomplete_Alternatives_Result
    {
        public int ProductID { get; set; }
        public int? ProductPageID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public long? ImageID { get; set; }
        public string Status { get; set; }
        public string RRP { get; set; }
        public string ProductType { get; set; }
        public string StockStatus { get; set; }
        public short? FreeStock { get; set; }
    }

    public class AlternativeProduct
    {
        public int ProductID { get; set; }
        public int? ProductPageID { get; set; }
        public int ParentProductPageID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public long? ImageID { get; set; }
        public string Status { get; set; }
        public string RRP { get; set; }
        public string ProductType { get; set; }
    }

    public class TradeCarriage_AutocompleteResult
    {
        public string CARRCODE { get; set; }
        public string HAULCODE { get; set; }
        public string Name { get; set; }
    }

    public class PassOrderEnquirySearch
    {
        public string term { get; set; }
        public int? tradeAccountGroupId { get; set; }
        public int? tradeAccountId { get; set; }
        public string period { get; set; }
        public DateTime? from { get; set; }
        public DateTime? to { get; set; }
        public byte? productTypeId { get; set; }
        public byte languageId { get; set; }
        public byte? orderStatus { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
    }


    public class PassCustomerEnquirySearch
    {
        public string term { get; set; }
        public int? tradeAccountGroupId { get; set; }
    }

    public class CustomerEnquiry_AutocompleteResult
    {
        public int TradeAccountID { get; set; }
        public string AccountNumber { get; set; }
        public string Name { get; set; }
    }

    public class PassVisitSearch
    {
        public string Term { get; set; }
        public int TradeAccountID { get; set; }
        public string Period { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public byte LanguageID { get; set; }
    }

    public class PassMemberSearch
    {
        public string term { get; set; }
        public int tradeAccountId { get; set; }
        public int? tradeAccountGroupId { get; set; }
        public byte languageId { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
    }

    public class PassCareSearch
    {
        public string term { get; set; }
        public int tradeAccountId { get; set; }
        public int? tradeAccountGroupId { get; set; }
        public byte languageId { get; set; }
        public byte careStatusId { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        public string period { get; set; }
        public DateTime? from { get; set; }
        public DateTime? to { get; set; }
        public byte? productTypeId { get; set; }
    }


    public class PassSalesRepID
    {
        public short? SalesRepID { get; set; }
    }

    public class PassLeadSearch
    {
        public string term { get; set; }
        public short? countryId { get; set; }
        public byte? status { get; set; }
        public string period { get; set; }
        public DateTime? from { get; set; }
        public DateTime? to { get; set; }
        public byte? leadSourceId { get; set; }
        public PassMember createdBy { get; set; }
        public PassMember assignedTo { get; set; }
        public byte? memberTypeId { get; set; }
        public bool? distributor { get; set; }
        public string widget { get; set; }
    }
    
    public class PassCustomerSearch
    {
        public int? userId { get; set; }
        public short? SalesMarketID { get; set; }
        public byte? CurrencyID { get; set; }
        public short? SalesAreaID { get; set; }
        public byte? TradeAccountTypeID { get; set; }
        public short? SalesRepresentativeID { get; set; }
        public bool? SalesRepOrAgent { get; set; }
        public string searchTerm { get; set; }
        public PassMember member { get; set; }
        public string widget { get; set; }
        public List<int> Tags { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }

    public class PassMiscCustomerSearch
    {
        public string term { get; set; }
        public short? countryId { get; set; }
        public PassMember createdBy { get; set; }
        public PassMember assignedTo { get; set; }
        public string widget { get; set; }
    }

    public class PassMember
    {
        public int MemberID { get; set; }
    }

    public class PassLeadDashboard
    {
        public short? countryId { get; set; }
        public PassMember member { get; set; }
        public byte? leadTypeId { get; set; }
    }
    
    public class PassCustomerDashboard
    {
        public short? SalesMarketID { get; set; }
        public byte? CurrencyID { get; set; }
        public short? SalesAreaID { get; set; }
        public byte? TradeAccountTypeID { get; set; }
        public short? TradeAccountGroupID { get; set; }
        public short? SalesRepresentativeID { get; set; }
        public bool? SalesRepOrAgent { get; set; }
        public string searchTerm { get; set; }
        public PassMember member { get; set; }
    }

    public class PassMemberSearchProperties
    {
        public List<KeyValuePair<String, ClientSideMember>> AdditionalOptions { get; set; }
    }

    public class PriceCheckerAutocompleteResult
    {
        public string Type { get; set; }
        public string ID { get; set; }
        public string Name { get; set; }
        public string LabelAddition { get; set; }
        public string Code { get; set; }
    }

    public class KeywordHintResult
    {
        public string Keyword { get; set; }
    }

    public class OrderEntryProductSearchResult
    {
        public long? ImageID { get; set; }
        public string Code { get; set; }
        public int? ProductPageID { get; set; }
        public string Group { get; set; }
        public string Name { get; set; }
        public string BestSeller { get; set; }
        public decimal? Price { get; set; }
        public long SortOrder { get; set; }
        public short FreeStock { get; set; }
        public short POFreeStock { get; set; }
        public DateTime? PODueDate { get; set; }
        public byte StockStatusID { get; set; }
        public string StockStatus { get; set; }
    }

    public class PassGenericAutocomplete
    {
        public string searchTerm { get; set; }
    }
}