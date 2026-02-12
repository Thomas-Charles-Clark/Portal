using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentApprovals
{
	public class SupplierPaymentApproval_Payment_Decision_FinaliseDTO
	{
		public int PeriodID { get; set; }

		public IEnumerable<SupplierPaymentApprovalBasketItemDTO> BasketItems { get; set; }
	}
}
