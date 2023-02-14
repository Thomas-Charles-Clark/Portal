using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using LabelNS = Portal.LabelRecovery;
using ShipNS = Portal.Ship;
using VoidNS = Portal.Void;

namespace Portal.UPSShipping
{
    public class ShipConfirmReply
    {
        public ShipNS.ShipConfirmResponse Response { get; set; }

        public string ErrorDetails { get; set; }

        public string ResponseString
        {
            get
            {
                return JsonConvert.SerializeObject(Response, Formatting.Indented);
            }
        }
    }
}
