using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Banking
{
	public class BankAccountStat_Select_Row
	{
		public int RowID { get; set; }

		public string Label { get; set; }

		public string Tooltip { get; set; }

		public int SortOrder { get; set; }
	}
}
