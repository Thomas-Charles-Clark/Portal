using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Mertex
{
    [Table("TradeAccount", Schema = "Mertex")]
    public partial class TradeAccountLive
    {
        [Key]
        [StringLength(50)]
        public string Code { get; set; }

        public int? TradeAccountCodeNumerical { get; set; }

        [StringLength(1)]
        public string Status { get; set; }

        [Column("CreatedDT", TypeName = "datetime")]
        public DateTime? CreatedDT { get; set; }

        [Column("ModifiedDT", TypeName = "datetime")]
        public DateTime? ModifiedDT { get; set; }

        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(100)]
        public string ContactName { get; set; }

        [StringLength(100)]
        public string SortName { get; set; }

        [StringLength(50)]
        public string PhoneNumber { get; set; }

        [StringLength(254)]
        public string Email { get; set; }

        [StringLength(254)]
        public string MarketingEmail { get; set; }

        [StringLength(200)]
        public string Website { get; set; }

        [StringLength(50)]
        public string CompanyRegistrationNumber { get; set; }

        [Column("EORINumber")]
        [StringLength(50)]
        public string Eorinumber { get; set; }

        [Column("TaxID")]
        [StringLength(50)]
        public string TaxID { get; set; }

        [StringLength(3)]
        public string Currency { get; set; }

        [StringLength(3)]
        public string TradeAccountGroup { get; set; }

        [StringLength(2)]
        public string TradeAccountType { get; set; }

        [StringLength(2)]
        public string TradeAccountClass { get; set; }

        [StringLength(2)]
        public string OrderCategory { get; set; }

        [StringLength(1)]
        public string Market { get; set; }

        [StringLength(10)]
        public string PriceList { get; set; }

        [StringLength(3)]
        public string SalesDivision { get; set; }

        [StringLength(1)]
        public string InternalOrExternal { get; set; }

        public bool MiscellaneousAccount { get; set; }

        [StringLength(3)]
        public string PriceCode { get; set; }

        [StringLength(1)]
        public string ContractOrDisplay { get; set; }

        [StringLength(1)]
        public string RetailOrContract { get; set; }

        public bool Advertiser { get; set; }

        public bool Stockist { get; set; }

        public bool NoEmail { get; set; }

        [StringLength(3)]
        public string SalesRepresentativeCode { get; set; }

        [StringLength(3)]
        public string SalesAgentCode { get; set; }

        [StringLength(10)]
        public string SalesArea { get; set; }

        [StringLength(150)]
        public string InvoiceAddressLine1 { get; set; }

        [StringLength(100)]
        public string InvoiceAddressLine2 { get; set; }

        [StringLength(100)]
        public string InvoiceAddressTown { get; set; }

        [StringLength(100)]
        public string InvoiceAddressCounty { get; set; }

        [StringLength(20)]
        public string InvoiceAddressPostcode { get; set; }

        [StringLength(3)]
        public string InvoiceAddressCountryCode { get; set; }

        public string InvoiceAccounts { get; set; }

        [StringLength(20)]
        public string DefaultDeliveryReference { get; set; }

        public bool SendInvoiceToDeliveryAddress { get; set; }

        [StringLength(10)]
        public string PaymentTerms { get; set; }

        public int? CreditLimit { get; set; }

        public bool CreditStopped { get; set; }

        [StringLength(3)]
        public string BankCode { get; set; }

        [StringLength(10)]
        public string CreditController { get; set; }

        [Column("CreditLimitExpiryDT", TypeName = "datetime")]
        public DateTime? CreditLimitExpiryDT { get; set; }

        public bool HighValueOrderCheckExempt { get; set; }

        public int? InsuredCreditLimit { get; set; }

        public byte? CreditLimitCheckAgainst { get; set; }

        [Column("InsuredCreditLimitExpiryDT", TypeName = "datetime")]
        public DateTime? InsuredCreditLimitExpiryDT { get; set; }

        [StringLength(20)]
        public string Bankrupt { get; set; }

        public bool ExcludeFromInvoicePrint { get; set; }

        public bool SendOverdueLetters { get; set; }

        public byte? OverdueInvoiceGracePeriod { get; set; }

        public byte? OverdueLetter1Delay { get; set; }

        public byte? OverdueLetter2Delay { get; set; }

        public byte? OverdueLetter3Delay { get; set; }

        public byte? OverdueLetter4Delay { get; set; }

        public byte? OverdueLetter5Delay { get; set; }

        [Column("EDIInvoice")]
        public bool Ediinvoice { get; set; }

        public bool CommercialInvoice { get; set; }

        public bool ProformaTrading { get; set; }

        [Column()]
        public decimal? ProformaSurcharge { get; set; }

        [StringLength(1)]
        public string InvoiceDetailPrint { get; set; }

        public byte? CreditNoteCopiesCount { get; set; }

        [Column("ABCPricing")]
        public bool Abcpricing { get; set; }

        public byte? InvoiceCopiesCount { get; set; }

        public bool ContractPricing { get; set; }

        public bool PrintInvoiceDetails { get; set; }

        public bool EndCustomerRequired { get; set; }

        public bool EndCustomerInvoicing { get; set; }

        [StringLength(1)]
        public string CreditCardDetails { get; set; }

        public bool StatementPrint { get; set; }

        public bool RetailTillCustomer { get; set; }

        public bool PermitTillCreditNotes { get; set; }

        [StringLength(50)]
        public string StatementTradeAccountCode { get; set; }

        [StringLength(100)]
        public string StatementAccountName { get; set; }

        [StringLength(40)]
        public string StatementAddressCounty { get; set; }

        [StringLength(60)]
        public string StatementAddressLine1 { get; set; }

        [StringLength(60)]
        public string StatementAddressLine2 { get; set; }

        [StringLength(50)]
        public string StatementAddressTown { get; set; }

        [StringLength(20)]
        public string StatementAddressPostcode { get; set; }

        [StringLength(100)]
        public string StatementContactName { get; set; }

        [StringLength(50)]
        public string StatementPhoneNumber { get; set; }

        public bool PurchaseOrderRequired { get; set; }

        [StringLength(12)]
        public string AnalysisCodeA { get; set; }

        [StringLength(2)]
        public string AnalysisCodeD { get; set; }

        [StringLength(2)]
        public string AnalysisCodeS { get; set; }

        [StringLength(500)]
        public string Memo { get; set; }

        public string Contacts { get; set; }

        [Column("RFScannerMemos")]
        public string RfscannerMemos { get; set; }

        public string ConfirmationMemos { get; set; }

        public string ExtendedMemos { get; set; }

        [StringLength(5)]
        public string FreeOfChargePromotionCode { get; set; }

        [StringLength(10)]
        public string SellingCompany { get; set; }

        [StringLength(10)]
        public string DistributorReference { get; set; }

        public bool TransferAccount { get; set; }

        public bool StockOnlyAccount { get; set; }

        [Column("VATNormalRateCode")]
        [StringLength(1)]
        public string VatnormalRateCode { get; set; }

        [Column("VATNumber")]
        [StringLength(30)]
        public string Vatnumber { get; set; }

        [Column("VATCountry")]
        [StringLength(3)]
        public string Vatcountry { get; set; }

        [Column("VATLastCheckedDT", TypeName = "datetime")]
        public DateTime? VatlastCheckedDT { get; set; }

        [Column("VATNumberValid")]
        [StringLength(3)]
        public string VatnumberValid { get; set; }

        [Column("VATNumberInvalid")]
        [StringLength(50)]
        public string VatnumberInvalid { get; set; }

        [Column("VATInvoiceDisplay")]
        [StringLength(50)]
        public string VatinvoiceDisplay { get; set; }

        [StringLength(10)]
        public string HaulierCode { get; set; }

        [StringLength(10)]
        public string CarriageCode { get; set; }

        [Column("UPSInvoiceAccountNumber")]
        [StringLength(20)]
        public string UpsinvoiceAccountNumber { get; set; }

        [Column("UPSTaxesDutyAccountNumber")]
        [StringLength(20)]
        public string UpstaxesDutyAccountNumber { get; set; }

        [Column("DHLAccountNumber")]
        [StringLength(20)]
        public string DhlaccountNumber { get; set; }

        [Column("TNTAccountNumber")]
        [StringLength(20)]
        public string TntaccountNumber { get; set; }

        [StringLength(3)]
        public string DeliveryTerms { get; set; }

        [StringLength(1)]
        public string GroupageType { get; set; }

        public bool DirectDelivery { get; set; }

        public byte? PackingListCopiesCount { get; set; }

        public bool ApplyMinimumCarriageValueSurcharge { get; set; }

        public bool DeliveryChangeReconfirmation { get; set; }

        public byte? MinimumOrderQuantity { get; set; }

        [StringLength(10)]
        public string ReceivingLocation { get; set; }

        public byte? CutVerify { get; set; }

        public bool OutOfStockLetter { get; set; }

        [StringLength(20)]
        public string DirectToCustomer { get; set; }

        public bool FullOrderOnly { get; set; }

        [Column("UPSReturnsLabel")]
        public bool UpsreturnsLabel { get; set; }

        [Column("UPSAddOnPercentage")]
        public decimal? UpsaddOnPercentage { get; set; }

        public byte? DefaultOrderPriority { get; set; }

        [StringLength(20)]
        public string PartnerCompany { get; set; }

        public bool AcceptSundries { get; set; }

        [StringLength(10)]
        public string SampleStockLocation { get; set; }

        [StringLength(10)]
        public string SampleHaulierCode { get; set; }

        [StringLength(10)]
        public string SampleCarriageCode { get; set; }

        [StringLength(1)]
        public string SampleCarriageExempt { get; set; }

        [StringLength(10)]
        public string DefaultStockLocation { get; set; }

        public bool Export { get; set; }

        public bool ExportWithNoPackingNote { get; set; }

        public bool Consolidate { get; set; }

        [StringLength(1)]
        public string CarriageSurchargeExempt { get; set; }

        [StringLength(1)]
        public string OrderConfirmationPrint { get; set; }

        public bool SendCancellationLetters { get; set; }

        public bool InterimStatementActions { get; set; }

        [StringLength(1)]
        public string InformOnPromiseDateChanged { get; set; }

        public bool ProductScreen { get; set; }

        public bool CheckForDuplicates { get; set; }

        public bool MeasurePiece { get; set; }

        public bool AllocateStockForProformaOrders { get; set; }

        public bool PrintInvoiceAtConfirmation { get; set; }

        public bool PrintUnitPriceOnDeliveryNote { get; set; }

        [Column("PrintJLPEanLabels")]
        public bool PrintJlpeanLabels { get; set; }

        public bool NewPickingListForGoodsInProblemItems { get; set; }

        [Column("MTMCarriageCharged")]
        public bool MtmcarriageCharged { get; set; }

        [Column()]
        public decimal? StandardRollLength { get; set; }

        [StringLength(1)]
        public string FileProtocol { get; set; }

        [Column("UserID")]
        [StringLength(20)]
        public string UserID { get; set; }

        [StringLength(2)]
        public string SampleLetterTitleText { get; set; }

        [StringLength(3)]
        public string ProductExclusionListCode { get; set; }

        [StringLength(2)]
        public string DeliveryDateCalculation { get; set; }

        [Column()]
        public decimal? MinimumOrderValue { get; set; }

        [Column("TillIDCode")]
        [StringLength(10)]
        public string TillIdcode { get; set; }

        [StringLength(5)]
        public string UsualOrderUnit { get; set; }

        [StringLength(20)]
        public string StoreName { get; set; }

        [StringLength(200)]
        public string TransferAddress { get; set; }

        [StringLength(20)]
        public string TransferPassword { get; set; }

        [StringLength(3)]
        public string HaulierCodeForConsolidatedInvoice { get; set; }

        public int? CutOffValue { get; set; }

        public byte? DaysForwardForReservations { get; set; }

        [Column("eCommerceCustomer")]
        public bool ECommerceCustomer { get; set; }

        [Column("SSField2")]
        [StringLength(50)]
        public string Ssfield2 { get; set; }

        [StringLength(50)]
        public string CreditControlRegion { get; set; }

        [Column("SSField5")]
        [StringLength(50)]
        public string Ssfield5 { get; set; }

        [StringLength(2)]
        public string StockistCategory { get; set; }

        [StringLength(254)]
        public string ExitCodeEmail { get; set; }

        [Column("DeletedDT")]
        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }
    }
}