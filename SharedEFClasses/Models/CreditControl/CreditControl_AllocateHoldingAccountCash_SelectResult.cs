using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_AllocateHoldingAccountCash_SelectResult
	{
		public IEnumerable<CreditControl_AllocateHoldingAccountCash_Pod> Pods { get; set; }
		public IEnumerable<CreditControl_AllocateHoldingAccountCash_SelectRecord> Records { get; set; }
	}
}
