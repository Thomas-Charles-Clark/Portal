using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_Dashboard_Select_Pod
	{
		public string Classes { get; set; }

		public byte SortOrder { get; set; }
		
		public string Heading { get; set; }

		public string Stats { get; set; }

		public string ParameterJSON { get; set; }

		public string PodHandle { get; set; }
	}
}
