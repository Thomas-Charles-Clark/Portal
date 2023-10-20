using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementDataFetchDto
    {
        public byte BranchID { get; set; }
        public IEnumerable<int> ProductIDs { get; set; }
    }
}
