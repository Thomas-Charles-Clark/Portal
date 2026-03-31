using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_Dashboard_Select_Result
	{
		public IEnumerable<CreditControl_Dashboard_Select_Pod> DashboardPods { get; set; }

		public IEnumerable<CreditControl_Dashboard_Select_Record> Results { get; set; }

		public CreditControl_TradeAccount_Totals_Record TotalsRecord { get; set; }
	}
}
