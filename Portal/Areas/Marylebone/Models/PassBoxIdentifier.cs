using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Marylebone.Models
{
    public class PassBoxIdentifier
    {
        public int BoxID { get; set; }
        public string BoxCode { get; set; }
        public string StockLocationCode { get; set; }
    }
}