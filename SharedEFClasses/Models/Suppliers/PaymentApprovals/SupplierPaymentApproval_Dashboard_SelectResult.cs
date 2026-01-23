using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentApproval
{
	public class SupplierPaymentApproval_Dashboard_SelectResult
	{
		public SupplierPaymentApprovalDashboard_WeekCommencingRecord WeekCommencingRecord { get; set; }
		public IEnumerable<SupplierPaymentApprovalDashboard_RequestedTotal> RequestedTotals { get; set; }
		public IEnumerable<SupplierPaymentApprovalDashboard_ApprovedTotal> ApprovedTotals { get; set; }
	}
}
