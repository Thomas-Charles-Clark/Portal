using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Marylebone.Models
{
    public class PassBoxingItem
    {
        public int BoxID { get; set; }

        public string Input { get; set; }

        public int? BoxedItemID { get; set; }
    }
}