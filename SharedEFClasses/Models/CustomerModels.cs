using SharedEFClasses.Models.General;
using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models.Customers
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
        public List<SaveVisitProduct> Products { get; set; }
        public bool ConfirmAndSend { get; set; }
        public string RecipientEmail { get; set; }
    }

    public class SaveVisitAttendee
    {
        public long TradeAccountContactID { get; set; }
    }

    public class SaveVisitProduct
    {
        public int ProductID { get; set; }
        public short Quantity { get; set; }
    }

    public class CustomerCareViewResult
    {
        public List<CareEnquiryResult> Results { get; set; }
        public int TotalResultsCount { get; set; }
    }

    public class CareEnquiryResult
    {
        public long? OrderNumber { get; set; }
        public DateTime? OrderDate { get; set; }
        public decimal? OrderValue { get; set; }

        public int CareHeadID { get; set; }
        public string CreditNumber { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime? CreditDate { get; set; }
        public decimal? CreditValue { get; set; }
        public byte CareStatusGroupID { get; set; }
        public string CareStatusGroupName { get; set; }

        public short CareLineNo { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public long? ImageID { get; set; }
        public decimal? ClaimQuantity { get; set; }
        public string Notes { get; set; }
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

    public class CustomerSummaryResult
    {
        public CustomerInfo CustomerInfo { get; set; }
        public List<CustomerSalesGrouping> SalesGroupings { get; set; }
        public List<CustomerSummaryAddress> CustomerAddresses { get; set; }
        public List<CustomerSummaryContact> CustomerContactsOrderConfirmations { get; set; }
        public List<CustomerSummaryContact> CustomerContactsMarketing { get; set; }
        public List<CustomerSummaryContact> CustomerContactsFinancial { get; set; }
        public List<CustomerSummaryContact> CustomerContactsPricelists { get; set; }
        public List<CustomerSummaryContact> CustomerContactsOther { get; set; }
    }

    public class CustomerInfo
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public DateTime? OpenedDate { get; set; }
        public string Status { get; set; }
        public string Website { get; set; }
        public string PhoneNumber { get; set; }
        public string PrimaryEmail { get; set; }
        public string MarketingEmail { get; set; }
        public string PriceListCode { get; set; }
        public string PriceListName { get; set; }
        public string Currency { get; set; }
        public string InvoiceName { get; set; }
        public string InvoiceAddressLine1 { get; set; }
        public string InvoiceAddressLine2 { get; set; }
        public string InvoiceTown { get; set; }
        public string InvoiceCounty { get; set; }
        public string InvoiceCountry { get; set; }
        public string InvoicePostcode { get; set; }
        public string DefaultDeliveryCode { get; set; }
        public string DeliveryName { get; set; }
        public string DeliveryAddressLine1 { get; set; }
        public string DeliveryAddressLine2 { get; set; }
        public string DeliveryTown { get; set; }
        public string DeliveryCounty { get; set; }
        public string DeliveryCountry { get; set; }
        public string DeliveryPostcode { get; set; }
        public string VisitName { get; set; }
        public string VisitAddressLine1 { get; set; }
        public string VisitAddressLine2 { get; set; }
        public string VisitTown { get; set; }
        public string VisitCounty { get; set; }
        public string VisitCountry { get; set; }
        public string VisitPostcode { get; set; }

        public object InvoiceAddress
        {
            get
            {
                return new
                {
                    name = InvoiceName,
                    addressLine1 = InvoiceAddressLine1,
                    addressLine2 = InvoiceAddressLine2,
                    town = InvoiceTown,
                    county = InvoiceCounty,
                    country = InvoiceCountry,
                    postcode = InvoicePostcode
                };
            }
        }

        public object DeliveryAddress
        {
            get
            {
                return new
                {
                    name = DeliveryName,
                    addressLine1 = DeliveryAddressLine1,
                    addressLine2 = DeliveryAddressLine2,
                    town = DeliveryTown,
                    county = DeliveryCounty,
                    country = DeliveryCountry,
                    postcode = DeliveryPostcode
                };
            }
        }

        public object VisitAddress
        {
            get
            {
                return new
                {
                    name = VisitName,
                    addressLine1 = VisitAddressLine1,
                    addressLine2 = VisitAddressLine2,
                    town = VisitTown,
                    county = VisitCounty,
                    country = VisitCountry,
                    postcode = VisitPostcode
                };
            }
        }
    }

    public class CustomerSalesGrouping
    {
        public int Tag { get; set; }
        public string Name { get; set; }
    }

    public class CustomerSummaryAddress
    {
        public long TradeAccountAddressID { get; set; }
        public string Name { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }
        public string Postcode { get; set; }
        public short? CountryID { get; set; }
        public string Country { get; set; }
        public string CountryCode { get; set; }
        public bool EU { get; set; }
        public decimal? Longitude { get; set; }
        public decimal? Latitude { get; set; }
        public string Label { get; set; }
        public string GooglePanoramaLink { get; set; }
        public bool Editable { get; set; }
        public long SortOrder { get; set; }
        public List<TradeAccountAddress_Tag> Tags { get; set; }

        public object Address
        {
            get
            {
                return new
                {
                    label = Label,
                    name = Name,
                    addressLine1 = AddressLine1,
                    addressLine2 = AddressLine2,
                    town = Town,
                    county = County,
                    countryName = Country,
                    countryCode = CountryCode,
                    eu = EU,
                    countryId = CountryID,
                    postcode = Postcode,
                    editable = Editable,
                    latitude = Latitude,
                    longitude = Longitude,
                    googlePanoramaLink = GooglePanoramaLink,
                    tags = Tags
                };
            }
        }
    }

    public class CustomerSummaryContact
    {
        public long TradeAccountContactID { get; set; }
        public byte? TitleID { get; set; }
        public string Title { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
        public string MobilePhone { get; set; }
        public string WorkPhone { get; set; }
        public string Email { get; set; }
        public string SkypeID { get; set; }
        public string WhatsApp { get; set; }
        public string Website { get; set; }
        public bool ReceiveOrderConfirmations { get; set; }
        public bool ReceiveMarketing { get; set; }
        public bool ReceiveFinancial { get; set; }
        public bool ReceivePricelists { get; set; }
        //public List<TradeAccountContact_Tag> Tags { get; set; }
    }
}