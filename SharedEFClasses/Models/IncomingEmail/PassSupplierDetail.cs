using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class PassSupplierDetail
    {
        public long EmailID { get; set; }

        public string SupplierCode { get; set; }

        public int MemberID { get; set; }
    }
}
