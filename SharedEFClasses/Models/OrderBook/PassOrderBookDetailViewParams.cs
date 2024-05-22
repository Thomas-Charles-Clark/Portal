using Org.BouncyCastle.Asn1.Mozilla;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class PassOrderBookDetailViewParams : PassOrderBookBaseParams
    {
        // Main Grid Intersection Filters
        public byte? OrderGroupID { get; set; }
        public byte? StockLocationGroupID { get; set; }
        public byte? OrderStatusID { get; set; }
        public byte? OrderStatusGroupID { get; set; }

        // PreDefined Pod Filters
        public byte? OrderLineDetailedStatusID { get; set; }
        public bool? HasLinkedPO { get; set; }
        public bool? LinkedPODelayed { get; set; }
    }
}
