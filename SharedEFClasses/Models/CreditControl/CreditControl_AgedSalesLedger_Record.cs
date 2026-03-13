using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_AgedSalesLedger_Record
	{
		public string RowLabel { get; set; }

		public int RowSortOrder { get; set; }

		public bool IsTotalRow { get; set; }

		public string ColumnLabel { get; set; }

		public int ColumnSortOrder { get; set; }

		public string Value { get; set; }
	}
}
