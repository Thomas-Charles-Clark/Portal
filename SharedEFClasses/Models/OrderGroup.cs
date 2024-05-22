using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("OrderGroup", Schema = "portal")]
    public class OrderGroup
    {
        [Key]
        public byte OrderGroupID { get; set; }
        public string Name { get; set; }
    }
}
