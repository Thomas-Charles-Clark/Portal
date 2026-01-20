using Microsoft.AnalysisServices.AdomdClient;

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
	[Table("PaymentRequest_PurchaseOrderHead", Schema = "payment")]
	public class PaymentRequest_PurchaseOrderHead
	{
		[Key]
		[Column(Order = 1)]
		public int PaymentRequestID { get; set; }

		[Key]
		[Column (Order = 2)]
		public string PurchaseOrderHeadID { get; set; }

		[NotMapped]
		public DateTime CreatedDT { get; set; }

		[NotMapped]
		public DateTime? DeletedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Deleted { get; set; }

		[ForeignKey("PaymentRequestID")]
		public virtual PaymentRequest PaymentRequest { get; set; }

		[ForeignKey("PurchaseOrderHeadID")]
		public virtual PurchaseOrderHead PurchaseOrderHead { get; set; }
	}
}
