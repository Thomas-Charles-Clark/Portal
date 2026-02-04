using Kendo.Mvc.UI;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.Payments
{
	public class SupplierPayments_Dashboard_SelectRecord
	{
		public bool IsTotal { get; set; }

		public string RowLabel { get; set; }

		public string CurrencyCode { get; set; }

		public string CurrencyFormattingCulture { get; set; }

		public decimal? OverdueSupplierInvoiceTotal { get; set; }

		public decimal? Budget { get; set; }

		public decimal? PaymentRequestTotal { get; set; }
		
		public decimal? PaymentRequestPaymentPlanTotal { get; set; }

		public decimal? PendingApprovalTotal { get; set; }

		public decimal? ApprovedTotal { get; set; }

		public decimal? GBPFXRate { get; set; }
	}
}
