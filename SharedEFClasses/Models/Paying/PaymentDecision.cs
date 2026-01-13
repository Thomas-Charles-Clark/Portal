using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Paying
{
	[Table("PaymentDecision", Schema = "payment")]
	public class PaymentDecision
	{
		[Key]
		public int PaymentDecisionID { get; set; }

		public int DecidedByMemberID { get; set; }

		public DateTime CreatedDT { get; set; }

		public DateTime? ModifiedDT { get; set; }

		public DateTime? DeletedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Deleted { get; set; }

		[ForeignKey("DecidedByMemberID")]
		public virtual Member DecidedBy { get; set; }
	}
}
