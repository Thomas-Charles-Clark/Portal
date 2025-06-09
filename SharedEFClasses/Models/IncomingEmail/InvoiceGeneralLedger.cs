using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("InvoiceGeneralLedger", Schema = "IncomingEmail")]
    public partial class InvoiceGeneralLedger
    {
        [Key]
        [Column("InvoiceGeneralLedger")]
        public long InvoiceGeneralLedgerKey { get; set; }

        public int InvoiceID { get; set; }

        [Required]
        [StringLength(50)]
        public string GLCode { get; set; }

        [Column(TypeName = "money")]
        public decimal AmountExVAT { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public int ModifiedMemberID { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }
    }
}