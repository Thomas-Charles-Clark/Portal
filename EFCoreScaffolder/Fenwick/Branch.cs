using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.Fenwicks;

[Table("Branch", Schema = "Fenwicks")]
public partial class Branch
{
    [Key]
    public int BranchID { get; set; }

    [StringLength(100)]
    public string Name { get; set; } = null!;

    [StringLength(50)]
    public string SalesAccountCode { get; set; } = null!;

    [StringLength(50)]
    public string? WarehouseToBranchTransferAccountCode { get; set; }

    [StringLength(50)]
    public string? BranchToWarehouseTransferAccountCode { get; set; }

    [StringLength(10)]
    public string? StockLocationCode { get; set; }

    [Precision(2)]
    public DateTime CreatedDT { get; set; }

    [Precision(2)]
    public DateTime ModifiedDT { get; set; }

    public int ModifiedMemberID { get; set; }

    [Precision(2)]
    public DateTime? DeletedDT { get; set; }

    public bool? Deleted { get; set; }

    public int? FenwickStoreID { get; set; }

    [Column(TypeName = "date")]
    public DateTime? OpenDate { get; set; }

    [Column(TypeName = "date")]
    public DateTime? CloseDate { get; set; }

    public virtual TradeAccount? BranchToWarehouseTransferAccountCodeNavigation { get; set; }

    [InverseProperty("Branch")]
    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    [ForeignKey("ModifiedMemberID")]
    [InverseProperty("Branches")]
    public virtual Member ModifiedMember { get; set; } = null!;

    public virtual TradeAccount SalesAccountCodeNavigation { get; set; } = null!;

    [InverseProperty("Branch")]
    public virtual ICollection<SelfBillInvoice> SelfBillInvoices { get; set; } = new List<SelfBillInvoice>();

    public virtual StockLocation? StockLocationCodeNavigation { get; set; }

    public virtual TradeAccount? WarehouseToBranchTransferAccountCodeNavigation { get; set; }
}
