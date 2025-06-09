using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("InvoiceVAT", Schema = "IncomingEmail")]
    public partial class InvoiceVAT
    {
        [Key]
        public long InvoiceVATID { get; set; }

        public int InvoiceID { get; set; }

        [Required]
        [StringLength(2)]
        public string VATCode { get; set; }

        [Column(TypeName = "money")]
        public decimal VatableAmount { get; set; }

        [Column(TypeName = "money")]
        public decimal VAT { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public int ModifiedMemberID { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }
    }
}