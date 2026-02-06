using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentRequests
{
	public class SupplierPaymentRequest_SelectResult
	{
		public IEnumerable<SupplierPaymentRequest_SelectRecord> Records { get; set; }
	}
}
