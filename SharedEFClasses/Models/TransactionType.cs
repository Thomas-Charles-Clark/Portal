using Newtonsoft.Json;

using SharedEFClasses.Models.Orders;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SharedEFClasses.Models
{
    [Table("TransactionType", Schema = "portal")]
    public class TransactionType
    {
        [Key]
        public byte TransactionTypeID { get; set; }
    
        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("TransactionType")]
        public virtual ICollection<Basket> Baskets { get; set; }
    }
}
