using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementBasketItemRemovalDto
    {
        public long BasketItemID { get; set; }
        public int? MemberID { get; set; }
    }
}
