using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentApprovals
{
	public class SupplierPaymentApproval_Basket_SelectResult
	{
		public IEnumerable<SupplierPaymentApproval_Basket_SelectRecord> Records { get; set; }
	}
}
