using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("ClaimHead", Schema = "Mertex")]
public partial class ClaimHead
{
    [Key]
    [Column("ClaimID")]
    [StringLength(25)]
    public string ClaimId { get; set; } = null!;

    [Column("OrderID")]
    [StringLength(25)]
    public string? OrderId { get; set; }

    [StringLength(50)]
    public string? DocumentNumber { get; set; }

    [StringLength(50)]
    public string? InvoiceNumber { get; set; }

    [StringLength(50)]
    public string TradeAccountCode { get; set; } = null!;

    [Column("ClaimCreatedDT")]
    [Precision(2)]
    public DateTime? ClaimCreatedDt { get; set; }

    [StringLength(10)]
    public string? ClaimTaker { get; set; }

    [StringLength(10)]
    public string? CurrentPerson { get; set; }

    [StringLength(10)]
    public string? CurrentDepartmentCode { get; set; }

    public bool? ClaimCompleted { get; set; }

    [StringLength(10)]
    public string? Result { get; set; }

    [StringLength(2)]
    public string? SalesMarketCode { get; set; }

    [StringLength(50)]
    public string? ContactName { get; set; }

    [StringLength(50)]
    public string? CollectionName { get; set; }

    [StringLength(60)]
    public string? CollectionAddressLine1 { get; set; }

    [StringLength(60)]
    public string? CollectionAddressLine2 { get; set; }

    [StringLength(50)]
    public string? CollectionTown { get; set; }

    [StringLength(40)]
    public string? CollectionCounty { get; set; }

    [StringLength(20)]
    public string? CollectionPostcode { get; set; }

    [StringLength(3)]
    public string? CollectionCountryCode { get; set; }

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

    [Column("ClaimLineFirstCheckedDT")]
    [Precision(2)]
    public DateTime? ClaimLineFirstCheckedDt { get; set; }

    [Column("ClaimLineLastCheckedDT")]
    [Precision(2)]
    public DateTime? ClaimLineLastCheckedDt { get; set; }
}
