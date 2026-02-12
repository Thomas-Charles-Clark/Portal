using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentRequests
{
	public class SupplierPaymentRequest_CreationDTO
	{
		public byte PaymentRequestStatusID { get; set; }

		public string SupplierCode { get; set; }

		public DateTime PaymentDueDT { get; set; }

		public decimal AmountInCurrency { get; set; }

		public IEnumerable<string> PurchaseOrderIDs { get; set; }

		public string ProformaNumber { get; set; }

		public string RequesterComments { get; set; }

		public int? RequestedByMemberID { get; set; }

		public int PeriodID
		{
			get
			{
				return Convert.ToInt32($"{PaymentDueDT.StartOfWeek(DayOfWeek.Monday):yyyyMMdd}");
			}
		}
	}
}
