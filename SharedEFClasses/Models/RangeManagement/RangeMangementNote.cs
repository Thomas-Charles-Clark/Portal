using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeMangementNote
    {
        public long RangeNoteID { get; set; }
        public string Note { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime ModifiedDT { get; set; }
        public int MemberID { get; set; }
        public string MemberName { get; set; }
        public string MemberEmail { get; set; }
    }
}
