using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Portal.Models
{
    public class CustomerEnquiryViewResult
    {
        public CustomerEnquiryResult CustomerDetails { get; set; }
        public CustomerEnquiryOrderStatusResult OrderStatus { get; set; }
        public CustomerEnquiryCareStatusResult CareStatus { get; set; }
        public CustomerEnquiryTaskStatusResult TaskStatus { get; set; }
    }
    
    public class CustomerEnquiryResult
    {
        public string GroupName { get; set; }
        public string GroupCode { get; set; }
        public string Language { get; set; }
        public string Region { get; set; }              //
        public short? PriceListID { get; set; }
        public string PriceList { get; set; }           //
        public string Area { get; set; }
        public decimal? CreditLimit { get; set; }
        public string CreditStatus { get; set; }
        public string PatternBookScheme { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Status { get; set; }
        public string Type { get; set; }
        public DateTime? OpenedDate { get; set; }
        public string Segment { get; set; }
        public string PrimaryContact { get; set; }      //
        public string AccountRank { get; set; }
        public CustomerAddress Address { get; set; }
        public string Country { get; set; }
        public string Email { get; set; }
        public string Website { get; set; }
        public string PhoneNumber { get; set; }         //

        public short? SalesRepresentativeID { get; set; }
        public string SalesRepresentativeCode { get; set; }
        public string SalesRepresentativeName { get; set; }
        public string SalesRepresentativeEmail { get; set; }

        public int? SalesRepresentativeRank { get; set; }
        public int? SalesRepresentativeAccounts { get; set; }
        public byte? MarketID { get; set; }
        public string MarketName { get; set; }
        public int? MarketRank { get; set; }
        public int? MarketAccounts { get; set; }
        public int? GlobalRank { get; set; }
        public int? GlobalAccounts { get; set; }

        #region Sales
        public string CurrencyCulture { get; set; }
        public string AccountCurrency { get; set; }
        public string CurrencyName { get; set; }
        public Currency Currency { get; set; }

        //public DateTime? SalesLastUpdated { get; set; }

        //public decimal SalesLY_FullMonth { get; set; }
        //public decimal GrowthLY_FullMonth { get; set; }
        //public decimal SalesTY_FullMonth { get; set; }
        //public decimal GrowthTY_FullMonth { get; set; }
        //public decimal SalesLY_MonthToDate { get; set; }
        //public decimal GrowthLY_MonthToDate { get; set; }
        //public decimal SalesTY_MonthToDate { get; set; }
        //public decimal GrowthTY_MonthToDate { get; set; }
        //public decimal SalesLY_FullFinancialYear { get; set; }
        //public decimal GrowthLY_FullFinancialYear { get; set; }
        //public decimal SalesTY_FullFinancialYear { get; set; }
        //public decimal GrowthTY_FullFinancialYear { get; set; }
        //public decimal SalesLY_FinancialYearToDate { get; set; }
        //public decimal GrowthLY_FinancialYearToDate { get; set; }
        //public decimal SalesTY_FinancialYearToDate { get; set; }
        //public decimal GrowthTY_FinancialYearToDate { get; set; }
        //public decimal SalesLY_FullCalendarYear { get; set; }
        //public decimal GrowthLY_FullCalendarYear { get; set; }
        //public decimal SalesTY_FullCalendarYear { get; set; }
        //public decimal GrowthTY_FullCalendarYear { get; set; }
        //public decimal SalesTY_CalendarYearToDate { get; set; }
        //public decimal GrowthTY_CalendarYearToDate { get; set; }
        //public decimal SalesLY_CalendarYearToDate { get; set; }
        //public decimal GrowthLY_CalendarYearToDate { get; set; }

        //public decimal SalesCurrLY_FullMonth { get; set; }
        //public decimal GrowthCurrLY_FullMonth { get; set; }
        //public decimal SalesCurrTY_FullMonth { get; set; }
        //public decimal GrowthCurrTY_FullMonth { get; set; }
        //public decimal SalesCurrLY_MonthToDate { get; set; }
        //public decimal GrowthCurrLY_MonthToDate { get; set; }
        //public decimal SalesCurrTY_MonthToDate { get; set; }
        //public decimal GrowthCurrTY_MonthToDate { get; set; }
        //public decimal SalesCurrLY_FullFinancialYear { get; set; }
        //public decimal GrowthCurrLY_FullFinancialYear { get; set; }
        //public decimal SalesCurrTY_FullFinancialYear { get; set; }
        //public decimal GrowthCurrTY_FullFinancialYear { get; set; }
        //public decimal SalesCurrLY_FinancialYearToDate { get; set; }
        //public decimal GrowthCurrLY_FinancialYearToDate { get; set; }
        //public decimal SalesCurrTY_FinancialYearToDate { get; set; }
        //public decimal GrowthCurrTY_FinancialYearToDate { get; set; }
        //public decimal SalesCurrLY_FullCalendarYear { get; set; }
        //public decimal GrowthCurrLY_FullCalendarYear { get; set; }
        //public decimal SalesCurrTY_FullCalendarYear { get; set; }
        //public decimal GrowthCurrTY_FullCalendarYear { get; set; }
        //public decimal SalesCurrTY_CalendarYearToDate { get; set; }
        //public decimal GrowthCurrTY_CalendarYearToDate { get; set; }
        //public decimal SalesCurrLY_CalendarYearToDate { get; set; }
        //public decimal GrowthCurrLY_CalendarYearToDate { get; set; }
        #endregion

        public long? LastTradeAccountVisitID { get; set; }
        public DateTime? LastVisitDate { get; set; }
        public long? NextTradeAccountVisitID { get; set; }
        public DateTime? NextVisitDate { get; set; }

        // Not from procedure:
        public string OpenSince { get; set; }
        public string LastVisit { get; set; }
        public string NextVisit { get; set; }
    }

    public class CustomerAddress
    {
        public long AddressID { get; set; }

        public int TradeAccountID { get; set; }

        [StringLength(60)]
        public string AddressLine1 { get; set; }

        [StringLength(60)]
        public string AddressLine2 { get; set; }

        [StringLength(50)]
        public string Town { get; set; }

        [StringLength(40)]
        public string County { get; set; }

        [StringLength(20)]
        public string PostCode { get; set; }

        public short CountryID { get; set; }

        public virtual Country Country { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool Deleted { get; set; }

        public string AppleMapsButton { get; set; }
        public string WazeButton { get; set; }
        public string GoogleStreetViewButton { get; set; }

        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }

    public class CustomerEnquiryOrderStatusResult
    {
        public int OpenOrderCount { get; set; }
        public long? LastOrderHeadID { get; set; }
        public DateTime? LastOrderDate { get; set; }
        public string LastOrderText { get; set; }
    }
    
    public class CustomerEnquiryCareStatusResult
    {
        public int? OpenCareRecordCount { get; set; }
        public int? LastCareHeadID { get; set; }
        public DateTime? LastCareHeadDate { get; set; }
        public string LastCareHeadText { get; set; }
    }

    public class CustomerEnquiryTaskStatusResult
    {
        public int? OpenTaskCount { get; set; }
        public int? LastTaskID { get; set; }
        public DateTime? LastTaskDate { get; set; }
        public string LastTaskText { get; set; }
    }

    public class CustomerVisitViewResult
    {
        public List<VisitEnquiryResult> Results { get; set; }
    }

    public class VisitEnquiryResult
    {
        public long TradeAccountVisitID { get; set; }
        public DateTime CreatedDT { get; set; }
        public string Notes { get; set; }
        public DateTime VisitDT { get; set; }

        public List<VisitAttendeesResult> Attendees { get; set; }
    }

    public class VisitAttendeesResult
    {
        public long TradeAccountVisitID { get; set; }
        public int MemberID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
    }

    public class SaveVisitModel
    {
        public int TradeAccountID { get; set; }
        public long? TradeAccountVisitID { get; set; }
        [Required(ErrorMessage = "You must specify a date")]
        public DateTime VisitDT { get; set; }
        public string Notes { get; set; }
        public List<SaveVisitAttendee> Attendees { get; set; }
    }

    public class SaveVisitAttendee
    {
        public int memberId { get; set; }
    }

    public class CustomerCareViewResult
    {
        public List<CareEnquiryResult> Results { get; set; }
        public int TotalResultsCount { get; set; }
    }

    public class CareEnquiryResult
    {
        public int CareHeadID { get; set; }
        public DateTime? CreatedDT { get; set; }
        public long? OrderHeadID { get; set; }
        public string OpenedBy { get; set; }
        public string ProcessedBy { get; set; }
        public string CareResultCode { get; set; }
        public bool? Completed { get; set; }
        public short CareLineNo { get; set; }
        public string ProductCode { get; set; }
        public long? ImageID { get; set; }
        public decimal? ClaimQuantity { get; set; }
        public decimal? ReturnedQuantity { get; set; }
        public decimal? AcceptedQuantity { get; set; }
        public bool? ReturnedToStock { get; set; }
        public string Notes { get; set; }
        public string FaultCode { get; set; }
    }

    public class PassCompetitorProductTypeGroups
    {
        public int tradeAccountId { get; set; }
        public Competitor competitor { get; set; }
        public List<PassCompetitorProductTypeGroup> productTypeGroups { get; set; }
    }    

    public class PassCompetitorProductTypeGroup
    {
        public byte ProductTypeGroupID { get; set; }
        public string Note { get; set; }
        public decimal? EstimatedValue { get; set; }
        public List<PassCompetitorProductTypeGroupOldNote> oldNotes { get; set; }
    }

    public class PassCompetitorProductTypeGroupOldNote
    {
        public long NoteID { get; set; }

        public string observable { get; set; }

        public string Note { get; set; }

        public bool Editable { get; set; }
    }
}