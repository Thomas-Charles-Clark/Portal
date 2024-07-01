using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public class BasketItemSplitSelectResult
    {
        public string BasketItemGroup { get; set; }
        public long BasketItemID { get; set; }
        public long ProductImageID { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string Details { get; set; }
    }
}
