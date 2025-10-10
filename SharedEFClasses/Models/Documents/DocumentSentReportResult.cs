using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Documents
{
    public class DocumentSentReportResult
    {
        public IEnumerable<DocumentSentReport_Pod> DashboardPods { get; set; }
        public IEnumerable<DocumentSentReport_Record> Records { get; set; }
    }
}
