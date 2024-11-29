using Kendo.Mvc.UI;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Products.Models
{
    public class FetchHeldOrdersManagementDTO
    {
        public string marketCode { get; set; }
        public string searchTerm { get; set; }
        public string holdReasonIds { get; set; }
    }
}