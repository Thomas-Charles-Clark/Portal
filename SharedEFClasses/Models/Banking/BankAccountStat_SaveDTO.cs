using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Banking
{
	public class BankAccountStat_SaveDTO
	{
		public DateTime Date { get; set; }

		public int? MemberID { get; set; }

		public IEnumerable<BankAccountStat_Save_Record> Records { get; set; }
	}
}
