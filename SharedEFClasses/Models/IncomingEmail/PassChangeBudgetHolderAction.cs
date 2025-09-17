using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class PassChangeBudgetHolderAction
    {
        public string SupplierCode { get; set; }

        public string NewBudgetHolderCode { get; set; }

        public int ChangeActionMemberID { get; set; }
    }
}
