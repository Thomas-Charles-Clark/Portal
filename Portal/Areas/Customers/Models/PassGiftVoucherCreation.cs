using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Customers.Models
{
    public class PassGiftVoucherCreation
    {
        public int ProductID { get; set; }

        public string GUID { get; set; }

        public string CreditOrderID { get; set; }

        public byte GiftVoucherTypeID { get; set; }

        public byte PriceListID { get; set; }

        public decimal ValueEx { get; set; }

        public decimal ValueInc { get; set; }

        public string Notes { get; set; }

        public string Message { get; set; }
    }
}