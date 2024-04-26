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

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool? Deleted { get; set; }

        public DateTime? ProcessedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool? Processed { get; set; }    

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

    public class SelfBillInvoiceDto
    {
        public int SelfBillInvoiceID { get; set; }

        public DateTime InvoiceDate { get; set; }

        public int BranchID { get; set; }

        public decimal? TotalGrossSales { get; set; }

        public decimal? TotalVAT { get; set; }

        public decimal? TotalCommission { get; set; }

        public decimal? FenwicksVariance { get; set; }

        public decimal? MertexRoundingVariance { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? SignedOffDT { get; set; }

        public bool SignedOff { get; set; }

        public int? SignedOffMemberID { get; set; }

        public string Notes { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        public byte[] InvoicePDF { get; set; }

        public virtual FenwickBranch Branch { get; set; }

        public string SignedOffByMemberFullName { get; set; }

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

        public SelfBillInvoiceDto(
            int selfBillInvoiceId,
            DateTime invoiceDate,
            int branchId,
            decimal? totalGrossSales,
            decimal? totalVat,
            decimal? totalCommission,
            decimal? fenwicksVariance,
            decimal? mertexRoundingVariance,
            DateTime createdDt,
            DateTime? signedOffDt,
            bool signedOff,
            int? signedOffMemberId,
            string notes,
            DateTime? deletedDt,
            bool? deleted,
            byte[] invoicePdf,
            FenwickBranch branch,
            string signedOffByMemberFullName
            )
        {
            SelfBillInvoiceID = selfBillInvoiceId;
            InvoiceDate = invoiceDate;
            BranchID = branchId;
            TotalGrossSales = totalGrossSales;
            TotalVAT = totalVat;
            TotalCommission = totalCommission;
            FenwicksVariance = fenwicksVariance;
            MertexRoundingVariance = mertexRoundingVariance;
            CreatedDT = createdDt;
            SignedOffDT = signedOffDt;
            SignedOff = signedOff;
            SignedOffMemberID = signedOffMemberId;
            Notes = notes;
            DeletedDT = deletedDt;
            Deleted = deleted;
            InvoicePDF = invoicePdf;
            Branch = branch;
            SignedOffByMemberFullName = signedOffByMemberFullName;
        }
    }


    public class SelfBillInvoiceSelectResult
    {
        public int SelfBillInvoiceID { get; set; }

        public DateTime InvoiceDate { get; set; }

        public int BranchID { get; set; }

        public decimal? TotalGrossSales { get; set; }

        public decimal? TotalVAT { get; set; }

        public decimal? TotalCommission { get; set; }

        public decimal? FenwicksVariance { get; set; }

        public decimal? MertexRoundingVariance { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? SignedOffDT { get; set; }

        public bool SignedOff { get; set; }

        public int? SignedOffMemberID { get; set; }

        public string Notes { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        public string SignedOffByMemberFullName { get; set; }
    }
}