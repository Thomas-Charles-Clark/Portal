using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Banking
{
	public class BankAccountStat_Select_Value
	{
		public int RowID { get; set; }

		public int ColumnID { get; set; }

		public string Value { get; set; }

		public string Breakdown { get; set; }

		public DateTime ModifiedDT { get; set; }

		public int MemberID { get; set; }
	}
}
