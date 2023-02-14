using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portal.UPSTracking
{
    public class TrackingRequest
    {
        public string AccountNumber { get; set; }
        public DateTime? ManifestDate { get; set; }
        public string TrackingNumber { get; set; }
        public string OriginPostalCode { get; set; }
        public string OriginCountryCode { get; set; }

        public TrackingRequest(string an, DateTime? md, string tn, string pc, string cc)
        {
            AccountNumber = an;
            ManifestDate = md;
            TrackingNumber = tn;
            OriginPostalCode = pc;
            OriginCountryCode = cc;
        }
    }
}
