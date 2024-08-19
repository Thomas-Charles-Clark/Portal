using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Parcel
{
    [Table("Surcharge", Schema = "parcel")]
    public class Surcharge
    {
        [Key]
        public byte SurchargeID { get; set; }

        public string Name { get; set; }

        public decimal RRP { get; set; }

        public decimal? PercentageDiscount { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public decimal DGRate { get; set; }
    }
}
