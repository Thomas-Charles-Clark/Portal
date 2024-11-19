using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Marylebone.Models
{
    public class PassBoxDestination : PassBoxIdentifier
    {
        public string DestinationStockLocationCode { get; set; }
    }
}