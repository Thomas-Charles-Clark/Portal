using SharedEFClasses.Models.General;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Payment
{
	[Table("Budget", Schema = "payment")]
	public class PaymentBudget
	{
		[Key]
		public int BudgetID { get; set; }

		public int PeriodID { get; set; }

		public byte CurrencyID { get; set; }

		public decimal Budget { get; set; }

		public DateTime CreatedDT { get; set; }

		public DateTime? ModifiedDT { get; set; }	

		public DateTime? DeletedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Deleted { get; set; }

		[JsonIgnore]
		[ForeignKey("CurrencyID")]
		public virtual Currency Currency { get; set; }

		[JsonIgnore]
		[ForeignKey("PeriodID")]
		public virtual PaymentPeriod PaymentPeriod { get; set; }
	}
}
