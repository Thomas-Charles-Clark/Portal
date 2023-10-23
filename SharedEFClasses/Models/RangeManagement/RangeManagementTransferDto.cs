using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementTransferDto
    {
        public int BranchID { get; set; }
        public int ProductID { get; set; }
        public decimal TransferQuantity { get; set; }
        public string TransferDirection { get; set; }
    }
}
