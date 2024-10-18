using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Customers.Models
{
    public class PassGiftVoucherPreview
    {
        public int ProductID { get; set; }

        public byte PriceListID { get; set; }
     
        public string Code { get; set; }

        public DateTime ExpiryDT { get; set; }

        public string CurrencySymbol { get; set; }

        public string Message { get; set; }
    }
}