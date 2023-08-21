using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Fenwicks
{
    [Table("Invoice", Schema = "Fenwicks")]
    public class Invoice
    {
        [Key]
        public long InvoiceID { get; set; }
        public int InvoiceFileID { get; set; }
        public DateTime InvoiceDate { get; set; }
        public int StoreID { get; set; }
        // public int TradeAccountID { get; set; }
        public string TradeAccountCode { get; set; }
        public int? DepartmentID { get; set; }
        public int? TillID { get; set; }
        public int? StaffID { get; set; }
        public int FenwickTransactionID { get; set; }
        public string EAN { get; set; }
        public string ProductCode { get; set; }
        public decimal Quantity { get; set; }
        public decimal GrossSales { get; set; }
        public decimal? Discount { get; set; }
        public decimal? NetSales { get; set; }
        public long? OrderLineID { get; set; }
        public DateTime DoNotProcessUntilDT { get; set; }
        public string ProcessBatch { get; set; }
        public DateTime? ProcessedDT { get; set; }
        public DateTime? CompletedDT { get; set; }
        public DateTime? DeletedDT { get; set; }


        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Completed { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Processed { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public char SaleOrCredit { get; set; }
    }
}
