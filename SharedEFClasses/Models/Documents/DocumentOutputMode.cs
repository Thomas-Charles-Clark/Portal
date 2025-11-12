using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Documents
{
	[Table("DocumentOutputMode", Schema = "portal")]
	public class DocumentOutputMode
	{
		[Key]
		public short DocumentOutputModeID { get; set; }

		public short DocumentID { get; set; }

		public string Code { get; set; }

		public string Name { get; set; }

		public DateTime CreatedDT { get; set; }

		public DateTime? DeletedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Deleted { get; set; }

		[JsonIgnore]
		[ForeignKey("DocumentID")]
		public virtual Document Document { get; set; }
	}
}
