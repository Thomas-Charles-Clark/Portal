using Newtonsoft.Json;

using SharedEFClasses.Models.Products;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("StockLocationGroup", Schema = "portal")]
    public class StockLocationGroup
    {
        [Key]
        public byte StockLocationGroupID { get; set; }

        public string Name { get; set; }
    }
}
