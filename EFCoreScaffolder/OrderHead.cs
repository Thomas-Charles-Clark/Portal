using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("OrderHead", Schema = "Mertex")]
[Index("Deleted", Name = "idx_Mertex_OrderHead_Deleted_Plus3")]
[Index("TradeAccountCode", Name = "idx_Mertex_OrderHead_TradeAccountCode_Plus2")]
public partial class OrderHead
{
    [Key]
    [Column("OrderID")]
    [StringLength(25)]
    public string OrderId { get; set; } = null!;

    [Column("OrderHeadID")]
    public int? OrderHeadId { get; set; }

    [StringLength(500)]
    public string? CustomerOrderReference { get; set; }

    [Column("OrderDT")]
    [Precision(2)]
    public DateTime? OrderDt { get; set; }

    [StringLength(50)]
    public string? OrderTaker { get; set; }

    public byte? OrderPriority { get; set; }

    public byte? AllocationPriority { get; set; }

    public bool? HoldOrder { get; set; }

    public bool? HoldDelivery { get; set; }

    [StringLength(50)]
    public string? DeliveryName { get; set; }

    [StringLength(60)]
    public string? DeliveryAddressLine1 { get; set; }

    [StringLength(60)]
    public string? DeliveryAddressLine2 { get; set; }

    [StringLength(50)]
    public string? DeliveryTown { get; set; }

    [StringLength(40)]
    public string? DeliveryCounty { get; set; }

    [StringLength(20)]
    public string? DeliveryPostcode { get; set; }

    [StringLength(3)]
    public string? DeliveryCountryCode { get; set; }

    [StringLength(20)]
    public string? DeliveryAlertLandlinePhoneNumber { get; set; }

    [StringLength(20)]
    public string? DeliveryAlertMobilePhoneNumber { get; set; }

    [StringLength(254)]
    public string? DeliveryAlertEmail { get; set; }

    [StringLength(10)]
    public string? HaulierCode { get; set; }

    [StringLength(10)]
    public string? CarriageCode { get; set; }

    [Column(TypeName = "decimal(18, 3)")]
    public decimal? TotalPaintWeight { get; set; }

    [StringLength(500)]
    public string? PaintMessage { get; set; }

    [Column("CreatedDT")]
    [Precision(2)]
    public DateTime CreatedDt { get; set; }

    [Column("ModifiedDT")]
    [Precision(2)]
    public DateTime ModifiedDt { get; set; }

    [Column("DeletedDT")]
    [Precision(2)]
    public DateTime? DeletedDt { get; set; }

    public bool? Deleted { get; set; }

    [Column("CompletedDT")]
    [Precision(2)]
    public DateTime? CompletedDt { get; set; }

    public bool? Completed { get; set; }

    [StringLength(4000)]
    public string? ErrorDetails { get; set; }

    public bool? Error { get; set; }

    [Column("OrderLineFirstCheckedDT")]
    [Precision(2)]
    public DateTime? OrderLineFirstCheckedDt { get; set; }

    [Column("OrderLineLastCheckedDT")]
    [Precision(2)]
    public DateTime? OrderLineLastCheckedDt { get; set; }

    [StringLength(50)]
    public string? TradeAccountCode { get; set; }

    [StringLength(50)]
    public string? TradeAccountName { get; set; }

    [Column(TypeName = "money")]
    public decimal? DeliveryChargeSterling { get; set; }

    [StringLength(1)]
    public string? ChargeOn { get; set; }

    [StringLength(20)]
    public string? HaulierAccountNumberForShippingCharge { get; set; }

    [StringLength(20)]
    public string? HaulierAccountNumberForDuty { get; set; }

    [Column(TypeName = "money")]
    public decimal? DeliveryChargeCurrency { get; set; }

    [StringLength(3)]
    public string? MertexCurrencyCode { get; set; }

    [Column(TypeName = "money")]
    public decimal? SterlingExchangeRate { get; set; }

    [StringLength(100)]
    public string? DeliveryGroup { get; set; }

    [Column("EORI")]
    [StringLength(20)]
    public string? Eori { get; set; }

    [StringLength(20)]
    public string? ContactPhone { get; set; }

    [StringLength(5)]
    public string? OrderType { get; set; }

    [StringLength(256)]
    public string? EmailTill { get; set; }

    [StringLength(256)]
    public string? EcommEmail { get; set; }

    [StringLength(256)]
    public string? MiscEmail { get; set; }

    [StringLength(256)]
    public string? EndCustomer { get; set; }

    [InverseProperty("Order")]
    public virtual ICollection<OrderLine> OrderLines { get; set; } = new List<OrderLine>();
}
