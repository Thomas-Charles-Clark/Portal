using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

using SharedEFClasses.Models.Mertex;

namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("SupplierBankDetails", Schema = "portal")]
    public class SupplierBankDetails
    {
        [Key]
        public string SupplierCode { get; set; }
    
        public string BankName { get; set; }

        public string AccountNumber { get; set; }

        public string SortCode { get; set; }

        public string IBAN { get; set; }

        public string BIC { get; set; }

        public int MemberID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string SupplierBankDetailsSignature { get; set; }

        public DateTime ValidFrom { get; set; }

        public DateTime ValidTo { get; set; }
    }
}
