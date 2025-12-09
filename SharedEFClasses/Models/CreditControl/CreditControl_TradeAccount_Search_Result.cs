using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_Search_Result
	{
		public IEnumerable<CreditControl_TradeAccount_Search_DashboardPod> DashboardPods { get; set; }

		public IEnumerable<CreditControl_TradeAccount_Search_Record> Results { get; set; }
	}
}
