using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.NeimanMarcus
{
    public class NeimanMarcusOrderStatusResponse
    {
        public IEnumerable<NeimanMarcusOrderStatusOrderResult> Orders { get; set; }

        public NeimanMarcusOrderStatusTitleExplanationResult TitleExplanations { get; set; }

        public IEnumerable<NeimanMarcusOrderStatusSummaryPod> SummaryPods { get; set; }
    }
}
