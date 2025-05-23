using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class PassInvoiceBookingFlagParams
    {
        public long EmailID { get; set; }
        public string State { get; set; }
    }
}
