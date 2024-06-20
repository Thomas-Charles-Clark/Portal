using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    [Table("OrderBook", Schema = "ram")]
    public class OrderBookRecord
    {
        [Key]
        public string OrderLineID { get; set; }

        public string OrderID { get; set; }

        public string CustomerOrderReference { get; set; }

        [NotMapped]
        public string ShortLabel
        {
            get
            {
                return $"{OrderID} - {CustomerOrderReference}";
            }
        }
    }
}
