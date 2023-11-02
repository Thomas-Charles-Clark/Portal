using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementTransferOrdersDto
    {
        public byte BranchID { get; set; }
        public string TransferDirection { get; set; }
    }
}
