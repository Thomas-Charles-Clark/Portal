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

		public decimal AmountInCurrency { get; set; }
	}
}
