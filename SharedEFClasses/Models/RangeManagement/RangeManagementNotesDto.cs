using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementNotesDto
    {
        public byte BranchID { get; set; }
        public int ProductID { get; set; }
        public int? MemberID { get; set; }
        public string Note { get; set; }
    }
}
