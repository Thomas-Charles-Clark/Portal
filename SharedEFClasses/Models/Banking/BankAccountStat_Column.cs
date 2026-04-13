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
	[Table("BankAccountStatColumn", Schema = "portal")]
	public class BankAccountStat_Column
	{
		[Key]
		public int ColumnID { get; set; }

		public string Label { get; set; }

		public string Tooltip { get; set; }

		public int SortOrder { get; set; }

		public string DataType { get; set; }

		[JsonIgnore]
		[InverseProperty("ColumnReference")]
		public virtual ICollection<BankAccountStat> BankAccountStats { get; set; }
	}
}
