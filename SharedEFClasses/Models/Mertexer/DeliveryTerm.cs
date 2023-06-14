using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    [Table("DeliveryTerm", Schema = "Maintenance")]
    public class DeliveryTerm
    {
        [Key]
        public string DeliveryTermCode { get; set; }
        public string Name { get; set; }
        public string Label { get; set; }
        public byte SortOrder { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
    }
}
