using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("Mertex_DeliveryType", Schema =  "adm")]
    public class Mertex_DeliveryType
    {
        [Key]
        public string Code { get; set; }

        public string Description { get; set; }

        public byte SortOrder { get; set; }

        [NotMapped]
        public string ShortLabel
        {
            get
            {
                return $"{Code} - {Description}";
            }
        }
    }
}
