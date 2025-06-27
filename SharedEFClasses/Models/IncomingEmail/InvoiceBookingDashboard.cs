using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class InvoiceBookingDashboard
    {
        public IEnumerable<InvoiceBookingDashboard_SelectResult> DashboardPods { get; set; }
        public string MertexWarning { get; set; }
    }
}
