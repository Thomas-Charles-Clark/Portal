using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_StopToggleDTO
	{
		public string UniVerseAccount { get; set; }
		public string TradeAccountCode { get; set; }
		public bool CreditStopped { get; set; }
		public int MemberID { get; set; }
		public string Reason { get; set; }
	}
}
