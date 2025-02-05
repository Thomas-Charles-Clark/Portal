using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderEntry
{
    public class StockCheckRequestSelectResult
    {
        public string Response { get; set; }

        public bool AllowStockCheckRequest { get; set; }

        public string @Class { get; set; }
    }
}
