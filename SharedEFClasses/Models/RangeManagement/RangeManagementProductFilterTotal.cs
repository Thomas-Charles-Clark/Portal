using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementProductFilterTotal
    {
        public byte ProductFilterID { get; set; }
        public string ProductFilterName { get; set; }
        public int? PlannedCount { get; set; }
        public decimal? PlannedValue { get; set; }
        public int? ActualCount { get; set; }
        public decimal? ActualValue { get; set; }
        public int? InProgressCount { get; set; }
        public decimal? InProgressValue { get; set; }
    }
}
