using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_ClaimBreakdown_Result
	{
		public CreditControl_TradeAccount_ClaimBreakdown_HeadingResult Heading { get; set; }

		public IEnumerable<CreditControl_TradeAccount_ClaimBreakdown_Pod> Pods { get; set; }

		public IEnumerable<CreditControl_TradeAccount_ClaimBreakdown_Record> Records { get; set; }
	}
}
