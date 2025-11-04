using Newtonsoft.Json;

using SharedEFClasses.Models.Fenwick;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Mertexer;
using SharedEFClasses.Models.OrderEntry;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.SessionState;

namespace SharedEFClasses.Models.Orders
{
    public class PassOrderEntryProductSearch
    {
        public int TradeAccountID { get; set; }
        public byte? ProductTypeGroupID { get; set; }
        public string SearchTerm { get; set; }
        public byte? ProductTypeID { get; set; }
        public byte? BrandID { get; set; }
        public short? CollectionID { get; set; }
        public short? QualityID { get; set; }
        public int? ProductID { get; set; }
        public string CodeLike { get; set; }
        public string CodeNotLike { get; set; }
        public string ProductRangeFilter { get; set; }
        public bool Seasonal { get; set; }
    }

    public class ProductRangeButton
    {
        [Key]
        public byte ProductRangeID { get; set; }
        public byte? ProductTypeID { get; set; }
        public byte? ProductTypeGroupID { get; set; }
        public string Name { get; set; }
        public byte SortOrder { get; set; }
        public bool Deleted { get; set; }
        public string CodeLike { get; set; }
        public string CodeNotLike { get; set; }
        public bool Seasonal { get; set; }
    }

    public class ProductRangeButtonCacheResult
    {
        public List<ProductRangeButton> Buttons { get; set; }
    }

    [Table("OrderLineStatus", Schema = "dbo")]
    public class OrderLineStatus
    {
        [Key]
        public short OrderLineStatusID { get; set; }
        public string Name { get; set; }
        public byte OrderLineStatusGroupID { get; set; }

        [JsonIgnore]
        public virtual OrderLineStatusGroup OrderLineStatusGroup { get; set; }
    }

    [Table("OrderLineStatusGroup", Schema = "dbo")]
    public class OrderLineStatusGroup
    {
        [Key]
        public byte OrderLineStatusGroupID { get; set; }
        public string Name { get; set; }
        public bool Outstanding { get; set; }
        public byte SortOrder { get; set; }

        [NotMapped]
        public int Count { get; set; }

        public ICollection<OrderLineStatus> OrderLineStatuses { get; set; }
    }

    [Table("TradePromotionCode", Schema = "dbo")]
    public class TradePromotionCode
    {
        [Key]
        public int TradePromotionCodeID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public DateTime OnDate { get; set; }
        public DateTime? OffDate { get; set; }
        public bool Enabled { get; set; }
        public short? TradePromotionProductGroupID { get; set; }
        public byte? BrandID { get; set; }
        public byte? TradeMarketID { get; set; }
        public char? Type { get; set; }
        public bool FOC { get; set; }
        public short? BudgetManagerID { get; set; }

        [ForeignKey("BudgetManagerID")]
        public virtual BudgetManager BudgetManager { get; set; }

        [NotMapped]
        public string TradePromotionName
        {
            get
            {
                return Description;
            }
        }

        [NotMapped]
        public string BudgetManagerName
        {
            get
            {
                return BudgetManager?.Name;
            }
        }

        [NotMapped]
        public string BudgetManagerCode
        {
            get
            {
                return BudgetManager?.Code;
            }
        }
    }

    [Table("BudgetManager", Schema = "portal")]
    public class BudgetManager
    {
        [Key]
        public short BudgetManagerID { get; set; }

        public string Code { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("BudgetManager")]
        public virtual ICollection<TradePromotionCode> TradePromotionCodes { get; set; }
    }

    [Table("Basket", Schema = "portal")]
    public class Basket
    {
        [Key]
        public long BasketID { get; set; }
        public byte TransactionTypeID { get; set; }
        public int TradeAccountID { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime ExpiryDT { get; set; }
        public int CreatedMemberID { get; set; }
        public int? LockedByMemberID { get; set; }
        public int? OwnerMemberID { get; set; }
        public string OrderReference { get; set; }
        public string OrderTaker { get; set; }
        public string DeliveryName { get; set; }
        public string DeliveryCompanyName { get; set; }
        public string DeliveryAddressLine1 { get; set; }
        public string DeliveryAddressLine2 { get; set; }
        public string DeliveryTown { get; set; }
        public string DeliveryCounty { get; set; }
        public string DeliveryPostcode { get; set; }
        public short? DeliveryCountryID { get; set; }
        public string DeliveryPhoneNumber { get; set; }
        public DateTime? ModifiedDT { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
        public byte PaymentTermsID { get; set; }
        public short SalesRepresentativeID { get; set; }
        public string VATCountryCode { get; set; }
        public string VATNumber { get; set; }
        public bool? ValidVATNumber { get; set; }
        public byte? CurrencyID { get; set; }
        public decimal? SterlingExchangeRate { get; set; }
        public char? VATCode { get; set; }
        public string DeliveryReference { get; set; }
        public DateTime? SubmittedDT { get; set; }
        public DateTime? ProcessedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool AllocationPermitted { get; set; }
        public bool CreditStop { get; set; }
        public bool HeldForSales { get; set; }
        public string HeldForSalesReasonCode { get; set; }
        public bool? CustomerRequestsFullDespatch { get; set; }
        public string HaulierAccountNumberForShippingCharge { get; set; }
        public string HaulierAccountNumberForDuty { get; set; }
        public string RaisedAsResultOfClaim { get; set; }
        public bool IsContractOrder { get; set; }
        public bool? AllocateProforma { get; set; }
        public short? SalesAgentID { get; set; }
        public string Email { get; set; }
        public string USTaxExemptionCertificate { get; set; }
        public string EndCustomerTradeAccountCode { get; set; }
        public string EndCustomerTradeAccountName { get; set; }

        public string MiscellaneousAccountInvoiceFullName { get; set; }
        public string MiscellaneousAccountInvoiceCompanyName { get; set; }
        public string MiscellaneousAccountInvoiceAddressLine1 { get; set; }
        public string MiscellaneousAccountInvoiceAddressLine2 { get; set; }
        public string MiscellaneousAccountInvoiceTown { get; set; }
        public string MiscellaneousAccountInvoiceCounty { get; set; }
        public string MiscellaneousAccountInvoicePostcode { get; set; }
        public string MiscellaneousAccountInvoicePhoneNumber { get; set; }
        public string MiscellaneousAccountInvoiceCountryCode { get; set; }
        public short? MiscellaneousAccountInvoiceCountryID { get; set; }
        public string MiscellaneousAccountInvoiceEmail { get; set; }

        public string EUExitCode { get; set; }
        public string EUExitFullName { get; set; }
        public string EUExitCompanyName { get; set; }
        public string EUExitAddressLine1 { get; set; }
        public string EUExitAddressLine2 { get; set; }
        public string EUExitTown { get; set; }
        public string EUExitCounty { get; set; }
        public string EUExitPostcode { get; set; }
        public string EUExitPhoneNumber { get; set; }
        public string EUExitCountryCode { get; set; }
        public short? EUExitCountryID { get; set; }

        public short? SavedBasketReasonID { get; set; }

        public string ReplacementOrderComment { get; set; }

        public int? DiscountApprovedByManagerMemberID { get; set; }
        public string DiscountManagerMessage { get; set; }
        public bool? DuplicateLineAcknowledgement { get; set; }
        public byte? CallTypeID { get; set; }
        public string CallerName { get; set; }

        public string CustomerRequestDeliveryServiceName { get; set; }
        public string CustomerRequestHaulierCode { get; set; }
        public string CustomerRequestServiceCode { get; set; }
        public string CustomerRequestHaulierAccountNumberForShippingCharge { get; set; }
        public string CustomerRequestHaulierAccountNumberForDuty { get; set; }
        public string CustomerRequestDeliveryTerms { get; set; }
        public string CustomerRequestDeliveryType { get; set; }
        public string CustomerRequestDeliveryAddress { get; set; }

        public bool DeletePermitted { get; set; }

        public byte? LastPhaseVisited { get; set; }

        public string RetailTillNumber { get; set; }
        public string RetailSessionNumber { get; set; }


        public bool HeldForManagementApproval { get; set; }
        public string HeldForManagementApprovalReason { get; set; }

        public bool MertexVATLookupSuccessful { get; set; }

        public bool UserRefusedAddressRecommendation { get; set; }

        public string DeliveryAlertLandlinePhoneNumber { get; set; }
        public string DeliveryAlertLandlinePhoneCountryCode { get; set; }
        public string DeliveryAlertMobilePhoneNumber { get; set; }
        public string DeliveryAlertMobilePhoneCountryCode { get; set; }
        public string DeliveryAlertEmail { get; set; }
        public string DeliveryContactName { get; set; }

        public string EORI { get; set; }

        public bool SendReserveBatchCuttingsExpress { get; set; }

        public string VIESConsultationNumber { get; set; }

        public bool? EUExitingConfirmed { get; set; }

        public bool IsDeliveryAddressTrade { get; set; }

        public bool ReadOnly { get; set; }


        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool OverCreditLimit { get; set; }

        [ForeignKey("CallTypeID")]
        public CallType CallType { get; set; }

        [ForeignKey("TransactionTypeID")]
        public virtual TransactionType TransactionType { get; set; }

        [ForeignKey("SavedBasketReasonID")]
        public virtual SavedBasketReason SavedBasketReason { get; set; }

        [ForeignKey("DeliveryCountryID")]
        public virtual Country DeliveryCountry { get; set; }

        [ForeignKey("OrderTaker")]
        public virtual MertexOperator MertexOperator { get; set; }

        [ForeignKey("PaymentTermsID")]
        public virtual PaymentTerms PaymentTerms { get; set; }

        [ForeignKey("SalesRepresentativeID")]
        public virtual SalesRepresentative SalesRepresentative { get; set; }

        [ForeignKey("CurrencyID")]
        public virtual Currency Currency { get; set; }

        [ForeignKey("SalesAgentID")]
        public virtual SalesAgent SalesAgent { get; set; }

        [JsonIgnore]
        [ForeignKey("LockedByMemberID")]
        public virtual Member LockedByMember { get; set; }

        [ForeignKey("TradeAccountID")]
        public virtual TradeAccount TradeAccount { get; set; }

        public virtual ICollection<BasketItem> BasketItems { get; set; }

        public virtual ICollection<Transaction> Transactions { get; set; }

        [InverseProperty("Basket")]
        public virtual ICollection<Basket_DeliveryService> BasketDeliveryServices { get; set; }

        [NotMapped]
        public string Status
        {
            get
            {
                return "";
            }
        }

        [NotMapped]
        public string Market
        {
            get
            {
                return TradeAccount.Market;
            }
        }

        [NotMapped]
        public string LastModified
        {
            get
            {
                return PortalFramework.DateTimeDistanceString(ModifiedDT, true, false);
            }
        }

        [NotMapped]
        public bool HasAllocations
        {
            get
            {
                return BasketItems.Where(p => p.BasketPreAllocations.Where(q => q.Deleted == false).Any()).Any();
            }
        }

        [NotMapped]
        public string AllocationsExpire
        {
            get
            {
                return PortalFramework.DateTimeDistanceString(ExpiryDT, true, false);
            }
        }

        [NotMapped]
        public bool Imported
        {
            get
            {
                return false;
            }
        }
    }


    [Table("Basket_DeliveryService", Schema = "portal")]
    public class Basket_DeliveryService
    {
        [Key]
        [Column(Order = 1)]
        public long BasketID { get; set; }

        [Key]
        [Column(Order = 2)]
        public string BasketSplitID { get; set; }

        public string ParentBasketSplitID { get; set; }

        public string BasketSplitName { get; set; }

        public int? TradeAccountID { get; set; }

        public byte? SalesMarketID { get; set; }

        public string MertexCurrencyCode { get; set; }

        public string HaulierCodeGroup { get; set; }

        public string HaulierCode { get; set; }

        public string HaulierName { get; set; }

        public string ServiceCode { get; set; }

        public string ServiceName { get; set; }

        public string DeliveryType { get; set; }

        public string DeliveryTerms { get; set; }

        public string TransportBilledToCode { get; set; }

        public string TransportBilledToName { get; set; }

        public string DutyTaxBilledToCode { get; set; }

        public string DutyTaxBilledToName { get; set; }

        public long Preference { get; set; }

        public long? HaulierSortOrder { get; set; }

        public string ServiceDataOrigin { get; set; }

        public int? ServiceDataOriginID { get; set; }

        public string HaulierServiceCode { get; set; }

        public bool? ExpressService { get; set; }

        public decimal? ParcelWeight { get; set; }

        public decimal? ParcelLengthCM { get; set; }

        public decimal? ParcelWidthCM { get; set; }

        public decimal? ParcelHeightCM { get; set; }

        public byte? DeliveryChargingLogicID { get; set; }

        public string DeliveryChargingLogicName { get; set; }

        public byte? SurchargeDeliveryChargingLogicID { get; set; }

        public string SurchargeDeliveryChargingLogicName { get; set; }

        public decimal? UnitDeliveryChargeExOriginCurrency { get; set; }

        public decimal? UnitDeliveryChargeEx { get; set; }

        public decimal? UnitDeliverySurchargeEx { get; set; }

        public decimal? UnitDeliveryVAT { get; set; }

        public decimal? TotalDeliveryChargeExOriginCurrency { get; set; }

        public decimal? TotalDeliveryChargeEx { get; set; }

        public decimal? TotalDeliveryVAT { get; set; }

        public decimal? FinalDeliveryChargeEx { get; set; }

        public decimal? FinalDeliveryVAT { get; set; }

        public byte? FinalDeliveryChargingLogicID { get; set; }

        public string FinalDeliveryChargingLogicName { get; set; }

        public decimal? PricelistUnitChargeEx { get; set; }

        public byte? PricelistProportionalCharge { get; set; }

        public decimal? ContractChargeEx { get; set; }

        public decimal? OperatorEnteredChargeEx { get; set; }

        public byte? OperatorEnteredChargingLogicID { get; set; }

        public decimal? CourierCostEx { get; set; }

        public byte? CourierMarkupPercentage { get; set; }

        public decimal? CourierSurchargeEx { get; set; }

        public string DeliveryDetailsJSON { get; set; }

        public byte SourceCurrencyID { get; set; }

        public string SourceCurrencyCode { get; set; }

        public decimal? GBPtoSourceCurrencyFX { get; set; }

        public byte TargetCurrencyID { get; set; }

        public string TargetCurrencyCode { get; set; }

        public decimal? GBPtoTargetCurrencyFX { get; set; }

        public bool Quote { get; set; }

        public bool CalculateTotalDeliveryCharge { get; set; }

        public byte PaymentTermsID { get; set; }

        public string Threshold { get; set; }

        public string SurchargeThreshold { get; set; }

        public short? EstimatedParcelCount { get; set; }

        public decimal? AvgParcelWeightKG { get; set; }

        public decimal? CalculatedAvgParcelWeightKG { get; set; }

        public decimal? AvgPalletWeightKG { get; set; }

        public short? EstimatedPalletCount { get; set; }

        public decimal? WeightBracket { get; set; }

        public string OrderDataOrigin { get; set; }

        public decimal? OrderTotal { get; set; }

        public decimal? OrderWeight { get; set; }

        public decimal? OrderQuantity { get; set; }

        public int? ItemCount { get; set; }

        public int? SeatCount { get; set; }

        public decimal? OrderDiscountPercentage { get; set; }

        public string DeliveryGroupName { get; set; }

        public byte DeliveryGroupID { get; set; }

        public byte FulfilmentTypeID { get; set; }

        public bool CustomerRequestsFullDespatch { get; set; }

        public decimal? OperatorDiscountPercentage { get; set; }

        public decimal? PromotionalDeliveryDiscountPercentage { get; set; }

        public byte? DiscountReasonID { get; set; }

        public string DiscountReasonComment { get; set; }

        public int? TradePromotionCodeID { get; set; }

        public DateTime? DeliveryEstimateMin { get; set; }

        public DateTime? DeliveryEstimateMax { get; set; }

        public bool? AllowCustomerHaulierAccountForTransportCharges { get; set; }

        public bool? AllowCustomerHaulierAccountForDutyAndTax { get; set; }

        public bool? OfferConsolidatedShipment { get; set; }

        public short? OriginCountryID { get; set; }

        public string OriginCountryName { get; set; }

        public short? DestinationCountryID { get; set; }

        public string DestinationCountryName { get; set; }

        public bool? DestinationInEU { get; set; }

        public string EUExitCode { get; set; }

        public string VATNumber { get; set; }

        public bool? ValidVATNumber { get; set; }

        public string VATCode { get; set; }

        public decimal? VATRate { get; set; }

        public string From { get; set; }

        public short? OriginStockLocationID { get; set; }

        public byte? OriginStockLocationSiteID { get; set; }

        public string SupplierCompanyName { get; set; }

        public string SupplierAddressLine1 { get; set; }

        public string SupplierAddressLine2 { get; set; }

        public string SupplierTown { get; set; }

        public string SupplierCounty { get; set; }

        public string SupplierPostcode { get; set; }

        public short? SupplierCountryID { get; set; }

        public string SupplierCountryCode { get; set; }

        public string To { get; set; }

        public byte? DestinationStockLocationSiteID { get; set; }

        public short? DestinationStockLocationID { get; set; }

        public string DeliveryName { get; set; }

        public string DeliveryCompanyName { get; set; }

        public string DeliveryAddressLine1 { get; set; }

        public string DeliveryAddressLine2 { get; set; }

        public string DeliveryTown { get; set; }

        public string DeliveryCounty { get; set; }

        public string DeliveryPostcode { get; set; }

        public short? DeliveryCountryID { get; set; }

        public string DeliveryCountryCode { get; set; }

        public string DeliveryPhoneNumber { get; set; }

        public string DeliveryReference { get; set; }

        public short? DeliveryZoneID { get; set; }

        public string DeliveryZoneName { get; set; }

        public string RetailPaymentsJSON { get; set; }

        [JsonIgnore]
        [ForeignKey("BasketID")]
        public virtual Basket Basket { get; set; }
    }

    [Table("CallType", Schema = "portal")]
    public class CallType
    {
        [Key]
        public byte CallTypeID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("CallType")]
        public virtual ICollection<Basket> Baskets { get; set; }
    }

    [Table("Transaction", Schema = "mbr")]
    public class Transaction
    {
        [Key]
        public int TransactionID { get; set; }

        public int TradeAccountID { get; set; }
        
        public long? BasketID { get; set; }

        public string Email { get; set; }

        [JsonIgnore]
        [InverseProperty("Transactions")]
        public virtual Basket Basket { get; set; }

        [JsonIgnore]
        [InverseProperty("Transaction")]
        public virtual ICollection<OrderHead> OrderHeads { get; set; }

        [InverseProperty("Transaction")]
        public virtual ICollection<TransactionHoldReason> HoldReasons { get; set; }
    }

    [Table("Transaction_HoldReason", Schema = "mbr")]
    public class TransactionHoldReason
    {
        [Key]
        [Column(Order = 1)]
        public long TransactionHoldReasonID { get; set; }

        [Key]
        [Column(Order = 2)]
        public int TransactionID { get; set; }

        [Key]
        [Column(Order = 3)]
        public short HoldReasonID { get; set; }

        public DateTime CreatedDT { get; set; }

        public int CreatedMemberID { get; set; }

        public DateTime? ReleasedDT { get; set; }
        public int? ReleasedMemberID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Released { get; set; }

        [JsonIgnore]
        [ForeignKey("TransactionID")]
        public virtual Transaction Transaction { get; set; }

        [ForeignKey("HoldReasonID")]
        public virtual HoldReason HoldReason { get; set; }
    }

    [Table("OrderHead", Schema = "mbr")]
    public class OrderHead
    {
        [Key]
        public int OrderHeadID { get; set; }

        public int TransactionID { get; set; }

        public string BasketSplitID { get; set; }

        public DateTime? AcceptedByMertexDT { get; set; }

        [ForeignKey("TransactionID")]
        public virtual Transaction Transaction { get; set; }

        [JsonIgnore]
        public virtual ICollection<OrderLine> OrderLines { get; set; }

        [JsonIgnore]
        [InverseProperty("OrderHead")]
        public virtual ICollection<SelfBillInvoice> FenwickSelfBillInvoices { get; set; }
    }


    [Table("OrderLine", Schema = "mbr")]
    public class OrderLine
    {
        [Key]
        public long OrderLineID { get; set; }

        public int OrderHeadID { get; set; }

        public short? GiftVoucherID { get; set; }

        public DateTime? SupplierInvoiceDate { get; set; }
        public DateTime? SupplierInvoiceApprovedDT { get; set; }
        public bool SupplierInvoiceApproved { get; set; }
        public string SupplierInvoiceNumber { get; set; }
        public decimal? SupplierInvoiceCharge { get; set; }
        public string SupplierInvoiceComments { get; set; }

        public string GiftVoucherMessage { get; set; }

        public virtual OrderHead OrderHead { get; set; }

        [JsonIgnore]
        [InverseProperty("OrderLines")]
        public virtual GiftVoucher GiftVoucher { get; set; }
    }

    [Table("BasketItem", Schema = "portal")]
    public class BasketItem
    {
        [Key]
        public long BasketItemID { get; set; }

        public long BasketID { get; set; }

        public int ProductID { get; set; }

        public string LineReference { get; set; }

        public decimal Quantity { get; set; }

        public virtual ICollection<BasketPreAllocation> BasketPreAllocations { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [ForeignKey("BasketID")]
        public virtual Basket Basket { get; set; }

        [InverseProperty("BasketItem")]
        public virtual ICollection<BasketItemLineMemo> BasketItemLineMemos { get; set; }

        [JsonIgnore]
        [ForeignKey("ProductID")]
        public virtual Product Product { get; set; }
    }

    [Table("BasketPreAllocation", Schema = "portal")]
    public class BasketPreAllocation
    {
        [Key]
        public long BasketPreAllocationID { get; set; }

        public long BasketItemID { get; set; }

        public long? RingFencePreAllocationID { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [InverseProperty("BasketPreAllocations")]
        public virtual BasketItem BasketItem { get; set; }

        [JsonIgnore]
        [InverseProperty("BasketPreAllocations")]
        public virtual RingFencePreAllocation RingFencePreAllocation { get; set; }
    }

    public class PassBasketCreation
    {
        public int MemberID { get; set; }
        public int TradeAccountID { get; set; }
        public string TradeAccountCode { get; set; }
    }

    public class PassBasketItemAdd
    {
        public int TradeAccountID { get; set; }
        public int MemberID { get; set; }
        public long BasketID { get; set; }
        public byte BasketItemTypeID { get; set; }
        public int ProductID { get; set; }
        public decimal Quantity { get; set; }
        public bool BackOrder { get; set; }
        public short? StockLocationID { get; set; }
        public string LineReference { get; set; }
        public byte? FulfilmentTypeID { get; set; }
        public byte OrderTypeID { get; set; }
        public DateTime? ForwardOrderDate { get; set; }
        public int? FeelerProductID { get; set; }
        public decimal? HeaderWidth { get; set; }
        public string FeelerLength { get; set; }
        public string Memo { get; set; }
        public bool? WaterfallRequired { get; set; }

        public short? BespokeWidth { get; set; }
        public short? BespokeLength { get; set; }
        public short? BespokeDiameter { get; set; }
        public string CADEmail { get; set; }
        public decimal? BespokeSize { get; set; }
        public byte? BespokeTreatmentID { get; set; }
        public int? BespokeModelProductID { get; set; }
        public string ProcessAnswersJSON { get; set; }
        public bool WithBatchCutting { get; set; }

        public string SupplierAccountCode { get; set; }
        public string SupplierFullName { get; set; }
        public string SupplierCompanyName { get; set; }
        public string SupplierAddressLine1 { get; set; }
        public string SupplierAddressLine2 { get; set; }
        public string SupplierTown { get; set; }
        public string SupplierCounty { get; set; }
        public string SupplierPostcode { get; set; }
        public string SupplierPhoneNumber { get; set; }
        public string SupplierCountryCode { get; set; }
        public short? SupplierCountryID { get; set; }

        public string PurchaseOrderLineNumber { get; set; }
    }

    public class PassBespokeBasketItemSave : PassBasketItemAdd
    {
        public long BasketItemID { get; set; }
    }

    public class PassBasketItem : PassBasketItemAdd
    {
        public long BasketItemID { get; set; }
    }

    public class PassBasketItemAllocationFetch
    {
        public int MemberID { get; set; }
        public int ProductID { get; set; }
        public int TradeAccountID { get; set; }
        public long BasketItemID { get; set; }
        public int BasketID { get; set; }
    }

    public class PassBasketItemAllocationSave
    {
        public long BasketItemID { get; set; }
        public byte? PackingMethodID { get; set; }
        public string CutLengthJSON { get; set; }
        public bool BatchCuttingIndicator { get; set; }
        //public bool FoldingDisclaimerAccepted { get; set; }
    }

    public class PassAdditionalProductsFetch
    {
        public int ProductID { get; set; }
        public int TradeAccountID { get; set; }
    }

    public class PassBasketItemEditFetch
    {
        public int TradeAccountID { get; set; }
        public long BasketID { get; set; }
        public long BasketItemID { get; set; }
    }

    public class BasketItemAllocationFetchResult
    {
        public List<BasketItemAllocation> Allocations { get; set; }
        public List<AllocationStockLocation> StockLocations { get; set; }
        public AllocationNotice AllocationNotices { get; set; }
        public AllocationDetails BasketItemDetails { get; set; }
        public List<WideWidthFabricControl> WideWidthFabricControls { get; set; }
    }

    public class AllocationDetails
    {
        public string CutLengthJSON { get; set; }
        public byte? MaxFoldLength { get; set; }
        public bool? BatchCuttingIndicator { get; set; }
        public string SupplierAvailabilityMessage { get; set; }
        public bool WideWidthFabric { get; set; }
        public string DefaultPoleWidth { get; set; }
    }

    public class WideWidthFabricControl
    {
        public string PoleWidth { get; set; }
        public byte? PackingMethodID { get; set; }
        public bool AllowWideWidthFabricToShipInABox { get; set; }
        public bool AllowWideWidthFabricToShipOnAStandardWidthPole { get; set; }
        public bool AllowWideWidthFabricToShipOnAWideWidthPole { get; set; }
        public string WideWidthMessage { get; set; }
    }

    public class BasketItemAllocation
    {
        public long SortOrder { get; set; }
        public string Source { get; set; }
        public string StockLocationCode { get; set; }
        public string StockLocationName { get; set; }
        public string ProductCode { get; set; }
        public string Batch { get; set; }
        public string Piece { get; set; }
        public bool Pickable { get; set; }
        public decimal QuantityAvailable { get; set; }
        public decimal QuantityAllocated { get; set; }
        public long? RingFencePreAllocationID { get; set; }
        public long? BasketPreAllocationID { get; set; }
        public decimal? ReserveBuffer { get; set; }
        public string FabricPoleWidth { get; set; }
    }

    public class AllocationStockLocation
    {
        public short StockLocationID { get; set; }
        public string StockLocationCode { get; set; }
        public string StockLocationName { get; set; }
    }

    public class AllocationNotice
    {
        public string GeneralAllocationsMessage { get; set; }
        public string DisableRingFenceAllocationsMessage { get; set; }
        public string DisableFreeStockAllocationsMessage { get; set; }
        public decimal ReserveBuffer { get; set; }
        public string PreventBackOrdersMessage { get; set; }
        public string AllocationRequest { get; set; }
    }

    public class BasketItemAllocationStockFetchResult
    {
        public short StockLocationID { get; set; }
        public string StockLocationCode { get; set; }
        public string StockLocationName { get; set; }
        public long StockLocationSortOrder { get; set; }
        public string Batch { get; set; }
        public string Piece { get; set; }
        public long SortOrder { get; set; }
        public decimal? AvailableNowQuantity { get; set; }
        public decimal? WaitingToBePutAwayQuantity { get; set; }
        public decimal? BulkQuantity { get; set; }
        public decimal? ThisCustomerRingFencedQuantity { get; set; }
        public decimal? OtherCustomerRingFencedQuantity { get; set; }
        public decimal OnReserveQuantity { get; set; }
        public decimal DueInQuantity { get; set; }
        public DateTime? DueInDate { get; set; }
        public string DueInMessage { get; set; }
        public bool? POConfirmed { get; set; }
        public bool? POOnCallOff { get; set; }
    }

    public class ProductStockFetchResult : BasketItemAllocationStockFetchResult
    {
        public int ProductID { get; set; }
        public string ProductCode { get; set; }
    }

    public class FetchStockInfoResult
    {
        public List<ProductStockFetchResult> stockResults { get; set; }
        public List<StockInfoAvailabilityMessage> availabilityMessages { get; set; }
        public StockCheckRequestSelectResult stockCheckRequest { get; set; }
    }

    public class StockInfoAvailabilityMessage
    {
        public int ProductID { get; set; }
        public string SupplierAvailabilityMessage { get; set; }
        public bool ExecuteStockCheckRequest { get; set; }
        public string @Class { get; set; }
    }

    public class PassBasketItemAllocationInstruction
    {
        public long BasketItemID { get; set; }
    }

    public class PassBasketID
    {
        public long BasketID { get; set; }
    }


    public class PassBasketSplitRequest
    {
        public long BasketID { get; set; }
        public IEnumerable<long> BasketItemIDs { get; set; }
    }

    public class PassProductCode
    {
        public string code { get; set; }
    }

    public class PassBasketPhaseChange
    {
        public long BasketID { get; set; }
        public byte PhaseID { get; set; }
    }

    public class PassTransactionID
    {
        public int TransactionID { get; set; }
    }

    public class PassBasketFetch
    {
        public long BasketID { get; set; }
        public bool? RecalculatePrices { get; set; }
    }

    public class BasketStatusCheckResult
    {
        public bool Active { get; set; }
        public string OperatorMessage { get; set; }
    }

    public class PassBasketSplit : PassBasketID
    {
        public string BasketSplitID { get; set; }
    }

    public class PassBasketUnlock
    {
        public long BasketID { get; set; }
        public int NotifyUserID { get; set; }
    }

    public class PassBasket
    {
        public long BasketID { get; set; }
        public string OrderReference { get; set; }
    }

    public class BasketSelectResult
    {
        public long BasketID { get; set; }
        public string Status { get; set; }
        public string StatusHover { get; set; }
        public string HeldReason { get; set; }
        public string Market { get; set; }
        public string MarketHover { get; set; }
        public string CustomerCode { get; set; }
        public string Customer { get; set; }
        public string CustomerHover { get; set; }
        public string OrderReference { get; set; }
        public string BasketValue { get; set; }
        public string HasAllocations { get; set; }
        public string HasAllocationsHover { get; set; }
        public string Modified { get; set; }
        public string Expires { get; set; }
        public bool CreditStop { get; set; }
        public bool OverCreditLimit { get; set; }
        public string CustomerRequestDeliveryServiceName { get; set; }
        public string CustomerRequestHaulierCode { get; set; }
        public string CustomerRequestServiceCode { get; set; }
        public string CustomerRequestHaulierAccountNumberForShippingCharge { get; set; }
        public string CustomerRequestHaulierAccountNumberForDuty { get; set; }
        public string CustomerRequestDeliveryTerms { get; set; }
        public string CustomerRequestDeliveryType { get; set; }
        public string CustomerRequestDeliveryAddress { get; set; }
        public bool? CustomerRequestsFullDespatch { get; set; }
        public bool DeletePermitted { get; set; }
        public bool Imported { get; set; }
        public bool MertexVATLookupSuccessful { get; set; }
        public bool UserRefusedAddressRecommendation { get; set; }
        public byte? OrderImportSourceID { get; set; }
        public string OrderImportSource { get; set; }
        public string DeliveryAlertLandlinePhoneNumber { get; set; }
        public string DeliveryAlertLandlinePhoneCountryCode { get; set; }
        public string DeliveryAlertMobilePhoneNumber { get; set; }
        public string DeliveryAlertMobilePhoneCountryCode { get; set; }
        public string DeliveryAlertEmail { get; set; }
        public DateTime CreatedDT { get; set; }
        public string BasketBOTError { get; set; }
        public string BasketBOTErrorDetails { get; set; }

        [NotMapped]
        public object basketBotErrorDetails
        {
            get
            {
                return JsonConvert.DeserializeObject(BasketBOTErrorDetails ?? "");
            }
            set
            {
            }
        }
        
        public bool ReadOnly { get; set; }
        
        public TradeAccount TradeAccount { get; set; }
        public List<BasketItem> BasketItems { get; set; }
        public List<BasketItemLineMemo> BasketItemLineMemos { get; set; }
        public object BasketItemCustomerLineMemoDisplay
        {
            get
            {
                var result = "";

                BasketItems?.ForEach(bi =>
                {
                    result += $@"<div class=""basket-line-memo-panel {(bi == BasketItems.Last() ? "last-basket-line-memo-panel" : "")}"">
                        {(bi.Product?.ImageID != null ? $@"<img src=""https://www.designersguild.com/image/90/{bi.Product.ImageID}""/>" : "")}
                        <div>
                            <h4>{bi.Product?.BasketName}</h4>
                            {bi.Product?.Code} &times; {bi.Quantity}";

                    BasketItemLineMemos?.Where(p => p.BasketItemID == bi.BasketItemID && p.LineMemoType?.AlertOperator == true).ToList().ForEach(c =>
                    {
                        result += $@"<div class=""memo well"">
                                                    {c.LineMemo?.Replace(Environment.NewLine, "<br/><br/>").Replace(@"\n", "<br/>")}
                                                </div>";
                    });

                    result += @"</div>
                        </div>";
                });

                if (!String.IsNullOrEmpty(result))
                {
                    result = $@"<div class=""basket-details-popover-content"">
                                    <h4 class=""basket-line-request-heading"">
                                        Customer Requests
                                    </h4>
                                    {result}
                                </div>
                                <div class=""basket-line-memo-footer"">
                                    {StatusHover}
                                </div>";
                }
                else
                {
                    result = $@"<div class=""basket-line-memo-footer"">
                                    {StatusHover}
                                </div>";
                }

                return result;
            }
        }
    }

    public class HeldOrderSelectResult
    {
        public string Reference { get; set; }
        public string HeldReasons { get; set; }
        public object heldReasons
        {
            get
            {
                return JsonConvert.SerializeObject(HeldReasons);
            }
            set
            {

            }
        }
        public string Market { get; set; }
        public string CustomerCode { get; set; }
        public string CustomerName { get; set; }
        public string CustomerReference { get; set; }
        public string Value { get; set; }
        public bool HasAllocations { get; set; }
        public string HasAllocationsHover { get; set; }
        public DateTime? ModifiedDT { get; set; }
        public DateTime? Expires { get; set; }
        public bool AllowBasketView { get; set; }
        public bool AllowBasketEdit { get; set; }
        public bool AllowBasketRelease { get; set; }
        public bool AllowBasketDelete { get; set; }
        public bool AllowTransactionView { get; set; }
        public bool AllowTransactionEdit { get; set; }
        public bool AllowTransactionRelease { get; set; }
        public bool AllowTransactionDelete { get; set; }
        public bool AllowRetailPaymentDetails { get; set; }
        public long? BasketID { get; set; }
        public int? TransactionID { get; set; }
        public bool Imported { get; set; }
        public byte LanguageID { get; set; }
        public bool ReadOnly { get; set; }

        public DateTime HeldSince { get; set; }

        public string DocumentSendHistory { get; set; }

        public string HoldReasonIDsString { get; set; }

        public string HoldReasonGroupIDsString { get; set; }

        public string Documents { get; set; }

        public object documents
        {
            get
            {
                return JsonConvert.DeserializeObject(Documents ?? "");
            }
            set
            {

            }
        }

        //public string Status { get; set; }
        //public string StatusHover { get; set; }
        //public string HeldReason { get; set; }
        //public string Market { get; set; }
        //public string MarketHover { get; set; }
        //public string CustomerCode { get; set; }
        //public string Customer { get; set; }
        //public string CustomerHover { get; set; }
        //public string OrderReference { get; set; }
        //public string BasketValue { get; set; }
        //public string HasAllocations { get; set; }
        //public string HasAllocationsHover { get; set; }
        //public string Modified { get; set; }
        //public string Expires { get; set; }
        //public bool CreditStop { get; set; }
        //public bool OverCreditLimit { get; set; }
        //public string CustomerRequestDeliveryServiceName { get; set; }
        //public string CustomerRequestHaulierCode { get; set; }
        //public string CustomerRequestServiceCode { get; set; }
        //public string CustomerRequestHaulierAccountNumberForShippingCharge { get; set; }
        //public string CustomerRequestHaulierAccountNumberForDuty { get; set; }
        //public string CustomerRequestDeliveryTerms { get; set; }
        //public string CustomerRequestDeliveryType { get; set; }
        //public string CustomerRequestDeliveryAddress { get; set; }
        //public bool? CustomerRequestsFullDespatch { get; set; }
        //public bool DeletePermitted { get; set; }
        //public bool Imported { get; set; }
        //public bool MertexVATLookupSuccessful { get; set; }

        public int TradeAccountID { get; set; }

        public TradeAccount TradeAccount { get; set; }
        public Market MertexMarket { get; set; }
        public List<BasketItem> BasketItems { get; set; }
        public List<BasketItemLineMemo> BasketItemLineMemos { get; set; }
        public object BasketItemCustomerLineMemoDisplay
        {
            get
            {
                var result = "";

                BasketItems?.ForEach(bi =>
                {
                    result += $@"<div class=""basket-line-memo-panel {(bi == BasketItems?.Last() ? "last-basket-line-memo-panel" : "")}"">
                        {(bi.Product?.ImageID != null ? $@"<img src=""https://www.designersguild.com/image/90/{bi.Product.ImageID}""/>" : "")}
                        <div>
                            <h4>{bi.Product?.BasketName}</h4>
                            {bi.Product?.Code} &times; {bi.Quantity}";

                    BasketItemLineMemos.Where(p => p.BasketItemID == bi.BasketItemID && p.LineMemoType?.AlertOperator == true).ToList().ForEach(c =>
                    {
                        result += $@"<div class=""memo well"">
                                                    {c.LineMemo?.Replace(Environment.NewLine, "<br/><br/>").Replace(@"\n", "<br/>")}
                                                </div>";
                    });

                    result += @"</div>
                        </div>";
                });

                if (!String.IsNullOrEmpty(result))
                {
                    result = $@"<div class=""basket-details-popover-content"">
                                    <h4 class=""basket-line-request-heading"">
                                        Customer Requests
                                    </h4>
                                    {result}
                                </div>
                                <div class=""basket-line-memo-footer"">
                                    Order Reference: {CustomerReference}
                                </div>";
                }
                else
                {
                    result = $@"<div class=""basket-line-memo-footer"">
                                    Order Reference: {CustomerReference}
                                </div>";
                }

                return result;
            }
        }

        [NotMapped]
        public string Label
        {
            get
            {
                return $"{CustomerCode} - {CustomerName}";
            }
            set
            {

            }
        }
    }

    public class HoldReasonSummaryPod
    {
        public int HoldReasonSummaryPodID { get; set; }
        public string RoleName { get; set; }
        public int RoleSortOrder { get; set; }
        public int RoleID { get; set; }
        public string HoldReasonGroupName { get; set; }
        public short HoldReasonGroupSortOrder { get; set; }
        public short HoldReasonGroupID { get; set; }
        public int Count { get; set; }
        public bool Priority { get; set; }
        public DateTime? HeldFromDT { get; set; }
        public DateTime? HeldToDT { get; set; }
    }

    public class HoldReasonSelectResult
    {
        public short HoldReasonGroupID { get; set; }
        public string HoldReasonGroupName { get; set; }
        public int HoldReasonGroupSortOrder { get; set; }

        [NotMapped]
        public object HoldReasonGroup
        {
            get
            {
                return new
                {
                    Name = HoldReasonGroupName
                };
            }
        }

        public short HoldReasonID { get; set; }
        public string HoldReasonApproverMessage { get; set; }
        public string HoldReasonDisplayName { get; set; }
        public int HoldReasonSortOrder { get; set; }

        [NotMapped]
        public string Name 
        { 
            get
            {
                return HoldReasonDisplayName;
            }
        }

        public int RoleID { get; set; }

        public string RoleName { get; set; }

        public int RoleSortOrder { get; set; }

        public int Count { get; set; }
    }

    public class HeldOrderResultWrapper
    {
        public IEnumerable<HeldOrderSelectResult> Data { get; set; }

        public IEnumerable<HoldReasonSelectResult> HoldReasons { get; set; }

        public IEnumerable<HoldReasonSummaryPod> SummaryPods { get; set; }
    }

    public class PassBasketTradeAccount
    {
        public long BasketID { get; set; }
        public int TradeAccountID { get; set; }
        public string TradeAccountNumber { get; set; }
        public bool EndCustomer { get; set; }
    }

    public class BasketItemAdvancedOrderStepResult
    {
        public decimal StepID { get; set; }
        public string Name { get; set; }
    }

    public class PassBasketItemAllocation
    {
        public long BasketItemID { get; set; }
        public int MemberID { get; set; }
        public string Batch { get; set; }
        public string Piece { get; set; }
        public decimal? Quantity { get; set; }
        public long? RingFencePreAllocationID { get; set; }
        public long? BasketPreAllocationID { get; set; }
        public string PreAllocationCode { get; set; }
        public long? PreAllocationErrorID { get; set; }
    }

    public class BasketItemPreAllocationUpsertResult
    {
        public long? BasketPreAllocationID { get; set; }
        public Guid? PreAllocationCode { get; set; }
        public long? PreAllocationErrorID { get; set; }
        public decimal? ReserveBuffer { get; set; }
    }

    public class BasketItemPreAllocationDeleteResult
    {
        public long? PreAllocationErrorID { get; set; }
    }

    public class ClearBasketItemAllocationsResult
    {
        public List<long?> PreAllocationErrorIDs { get; set; }
    }

    public class BasketItemAddResult
    {
        public long? BasketItemID { get; set; }
        public long? BasketPreAllocationID { get; set; }
        public Guid? PreAllocationCode { get; set; }
        public long? PreAllocationErrorID { get; set; }
        public bool BackOrder { get; set; }
    }

    public class PassBasketItemID
    {
        public long BasketItemID { get; set; }
    }

    public class PassBasketPhase
    {
        public long BasketID { get; set; }
        public byte Phase { get; set; }
    }

    public class PassBasketItemStockLocation
    {
        public long BasketItemID { get; set; }
        public short StockLocationID { get; set; }
        public int MemberID { get; set; }
    }

    public class BasketItemReviewPricesSelectResult
    {
        public List<BasketItemDiscountRecord> SystemDiscounts { get; set; }
        public List<DiscountReasonRecord> DiscountReasons { get; set; }
        public List<DiscountFOCPromoCode> FOCPromotionCodes { get; set; }
    }

    public class BasketItemDiscountRecord
    {
        public long BasketItemID { get; set; }
        public string Code { get; set; }
        public string BasketName { get; set; }
        public long? ImageID { get; set; }

        public decimal Quantity { get; set; }
        public byte QuantityPrecision { get; set; }
        public string StockUnit { get; set; }

        public bool ListPrice_Hide { get; set; }
        public string ListPrice_Label { get; set; }
        public string ListPrice_Explanation { get; set; }
        public decimal? ListPrice_Value { get; set; }
        public bool ListPrice_Strikethrough { get; set; }

        public bool ContractPrice_Hide { get; set; }
        public string ContractPrice_Label { get; set; }
        public string ContractPrice_Explanation { get; set; }
        public decimal? ContractPrice_Value { get; set; }
        public bool ContractPrice_Strikethrough { get; set; }

        public bool ContractDiscount_Hide { get; set; }
        public string ContractDiscount_Label { get; set; }
        public string ContractDiscount_Explanation { get; set; }
        public decimal? ContractDiscount_Value { get; set; }
        public bool ContractDiscount_Strikethrough { get; set; }

        public bool PromotionalDiscount_Hide { get; set; }
        public string PromotionalDiscount_Label { get; set; }
        public string PromotionalDiscount_Explanation { get; set; }
        public decimal? PromotionalDiscount_Value { get; set; }
        public bool PromotionalDiscount_Strikethrough { get; set; }

        public bool ClearanceDiscount_Hide { get; set; }
        public string ClearanceDiscount_Label { get; set; }
        public string ClearanceDiscount_Explanation { get; set; }
        public decimal? ClearanceDiscount_Value { get; set; }
        public bool ClearanceDiscount_Strikethrough { get; set; }

        public string FinalPrice_Label { get; set; }
        public string FinalPrice_Explanation { get; set; }

        public decimal? OperatorEnteredChargeEx { get; set; }
        public decimal? OperatorDiscountPercentage { get; set; }
        public byte? DiscountReasonID { get; set; }
        public string DiscountReasonComment { get; set; }
        public int? TradePromotionCodeID { get; set; }

        public decimal? PreOperator_Value { get; set; }
        public decimal? FinalPrice_Value { get; set; }
    }

    public class BasketItemReviewPriceCalculateFinalPriceRecord
    {
        public long BasketItemID { get; set; }
        public decimal FinalPrice_Value { get; set; }
        public string FinalPrice_Explanation { get; set; }
        public bool ListPrice_Strikethrough { get; set; }
        public bool ContractPrice_Strikethrough { get; set; }
        public bool ContractDiscount_Strikethrough { get; set; }
        public bool PromotionalDiscount_Strikethrough { get; set; }
        public bool ClearanceDiscount_Strikethrough { get; set; }
    }

    public class DiscountReasonRecord
    {
        public byte DiscountReasonID { get; set; }
        public string Name { get; set; }
        public bool CommentRequired { get; set; }
        public bool PriceIncrease { get; set; }
    }

    public class DiscountFOCPromoCode
    {
        public int TradePromotionCodeID { get; set; }
        public string Code { get; set; }
        public string TradePromotionName { get; set; }
        public string BudgetManagerCode { get; set; }
        public string BudgetManagerName { get; set; }
    }

    public class PassBasketItemReviewPricesSelect
    {
        public long BasketItemID { get; set; }
        public List<PassBasketItemDiscount> Discounts { get; set; }
    }

    public class PassBasketItemReviewPricesSave
    {
        public long BasketID { get; set; }
        public List<PassBasketItemDiscount> Discounts { get; set; }
        public bool AddAll { get; set; }
    }

    public class PassBasketItemDiscount
    {
        public long BasketItemID { get; set; }
        public decimal? OperatorDiscountPercentage { get; set; }
        public decimal? OperatorEnteredChargeEx { get; set; }
        public byte? DiscountReasonID { get; set; }
        public string DiscountReasonComment { get; set; }
        public int? TradePromotionCodeID { get; set; }
    }

    public class FetchBasketResult
    {
        public List<BasketItemPopupNotice> PopupNotices { get; set; }
        public List<BasketItemSelectResult> BasketItems { get; set; }
    }

    public class BasketItemPopupNotice
    {
        public int ProductID { get; set; }
        public string Code { get; set; }
        public string ProductName { get; set; }
        public decimal Quantity { get; set; }
        public string OperatorMessage { get; set; }
        public long? ImageID { get; set; }
    }

    public class FetchMemberBasketResult
    {
        public long BasketID { get; set; }
        public int TradeAccountID { get; set; }
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? ModifiedDT { get; set; }
        public DateTime? ExpiryDT { get; set; }
        public int CreatedMemberID { get; set; }
        public string MemberName { get; set; }
        public string MemberEmail { get; set; }
        public string OrderReference { get; set; }
        public string OrderTaker { get; set; }
        public string DeliveryName { get; set; }
        public string DeliveryCompany { get; set; }
        public string DeliveryAddressLine1 { get; set; }
        public string DeliveryAddressLine2 { get; set; }
        public string DeliveryTown { get; set; }
        public string DeliveryCounty { get; set; }
        public string DeliveryPostcode { get; set; }
        public short? DeliveryCountryID { get; set; }
        public string DeliveryPhoneNumber { get; set; }
        public int AllocationCount { get; set; }
        public int BasketItemCount { get; set; }
        public decimal? BasketTotal { get; set; }

        [NotMapped]
        public string Status
        {
            get
            {
                return "";
            }
        }

        [NotMapped]
        public string Market
        {
            get
            {
                return "";
            }
        }

        [NotMapped]
        public string LastModified
        {
            get
            {
                return PortalFramework.DateTimeDistanceString(ModifiedDT, true, false);
            }
        }

        [NotMapped]
        public bool HasAllocations
        {
            get
            {
                return AllocationCount > 0;
            }
        }

        [NotMapped]
        public string AllocationsExpire
        {
            get
            {
                return PortalFramework.DateTimeDistanceString(ExpiryDT, true, false);
            }
        }
    }

    public class BasketItemSelectResult
    {
        public string AdditionalInformation { get; set; }
        public short? RowNumber { get; set; }
        public short? ParentRowNumber { get; set; }
        public long BasketItemID { get; set; }
        public bool? BatchCuttingIndicator { get; set; }
        public string BasketSplitID { get; set; }
        public byte? DeliveryGroupID { get; set; }
        public string BasketGroup { get; set; }
        public byte BasketItemTypeID { get; set; }
        public byte OrderTypeID { get; set; }
        public string OrderTypeName { get; set; }
        public string StockLocationCode { get; set; }
        public string StockLocationName { get; set; }
        public string FulfilmentTypeName { get; set; }
        public int ProductID { get; set; }
        public byte ProductFilterID { get; set; }
        public string ProductFilterName { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string ProductOrderFormName { get; set; }
        public string ProductBasketName { get; set; }
        public string Size { get; set; }
        public string Tag { get; set; }
        public string ProductCollection { get; set; }
        public string Memo { get; set; }
        public string BespokeFeelerProductCode { get; set; }
        public string BespokeFeelerProductName { get; set; }
        public string BespokeFeelerProductOrderFormName { get; set; }
        public string BespokeFeelerProductBasketName { get; set; }
        public decimal? BespokeHeaderWidth { get; set; }
        public decimal? BespokeFeelerLength { get; set; }
        public bool? BespokeWaterfallRequired { get; set; }
        public short? BespokeWidth { get; set; }
        public short? BespokeLength { get; set; }
        public short? BespokeDiameter { get; set; }
        public string CADEmail { get; set; }
        public decimal? BespokeSize { get; set; }
        public string BespokeTreatment { get; set; }
        public string BespokeModelProductCode { get; set; }
        public string BespokeModelProductName { get; set; }
        public string BespokeModelProductOrderFormName { get; set; }
        public string BespokeModelProductBasketName { get; set; }
        public DateTime? DispatchDelayDT { get; set; }
        public long? ProductImageID { get; set; }
        public decimal? FreeStock { get; set; }
        public decimal? POFreeStock { get; set; }
        public DateTime? PODueDate { get; set; }
        public string POMessage { get; set; }
        public string StockStatus { get; set; }
        public string StockStatusMessage { get; set; }
        public string ParentStockStatus { get; set; }
        public decimal? ParentFreeStock { get; set; }
        public decimal? ParentPOFreeStock { get; set; }
        public DateTime? ParentPODueDate { get; set; }
        public decimal? NetWeight { get; set; }
        public decimal Quantity { get; set; }
        public bool BackOrder { get; set; }
        public string Units { get; set; }
        public decimal? TradePrice { get; set; }
        public decimal? SpecialPrice { get; set; }
        public string SpecialPriceExplanation { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? OperatorDiscountPercentage { get; set; }
        public string PromotionCode { get; set; }
        public decimal? ListPrice { get; set; }
        public decimal? FinalPrice { get; set; }
        public bool AllowEdit { get; set; }
        public bool AllowDelete { get; set; }
        public bool AllowQuantityEdit { get; set; }
        public bool IncludeInQuantityTotal { get; set; }
        public bool IncludeInPriceTotal { get; set; }
        public bool BasketVisible { get; set; }
        public string VATCode { get; set; }
        public decimal? VATRatePercentage { get; set; }
        public decimal? VATSubTotal { get; set; }
        public string ProcessAnswersJSON { get; set; }
        public string BespokeFurnitureJSON { get; set; }
        public string DuplicateLineWarning { get; set; }
        public bool MustAllocateOrBackOrder { get; set; }
        public bool MustProvidePackingMethod { get; set; }
        public string BasketItemErrors { get; set; }
        public string BasketMessage { get; set; }
        public List<BasketItemLineMemo> BasketItemLineMemos { get; set; }
        public object BasketItemCustomerLineMemoDisplay
        {
            get
            {
                var result = "";

                BasketItemLineMemos?.Where(p => p.LineMemoType?.AlertOperator == true).ToList().ForEach(c =>
                {
                    result += $@"<div class=""basket-line-memo-panel {(c == BasketItemLineMemos?.Last() ? "last-basket-line-memo-panel" : "")}"">
    {(c.ProductImageID != null ? $@"<img src=""https://www.designersguild.com/image/90/{c.ProductImageID}""/>" : "")}
    <div>
        <h4>{c.ProductName}</h4>
        {c.ProductCode} &times; {c.ProductQuantity}
        <div class=""memo well"">
            {c.LineMemo?.Replace(Environment.NewLine, "<br/><br/>")}
        </div>
    </div>
</div>";
                });

                if (result != "")
                {
                    result = $@"<div class=""basket-details-popover-content"">
                                    <h4 class=""basket-line-request-heading"">
                                        Customer Requests
                                    </h4>
                                    {result}
                                </div>";
                }

                return result;
            }
        }

        public object basketItemErrors
        {
            get
            {
                return JsonConvert.DeserializeObject(BasketItemErrors ?? "");
            }
        }
    }

    public class PassBatchCuttingExpressIndicator
    {
        public long BasketID { get; set; }
        public bool SendBatchCuttingsExpress { get; set; }
    }

    [Table("DocumentType", Schema = "portal")]
    public class DocumentType
    {
        [Key]
        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class BasketDeliveryAddress
    {
        public string DeliveryReference { get; set; }
        public string DeliveryName { get; set; }
        public string DeliveryCompanyName { get; set; }
        public string DeliveryAddressLine1 { get; set; }
        public string DeliveryAddressLine2 { get; set; }
        public string DeliveryTown { get; set; }
        public string DeliveryCounty { get; set; }
        public string DeliveryPostcode { get; set; }
        public short? DeliveryCountryID { get; set; }
        public string DeliveryCountryCode { get; set; }
        public string DeliveryCountryName { get; set; }
        public string DeliveryPhoneNumber { get; set; }
        public string EndCustomerTradeAccountCode { get; set; }
        public string EndCustomerTradeAccountName { get; set; }
        public bool DeliveryCountryEU { get; set; }
        public string OrderConfirmationsEmail { get; set; }
        public bool CleansePerformed { get; set; }
        public bool UserRefusedAddressRecommendation { get; set; }
    }


    public class Basket_DeliveryAddress_SelectResult
    {
        public BasketDeliveryAddress DeliveryAddress { get; set; }
        public MiscellaneousInvoiceAddress MiscInvoiceAddress { get; set; }

        public List<ForbiddenDestinationCountry> ForbiddenDestinationCountries { get; set; }
    }

    public class PassBasketAddress
    {
        public string tradeAccountCode { get; set; }
        public long basketId { get; set; }
        public string deliveryReference { get; set; }
        public string deliveryName { get; set; }
        public string deliveryCompanyName { get; set; }
        public string deliveryAddressLine1 { get; set; }
        public string deliveryAddressLine2 { get; set; }
        public string deliveryTown { get; set; }
        public string deliveryCounty { get; set; }
        public string deliveryPostcode { get; set; }
        public short? deliveryCountryId { get; set; }
        public string deliveryCountryCode { get; set; }
        public string deliveryPhoneNumber { get; set; }
        public string email { get; set; }
        public string endCustomerCode { get; set; }
        public string endCustomerName { get; set; }
        public bool isDefaultDeliveryAddress { get; set; }
        public string invoiceAddressCountryCode { get; set; }
        public string invoiceAddressPostcode { get; set; }
    }

    public class PassBasketAddressCleanse : PassBasketAddress
    {
        public int tradeAccountId { get; set; }
        public bool skipDeliveryRestrictions { get; set; }
        public bool loqateLookupPerformed { get; set; }
        public bool isLoqateAddress { get; set; }
        public bool forceCleanse { get; set; }
        public string status { get; set; }

        public string md5Hash
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

                    addString(md5, String.IsNullOrEmpty(tradeAccountCode) ? "|" : $"{tradeAccountCode}|");
                    addString(md5, String.IsNullOrEmpty(deliveryName) ? "|" : $"{deliveryName}|");
                    addString(md5, String.IsNullOrEmpty(deliveryCompanyName) ? "|" : $"{deliveryCompanyName}|");
                    addString(md5, String.IsNullOrEmpty(deliveryAddressLine1) ? "|" : $"{deliveryAddressLine1}|");
                    addString(md5, String.IsNullOrEmpty(deliveryAddressLine2) ? "|" : $"{deliveryAddressLine2}|");
                    addString(md5, String.IsNullOrEmpty(deliveryTown) ? "|" : $"{deliveryTown}|");
                    addString(md5, String.IsNullOrEmpty(deliveryCounty) ? "|" : $"{deliveryCounty}|");
                    addString(md5, String.IsNullOrEmpty(deliveryPostcode) ? "|" : $"{deliveryPostcode}|");
                    addString(md5, $"{deliveryCountryCode}");

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
        public string label
        {
            get
            {
                var lines = new List<string>()
                {
                    deliveryName,
                    deliveryCompanyName,
                    deliveryAddressLine1,
                    deliveryAddressLine2,
                    deliveryTown,
                    deliveryCounty,
                    deliveryPostcode
                }.ToList();

                lines.RemoveAll(c => String.IsNullOrEmpty(c));

                var displayLine = String.Join(", ", lines);

                return $"{deliveryReference} - {displayLine}";
            }
        }

        public bool manual { get; set; }

        public bool skipDedupe { get; set; }
    }

    public class PassMiscellaneousInvoiceAddress : PassBasketAddress
    {
        public string vatNumber { get; set; }
    }

    public class PassEndCustomerDeliveryAddress : PassBasketAddress
    {
        public int TradeAccountID { get; set; }
    }

    public class BasketShippingRestrictionResult
    {
        public short RowNumber { get; set; }
    }

    public class Basket_DeliveryService_Result
    {
        public List<BasketSplitResult> BasketSplitResults { get; set; }
        public List<CustomerAccountNumber> CustomerAccountNumbers { get; set; }
        public List<DiscountReason> DiscountReasons { get; set; }
        public List<DeliveryServiceResult> SelectedDeliveryServices { get; set; }
        public List<DeliveryServiceResult> DeliveryServices { get; set; }
        public List<CustomerDeliveryDefault> CustomerDeliveryDefaults { get; set; }
        //public List<DeliveryTerm> DeliveryTerms { get; set; }
        public List<DeliveryError> DeliveryErrors { get; set; }
        public CustomerDeliveryRequests CustomerRequests { get; set; }
        public DatabaseJSONResult Notifications { get; set; }
        public string ParcelEstimateBreakdowns { get; set; }
    }

    public class CustomerDeliveryRequests
    {
        public string CustomerRequestDeliveryAddress { get; set; }
        public bool CustomerRequestsFullDespatch { get; set; }
        public string CustomerRequestHaulierCode { get; set; }
        public string CustomerRequestServiceCode { get; set; }
        public string CustomerRequestHaulierAccountNumberForShippingCharge { get; set; }
        public string CustomerRequestHaulierAccountNumberForDuty { get; set; }
        public string CustomerRequestDeliveryTerms { get; set; }
        public string CustomerRequestDeliveryType { get; set; }
        public string CustomerRequestDeliveryServiceName { get; set; }
    }

    public class DeliveryError
    {
        public string Error { get; set; }
    }

    public class DeliveryTerm
    {
        public string HAULCODE { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class CustomerAccountNumber
    {
        public string HaulierCode { get; set; }
        public string HaulierName { get; set; }
        public string HaulierTransportAccountCode { get; set; }
        public string HaulierDutyTaxAccountCode { get; set; }
    }

    public class CustomerDeliveryDefault
    {
        public string BasketSplitID { get; set; }
        public string DeliveryType { get; set; }
        public string DeliveryTerms { get; set; }
    }

    public class BasketSplitResult
    {
        public short? RowNumber { get; set; }
        public string BasketSplitID { get; set; }
        public long SortOrder { get; set; }
        public string BasketSplitName { get; set; }
        public string DespatchEstimate { get; set; }
    }

    public class DeliveryServiceResult
    {
        [OrderedProperty]
        public string BasketSplitID { get; set; }

        [OrderedProperty]
        public string ParentBasketSplitID { get; set; }

        [OrderedProperty]
        public string BasketSplitName { get; set; }

        // Trade Account Details
        [OrderedProperty]
        public int? TradeAccountID { get; set; }

        [OrderedProperty]
        public int? TradeAccountGroupID { get; set; }

        [OrderedProperty]
        public int? ChargeTradeAccountID { get; set; }

        [OrderedProperty]
        public int? ChargeTradeAccountGroupID { get; set; }

        [OrderedProperty]
        public bool? IsFurnitureOrder { get; set; }

        [OrderedProperty]
        public bool? IsTreatmentOrder { get; set; }

        [OrderedProperty]
        public string OrderContext { get; set; }

        [OrderedProperty]
        public byte? OrderLevel { get; set; }

        [OrderedProperty]
        public byte? SalesMarketID { get; set; }

        [OrderedProperty]
        public string MertexCurrencyCode { get; set; }

        // Service Details
        [OrderedProperty]
        public string HaulierCodeGroup { get; set; }

        [OrderedProperty]
        public string HaulierCode { get; set; }

        [OrderedProperty]
        public string HaulierName { get; set; }

        [OrderedProperty]
        public string ServiceCode { get; set; }

        [OrderedProperty]
        public string ServiceName { get; set; }

        [OrderedProperty]
        public string DeliveryType { get; set; }

        [OrderedProperty]
        public string DeliveryTerms { get; set; }

        [OrderedProperty]
        public string TransportBilledToCode { get; set; }

        [OrderedProperty]
        public string TransportBilledToName { get; set; }

        [OrderedProperty]
        public string DutyTaxBilledToCode { get; set; }

        [OrderedProperty]
        public string DutyTaxBilledToName { get; set; }

        [OrderedProperty]
        public long Preference { get; set; }

        [OrderedProperty]
        public long? HaulierSortOrder { get; set; }

        [OrderedProperty]
        public string ServiceDataOrigin { get; set; }

        [OrderedProperty]
        public int? ServiceDataOriginID { get; set; }

        [OrderedProperty]
        public string HaulierServiceCode { get; set; }

        [OrderedProperty]
        public bool? ExpressService { get; set; }

        [OrderedProperty]
        public bool? PriorityOrder { get; set; }

        // Parcel Details
        [OrderedProperty]
        public decimal? ParcelWeight { get; set; }

        [OrderedProperty]
        public decimal? ParcelLengthCM { get; set; }

        [OrderedProperty]
        public decimal? ParcelWidthCM { get; set; }

        [OrderedProperty]
        public decimal? ParcelHeightCM { get; set; }

        // Charge Details
        [OrderedProperty]
        public byte? DeliveryChargingLogicID { get; set; }

        [OrderedProperty]
        public string DeliveryChargingLogicName { get; set; }

        [OrderedProperty]
        public byte? SurchargeDeliveryChargingLogicID { get; set; }

        [OrderedProperty]
        public string SurchargeDeliveryChargingLogicName { get; set; }

        [OrderedProperty]
        public decimal? UnitDeliveryChargeExOriginCurrency { get; set; }

        [OrderedProperty]
        public decimal? UnitDeliveryChargeEx { get; set; }

        [OrderedProperty]
        public decimal? UnitDeliverySurchargeEx { get; set; }

        [OrderedProperty]
        public decimal? UnitDeliveryVAT { get; set; }

        [OrderedProperty]
        public decimal? TotalDeliveryChargeExOriginCurrency { get; set; }

        [OrderedProperty]
        public decimal? TotalDeliveryChargeEx { get; set; }

        [OrderedProperty]
        public decimal? TotalDeliveryVAT { get; set; }

        [OrderedProperty]
        public decimal? FinalDeliveryChargeEx { get; set; }

        [OrderedProperty]
        public decimal? FinalDeliveryVAT { get; set; }

        [OrderedProperty]
        public byte? FinalDeliveryChargingLogicID { get; set; }

        [OrderedProperty]
        public string FinalDeliveryChargingLogicName { get; set; }

        // Charge Calculation Components
        [OrderedProperty]
        public decimal? PricelistUnitChargeEx { get; set; }

        [OrderedProperty]
        public byte? PricelistProportionalCharge { get; set; }

        [OrderedProperty]
        public decimal? ContractChargeEx { get; set; }

        [OrderedProperty]
        public decimal? OperatorEnteredChargeEx { get; set; }

        [OrderedProperty]
        public byte? OperatorEnteredChargingLogicID { get; set; }

        [OrderedProperty]
        public decimal? CourierCostEx { get; set; }

        [OrderedProperty]
        public byte? CourierMarkupPercentage { get; set; }

        [OrderedProperty]
        public decimal? CourierSurchargeEx { get; set; }

        [OrderedProperty]
        public string DeliveryDetailsJSON { get; set; }

        [OrderedProperty]
        public byte SourceCurrencyID { get; set; }

        [OrderedProperty]
        public string SourceCurrencyCode { get; set; }

        [OrderedProperty]
        public decimal? GBPtoSourceCurrencyFX { get; set; }

        [OrderedProperty]
        public byte TargetCurrencyID { get; set; }

        [OrderedProperty]
        public string TargetCurrencyCode { get; set; }

        [OrderedProperty]
        public decimal? GBPtoTargetCurrencyFX { get; set; }

        [OrderedProperty]
        public bool Quote { get; set; }

        [OrderedProperty]
        public bool CalculateTotalDeliveryCharge { get; set; }

        [OrderedProperty]
        public byte PaymentTermsID { get; set; }

        [OrderedProperty]
        public string Threshold { get; set; }

        [OrderedProperty]
        public string SurchargeThreshold { get; set; }

        [OrderedProperty]
        public short? EstimatedParcelCount { get; set; }

        [OrderedProperty]
        public decimal? AvgParcelWeightKG { get; set; }

        [OrderedProperty]
        public decimal? CalculatedAvgParcelWeightKG { get; set; }

        [OrderedProperty]
        public decimal? AvgPalletWeightKG { get; set; }

        [OrderedProperty]
        public short? EstimatedPalletCount { get; set; }

        [OrderedProperty]
        public decimal? WeightBracket { get; set; }

        // Order Details
        [OrderedProperty]
        public string OrderDataOrigin { get; set; }

        [OrderedProperty]
        public decimal? OrderTotal { get; set; }

        [OrderedProperty]
        public decimal? OrderWeight { get; set; }

        [OrderedProperty]
        public decimal? OrderQuantity { get; set; }

        [OrderedProperty]
        public int? ItemCount { get; set; }

        [OrderedProperty]
        public int? SeatCount { get; set; }

        [OrderedProperty]
        public decimal? OrderDiscountPercentage { get; set; }

        [OrderedProperty]
        public string DeliveryGroupName { get; set; }

        [OrderedProperty]
        public byte DeliveryGroupID { get; set; }

        [OrderedProperty]
        public byte FulfilmentTypeID { get; set; }

        [OrderedProperty]
        public bool CustomerRequestsFullDespatch { get; set; }

        // Discount
        [OrderedProperty]
        public decimal? OperatorDiscountPercentage { get; set; }

        [OrderedProperty]
        public decimal? PromotionalDeliveryDiscountPercentage { get; set; }

        [OrderedProperty]
        public byte? DiscountReasonID { get; set; }

        [OrderedProperty]
        public string DiscountReasonComment { get; set; }

        [OrderedProperty]
        public int? TradePromotionCodeID { get; set; }

        // Estimates
        [OrderedProperty]
        public DateTime? DeliveryEstimateMin { get; set; }

        [OrderedProperty]
        public DateTime? DeliveryEstimateMax { get; set; }

        // Controls
        [OrderedProperty]
        public bool? AllowCustomerHaulierAccountForTransportCharges { get; set; }

        [OrderedProperty]
        public bool? AllowCustomerHaulierAccountForDutyAndTax { get; set; }

        [OrderedProperty]
        public bool? OfferConsolidatedShipment { get; set; }

        // VAT Parameters
        [OrderedProperty]
        public short? OriginCountryID { get; set; }

        [OrderedProperty]
        public string OriginCountryName { get; set; }

        [OrderedProperty]
        public short? DestinationCountryID { get; set; }

        [OrderedProperty]
        public string DestinationCountryName { get; set; }

        [OrderedProperty]
        public bool? DestinationInEU { get; set; }

        [OrderedProperty]
        public string EUExitCode { get; set; }

        [OrderedProperty]
        public string VATNumber { get; set; }

        [OrderedProperty]
        public bool? ValidVATNumber { get; set; }

        [OrderedProperty]
        public string VATCode { get; set; }

        [OrderedProperty]
        public decimal? VATRate { get; set; }

        // Origin
        [OrderedProperty]
        public string From { get; set; }

        [OrderedProperty]
        public short? OriginStockLocationID { get; set; }

        [OrderedProperty]
        public byte? OriginStockLocationSiteID { get; set; }

        // Supplier Details
        [OrderedProperty]
        public string SupplierCompanyName { get; set; }

        [OrderedProperty]
        public string SupplierAddressLine1 { get; set; }

        [OrderedProperty]
        public string SupplierAddressLine2 { get; set; }

        [OrderedProperty]
        public string SupplierTown { get; set; }

        [OrderedProperty]
        public string SupplierCounty { get; set; }

        [OrderedProperty]
        public string SupplierPostcode { get; set; }

        [OrderedProperty]
        public short? SupplierCountryID { get; set; }

        [OrderedProperty]
        public string SupplierCountryCode { get; set; }

        // Destination
        [OrderedProperty]
        public string To { get; set; }

        [OrderedProperty]
        public byte? DestinationStockLocationSiteID { get; set; }

        [OrderedProperty]
        public short? DestinationStockLocationID { get; set; }

        // Delivery Details
        [OrderedProperty]
        public string DeliveryName { get; set; }

        [OrderedProperty]
        public string DeliveryCompanyName { get; set; }

        [OrderedProperty]
        public string DeliveryAddressLine1 { get; set; }

        [OrderedProperty]
        public string DeliveryAddressLine2 { get; set; }

        [OrderedProperty]
        public string DeliveryTown { get; set; }

        [OrderedProperty]
        public string DeliveryCounty { get; set; }

        [OrderedProperty]
        public string DeliveryPostcode { get; set; }

        [OrderedProperty]
        public short? DeliveryCountryID { get; set; }

        [OrderedProperty]
        public string DeliveryCountryCode { get; set; }

        [OrderedProperty]
        public string DeliveryPhoneNumber { get; set; }

        [OrderedProperty]
        public string DeliveryReference { get; set; }

        [OrderedProperty]
        public short? DeliveryZoneID { get; set; }

        [OrderedProperty]
        public string DeliveryZoneName { get; set; }

        [OrderedProperty]
        public bool? AllowDeliveryChargeCalculationAtDespatch { get; set; }

        [OrderedProperty]
        public bool? CalculateDeliveryChargeAtDespatch { get; set; }

        [NotMapped]
        public bool DemandMobilePhoneNumber { get; set; }
    }

    public class DeliveryServiceAddressResult
    {
        public string BasketSplitID { get; set; }
        public string OriginCountryName { get; set; }
        public string From { get; set; }
        public string To { get; set; }
    }

    public class PassDispatchFactorySave
    {
        public long basketId { get; set; }
        public string basketSplitId { get; set; }
        public List<DeliveryServiceResult> deliveryServices { get; set; }
    }

    public class DispatchFactorySaveResult
    {
        public bool RequestEORI { get; set; }
        public bool RequireEORI { get; set; }
    }

    public class PassMertexAddressInsert
    {

    }

    public class MertexAddressInsertResult
    {
        public string DeliveryReference { get; set; }
    }

    public class PassBasketDeliveryGroup
    {
        public long BasketID { get; set; }
        public byte? DeliveryGroupID { get; set; }
    }

    [Table("TradeAccountAddressCleanse", Schema = "portal")]
    public class TradeAccountAddressCleanse
    {
        [Key]
        public long TradeAccountAddressCleanseID { get; set; }
        public string TradeAccountCode { get; set; }
        public string DeliveryReference { get; set; }
        public string SourceAddressHash { get; set; }
        public string SourceAddress { get; set; }
        public string Status { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? ModifiedDT { get; set; }
        public DateTime? LookupDT { get; set; }
        public DateTime? LastUsedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
    }

    public class AddressCleanseInput
    {
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string Address4 { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
    }

    public class AddressCleanseResult
    {
        public AddressCleanseInput Input { get; set; }
        public List<AddressCleanseMatch> Matches { get; set; }
    }

    public class AddressCleanseMatch
    {
        public string AQI { get; set; }
        public string AVC { get; set; }
        public string Address { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string AdministrativeArea { get; set; }
        public string CountryName { get; set; }
        public string DeliveryAddress { get; set; }
        public string DeliveryAddress1 { get; set; }
        public string HyphenClass { get; set; }
        public string ISO3166_2 { get; set; }
        public string Country { get; set; }
        public string ISO3166_3 { get; set; }
        public string ISO3166_N { get; set; }
        public string Locality { get; set; }
        public string MatchRuleLabel { get; set; }
        public string PostalCode { get; set; }
        public string PostalCodePrimary { get; set; }
        public string PostalCodeSecondary { get; set; }
        public string Premise { get; set; }
        public string PremiseNumber { get; set; }
        public string SubAdministrativeArea { get; set; }
        public string SubBuilding { get; set; }
        public string SubBuildingLeadingType { get; set; }
        public string SubBuildingNumber { get; set; }
        public string Thoroughfare { get; set; }
        public string DuplicateInfo { get; set; }
    }

    public class PassTradeAccountCodeDeliveryReference
    {
        public string tradeAccountCode { get; set; }
        public string deliveryReference { get; set; }
    }

    public class DatabaseJSONResult
    {
        public string JSON { get; set; }
        public object json
        {
            set
            {

            }
            get
            {
                return JsonConvert.DeserializeObject(JSON);
            }
        }
    }

    public class RetailTillPhaseReturn
    {
        public List<RetailTillBasketGroup> results { get; set; }
    }

    public class RetailTillBasketGroup
    {
        public string BasketSplitID { get; set; }
        public decimal? TotalPayableIncVAT { get; set; }
        public decimal? TotalItemsIncVAT { get; set; }
        public decimal? TotalDeliveryIncVAT { get; set; }
        public string RetailPaymentsJSON { get; set; }
        public object retailPayments
        {
            get
            {
                return JsonConvert.DeserializeObject(RetailPaymentsJSON ?? "");
            }
        }
    }

    public class BasketReceipt
    {
        public List<BasketReceiptOrderHeadDetail> OrderHeads { get; set; }
        public List<BasketReceiptOrderLineDetail> OrderLines { get; set; }
        public List<BasketReceiptPaymentDetail> Payments { get; set; }
    }

    public class BasketReceiptOrderHeadDetail
    {
        public int OrderHeadID { get; set; }
        public DateTime CreatedDT { get; set; }
        public string FullName { get; set; }
        public string CompanyName { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }
        public string Postcode { get; set; }
        public string CountryCode { get; set; }
        public string DeliveryService { get; set; }
        public string Description { get; set; }
        public byte SellingCompanyID { get; set; }
        public string SellingCompany { get; set; }
        public byte OrderTypeID { get; set; }
        public string OrderType { get; set; }
        public string FooterAddress { get; set; }
        public string FooterEmail { get; set; }
        public string FooterVATCode { get; set; }
        public string FooterPhone { get; set; }
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }

        public bool TradeAccountRetailTill { get; set; }

        public string OrderTaker { get; set; }
        public decimal CarriagePriceInc { get; set; }
        public decimal CarriagePriceEx { get; set; }
        public decimal CarriageVAT { get; set; }
        public bool DeliveryAddressRequired { get; set; }
        public string CustomerOrderReference { get; set; }
        public bool PaymentRequired { get; set; }
        public string HeaderText { get; set; }
        public string MarketingText { get; set; }
        public string FooterText { get; set; }
        public string InvoiceAddressFullName { get; set; }
        public string InvoiceAddressLine1 { get; set; }
        public string InvoiceAddressLine2 { get; set; }
        public string InvoiceAddressTown { get; set; }
        public string InvoiceAddressCounty { get; set; }
        public string InvoiceAddressPostcode { get; set; }
        public string InvoiceAddressCountryCode { get; set; }
    }

    public class BasketReceiptOrderLineDetail
    {
        public int OrderHeadID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public short Quantity { get; set; }
        public decimal PriceEx { get; set; }
        public decimal FinalPriceEx { get; set; }
        public decimal TotalDiscountInc { get; set; }
        public string DiscountMessage { get; set; }
        public decimal FinalVAT { get; set; }
        public decimal FinalPriceInc { get; set; }
        public decimal VATRate { get; set; }
        public DateTime? EstimatedDispatchDate { get; set; }
    }

    public class BasketReceiptPaymentDetail
    {
        public string PaymentTypeName { get; set; }
        public string PaymentTypeID { get; set; }
        public decimal PaymentAmount { get; set; }
    }

    public class ForbiddenDestinationCountry
    {
        public short CountryID { get; set; }
        public string Reason { get; set; }
    }

    public class PassBasketIDEmail
    {
        public long basketId { get; set; }
        public string email { get; set; }
    }

    public class PassTransactionSearch
    {
        public long? basketId { get; set; }
        public int? memberId { get; set; }
        public string marketCode { get; set; }
        public string tradeAccountCode { get; set; }
        public int? tradeAccountId { get; set; }
        public string searchTerm { get; set; }
    }

    public class TransactionSelectResult
    {
        public long BasketID { get; set; }
        public string OrderReference { get; set; }
        public int TransactionID { get; set; }
        public int TradeAccountID { get; set; }
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
        public string MemberName { get; set; }
        public string MemberEmail { get; set; }
        public DateTime CreatedDT { get; set; }
        public bool OfferReceipt { get; set; }
        public string OrderDetails { get; set; }
        public object orderDetails
        {
            get
            {
                return JsonConvert.DeserializeObject(OrderDetails ?? "[]");
            }
        }
    }

    public class PassParcelCount
    {
        public string documentNumber { get; set; }

        public string DocumentKey
        {
            get
            {
                return HttpUtility.UrlEncode(dgCrypto.Encrypt(documentNumber));
            }
        }
    }

    public class OrderTrackingSearchResult
    {
        public TradeAccount TradeAccount { get; set; }
        public List<DeliveryNoteHeadRecord> DeliveryNotes { get; set; }
        public List<OrderLineRecord> OrderLines { get; set; }
        public string ResultStatus { get; set; }
        public string HaulierName { get; set; }
        public string HaulierCode { get; set; }
        public string EmailAddress { get; set; }
        public string DeliveryAddress { get; set; }
        public string DeliveryName { get; set; }
        public string CustomerName { get; set; }
        public List<MertexReportDataOrderSearchResult> MertexReportDataOrderSearchResults { get; set; }
        public string CustomerReference { get; set; }
        public string CustomerOrderReference { get; set; }
        public string OrderNumber { get; set; }
        public List<ParcelContent> undespatched { get; set; }
        public List<OrderParcelDetail> despatched { get; set; }
        public string body { get; set; }
        public string subject { get; set; }
        public string replyTo { get; set; }
        public string email { get; set; }
        public string DateOnFile { get; set; }
        public string OrderDate
        {
            get
            {
                DateTime dt = DateTime.MinValue;

                string result = dt.ToString();

                if (DateTime.TryParseExact(DateOnFile, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-GB"), System.Globalization.DateTimeStyles.None, out dt))
                {
                    if (dt.Day.ToString("d").Length == 1)
                    {
                        result = dt.ToString("d MMMM yyyy").Insert(1, PortalFramework.GetDaySuffix(dt.Day));
                    }
                    else
                    {
                        result = dt.ToString("dd MMMM yyyy").Insert(2, PortalFramework.GetDaySuffix(dt.Day));
                    }

                    result = $"{dt.ToString("dddd")} {result}";

                    return result;
                }
                else
                {
                    return DateOnFile;
                }
            }
            set
            {

            }
        }

        public OrderTrackingSearchResult()
        {
            TradeAccount = null;
        }

        public OrderTrackingSearchResult(OrderTrackingSearchResultWrapper i)
        {
            TradeAccount = null;

            DeliveryNotes = i.DeliveryNotes;
            OrderLines = i.OrderLines;
            ResultStatus = i.ResultStatus;
            HaulierName = i.HaulierName;
            HaulierCode = i.HaulierCode;
            EmailAddress = i.EmailAddress;
            DeliveryAddress = i.DeliveryAddress;
            DeliveryName = i.DeliveryName;
            CustomerName = i.CustomerName;
            MertexReportDataOrderSearchResults = i.MertexReportDataOrderSearchResults;
            CustomerReference = i.CustomerReference;
            OrderNumber = i.OrderNumber;
            undespatched = i.undespatched;
            despatched = i.despatched;
            body = i.body;
            subject = i.subject;
            replyTo = i.replyTo;
            email = i.email;
            DateOnFile = i.DateOnFile;
            OrderDate = i.OrderDate;
        }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }
    }

    [Table("Account", Schema = "ups")]
    public class UPSAccount
    {
        [Key]
        public byte AccountID { get; set; }
        public string LocationName { get; set; }
        public string CompanyName { get; set; }
        public string AccountNumber { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Town { get; set; }
        public string StateProvinceCode { get; set; }
        public string Postcode { get; set; }
        public string CountryCode { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
        public string TaxID { get; set; }
    }

    [Table("HoldReason", Schema = "portal")]
    public class HoldReason
    {
        [Key]
        public short HoldReasonID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int ReleasedByRoleID { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
        public string OperatorMessage { get; set; }
        public short ReleaseSequence { get; set; }
        public string HoldWhere { get; set; }
        public string ApproverMessage { get; set; }
        public short HoldReasonGroupID { get; set; }

        [NotMapped]
        public string HeldReasons
        {
            get
            {
                return ApproverMessage;
            }
            set
            {
            }
        }

        [JsonIgnore]
        [InverseProperty("HoldReason")]
        public virtual ICollection<TransactionHoldReason> TransactionsHeld { get; set; }

        [ForeignKey("HoldReasonGroupID")]
        public virtual HoldReasonGroup HoldReasonGroup { get; set; }
    }

    [Table("HoldReasonGroup", Schema = "portal")]
    public class HoldReasonGroup
    {
        [Key]
        public short HoldReasonGroupID { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("HoldReasonGroup")]
        public virtual ICollection<HoldReason> HoldReasons { get; set; }
    }

    public class PassPaymentTermsSearch
    {
        public int basketId { get; set; }
        public int tradeAccountId { get; set; }
        public string searchTerm { get; set; }
    }

    public class PaymentTermsResult
    {
        public List<PaymentTermsSelectResult> Results { get; set; }
    }

    public class PaymentTermsSelectResult
    {
        public byte PaymentTermsID { get; set; }
        public string Label { get; set; }
    }

    [Table("OrderImportSource", Schema = "portal")]
    public class OrderImportSource
    {
        [Key]
        public byte OrderImportSourceID { get; set; }

        public string Name { get; set; }
    }

    public class PassLastChanceModalSave
    {
        public long basketId { get; set; }
        public string landline { get; set; }
        public string landlineCountryCode { get; set; }
        public string mobile { get; set; }
        public string mobileCountryCode { get; set; }
        public string email { get; set; }
        public string eori { get; set; }
        public string contactName { get; set; }
        public bool isDeliveryAddressTrade { get; set; }
    }

    public class PassBasketStatusEnquiry
    {
        public int TradeAccountID { get; set; }
        public string OrderNumber { get; set; }
        public string CustomerReference { get; set; }
        public DateTime? FromDT { get; set; }
        public DateTime? ToDT { get; set; }
    }

    public class BasketStatusResult 
    {
        public int TradeAccountID { get; set; }
        public long BasketID { get; set; }
        public bool Imported { get; set; }
        public string Owner { get; set; }
        public string CustomerOrderReference { get; set; }
        public string Status { get; set; }
        public string History { get; set; }
        public int? TradeOrderImportFileID { get; set; }
        public long? OrderImportHeadID { get; set; }
        public int? OrderHeadID { get; set; }
        public string BasketSplitName { get; set; }
        public string LineCount { get; set; }
        public int? CancelledLineCount { get; set; }
        public int? CompletedLineCount { get; set; }
        public string LastModified { get; set; }
        public bool CanEditBasket { get; set; }

        // This to get Dapper to ignore the property on QueryAsync<T>
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public virtual TradeAccount TradeAccount { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool MertexVATLookupSuccessful { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string VATNumber { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string VATCountryCode { get; set; }
    }
}