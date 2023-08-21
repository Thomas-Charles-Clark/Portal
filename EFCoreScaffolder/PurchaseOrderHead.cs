using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("PurchaseOrderHead", Schema = "Mertex")]
public partial class PurchaseOrderHead
{
    [Key]
    [Column("PurchaseOrderHeadID")]
    [StringLength(25)]
    public string PurchaseOrderHeadId { get; set; } = null!;

    [Column("OrderID")]
    [StringLength(25)]
    public string? OrderId { get; set; }

    [Column("PurchaseOrderStatusID")]
    public byte? PurchaseOrderStatusId { get; set; }

    [StringLength(10)]
    public string? StockLocationCode { get; set; }

    [StringLength(50)]
    public string? SupplierCode { get; set; }

    [StringLength(10)]
    public string? ProcessCode { get; set; }

    [StringLength(10)]
    public string? AuthoriserCode { get; set; }

    public bool? CallOffIndicator { get; set; }

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
    public string? DeliveryPhone { get; set; }

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

    [Column("PurchaseOrderLineFirstCheckedDT")]
    [Precision(2)]
    public DateTime? PurchaseOrderLineFirstCheckedDt { get; set; }

    [Column("PurchaseOrderLineLastCheckedDT")]
    [Precision(2)]
    public DateTime? PurchaseOrderLineLastCheckedDt { get; set; }

    [Column("PurchaseOrderRaisedDT")]
    [Precision(2)]
    public DateTime? PurchaseOrderRaisedDt { get; set; }

    [Column("SentToMylandsDT")]
    [Precision(2)]
    public DateTime? SentToMylandsDt { get; set; }

    [Column("EmailedToMylandsDT")]
    [Precision(2)]
    public DateTime? EmailedToMylandsDt { get; set; }
}
