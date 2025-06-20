using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace SharedEFClasses.Models.Mertex
{
    [Table("SupplierPaymentTerms", Schema = "Mertex")]
    public class SupplierPaymentTerms
    {
        [Key]
        public string Code { get; set; }

        public string Name { get; set; }

        public byte? Days { get; set; }

        public byte? Months { get; set; }
    
        public byte? FixedDay { get; set; }
    
        public byte? SettlementDays { get; set; }

        public byte? SettlementMonths { get; set; }

        public byte? SettlementFixedDay { get; set; }

        public decimal SettlementDiscountPercentage { get; set; }

        public short SortOrder { get; set; }

        [JsonIgnore]
        [InverseProperty("PaymentTerms")]
        public virtual ICollection<SupplierLive> Suppliers { get; set; }
    }
}
