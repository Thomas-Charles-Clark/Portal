using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.TradeAccounts
{
	public class TradeAccountMaintenance_TradeAccount_Search_Result
	{
		public IEnumerable<TradeAccountMaintenance_TradeAccount_Search_DashboardPod> DashboardPods { get; set; }

		public IEnumerable<TradeAccountMaintenance_TradeAccount_Search_Record> Results { get; set; }
	}
}
