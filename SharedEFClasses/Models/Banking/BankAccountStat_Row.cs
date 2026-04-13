using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Banking
{
	[Table("BankAccountStatRow", Schema = "portal")]
	public class BankAccountStat_Row
	{
		[Key]
		public int RowID { get; set; }

		public string Label { get; set; }

		public string Tooltip { get; set; }

		public int SortOrder { get; set; }

		[JsonIgnore]
		[InverseProperty("RowReference")]
		public virtual ICollection<BankAccountStat> BankAccountStats { get; set; }
	}
}
