using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	[Table("SalesHistoryAnalysisPeriod", Schema = "dbo")]
	public class SalesHistoryAnalysisPeriod
	{
		[Key]
		public string Code { get; set; }

		public string Name { get; set; }

		public string GroupName { get; set; }

		public byte SortOrder { get; set; }
	}
}
