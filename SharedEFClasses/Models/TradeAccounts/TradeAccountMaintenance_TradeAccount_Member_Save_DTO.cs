using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.TradeAccounts
{
	public class TradeAccountMaintenance_TradeAccount_Member_Save_DTO
	{
		public int TradeAccountID { get; set; }
		public IEnumerable<TradeAccountMaintenance_TradeAccount_Member_Select_Record> Contacts { get; set; }
	}
}
