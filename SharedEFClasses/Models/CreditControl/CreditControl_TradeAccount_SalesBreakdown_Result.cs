using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_SalesBreakdown_Result
	{
		public CreditControl_TradeAccount_SalesBreakdown_HeadingResult Heading { get; set; }

		public IEnumerable<CreditControl_TradeAccount_SalesBreakdown_Pod> Pods { get; set; }

		public IEnumerable<CreditControl_TradeAccount_SalesBreakdown_Record> Records { get; set; }
	}
}
