using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_OutstandingInvoicesWithUnallocatedDeposits_SelectResult
	{
		public IEnumerable<CreditControl_OutstandingInvoicesWithUnallocatedDeposits_SelectRecord> Records { get; set; }
	}
}
