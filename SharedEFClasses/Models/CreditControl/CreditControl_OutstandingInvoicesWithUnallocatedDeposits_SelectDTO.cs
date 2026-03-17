using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_OutstandingInvoicesWithUnallocatedDeposits_SelectDTO
	{
		public string DateRangeID { get; set; }

		public string SearchTerm { get; set; }

		public string TradeAccountCode { get; set; }

		public string CurrencyCode { get; set; }

		public DateTime? From { get; set; }

		public DateTime? To { get; set; }
	}
}
