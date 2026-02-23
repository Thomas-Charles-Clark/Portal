using Newtonsoft.Json;

using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_Totals_Record
	{
		public int TotalRowCount { get; set; }

		public string TradeAccountIDList { get; set; }

		public string TradeAccountCodeList { get; set; }

		public IEnumerable<int> TradeAccountIDs
		{
			get
			{
				return TradeAccountIDList.Split(new char[] { ',' }).Select(p => Convert.ToInt32(p));
			}
		}

		public IEnumerable<string> TradeAccountCodes
		{
			get
			{
				return TradeAccountCodeList.Split(new char[] { ',' });
			}
		}
	}
}
