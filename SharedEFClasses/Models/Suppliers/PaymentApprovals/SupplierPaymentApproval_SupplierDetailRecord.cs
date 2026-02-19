using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentApproval
{
	public class SupplierPaymentApproval_SupplierDetailRecord
	{
		public string SupplierCode { get; set; }

		public int PaymentRequestID { get; set; }

		public string PaymentRequestStatusName { get; set; }

		public decimal OriginalAmountInCurrency { get; set; }

		public decimal PendingApprovalAmountInCurrency { get; set; }

		public decimal? ApprovedAmountInCurrency { get; set; }

		public decimal? OutstandingAmountInCurrency { get; set; }

		public string RequesterComments { get; set; }

		public string DeciderComments { get; set; }

		public int RequestedByMemberID { get; set; }

		public string RequestedByMemberName { get; set; }

		public DateTime CreatedDT { get; set; }

		public DateTime? PayOnDate { get; set; }
	}
}
