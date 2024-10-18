using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Customers.Models
{
    public class PassGiftVoucherRedeem
    {
        public short GiftVoucherID { get; set; }

        public string OrderID { get; set; }

        public string Notes { get; set; }
    }
}