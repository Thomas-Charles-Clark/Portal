using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentApproval
{
	public class SupplierPaymentApproval_SelectDTO
	{
		public int MemberID { get; set; }

		public int PeriodID { get; set; }
	
		public bool OnlyShowSuppliersWithPaymentRequests { get; set; }

		public bool OnlyShowSuppliersWithOutstandingInvoices { get; set; }
	}
}
