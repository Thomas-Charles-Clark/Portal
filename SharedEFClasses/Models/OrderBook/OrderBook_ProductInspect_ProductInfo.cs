using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_ProductInspect_ProductInfo
    {
        public long ProductImageID { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string ProductStatus { get; set; }
        public string LaunchDate { get; set; }
        public string Link { get; set; }
    }
}
