using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_OtherBreakdown_Result
	{
		public CreditControl_TradeAccount_OtherBreakdown_HeadingResult Heading { get; set; }

		public IEnumerable<CreditControl_TradeAccount_OtherBreakdown_Pod> Pods { get; set; }

		public IEnumerable<CreditControl_TradeAccount_OtherBreakdown_Record> Records { get; set; }
	}
}
