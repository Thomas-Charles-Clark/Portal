using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Utilities
{
    public class HMRCVATCheckResult
    {
        [JsonProperty("target")]
        public HMRCVATCheckTarget Target { get; set; }

        [JsonProperty("processingDate")]
        public string ProcessingDate { get; set; }
    }

    public class HMRCVATCheckTarget
    {
        public string Name { get; set; }

        public string VATNumber { get; set; }

        public object Address { get; set; }
    }
}
