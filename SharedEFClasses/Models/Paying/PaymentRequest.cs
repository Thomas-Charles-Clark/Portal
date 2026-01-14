using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Mertex;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Payment
{
	[Table("PaymentRequest", Schema = "payment")]
	public class PaymentRequest
	{
		[Key]
		public int PaymentRequestID { get; set; }

		public byte PaymentRequestStatusID { get; set; }

		public int RequestedByMemberID { get; set; }

		public string SupplierCode { get; set; }

		public byte CurrencyID { get; set; }

		public string PurchaseOrderHeadIDs { get; set; }

		public string ProformaNumber { get; set; }

		public decimal AmountInCurrency { get; set; }

		public decimal AmountInSterling { get; set; }

		public decimal ExchangeRate { get; set; }

		public string Comments { get; set; }

		public DateTime CreatedDT { get; set; }

		public DateTime? ModifiedDT { get; set; }

		public DateTime? DeletedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Deleted { get; set; }

		[ForeignKey("PaymentRequestStatusID")]
		public virtual PaymentRequestStatus PaymentRequestStatus { get; set; }

		[ForeignKey("RequestedByMemberID")]
		public virtual Member RequestedByMember { get; set; }

		[ForeignKey("CurrencyID")]
		public virtual Currency Currency { get; set; }

		[ForeignKey("SupplierCode")]
		public virtual SupplierLive Supplier { get; set; }
	}
}
