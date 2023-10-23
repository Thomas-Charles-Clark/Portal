using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Unity.Interception.PolicyInjection;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementProductUpsert
    {
        public int ProductID { get; set; }
        public decimal Quantity { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
