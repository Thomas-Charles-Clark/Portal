using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class SupplierBankDetails_SelectResult
    {
        public string SupplierCode { get; set; }

        public string BankName { get; set; }

        public string AccountNumber { get; set; }
        
        public string SortCode { get; set; }

        public string IBAN { get; set; }

        public string BIC { get; set; }

        public int? ModifiedMemberID { get; set; }

        public DateTime? ModifiedDT { get; set; }
    }
}
