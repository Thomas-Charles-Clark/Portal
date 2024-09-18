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
    [Table("GiftVoucherType", Schema = "dbo")]
    public class GiftVoucherType
    {
        [Key]
        public byte GiftVoucherTypeID { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("GiftVoucherType")]
        public virtual ICollection<GiftVoucher> GiftVouchers { get; set; }
    }
}
