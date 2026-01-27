using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentApprovals
{
	public class SupplierPaymentApprovalBasketDTO
	{
		public IEnumerable<SupplierPaymentApprovalBasketItemDTO> BasketItems { get; set; }
	}
}
