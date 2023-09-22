using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.StockManagement
{
    public class StockManagementProductStatusChangeDto
    {
        public int ProductID { get; set; }

        public string Status { get; set; }

        public decimal? ClearanceDiscountPercentage { get; set; }
    }
}
