using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("OrderLineDetailedStatus", Schema = "portal")]
    public class OrderLineDetailedStatus
    {
        [Key]
        public byte OrderLineDetailedStatusID { get; set; }

        public string Name { get; set; }

        public byte OrderLineDetailedStatusGroupID { get; set; }

        [ForeignKey("OrderLineDetailedStatusGroupID")]
        public virtual OrderLineDetailedStatusGroup DetailedStatusGroup { get; set; }
    }
}
