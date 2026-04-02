using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_Statement_SendDTO
	{
		public IEnumerable<string> TradeAccountCodes { get; set; }

		public DateTime? Date { get; set; }
	}
}
