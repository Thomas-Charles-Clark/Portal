using Newtonsoft.Json;

using SharedEFClasses.Models.Products;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Marylebone
{
    [Table("BoxedItem", Schema = "mhs")]
    public class BoxedItem
    {
        [Key]
        public int BoxedItemID { get; set; }
        
        public int BoxID { get; set; }

        public int ProductID { get; set; }

        public decimal Quantity { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [ForeignKey("BoxID")]
        public virtual Box Box { get; set; }

        [ForeignKey("ProductID")]
        public virtual Product Product { get; set; }
    }
}
