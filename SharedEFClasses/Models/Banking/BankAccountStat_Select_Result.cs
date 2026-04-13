using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Banking
{
	public class BankAccountStat_Select_Result
	{
		public IEnumerable<BankAccountStat_Select_Row> Rows { get; set; }
		public IEnumerable<BankAccountStat_Select_Column> Columns { get; set; }
		public IEnumerable<BankAccountStat_Select_Value> Values { get; set; }
	}
}
