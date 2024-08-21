using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Parcel
{
    public class PassParcelRateFetch
    {
        public short DestinationID { get; set; }
        public byte ParcelTypeID { get; set; }
        public string TradeAccountCurrencyCode { get; set; }
    }
}
