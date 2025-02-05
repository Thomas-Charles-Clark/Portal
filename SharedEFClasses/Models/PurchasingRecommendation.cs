using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("PurchasingRecommendation", Schema = "portal")]
    public class PurchasingRecommendation
    {
        [Key]
        public byte PurchasingRecommendationID { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
    }
}
