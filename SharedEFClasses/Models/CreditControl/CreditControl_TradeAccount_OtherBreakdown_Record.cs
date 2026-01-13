using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_OtherBreakdown_Record
	{
		public string UniverseAccount { get; set; }
		public string HoldingTradeAccountCode { get; set; }
		public string TransactionType { get; set; }
		public string SalesLedgerKey { get; set; }
		public decimal? OriginalValueInCurrency { get; set; }
		public decimal? OutstandingAmountInCurrency { get; set; }
		public string ItemReference { get; set; }
	}
}
