using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("PaymentTermsType", Schema = "dbo")]
    public class PaymentTermsType
    {
        [Key]
        public byte PaymentTermsTypeID { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("PaymentTermsType")]
        public virtual ICollection<PaymentTerms> PaymentTerms { get; set; }

        [JsonIgnore]
        [InverseProperty("PaymentTermsType")]
        public virtual ICollection<MertexTradeAccountClassificationSuperSet> MertexTradeAccountClassificationSuperSetRecords { get; set; }

    }
}
