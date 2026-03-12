
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_Payments_SelectRecord
	{
		[Key]
		public int PaymentRequestID { get; set; }

		public Guid PaymentRequestGUID { get; set; }

		public string PaymentURI { get; set; }

		public string PaymentRequestType { get; set; }

		public string Status { get; set; }

		public string CurrencyCode { get; set; }

		public string FormattingCulture { get; set; }

		public decimal Amount { get; set; }

		public string DocumentURI { get; set; }

		public DateTime? ModifiedDT { get; set; }

		public string TradeAccountLabel { get; set; }
	}
}
