using Newtonsoft.Json;

using SharedEFClasses.Models.Products;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Pricing
{
    [Table("Price", Schema = "dbo")]
    public class Price
    {
        [Key]
        [Column(Order = 1)]
        public int ProductID { get; set; }

        [Key]
        [Column(Order = 2)]
        public byte PriceListID { get; set; }

        public decimal PriceInc { get; set; }

        public decimal PriceEx { get; set; }

        [JsonIgnore]
        [ForeignKey("ProductID")]
        public virtual Product Product { get; set; }
    }
}
