using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentRequests
{
	public class SupplierPaymentRequest_SelectRecord
	{
		[Key]
		public int PaymentRequestID { get; set; }

		public byte PaymentRequestStatusID { get; set; }

		public int RequestedByMemberID { get; set; }

		public string PaymentRequestType { get; set; }

		public string RequestorName { get; set; }

		public string RequestorEmail { get; set; }

		public string RequestType { get; set; }

		public DateTime PaymentDueDate { get; set; }

		public string Status { get; set; }

		public string SupplierCode { get; set; }

		public string SupplierName { get; set; }

		public string CurrencyCode { get; set; }

		public string FormattingCulture { get; set; }

		public decimal RequestAmount { get; set; }

		public decimal OutstandingAmount { get; set; }

		public string ApprovalDetails { get; set; }

		public string ProformaNumber { get; set; }

		public string RequesterComments { get; set; }

		public DateTime CreatedDT { get; set; }

		public DateTime? ModifiedDT { get; set; }
	}
}
