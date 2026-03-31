using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_SalesLedger_Select_Result
	{
		public CreditControl_SalesLedger_Select_HeadingResult Heading { get; set; }

		public IEnumerable<CreditControl_SalesLedger_Select_Pod> Pods { get; set; }

		public IEnumerable<CreditControl_SalesLedger_Select_Record> Records { get; set; }
	}
}
