using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Utilities
{
    public class HMRCVATCheckReturnType
    {
        public HMRCVATCheckReturnBody Body { get; set; }

        public string countryName { get; set; }

        public string responseMessage { get; set; }

        public HMRCVATCheckReturnType(bool valid, string traderName, string countryName, string responseMessage)
        {
            this.Body = new HMRCVATCheckReturnBody(valid, traderName);

            this.countryName = countryName;

            this.responseMessage = responseMessage;
        }
    }

    public class HMRCVATCheckReturnBody 
    { 
        public bool valid { get; set; }

        public string traderName { get; set; }

        public HMRCVATCheckReturnBody(bool valid, string traderName)
        {
            this.valid = valid;

            this.traderName = traderName;
        }
    }
}
