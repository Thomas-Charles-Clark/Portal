using SharedEFClasses.Models.Pricing;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_Statement_Select_Record
	{
		public string UniVerseAccount { get; set; }

		public string TradeAccountCode { get; set; }

		public string TradeAccountName { get; set; }

		public string Advisory { get; set; }

		public string UniVerseAccounts { get; set; }

		public string StatementTotals { get; set; }

		public string OverdueTotals { get; set; }

		public string StatementLinks { get; set; }

		public string StatementContacts { get; set; }

		public string SendHistory { get; set; }
	}
}
