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

		public string GroupLabel { get; set; }

		public string Label { get; set; }

		public string Tooltip { get; set; }

		public int SortOrder { get; set; }

		public string CurrencyCode { get; set; }

		public byte? FormattingDigits { get; set; }

		public string FormattingCulture { get; set; }
	}
}
