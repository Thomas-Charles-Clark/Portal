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
	[Table("PaymentRequestStatus", Schema = "payment")]
	public class PaymentRequestStatus
	{
		[Key]
		public byte PaymentRequestStatusID { get; set; }

		public string Name { get; set; }

		public byte SortOrder { get; set; }

		public DateTime CreatedDT { get; set; }

		public DateTime? ModifiedDT { get; set; }

		public DateTime? DeletedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Deleted { get; set; }

		[NotMapped]
		[JsonIgnore]
		public virtual ICollection<PaymentRequest> PaymentRequests { get; set; }
	}
}
