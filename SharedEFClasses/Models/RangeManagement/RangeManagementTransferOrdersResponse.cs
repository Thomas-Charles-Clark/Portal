using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementTransferOrdersResponse
    {
        public IEnumerable<RangeManagementTransferOrderResult> Results { get; set; }
    }
}
