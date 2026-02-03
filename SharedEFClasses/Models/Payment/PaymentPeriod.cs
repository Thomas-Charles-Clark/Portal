using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Payment
{
	[Table("Period", Schema = "payment")]
	public class PaymentPeriod
	{
		[Key]
		public int PeriodID { get; set; }
	
		public string Label { get; set; }

		public DateTime WeekCommencingDate { get; set; }

		public DateTime? FinalisedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Finalised { get; set; }

		public int? FinalisedMemberID { get; set; }

		[InverseProperty("PaymentPeriod")]
		public virtual ICollection<PaymentBudget> PaymentBudgets { get; set; }

		[InverseProperty("FinalisedPaymentPeriods")]
		[ForeignKey("FinalisedMemberID")]
		public virtual Member FinalisedByMember { get; set; }
	}
}
