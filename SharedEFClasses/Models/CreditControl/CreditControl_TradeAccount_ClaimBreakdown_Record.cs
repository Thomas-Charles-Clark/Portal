using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_ClaimBreakdown_Record
	{
		public string ClaimID { get; set; }
		public DateTime? ClaimDT { get; set; }
		public string OrderID { get; set; }
		public DateTime? OrderDT { get; set; }
		public string InvoiceNumber { get; set; }
		public string ClaimTaker { get; set; }
		public string ClaimLineID { get; set; }
		public string OrderLineID { get; set; }
		public string ProductCode { get; set; }
		public decimal? OrderQuantity { get; set; }
		public decimal? ClaimQuantity { get; set; }
		public decimal? AcceptedQuantity { get; set; }
		public decimal? ReturnedQuantity { get; set; }
		public string FaultCode { get; set; }
		public string Result { get; set; }
		public string Notes { get; set; }
	}
}
