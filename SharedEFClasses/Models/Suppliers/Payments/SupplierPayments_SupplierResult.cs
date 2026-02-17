using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.Payments
{
	public class SupplierPayments_SupplierResult
	{
		public IEnumerable<SupplierPayments_SupplierRecord> Records { get; set; }
	}
}
