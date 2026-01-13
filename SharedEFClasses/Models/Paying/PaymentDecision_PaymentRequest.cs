using SharedEFClasses.Models.OrderBook;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Paying
{
	[Table("PaymentDecision_PaymentRequest", Schema = "payment")]
	public class PaymentDecision_PaymentRequest
	{
		[Key]
		[Column(Order = 1)]
		public int PaymentDecisionID { get; set; }

		[Key]
		[Column(Order = 2)]
		public int PaymentRequestID { get; set; }

		public decimal AmountInCurrency { get; set; }

		public decimal AmountInSterling { get; set; }

		public decimal ExchangeRate { get; set; }

		public DateTime CreatedDT { get; set; }

		public DateTime? ModifiedDT { get; set; }

		public DateTime? DeletedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Deleted { get; set; }
	}
}
