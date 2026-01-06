using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_DebtBreakdown_Result
	{
		public CreditControl_DebtBreakdown_HeadingResult Heading { get; set; }

		public IEnumerable<CreditControl_DebtBreakdown_Pod> Pods { get; set; }

		public IEnumerable<CreditControl_DebtBreakdown_Record> Records { get; set; }
	}
}
