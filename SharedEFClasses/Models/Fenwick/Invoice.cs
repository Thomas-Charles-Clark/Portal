using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeAccounts;

namespace SharedEFClasses.Models.Fenwick
{
    [Table("Invoice", Schema = "Fenwicks")]
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
        public string TradeAccountCode { get; set; }

        public int? DepartmentID { get; set; }

        public int? TillID { get; set; }

        public int? StaffID { get; set; }

        public int FenwickTransactionID { get; set; }

        [StringLength(20)]
        public string EAN { get; set; }

        [StringLength(50)]
        public string ProductCode { get; set; }

        public decimal Quantity { get; set; }

        public decimal GrossSales { get; set; }

        public decimal? Discount { get; set; }

        public decimal NetSales { get; set; }

        [StringLength(1)]
        public string SaleOrCredit { get; set; }

        public DateTime DoNotProcessUntilDT { get; set; }

        [StringLength(36)]
        public string ProcessBatch { get; set; }

        public DateTime? ProcessedDT { get; set; }

        public bool? Processed { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        public decimal CommissionRate { get; set; }

        public decimal Commission { get; set; }

        public decimal? NetSalesMinusCommission { get; set; }

        [ForeignKey("BranchID")]
        [InverseProperty("Invoices")]
        public virtual FenwickBranch Branch { get; set; }

        [ForeignKey("InvoiceFileID")]
        [InverseProperty("Invoices")]
        public virtual InvoiceFile InvoiceFile { get; set; }

        public virtual Product ProductCodeNavigation { get; set; }

        [ForeignKey("TradeAccountID")]
        [InverseProperty("FenwickInvoices")]
        public virtual TradeAccount TradeAccount { get; set; }

        public virtual TradeAccount TradeAccountCodeNavigation { get; set; }
    }
}