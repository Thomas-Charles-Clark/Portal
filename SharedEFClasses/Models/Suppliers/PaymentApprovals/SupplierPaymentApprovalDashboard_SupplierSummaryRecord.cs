using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentApproval
{
	public class SupplierPaymentApprovalDashboard_SupplierSummaryRecord
	{
		public string SupplierCode { get; set; }
		public string SupplierName { get; set; }
		public string SupplierCurrencyCode { get; set; }
		public decimal? PaymentRequestPaymentPlanTotal { get; set; }
		public decimal? PaymentRequestOtherTotal { get; set; }
		public decimal TotalValueGBP { get; set; }
		public decimal TotalValue { get; set; }
		public decimal NotDueTotalValue { get; set; }
		public decimal OverdueTotalValue { get; set; }
		public decimal Debt30DayValue { get; set; }
		public decimal Debt60DayValue { get; set; }
		public decimal Debt90DayValue { get; set; }
		public decimal Debt120DayValue { get; set; }

		[NotMapped]
		public IEnumerable<SupplierPaymentApprovalDashboard_SupplierDetailRecord> Details { get; set; }
	}
}
