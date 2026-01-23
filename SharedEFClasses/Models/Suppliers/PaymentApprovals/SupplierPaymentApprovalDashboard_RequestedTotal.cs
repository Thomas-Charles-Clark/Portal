using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentApproval
{
	public class SupplierPaymentApprovalDashboard_RequestedTotal
	{
		public string CurrenyName { get; set; }

		public string CurrencyCode { get; set; }

		public string FormattingCulture { get; set; }

		public decimal TotalRequestedInCurrency { get; set; }
		public decimal RequestedTotalInSterling { get; set; }
	}
}
