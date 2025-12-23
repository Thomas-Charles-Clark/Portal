using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_Breakdown_SelectDTO
	{
		public int TradeAccountID { get; set; }

		public string SelectedPOD { get; set; }

		public int DebtAgeBracket { get; set; }


	}
}
