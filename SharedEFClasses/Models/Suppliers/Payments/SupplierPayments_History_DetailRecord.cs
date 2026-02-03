using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.Payments
{
	public class SupplierPayments_History_DetailRecord
	{
		public int PaymentDecisionID { get; set; }

		public int PeriodID { get; set; }

		public string Period { get; set; }

		public string SupplierCode { get; set; }

		public string SupplierName { get; set; }

		public string CurrencyCode { get; set; }

		public string FormattingCulture { get; set; }

		public decimal AmountInCurrency { get; set; }

		public DateTime? FinalisedDT { get; set; }

		public string RequestedBy { get; set; }

		public string ApprovedBy { get; set; }
	}
}
