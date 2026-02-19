using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_PerformanceDTO
	{
		public IEnumerable<string> TradeAccountCodeList { get; set; }
		public string ReportGrouping { get; set; }
		public string CurrencyOrSterling { get; set; }
	}
}
