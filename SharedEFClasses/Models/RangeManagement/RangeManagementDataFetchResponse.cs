using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementDataFetchResponse
    {
        public IEnumerable<RangeManagementDataRecord> Results { get; set; }
    }
}
