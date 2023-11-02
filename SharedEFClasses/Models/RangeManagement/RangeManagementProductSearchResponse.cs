using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementProductSearchRecord
    {
        public int ProductID { get; set; }
        public string ProductFilterName { get; set; }
        public byte? ProductFilterID { get; set; }
        public string ProductPageName { get; set; }
        public string OrderFormGroup { get; set; }
        public long? ImageID { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string ProductStatus { get; set; }
        public string Launch { get; set; }
    }

    public class RangeManagementProductSearchResponse
    {
        public IEnumerable<RangeManagementProductSearchRecord> Results { get; set; }
        public IEnumerable<RangeManagementProductFilterTotal> Totals { get; set; }
    }
}
