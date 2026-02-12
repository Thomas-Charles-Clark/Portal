using Newtonsoft.Json;

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

		public string ProformaNumber { get; set; }

		public decimal AmountInCurrency { get; set; }

		public string RequesterComments { get; set; }

		public string DeciderComments { get; set; }

		public int PeriodID { get; set; }

		public DateTime PaymentDueDT { get; set; }

		public DateTime CreatedDT { get; set; }

		public DateTime? ModifiedDT { get; set; }

		public DateTime? DeletedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Deleted { get; set; }

		[JsonIgnore]
		[ForeignKey("PaymentRequestStatusID")]
		public virtual PaymentRequestStatus PaymentRequestStatus { get; set; }

		[JsonIgnore]
		[ForeignKey("RequestedByMemberID")]
		public virtual Member RequestedByMember { get; set; }

		[JsonIgnore]
		[NotMapped]
		public virtual Currency Currency { get; set; }

		[JsonIgnore]
		[ForeignKey("SupplierCode")]
		public virtual SupplierLive Supplier { get; set; }

		[InverseProperty("PaymentRequest")]
		public virtual ICollection<PaymentRequest_PurchaseOrderHead> PaymentRequestPurchaseOrderHeads { get; set; }

		[NotMapped]
		public decimal? AmountApprovedInCurrency { get; set; }

		[InverseProperty("PaymentRequest")]
		public virtual ICollection<PaymentDecision> PaymentDecisions { get; set; }

		[ForeignKey("PeriodID")]
		public virtual PaymentPeriod PaymentPeriod { get; set; }
	}
}
