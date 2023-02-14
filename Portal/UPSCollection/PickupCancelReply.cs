using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PickupNS = Portal.Pickup;

namespace Portal.UPSCollection
{
    public class PickupCancelReply
    {
        public PickupNS.PickupCancelResponse Response { get; set; }
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
