using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.TradeAccounts
{
	public class TradeAccountMaintenance_TradeAccount_Search_Record
	{
		public int TradeAccountID { get; set; }
		public string Code { get; set; }
		public string Name { get; set; }
		public string Status { get; set; }
		public bool CreditStop { get; set; }
		public string Email { get; set; }
		public string Address { get; set; }
		public string Advisory { get; set; }
	}
}
