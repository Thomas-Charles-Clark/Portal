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
	[Table("DebtFunder", Schema = "Mertex")]
	public class DebtFunder
	{
		[Key]
		public string Code { get; set; }

		public string Name { get; set; }

		[JsonIgnore]
		public virtual ICollection<MertexTradeAccountClassificationSuperSet> MertexTradeAccountClassificationSuperSetRecords { get; set; }
	}
}
