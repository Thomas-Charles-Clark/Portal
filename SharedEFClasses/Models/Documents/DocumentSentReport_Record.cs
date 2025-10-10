using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Documents
{
    public class DocumentSentReport_Record
    {
        public long DocumentSentID { get; set; }
        public string TradeAccount { get; set; }
        public string SentRegarding { get; set; }
        public string Document { get; set; }
        public string DocumentLink { get; set; }
        public DateTime SentDT { get; set; }
        public string SentTo { get; set; }
        public string SentBy { get; set; }
        public string ReplyTo { get; set; }
        public string Status { get; set; }
        public string FilePath { get; set; }
        public int TotalRowCount { get; set; }
    }
}
