using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_Statement_Select_Result
	{
		public CreditControl_Statement_Select_HeadingResult Heading { get; set; }

		public IEnumerable<CreditControl_Statement_Select_Pod> Pods { get; set; }

		public IEnumerable<CreditControl_Statement_Select_Record> Results { get; set; }

		public CreditControl_TradeAccount_Totals_Record TotalsRecord { get; set; }

		public CreditControl_Statement_Info_Record InformationPopup { get; set; }
	}
}
