using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.Fenwicks;

[Table("TradeAccount")]
[Index("Code", Name = "UQ__TradeAccoun_Code", IsUnique = true)]
[Index("Status", "Code", "Market", Name = "idx_Status_Code_Market")]
[Index("Code", Name = "idx_TradeAccount_Code_Name_Status")]
[Index("Status", "Email", Name = "idx_TradeAccount_Status_Email")]
[Index("Status", "Email", Name = "idx_TradeAccount_Status_Email_Plus9")]
[Index("TradePriceListID", Name = "idx_TradeAccount_TradePriceListID")]
public partial class TradeAccount
{
    [Key]
    public int TradeAccountID { get; set; }

    public int? TradeAccountGroupID { get; set; }

    [StringLength(50)]
    public string Code { get; set; } = null!;

    [StringLength(50)]
    public string Name { get; set; } = null!;

    [StringLength(1)]
    public string Status { get; set; } = null!;

    [StringLength(2)]
    public string CountryCode { get; set; } = null!;

    public byte MarketID { get; set; }

    [StringLength(1)]
    public string Market { get; set; } = null!;

    public short TradePriceListID { get; set; }

    [StringLength(256)]
    public string? Email { get; set; }

    [StringLength(50)]
    public string? AddressLine1 { get; set; }

    [StringLength(50)]
    public string? AddressLine2 { get; set; }

    [StringLength(50)]
    public string? AddressLine3 { get; set; }

    [StringLength(50)]
    public string? AddressLine4 { get; set; }

    [StringLength(20)]
    public string? Postcode { get; set; }

    /// <summary>
    /// SAMPLES ONLY - This is SAMP_HAULIER from SLCUST
    /// </summary>
    [StringLength(10)]
    public string? HAULCODE { get; set; }

    /// <summary>
    /// SAMPLES ONLY - This is SAMP_SERVICE from SLCUST
    /// </summary>
    [StringLength(10)]
    public string? CARRCODE { get; set; }

    [StringLength(10)]
    public string? SampleHAULCODE { get; set; }

    [StringLength(10)]
    public string? SampleCARRCODE { get; set; }

    [StringLength(20)]
    public string? SampleOwnHaulierAccNo { get; set; }

    [StringLength(2)]
    public string VATCode { get; set; } = null!;

    [StringLength(10)]
    public string? SampleLetterLanguageCode { get; set; }

    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    [Precision(2)]
    public DateTime? SalesLastUpdatedDT { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLY_FullMonth { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthLY_FullMonth { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesTY_FullMonth { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthTY_FullMonth { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLY_MonthToDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthLY_MonthToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesTY_MonthToDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthTY_MonthToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLY_FullFinancialYear { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthLY_FullFinancialYear { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesTY_FullFinancialYear { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthTY_FullFinancialYear { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLY_FinancialYearToDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthLY_FinancialYearToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesTY_FinancialYearToDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthTY_FinancialYearToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLY_FullCalendarYear { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthLY_FullCalendarYear { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesTY_FullCalendarYear { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthTY_FullCalendarYear { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLY_CalendarYearToDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthLY_CalendarYearToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesTY_CalendarYearToDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthTY_CalendarYearToDate { get; set; }

    public short? SalesRepresentativeID { get; set; }

    [Precision(2)]
    public DateTime? SalesCurrLastUpdatedDT { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrLY_FullMonth { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthCurrLY_FullMonth { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrTY_FullMonth { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthCurrTY_FullMonth { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrLY_MonthToDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthCurrLY_MonthToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrTY_MonthToDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthCurrTY_MonthToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrLY_FullFinancialYear { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthCurrLY_FullFinancialYear { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrTY_FullFinancialYear { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthCurrTY_FullFinancialYear { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrLY_FinancialYearToDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthCurrLY_FinancialYearToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrTY_FinancialYearToDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthCurrTY_FinancialYearToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrLY_FullCalendarYear { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthCurrLY_FullCalendarYear { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrTY_FullCalendarYear { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthCurrTY_FullCalendarYear { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrLY_CalendarYearToDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthCurrLY_CalendarYearToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrTY_CalendarYearToDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? GrowthCurrTY_CalendarYearToDate { get; set; }

    public byte? CurrencyID { get; set; }

    public int? SalesRepresentativeRank { get; set; }

    public int? SalesRepresentativeAccounts { get; set; }

    public int? MarketRank { get; set; }

    public int? MarketAccounts { get; set; }

    public int? GlobalRank { get; set; }

    public int? GlobalAccounts { get; set; }

    [StringLength(255)]
    public string? Website { get; set; }

    [Column(TypeName = "money")]
    public decimal? CreditLimit { get; set; }

    [Column(TypeName = "date")]
    public DateTime? OpenedDate { get; set; }

    public short TradeAreaID { get; set; }

    public byte? LanguageID { get; set; }

    public short? TradeAccountTypeID { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLast12Months { get; set; }

    [Column(TypeName = "date")]
    public DateTime? LastOrderDate { get; set; }

    [Required]
    public bool? AllowTradePrice { get; set; }

    public byte? MarginBoosterPercentage { get; set; }

    public byte? RetailOnlyDiscountPercentage { get; set; }

    public short CountryID { get; set; }

    [Column(TypeName = "decimal(11, 8)")]
    public decimal? Longitude { get; set; }

    [Column(TypeName = "decimal(11, 8)")]
    public decimal? Latitude { get; set; }

    public bool? Open { get; set; }

    [Precision(2)]
    public DateTime? AddressUpdatedDT { get; set; }

    [Precision(2)]
    public DateTime? CoordinatesUpdatedDT { get; set; }

    [StringLength(50)]
    public string? Memo { get; set; }

    [StringLength(20)]
    public string? VATNumber { get; set; }

    [StringLength(1)]
    public string? DeliveryType { get; set; }

    [StringLength(50)]
    public string? UPSAccountNumber { get; set; }

    [StringLength(50)]
    public string? DHLAccountNumber { get; set; }

    [StringLength(20)]
    public string? DefaultDeliveryReference { get; set; }

    public short? SalesAreaID { get; set; }

    public byte? SalesMarketID { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLast6Months { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLast24Months { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLast1Months { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLast3Months { get; set; }

    public short? SalesAgentID { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesTY_FinancialQ1ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLY_FinancialQ1ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesTY_FinancialQ2ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLY_FinancialQ2ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesTY_FinancialQ3ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLY_FinancialQ3ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesTY_FinancialQ4ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLY_FinancialQ4ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrTY_FinancialQ1ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrLY_FinancialQ1ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrTY_FinancialQ2ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrLY_FinancialQ2ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrTY_FinancialQ3ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrLY_FinancialQ3ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrTY_FinancialQ4ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrLY_FinancialQ4ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesTY_CalendarQ1ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLY_CalendarQ1ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesTY_CalendarQ2ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLY_CalendarQ2ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesTY_CalendarQ3ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLY_CalendarQ3ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesTY_CalendarQ4ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesLY_CalendarQ4ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrTY_CalendarQ1ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrLY_CalendarQ1ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrTY_CalendarQ2ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrLY_CalendarQ2ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrTY_CalendarQ3ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrLY_CalendarQ3ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrTY_CalendarQ4ToDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrLY_CalendarQ4ToDate { get; set; }

    [StringLength(25)]
    public string? DeliveryTerms { get; set; }

    public byte? PaymentTermsID { get; set; }

    public Guid GUID { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM0 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM1 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM2 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM3 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM4 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM5 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM6 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM7 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM8 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM9 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM10 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM11 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM12 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM13 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM14 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM15 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM16 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM17 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM18 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM19 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM20 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM21 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM22 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM23 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesM24 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM0 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM1 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM2 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM3 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM4 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM5 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM6 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM7 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM8 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM9 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM10 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM11 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM12 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM13 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM14 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM15 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM16 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM17 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM18 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM19 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM20 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM21 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM22 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM23 { get; set; }

    [Column(TypeName = "money")]
    public decimal? SalesCurrM24 { get; set; }

    [Precision(2)]
    public DateTime? DeletedDT { get; set; }

    public bool? Deleted { get; set; }

    public bool CreditStop { get; set; }

    public long? DefaultInvoiceTradeAccountAddressID { get; set; }

    public long? DefaultDeliveryTradeAccountAddressID { get; set; }

    public long? DefaultVisitTradeAccountAddressID { get; set; }

    public long? DefaultTradeAccountContactID { get; set; }

    public byte? TradeAccountFulfilmentGroupID { get; set; }

    public bool MiscellaneousAccount { get; set; }

    public short? StockLocationID { get; set; }

    public short? StockLocationID_Origin { get; set; }

    public short? StockLocationID_Destination { get; set; }

    public bool RetailCustomer { get; set; }

    public bool AllocateProforma { get; set; }

    [StringLength(255)]
    public string? USTaxExemptionCertificate { get; set; }

    public bool HasEndCustomers { get; set; }

    [StringLength(5)]
    public string MertexCurrencyCode { get; set; } = null!;

    public bool AllowWideWidthFabricToShipInABox { get; set; }

    public bool PurchaseOrderNumberRequired { get; set; }

    [StringLength(25)]
    public string? PartnerCompany { get; set; }

    [StringLength(255)]
    public string? SearchName { get; set; }

    public bool AllowReserves { get; set; }

    public byte? ReserveDays { get; set; }

    public byte? ImportTypeID { get; set; }

    public int? ADS_LatestApprovalRequestID { get; set; }

    public bool AllowEUExitCode { get; set; }

    public bool RetailTill { get; set; }

    public bool HoldForFullDespatch { get; set; }

    public bool TransferAccount { get; set; }

    [StringLength(5)]
    public string? DGPaymentDetailsCode { get; set; }

    [StringLength(50)]
    public string? CompanyRegistrationNumber { get; set; }

    public int OverheadTradeAccountID { get; set; }

    public bool OverheadAccount { get; set; }

    public byte? RetailStoreID { get; set; }

    public byte StockCheckFrequencyControl { get; set; }

    public byte StockCheckAttempts { get; set; }

    public byte StockCheckAllowed { get; set; }

    [Precision(2)]
    public DateTime? LastStockEnquiryDT { get; set; }

    public Guid StockAPIKey { get; set; }

    public string? BeforeOrderNotification { get; set; }

    public bool Advertiser { get; set; }

    public byte? MertexAccountID { get; set; }

    public string? UniVerseDataSources { get; set; }

    [StringLength(50)]
    public string? ParentCode { get; set; }

    [Precision(2)]
    public DateTime? StockCheckEnabledDT { get; set; }

    [Precision(2)]
    public DateTime? MertexUpsertFirstDT { get; set; }

    [Precision(2)]
    public DateTime? MertexUpsertLastDT { get; set; }

    [StringLength(20)]
    public string? EORI { get; set; }

    [Precision(2)]
    public DateTime ModifiedDT { get; set; }

    public bool ExemptFromHighValueOrderCheck { get; set; }

    [StringLength(256)]
    public string? MarketingEmail { get; set; }

    public short? AdvertiserClassID { get; set; }

    [Precision(2)]
    public DateTime? MertexUpsertQueuedDT { get; set; }

    public bool? MertexUpsertQueued { get; set; }

    [StringLength(50)]
    public string? ContactName { get; set; }

    [StringLength(50)]
    public string? StatementTradeAccountCode { get; set; }

    [StringLength(50)]
    public string? StatementContactName { get; set; }

    [StringLength(50)]
    public string? StatementName { get; set; }

    [StringLength(50)]
    public string? StatementAddressLine1 { get; set; }

    [StringLength(50)]
    public string? StatementAddressLine2 { get; set; }

    [StringLength(50)]
    public string? StatementTown { get; set; }

    [StringLength(50)]
    public string? StatementCounty { get; set; }

    [StringLength(20)]
    public string? StatementPostcode { get; set; }

    [StringLength(20)]
    public string? StatementPhoneNumber { get; set; }

    public byte? TradeAccountClassID { get; set; }

    [StringLength(20)]
    public string? SwissTaxID { get; set; }

    public short? VATCountryID { get; set; }

    [StringLength(2)]
    public string? USATaxCode { get; set; }

    public bool? ValidVATNumber { get; set; }

    [StringLength(50)]
    public string? VIESConsultationNumber { get; set; }

    [Precision(2)]
    public DateTime? VIESLastCheckedDT { get; set; }

    public short? BankAccountID { get; set; }

    [Column(TypeName = "date")]
    public DateTime? CreditLimitExpiryDT { get; set; }

    [Column(TypeName = "money")]
    public decimal? InsuredCreditLimit { get; set; }

    [Column(TypeName = "date")]
    public DateTime? InsuredCreditLimitExpirtyDT { get; set; }

    [StringLength(20)]
    public string? VATNumberOnInvoice { get; set; }

    public bool EDIInvoice { get; set; }

    [StringLength(5)]
    public string? AnalysisCodeS { get; set; }

    [Required]
    public bool? AcceptSundry { get; set; }

    [Required]
    public bool? SendOverdueLetters { get; set; }

    public bool? OverdueTotals { get; set; }

    public short? SendOverdueLetter1AfterXDays { get; set; }

    public short? SendOverdueLetter2AfterXDays { get; set; }

    public short? SendOverdueLetter3AfterXDays { get; set; }

    public short? SendOverdueLetter4AfterXDays { get; set; }

    public short? SendOverdueLetter5AfterXDays { get; set; }

    public bool CommercialInvoice { get; set; }

    public short OrderStockLocationID { get; set; }

    public bool? Export { get; set; }

    public bool? ExportWithoutPackingNote { get; set; }

    public bool? ConsolidateIndicator { get; set; }

    [StringLength(1)]
    public string? PrintOrderConfirmation { get; set; }

    [StringLength(1)]
    public string? CarriageExempt { get; set; }

    public bool? ProformaTrading { get; set; }

    public int? FOCTradePromotionCodeID { get; set; }

    public byte? SellingCompanyID { get; set; }

    [StringLength(1)]
    public string? GroupageType { get; set; }

    public bool? DirectDelivery { get; set; }

    public byte PackingListCopies { get; set; }

    public byte CreditNoteCopies { get; set; }

    public byte InvoiceCopies { get; set; }

    public bool? ABCPricing { get; set; }

    public short? StandardRollLength { get; set; }

    public bool? MinimumCarriageValueSurcharge { get; set; }

    public bool? DeliveryChangeReconfirmation { get; set; }

    [Column(TypeName = "money")]
    public decimal? ProformaSurcharge { get; set; }

    [StringLength(50)]
    public string? DistributorReference { get; set; }

    public bool? StockOnlyAccount { get; set; }

    public short? ReceivingStockLocationID { get; set; }

    [Required]
    public bool? ContractPricing { get; set; }

    public bool? ProductScreen { get; set; }

    public byte? PaymentDetailsType { get; set; }

    public bool? OutOfStockLetter { get; set; }

    [Required]
    public bool? StatementPrint { get; set; }

    [StringLength(1)]
    public string? InternalOrExternal { get; set; }

    public bool? AllowTillCreditNotes { get; set; }

    public bool? EndCustomerInvoice { get; set; }

    public byte? MertexCultureID { get; set; }

    [StringLength(50)]
    public string? WebtexExcludeList { get; set; }

    [Column(TypeName = "money")]
    public decimal? MinimumOrderValue { get; set; }

    [Required]
    public bool? CheckForDuplicates { get; set; }

    public bool? CancellationLetters { get; set; }

    public bool? StatementActions { get; set; }

    [StringLength(1)]
    public string? InformPromiseDateChange { get; set; }

    [StringLength(100)]
    public string? StoreName { get; set; }

    public bool? MeasurePiece { get; set; }

    public byte? OrderPriority { get; set; }

    public bool? FullOrderOnly { get; set; }

    public bool? SendInvoiceToDeliveryAddress { get; set; }

    public bool? PrintPricesOnDeliveryNote { get; set; }

    public byte? MertexOrderCategoryID { get; set; }

    [StringLength(1)]
    public string? RetailOrContract { get; set; }

    [StringLength(10)]
    public string? ConsolidateInvoiceForHaulier { get; set; }

    public bool? MTMCarriageCharged { get; set; }

    [Column(TypeName = "money")]
    public decimal? CutOffValue { get; set; }

    [Column(TypeName = "money")]
    public decimal? UPSAddOnPercentage { get; set; }

    [StringLength(1)]
    public string? PrintInvoiceAtConfirmation { get; set; }

    public bool? JohnLewisLabels { get; set; }

    [StringLength(4000)]
    public string? ScannerMemo { get; set; }

    [StringLength(4000)]
    public string? ConfirmationMemo { get; set; }

    public bool? Stockist { get; set; }

    [StringLength(10)]
    public string? StockistCategory { get; set; }

    [StringLength(1)]
    public string? ContractOrDisplay { get; set; }

    public bool? Called { get; set; }

    public bool PurchaseOrderLineNumberRequired { get; set; }

    public long? LeadID { get; set; }

    [Required]
    public bool? AllowBotOrderProcessing { get; set; }

    [StringLength(255)]
    public string? DeliveryAlertEmail { get; set; }

    public virtual ICollection<Branch> BranchBranchToWarehouseTransferAccountCodeNavigations { get; set; } = new List<Branch>();

    public virtual ICollection<Branch> BranchSalesAccountCodeNavigations { get; set; } = new List<Branch>();

    public virtual ICollection<Branch> BranchWarehouseToBranchTransferAccountCodeNavigations { get; set; } = new List<Branch>();

    [InverseProperty("OverheadTradeAccount")]
    public virtual ICollection<TradeAccount> InverseOverheadTradeAccount { get; set; } = new List<TradeAccount>();

    public virtual ICollection<Invoice> InvoiceTradeAccountCodeNavigations { get; set; } = new List<Invoice>();

    [InverseProperty("TradeAccount")]
    public virtual ICollection<Invoice> InvoiceTradeAccounts { get; set; } = new List<Invoice>();

    [InverseProperty("TradeAccount")]
    public virtual ICollection<Member> Members { get; set; } = new List<Member>();

    [ForeignKey("OverheadTradeAccountID")]
    [InverseProperty("InverseOverheadTradeAccount")]
    public virtual TradeAccount OverheadTradeAccount { get; set; } = null!;
}
