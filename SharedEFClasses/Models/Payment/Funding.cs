using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Payment
{
	[Table("Funding", Schema = "payment")]
	public class Funding
	{
		[Key]
		public int FundingID { get; set; }

		public DateTime WeekCommencing { get; set; }

		public decimal AvailableForSpendingInSterling { get; set; }

		public decimal TargetSpendInSterling { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public decimal RemainingInSterling { get; set; }

		public int CreatedByMemberID { get; set; }

		public DateTime CreatedDT { get; set; }

		public DateTime? ModifiedDT { get; set; }

		public DateTime? DeletedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Deleted { get; set; }

		[ForeignKey("CreatedByMemberID")]
		public virtual Member CreatedByMember { get; set; }
	}
}
