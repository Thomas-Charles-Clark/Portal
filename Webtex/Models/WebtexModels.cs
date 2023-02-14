using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Webtex.Models
{
    //[Table("DataCategory", Schema = "gdpr")]
    //public class DataCategory
    //{
    //    [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
    //    public byte DataCategoryID { get; set; }

    //    public string Name { get; set; }

    //    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    //    public DateTime CreatedDT { get; set; }

    //    public virtual ICollection<DataType> DataTypes { get; set; }

    //    [JsonIgnore]
    //    public virtual ICollection<DataCategory_DataSource> DataSources { get; set; }

    //    [JsonIgnore]
    //    public virtual ICollection<DataCategory_DataStore> DataStores { get; set; }

    //    [JsonIgnore]
    //    public virtual ICollection<DataCategory_IndividualCategory> Individuals { get; set; }

    //    [JsonIgnore]
    //    public virtual ICollection<DataCategory_Supplier_DataTransmissionMethod> Supplier_DataTransmissionMethods { get; set; }
    //}

    /*public class FetchSalesStatisticsResult
    {
        public List<TotalSalesResult> TotalSales { get; set; }
        public List<SalesByAreaResult> SalesByArea { get; set; }
        public List<CustomerDashboardResult> CustomerDashboard { get; set; }
        public List<SalesByCustomerResult> SalesByCustomer { get; set; }
        public List<SalesByQuarterFinancialResult> SalesByQuarterFinancial { get; set; }
        public List<SalesByQuarterCalendarResult> SalesByQuarterCalendar { get; set; }

        public FetchSalesStatisticsResult(
            List<TotalSalesResult> totalSales,
            List<SalesByAreaResult> salesByArea,
            List<CustomerDashboardResult> salesByCustomerDashboard,
            List<SalesByCustomerResult> salesByCustomer,
            SalesByQuarterResult salesByQuarter
            )
        {
            TotalSales = totalSales;
            SalesByArea = salesByArea;
            CustomerDashboard = salesByCustomerDashboard;
            SalesByCustomer = salesByCustomer;
            SalesByQuarterFinancial = salesByQuarter.Financial;
            SalesByQuarterCalendar = salesByQuarter.Calendar;
        }
    }

    public class TotalSalesResult
    {
        public decimal TY_CalendarYearToDate { get; set; }
        public decimal LY_CalendarYearToDate { get; set; }
        public decimal? CalendarYearToDateGrowth { get; set; }
        public decimal CalendarYearToDateVariance { get; set; }

        public decimal TY_FinancialYearToDate { get; set; }
        public decimal LY_FinancialYearToDate { get; set; }
        public decimal? FinancialYearToDateGrowth { get; set; }
        public decimal FinancialYearToDateVariance { get; set; }

        public decimal TY_MonthToDate { get; set; }
        public decimal LY_MonthToDate { get; set; }
        public decimal? MonthToDateGrowth { get; set; }
        public decimal MonthToDateVariance { get; set; }

        public decimal TY_CalendarYearToDateCurr { get; set; }
        public decimal LY_CalendarYearToDateCurr { get; set; }
        public decimal? CalendarYearToDateGrowthCurr { get; set; }
        public decimal CalendarYearToDateVarianceCurr { get; set; }

        public decimal TY_FinancialYearToDateCurr { get; set; }
        public decimal LY_FinancialYearToDateCurr { get; set; }
        public decimal? FinancialYearToDateGrowthCurr { get; set; }
        public decimal FinancialYearToDateVarianceCurr { get; set; }

        public decimal TY_MonthToDateCurr { get; set; }
        public decimal LY_MonthToDateCurr { get; set; }
        public decimal? MonthToDateGrowthCurr { get; set; }
        public decimal MonthToDateVarianceCurr { get; set; }
    }

    public class SalesByAreaResult
    {
        public short SalesAreaID { get; set; }
        public string SalesAreaCode { get; set; }
        public string SalesAreaName { get; set; }
        public int AccountCount { get; set; }
        
        public decimal TY_CalendarYearToDate { get; set; }
        public decimal LY_CalendarYearToDate { get; set; }
        public decimal? CalendarYearToDateGrowth { get; set; }
        public decimal CalendarYearToDateVariance { get; set; }

        public decimal TY_FinancialYearToDate { get; set; }
        public decimal LY_FinancialYearToDate { get; set; }
        public decimal? FinancialYearToDateGrowth { get; set; }
        public decimal FinancialYearToDateVariance { get; set; }

        public decimal TY_MonthToDate { get; set; }
        public decimal LY_MonthToDate { get; set; }
        public decimal? MonthToDateGrowth { get; set; }
        public decimal MonthToDateVariance { get; set; }

        public decimal TY_CalendarYearToDateCurr { get; set; }
        public decimal LY_CalendarYearToDateCurr { get; set; }
        public decimal? CalendarYearToDateGrowthCurr { get; set; }
        public decimal CalendarYearToDateVarianceCurr { get; set; }

        public decimal TY_FinancialYearToDateCurr { get; set; }
        public decimal LY_FinancialYearToDateCurr { get; set; }
        public decimal? FinancialYearToDateGrowthCurr { get; set; }
        public decimal FinancialYearToDateVarianceCurr { get; set; }

        public decimal TY_MonthToDateCurr { get; set; }
        public decimal LY_MonthToDateCurr { get; set; }
        public decimal? MonthToDateGrowthCurr { get; set; }
        public decimal MonthToDateVarianceCurr { get; set; }
    }

    public class CustomerDashboardResult
    {
        public int AllAccountCount { get; set; }
        public int OpenAccountCount { get; set; }
        public int ClosedAccountCount { get; set; }
        public int TopAccountCount { get; set; }
        public int ActiveAccountCount { get; set; }
        public int LapsingAccountCount { get; set; }
        public int LapsedAccountCount { get; set; }
        public int NewAccountCount { get; set; }

        public decimal AllAccountValue { get; set; }
        public decimal OpenAccountValue { get; set; }
        public decimal ClosedAccountValue { get; set; }
        public decimal TopAccountValue { get; set; }
        public decimal ActiveAccountValue { get; set; }
        public decimal LapsingAccountValue { get; set; }
        public decimal LapsedAccountValue { get; set; }
        public decimal NewAccountValue { get; set; }

        public decimal AllAccountValueCurr { get; set; }
        public decimal OpenAccountValueCurr { get; set; }
        public decimal ClosedAccountValueCurr { get; set; }
        public decimal TopAccountValueCurr { get; set; }
        public decimal ActiveAccountValueCurr { get; set; }
        public decimal LapsingAccountValueCurr { get; set; }
        public decimal LapsedAccountValueCurr { get; set; }
        public decimal NewAccountValueCurr { get; set; }
    }

    public class SalesByQuarterResult
    {
        public List<SalesByQuarterFinancialResult> Financial { get; set; }
        public List<SalesByQuarterCalendarResult> Calendar { get; set; }
    }

    public class SalesByQuarterFinancialResult
    {
        public decimal TY_FinancialQ1ToDate { get; set; }
        public decimal LY_FinancialQ1ToDate { get; set; }
        public decimal TY_FinancialQ2ToDate { get; set; }
        public decimal LY_FinancialQ2ToDate { get; set; }
        public decimal TY_FinancialQ3ToDate { get; set; }
        public decimal LY_FinancialQ3ToDate { get; set; }
        public decimal TY_FinancialQ4ToDate { get; set; }
        public decimal LY_FinancialQ4ToDate { get; set; }

        public decimal TY_FinancialQ1ToDateCurr { get; set; }
        public decimal LY_FinancialQ1ToDateCurr { get; set; }
        public decimal TY_FinancialQ2ToDateCurr { get; set; }
        public decimal LY_FinancialQ2ToDateCurr { get; set; }
        public decimal TY_FinancialQ3ToDateCurr { get; set; }
        public decimal LY_FinancialQ3ToDateCurr { get; set; }
        public decimal TY_FinancialQ4ToDateCurr { get; set; }
        public decimal LY_FinancialQ4ToDateCurr { get; set; }
    }

    public class SalesByQuarterCalendarResult
    {
        public decimal TY_CalendarQ1ToDate { get; set; }
        public decimal LY_CalendarQ1ToDate { get; set; }
        public decimal TY_CalendarQ2ToDate { get; set; }
        public decimal LY_CalendarQ2ToDate { get; set; }
        public decimal TY_CalendarQ3ToDate { get; set; }
        public decimal LY_CalendarQ3ToDate { get; set; }
        public decimal TY_CalendarQ4ToDate { get; set; }
        public decimal LY_CalendarQ4ToDate { get; set; }

        public decimal TY_CalendarQ1ToDateCurr { get; set; }
        public decimal LY_CalendarQ1ToDateCurr { get; set; }
        public decimal TY_CalendarQ2ToDateCurr { get; set; }
        public decimal LY_CalendarQ2ToDateCurr { get; set; }
        public decimal TY_CalendarQ3ToDateCurr { get; set; }
        public decimal LY_CalendarQ3ToDateCurr { get; set; }
        public decimal TY_CalendarQ4ToDateCurr { get; set; }
        public decimal LY_CalendarQ4ToDateCurr { get; set; }
    }

    public class SalesStatisticsCurrenciesResult
    {
        public List<SalesStatisticsCurrencyRecord> Results { get; set; }
    }

    public class SalesStatisticsCurrencyRecord
    {
        public byte CurrencyID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string FormattingCulture { get; set; }
        public string Symbol { get; set; }
    }

    

    public class SalesByCustomerResult
    {
        public int TradeAccountID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public string SalesMarketCode { get; set; }
        public string SalesAreaCode { get; set; }
        public string SalesAreaName { get; set; }

        //public decimal TY_CalendarYearToDate { get; set; }
        //public decimal LY_CalendarYearToDate { get; set; }
        //public decimal? CalendarYearToDateGrowth { get; set; }
        //public decimal CalendarYearToDateVariance { get; set; }

        public decimal TY_FinancialYearToDate { get; set; }
        public decimal TY_FinancialYearToDateGrowth { get; set; }
        public decimal LY_FinancialYearToDate { get; set; }
        public decimal LY_FinancialYearToDateGrowth { get; set; }

        public decimal M0Value { get; set; }
        public decimal M0Growth { get; set; }
        public decimal M1Value { get; set; }
        public decimal M1Growth { get; set; }
        public decimal M2Value { get; set; }
        public decimal M2Growth { get; set; }
        public decimal M3Value { get; set; }
        public decimal M3Growth { get; set; }
        public decimal M4Value { get; set; }
        public decimal M4Growth { get; set; }
        public decimal M5Value { get; set; }
        public decimal M5Growth { get; set; }
        public decimal M6Value { get; set; }
        public decimal M6Growth { get; set; }
        public decimal M7Value { get; set; }
        public decimal M7Growth { get; set; }
        public decimal M8Value { get; set; }
        public decimal M8Growth { get; set; }
        public decimal M9Value { get; set; }
        public decimal M9Growth { get; set; }
        public decimal M10Value { get; set; }
        public decimal M10Growth { get; set; }
        public decimal M11Value { get; set; }
        public decimal M11Growth { get; set; }
        public decimal M12Value { get; set; }
        public decimal M12Growth { get; set; }

        //public decimal? FinancialYearToDateGrowth { get; set; }
        //public decimal FinancialYearToDateVariance { get; set; }

        //public decimal TY_MonthToDate { get; set; }
        //public decimal LY_MonthToDate { get; set; }
        //public decimal? MonthToDateGrowth { get; set; }
        //public decimal MonthToDateVariance { get; set; }

        //public decimal TY_CalendarYearToDateCurr { get; set; }
        //public decimal LY_CalendarYearToDateCurr { get; set; }
        //public decimal? CalendarYearToDateGrowthCurr { get; set; }
        //public decimal CalendarYearToDateVarianceCurr { get; set; }

        public decimal TY_FinancialYearToDateCurr { get; set; }
        public decimal TY_FinancialYearToDateGrowthCurr { get; set; }
        public decimal LY_FinancialYearToDateCurr { get; set; }
        public decimal LY_FinancialYearToDateGrowthCurr { get; set; }

        public decimal M0ValueCurr { get; set; }
        public decimal M0GrowthCurr { get; set; }
        public decimal M1ValueCurr { get; set; }
        public decimal M1GrowthCurr { get; set; }
        public decimal M2ValueCurr { get; set; }
        public decimal M2GrowthCurr { get; set; }
        public decimal M3ValueCurr { get; set; }
        public decimal M3GrowthCurr { get; set; }
        public decimal M4ValueCurr { get; set; }
        public decimal M4GrowthCurr { get; set; }
        public decimal M5ValueCurr { get; set; }
        public decimal M5GrowthCurr { get; set; }
        public decimal M6ValueCurr { get; set; }
        public decimal M6GrowthCurr { get; set; }
        public decimal M7ValueCurr { get; set; }
        public decimal M7GrowthCurr { get; set; }
        public decimal M8ValueCurr { get; set; }
        public decimal M8GrowthCurr { get; set; }
        public decimal M9ValueCurr { get; set; }
        public decimal M9GrowthCurr { get; set; }
        public decimal M10ValueCurr { get; set; }
        public decimal M10GrowthCurr { get; set; }
        public decimal M11ValueCurr { get; set; }
        public decimal M11GrowthCurr { get; set; }
        public decimal M12ValueCurr { get; set; }
        public decimal M12GrowthCurr { get; set; }

        //public decimal? FinancialYearToDateGrowthCurr { get; set; }
        //public decimal FinancialYearToDateVarianceCurr { get; set; }

        //public decimal TY_MonthToDateCurr { get; set; }
        //public decimal LY_MonthToDateCurr { get; set; }
        //public decimal? MonthToDateGrowthCurr { get; set; }
        //public decimal MonthToDateVarianceCurr { get; set; }
    }

	*/
    //[Table("Filter_TradeAccount", Schema = "portal")]
    //public class TradeAccountFilter
    //{
    //    [Key]
    //    public long TradeAccountFilterID { get; set; }
    //    public byte SalesMarketID { get; set; }
    //    public short SalesAreaID { get; set; }
    //    public short? SalesAgentID { get; set; }
    //    public short SalesRepresentativeID { get; set; }
    //    public string SalesMarketName { get; set; }
    //    public string SalesAreaName { get; set; }
    //    public string SalesAgentName { get; set; }
    //    public string SalesRepresentativeName { get; set; }
    //}
    
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
    }

    [Table("Filter_Product", Schema = "Portal")]
    public class ProductFilter
    {
        [Key]
        [Column(Order = 1)]
        public byte BrandID { get; set; }
        public string BrandName { get; set; }

        [Key]
        [Column(Order = 2)]
        public byte ProductGroupID { get; set; }
        public string ProductGroupName { get; set; }

        [Key]
        [Column(Order = 3)]
        public short ItemTypeID { get; set; }
        public string ItemTypeName { get; set; }

        [Key]
        [Column(Order = 4)]
        public short LaunchID { get; set; }
        public string LaunchName { get; set; }
    }

    public class SalesStatisticsTaggingResult
    {
        public List<TaggingTradeAccountRecord> Results { get; set; }

        public List<TaggingRecord> Tags { get; set; }
    }

    public class TaggingTradeAccountRecord
    {
        public int TradeAccountID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public string SalesMarketCode { get; set; }
        public string SalesAreaCode { get; set; }
        public string SalesAreaName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string AddressLine4 { get; set; }
        public string CountryCode { get; set; }
        public string DeliveryAddressLine1 { get; set; }
        public string DeliveryAddressLine2 { get; set; }
        public string DeliveryAddressLine3 { get; set; }
        public string DeliveryAddressLine4 { get; set; }
        public string DeliveryCountryCode { get; set; }
        public decimal? LY_MonthToDate { get; set; }
        public decimal? TY_MonthToDate { get; set; }
        public decimal? MonthToDateGrowth { get; set; }
        public decimal? LY_FinancialYearToDate { get; set; }
        public decimal? TY_FinancialYearToDate { get; set; }
        public decimal? FinancialYearToDateGrowth { get; set; }
        public decimal? LY_CalendarYearToDate { get; set; }
        public decimal? TY_CalendarYearToDate { get; set; }
        public decimal? CalendarYearToDateGrowth { get; set; }
        public decimal? LY_MonthToDateCurr { get; set; }
        public decimal? TY_MonthToDateCurr { get; set; }
        public decimal? MonthToDateGrowthCurr { get; set; }
        public decimal? LY_FinancialYearToDateCurr { get; set; }
        public decimal? TY_FinancialYearToDateCurr { get; set; }
        public decimal? FinancialYearToDateGrowthCurr { get; set; }
        public decimal? LY_CalendarYearToDateCurr { get; set; }
        public decimal? TY_CalendarYearToDateCurr { get; set; }
        public decimal? CalendarYearToDateGrowthCurr { get; set; }
        public TaggingRecord[] Tags { get; set; }
    }

    public class TaggingRecord
    {
        public int TradeAccountID { get; set; }
        public int TagID { get; set; }
        public string Tag { get; set; }
    }
}