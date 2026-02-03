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

		public DateTime WeekCommencing { get; set; }
	
		public bool OnlyShowSuppliersWithPaymentRequests { get; set; }
	}
}
