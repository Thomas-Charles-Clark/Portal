using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentRequests
{
	public class SupplierPaymentRequest_SelectDTO
	{
		public int? MemberID { get; set; }

		public string PaymentRequestStatus { get; set; }
	}
}