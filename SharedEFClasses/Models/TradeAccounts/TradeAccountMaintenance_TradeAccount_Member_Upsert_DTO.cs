using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.TradeAccounts
{
	public class TradeAccountMaintenance_TradeAccount_Member_Upsert_DTO
	{
		public int MemberID { get; set; }
		public int TradeAccountID { get; set; }
		public IEnumerable<TradeAccountMaintenance_TradeAccount_Member_Select_Record> Contacts { get; set; }
	}
}
