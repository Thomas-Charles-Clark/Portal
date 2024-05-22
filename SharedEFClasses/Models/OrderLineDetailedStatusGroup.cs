using Newtonsoft.Json;

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
    [Table("OrderLineDetailedStatusGroup", Schema = "portal")]
    public class OrderLineDetailedStatusGroup
    {
        [Key]
        public byte OrderLineDetailedStatusGroupID { get; set; }

        public string Name { get; set; }

        [InverseProperty("DetailedStatusGroup")]
        [JsonIgnore]
        public virtual ICollection<OrderLineDetailedStatus> DetailedStatuses { get; set; }
    }
}
