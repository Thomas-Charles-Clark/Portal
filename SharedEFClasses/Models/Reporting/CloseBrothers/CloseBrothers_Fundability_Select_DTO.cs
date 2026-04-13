using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Reporting.CloseBrothers
{
	public class CloseBrothers_Fundability_Select_DTO
	{
		public DateTime? From { get; set; }

		public DateTime? To { get; set; }
	
		public string DateRangeID { get; set; }
	}
}
