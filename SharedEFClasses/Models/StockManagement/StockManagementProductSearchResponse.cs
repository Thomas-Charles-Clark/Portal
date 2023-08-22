using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.StockManagement
{
    public class StockManagementProductSearchRecord
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class StockManagementProductSearchResponse
    {
        public IEnumerable<StockManagementProductSearchRecord> Results { get; set; }
    }
}
