using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Fenwick
{
    [Table("InvoiceFile", Schema = "Fenwicks")]
    public partial class InvoiceFile
    {
        [Key]
        public int InvoiceFileID { get; set; }

        [StringLength(100)]
        public string FileName { get; set; }

        public string Contents { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? ProcessedDT { get; set; }

        public bool? Processed { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        [InverseProperty("InvoiceFile")]
        public virtual ICollection<FenwickInvoice> Invoices { get; set; }
    }
}