using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementTransferResponse
    {
        public int Error { get; set; }
        public string ErrorMessage { get; set; }
        public string Notification { get; set; }
        public long BasketID { get; set; }
        public long BasketItemID { get; set; }
    }
}
