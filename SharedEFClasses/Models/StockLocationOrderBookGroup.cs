using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("StockLocationOrderBookGroup", Schema = "portal")]
    public class StockLocationOrderBookGroup
    {
        [Key]
        public byte StockLocationOrderBookGroupID { get; set; }

        public string Name { get; set; }
    }
}
