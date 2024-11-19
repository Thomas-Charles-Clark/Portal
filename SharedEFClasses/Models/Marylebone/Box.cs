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
    [Table("Box", Schema = "mhs")]
    public class Box
    {
        [Key]
        public int BoxID { get; set; }

        public string BoxCode { get; set; }

        public short DestinationStockLocationID { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("DestinationStockLocationID")]
        public virtual StockLocation DestinationStockLocation { get; set; }

        [InverseProperty("Box")]
        public ICollection<BoxedItem> BoxedItems { get; set; }
    }
}
