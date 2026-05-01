using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_AllocateHoldingAccountCash_SelectRecord
	{
		public string UniVerseAccount { get; set; }

		public string TradeAccountLabel { get; set; }

		public string CurrencyCode { get; set; }

		public string FormattingCulture { get; set; }

		public string SalesLedgerKey { get; set; }

		public string Age { get; set; }

		public string OriginalValueInCurrency { get; set; }

		public string OutstandingAmountInCurrency { get; set; }

		public string UnallocatedCashAssignedToThisOrderTotalInCurrency { get; set; }
	
		public string UnallocatedCashAssignedToThisOrderBreakdown { get; set; }

		public string UnallocatedCashAssignedToThisAccountTotalInCurrency { get; set; }

		public string UnallocatedCashAssignedToThisAccountBreakdown { get; set; }

		public string InvoiceID { get; set; }

		public DateTime? InvoiceDT { get; set; }

		public string InvoiceURI { get; set; }

		public string OrderID { get; set; }
	}
}
