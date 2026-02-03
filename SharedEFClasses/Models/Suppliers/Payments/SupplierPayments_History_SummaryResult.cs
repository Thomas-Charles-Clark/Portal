using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.Payments
{
	public class SupplierPayments_History_SummaryResult
	{
		public IEnumerable<SupplierPayments_History_SummaryRecord> Records { get; set; }
	}
}
