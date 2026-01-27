using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentApprovals
{
	public class SupplierPaymentApprovalBasketItemDTO
	{
		public int? PaymentDecisionID { get; set; }

		public int PaymentRequestID { get; set; }

		public decimal AmountApprovedInCurrency { get; set; }

		public decimal ExchangeRate { get; set; }

		public decimal AmountApprovedInSterling { get; set; }
	}
}
