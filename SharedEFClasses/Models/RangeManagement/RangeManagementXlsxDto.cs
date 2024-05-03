using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementXlsxDto
    {
        public int TradeAccountID { get; set; }
        public string TradeAccountCode { get; set; }
        public string UserID { get; set; }
        public short CountryID { get; set; }
        public byte LanguageID { get; set; }
        public bool DisplayPrices 
        {
            get 
            { 
                return false;
            } 
        }
        public bool DisplayClearance
        {
            get
            {
                return false;
            }
        }
        public IEnumerable<int> ProductPageIDs { get; set; }
    }
}
