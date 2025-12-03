using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertex
{
	[Table("CreditController", Schema = "Mertex")]
	public class CreditControllerLive
	{
		[Key]
		public string Code { get; set; }

		public string Name { get; set; }

		public string Email { get; set; }

		public DateTime CreatedDT { get; set; }

		public DateTime? ModifiedDT { get; set; }

		public DateTime? DeletedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Deleted { get; set; }

		public DateTime? SyncedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Synced { get; set; }

		public string Region { get; set; }

		[JsonIgnore]
		[InverseProperty("CreditController")]
		public virtual ICollection<MertexTradeAccountClassificationSuperSet> SuperSetRecords { get; set; }
	}
}
