using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentRequest
{
	public class SupplierPaymentRequest_Dashboard_SelectResult
	{
		public SupplierPaymentRequestDashboard_WeekCommencingRecord WeekCommencingRecord { get; set; }
		public IEnumerable<SupplierPaymentRequestDashboard_RequestedTotal> RequestedTotals { get; set; }
		public IEnumerable<SupplierPaymentRequestDashboard_ApprovedTotal> ApprovedTotals { get; set; }
	}
}
