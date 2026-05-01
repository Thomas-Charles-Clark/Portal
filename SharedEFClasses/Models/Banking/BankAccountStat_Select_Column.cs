using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Banking
{
	public class BankAccountStat_Select_Column
	{
		public int ColumnID { get; set; }

		public string GroupLabel { get; set; }

		public string Label { get; set; }

		public string Tooltip { get; set; }

		public int SortOrder { get; set; }

		public string DataType { get; set; }

		public string WidthPixels { get; set; }

		public string ExtraDataJSON { get; set; }

		public bool BreakdownRequired { get; set; }

		public bool ReadOnly { get; set; }
	}
}
