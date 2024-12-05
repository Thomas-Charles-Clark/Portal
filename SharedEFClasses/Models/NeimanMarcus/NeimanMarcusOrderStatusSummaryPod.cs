using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.NeimanMarcus
{
    public class NeimanMarcusOrderStatusSummaryPod
    {
        public int PodID { get; set; }
        public string Label { get; set; }
        public int OrderCount { get; set; }
        public decimal SalesTotal { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
