using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_AgedSalesLedger_Record
	{
		public string PeriodLabel { get; set; }

		public string ReportGroup { get; set; }

		public string CurrencyCode { get; set; }

		public string FormattingCulture { get; set; }

		public int TradeAccountCount { get; set; }

		public int CreditStoppedCount { get; set; }

		public int TwelveMonthOrderCount { get; set; }

		public decimal TwelveMonthOrderValue { get; set; }

		public decimal TotalOutstanding { get; set; }
	}
}
