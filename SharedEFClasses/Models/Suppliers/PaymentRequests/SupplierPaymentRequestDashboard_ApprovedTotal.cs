using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentRequest
{
	public class SupplierPaymentRequestDashboard_ApprovedTotal
	{
		public int FundingID { get; set; }

		public DateTime WeekCommencing { get; set; }

		public decimal? AvailableForApprovalInSterling { get; set; }

		public decimal? TargetSpendInSterling { get; set; }

		public decimal? SpentInSterling { get; set; }

		public decimal? RemainingInSterling { get; set; }
	}
}
