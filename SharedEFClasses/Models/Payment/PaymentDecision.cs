using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Payment
{
	[Table("PaymentDecision", Schema = "payment")]
	public class PaymentDecision
	{
		[Key]
		public int PaymentDecisionID { get; set; }

		public int PaymentRequestID { get; set; }

		public int DecidedByMemberID { get; set; }

		public decimal AmountInCurrency { get; set; }

		public decimal AmountInSterling { get; set; }

		public decimal ExchangeRate { get; set; }

		public DateTime? FinalisedDT { get; set; }

		public DateTime CreatedDT { get; set; }

		public DateTime? ModifiedDT { get; set; }

		public DateTime? DeletedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Deleted { get; set; }

		public int? FinalisedPeriodID { get; set; }

		[ForeignKey("DecidedByMemberID")]
		public virtual Member DecidedBy { get; set; }

		[JsonIgnore]
		[ForeignKey("PaymentRequestID")]
		public virtual PaymentRequest PaymentRequest { get; set; }

		[JsonIgnore]
		[ForeignKey("FinalisedPeriodID")]
		public virtual PaymentPeriod FinalisedPeriod { get; set; }
	}
}
