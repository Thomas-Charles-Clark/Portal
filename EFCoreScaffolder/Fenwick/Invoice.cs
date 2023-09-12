using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.Fenwicks;

[Table("Invoice", Schema = "Fenwicks")]
[Index("BranchID", "DepartmentID", "FenwickTransactionID", "EAN", "Quantity", "NetSales", Name = "UQ_Fenwicks_Invoice", IsUnique = true)]
public partial class Invoice
{
    [Key]
    public long InvoiceID { get; set; }

    public int InvoiceFileID { get; set; }

    [Column(TypeName = "date")]
    public DateTime InvoiceDate { get; set; }

    public int BranchID { get; set; }

    public int? TradeAccountID { get; set; }

    [StringLength(50)]
    public string TradeAccountCode { get; set; } = null!;

    public int? DepartmentID { get; set; }

    public int? TillID { get; set; }

    public int? StaffID { get; set; }

    public int FenwickTransactionID { get; set; }

    [StringLength(20)]
    public string EAN { get; set; } = null!;

    [StringLength(50)]
    public string ProductCode { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Quantity { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal GrossSales { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Discount { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal NetSales { get; set; }

    [StringLength(1)]
    [Unicode(false)]
    public string? SaleOrCredit { get; set; }

    [Precision(2)]
    public DateTime DoNotProcessUntilDT { get; set; }

    [StringLength(36)]
    public string? ProcessBatch { get; set; }

    [Precision(2)]
    public DateTime? ProcessedDT { get; set; }

    public bool? Processed { get; set; }

    [Precision(2)]
    public DateTime CreatedDT { get; set; }

    [Precision(2)]
    public DateTime? DeletedDT { get; set; }

    public bool? Deleted { get; set; }

    [Column(TypeName = "decimal(5, 3)")]
    public decimal CommissionRate { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Commission { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? NetSalesMinusCommission { get; set; }

    [ForeignKey("BranchID")]
    [InverseProperty("Invoices")]
    public virtual Branch Branch { get; set; } = null!;

    [ForeignKey("InvoiceFileID")]
    [InverseProperty("Invoices")]
    public virtual InvoiceFile InvoiceFile { get; set; } = null!;

    public virtual Product ProductCodeNavigation { get; set; } = null!;

    [ForeignKey("TradeAccountID")]
    [InverseProperty("InvoiceTradeAccounts")]
    public virtual TradeAccount? TradeAccount { get; set; }

    public virtual TradeAccount TradeAccountCodeNavigation { get; set; } = null!;
}
