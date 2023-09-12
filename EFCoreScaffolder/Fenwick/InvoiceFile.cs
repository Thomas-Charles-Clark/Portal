using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.Fenwicks;

[Table("InvoiceFile", Schema = "Fenwicks")]
[Index("FileName", Name = "UQ_Fenwick_InvoiceFile_FileName", IsUnique = true)]
public partial class InvoiceFile
{
    [Key]
    public int InvoiceFileID { get; set; }

    [StringLength(100)]
    public string FileName { get; set; } = null!;

    public string Contents { get; set; } = null!;

    [Precision(2)]
    public DateTime CreatedDT { get; set; }

    [Precision(2)]
    public DateTime? ProcessedDT { get; set; }

    public bool? Processed { get; set; }

    [Precision(2)]
    public DateTime? DeletedDT { get; set; }

    public bool? Deleted { get; set; }

    [InverseProperty("InvoiceFile")]
    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
