using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_Payments_SelectResult
	{
		public IEnumerable<CreditControl_Payments_SelectRecord> Records { get; set; }
	}
}
