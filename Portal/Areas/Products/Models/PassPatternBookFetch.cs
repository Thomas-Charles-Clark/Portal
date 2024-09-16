using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Products.Models
{
    public class PassPatternBookFetch
    {
        public int ProductID { get; set; }
        public int TradeAccountID { get; set; }
        public IEnumerable<int> ProductIDs { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
    }
}