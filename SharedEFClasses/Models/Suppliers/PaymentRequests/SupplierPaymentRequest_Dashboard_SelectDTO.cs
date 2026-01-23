using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentRequest
{
	public class SupplierPaymentRequest_Dashboard_SelectDTO
	{
		public int MemberID { get; set; }

		public DateTime? WeekCommencingOverride { get; set; }
	}
}
