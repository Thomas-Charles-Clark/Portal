using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Customers.Models
{
    public class PassGiftVoucherExtend
    {
        public short GiftVoucherID { get; set; }

        public string Notes { get; set; }

        public DateTime ExpiryDT { get; set; }
    }
}