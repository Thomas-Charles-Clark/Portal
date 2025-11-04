using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Leads
{
    public class PassCreditControllerDefaultInfo
    {
        public long LeadID { get; set; }
        public int CallerMemberID { get; set; }
        public byte? LanguageID { get; set; }
        public byte? SalesMarketID { get; set; }
        public string MertexLanguageCode { get; set; }
    }
}
