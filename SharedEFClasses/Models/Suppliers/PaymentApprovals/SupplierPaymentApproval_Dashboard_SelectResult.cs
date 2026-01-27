using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentApproval
{
	public class SupplierPaymentApproval_Dashboard_SelectResult
	{
		public IEnumerable<SupplierPaymentApprovalDashboard_SupplierSummaryRecord> SupplierSummaryRecords { get; set; }
		public IEnumerable<SupplierPaymentApprovalDashboard_SupplierDetailRecord> SupplierDetailRecords { get; set; }
	}
}
