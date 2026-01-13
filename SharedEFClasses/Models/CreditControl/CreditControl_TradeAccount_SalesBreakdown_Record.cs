using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_SalesBreakdown_Record
	{
		public string OrderID { get; set; }
		public DateTime? OrderDate  { get; set; }
		public string InvoiceID { get; set; }
		public DateTime? InvoiceDate { get; set; }
		public string ProductCode { get; set; }
		public decimal? QuantityOrdered { get; set; }
		public decimal? SalesValueCurrency { get; set; }
		public decimal? SalesValueSterling { get; set; }
	}
}
