using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace SharedEFClasses.Models.Fenwick
{
    public class FenwickInvoiceResult
    {
        public int InvoiceID { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string ProductCode { get; set; }
        public decimal Quantity { get; set; }
        public decimal GrossSales { get; set; }
        public decimal Discount { get; set; }
        public decimal NetSales { get; set; }
        public int DepartmentID { get; set; }
        public int TillID { get; set; }
        public int StaffID { get; set; }
        public int FenwickTransactionID { get; set; }
        public string EAN { get; set; }
        public char SaleOrCredit { get; set; }
        public bool Processed { get; set; }
        public bool Deleted { get; set; }
    }
}
