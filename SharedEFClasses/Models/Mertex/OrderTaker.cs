using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertex
{
    [Table("OrderTaker", Schema = "Mertex")]
    public partial class OrderTaker
    {
        [Key]
        [StringLength(10)]
        public string Code { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        [StringLength(254)]
        public string Email { get; set; }

        [NotMapped]
        public string ShortLabel
        {
            get
            {
                return $"{Code} - {Name}";
            }
        }
    }
}
