using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class PassOrderExportParams : PassOrderBookBaseParams
    {
        public string EnquiryType { get; set; }
    }
}
