using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_Statement_Select_HeadingResult
	{
		public string Heading { get; set; }

		public string StatementURI { get; set; }
		
		public string CurrencyCode { get; set; }

		public string FormattingCulture { get; set; }

		public string OverviewMessage { get; set; }

		public string Classes { get; set; }

		public byte SortOrder { get; set; }
		
		public string Stats { get; set; }

		public string PodHandle { get; set; }
	}
}
