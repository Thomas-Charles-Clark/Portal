using Microsoft.Owin.Security;

using SharedEFClasses.Models.General;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Payment
{
	public class PaymentCreationRequestDTO
	{
		public DateTime WeekCommencingDate { get; set; }
		public byte PaymentRequestStatusID { get; set; }
		public object PaymentRequestStatus { get; set; }
		public DateTime PaymentDueDT { get; set; }
		public int RequestedByMemberID { get; set; }
		public object RequestedByMember { get; set; }
		public byte? CurrencyID { get; set; }
		public Currency Currency { get; set; }
		public string SupplierCode { get; set; }
		public string PurchaseOrderHeadIDs { get; set; }
		public string ProformaNumber { get; set; }
		public decimal AmountInCurrency { get; set; }
		public decimal AmountInSterling { get; set; }
		public decimal ExchangeRate { get; set; }
		public string RequesterComments { get; set; }
		public string DeciderComments { get; set; }
		public DateTime CreatedDT { get; set; }
		public DateTime ModifiedDT { get; set; }
		public object Supplier { get; set; }
		public object[] PurchaseOrderHeads { get; set; }
	}
}
