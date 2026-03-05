using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_Toggle_CreditStop_Record
	{
		public string UniVerseAccount { get; set; }
		public string TradeAccountCode { get; set; }
		public DateTime ChangedDT { get; set; }
		public bool ChangedTo { get; set; }
		public string ChangedBy { get; set; }
		public string Reason { get; set; }
	}
}
