using Microsoft.Owin.Security;

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Fenwick
{
    [Table("SelfBillInvoice", Schema = "Fenwicks")]
    public partial class SelfBillInvoice
    {
        [Key]
        public int SelfBillInvoiceID { get; set; }

        [Column(TypeName = "date")]
        public DateTime InvoiceDate { get; set; }

        public int BranchID { get; set; }

        public decimal? TotalGrossSales { get; set; }

        public decimal? TotalVAT { get; set; }

        public decimal? TotalCommission { get; set; }

        public decimal? FenwicksVariance { get; set; }

        public decimal? MertexRoundingVariance { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? SignedOffDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool SignedOff { get; set; }

        public int? SignedOffMemberID { get; set; }

        [StringLength(2000)]
        public string Notes { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        public byte[] InvoicePDF { get; set; }

        [ForeignKey("BranchID")]
        [InverseProperty("SelfBillInvoices")]
        public virtual FenwickBranch Branch { get; set; }

        [ForeignKey("SignedOffMemberID")]
        [InverseProperty("SignedOffFenwicksInvoices")]
        public virtual Member SignedOffByMember { get; set; }

        [NotMapped]
        public string InvoicePDFBase64
        {
            get
            {
                if (InvoicePDF == null)
                {
                    return null;
                }
                else
                {
                    return $"data:application/pdf;base64,{Convert.ToBase64String(InvoicePDF)}";
                }
            }
        }
    }
}