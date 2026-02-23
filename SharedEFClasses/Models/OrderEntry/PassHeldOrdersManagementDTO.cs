using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderEntry
{
	public class PassHeldOrdersManagementDTO
	{
		public int? memberId { get; set; }

		public string marketCode { get; set; }

		public string searchTerm { get; set; }

		public string holdReasonIds { get; set; }

		public DateTime? heldFromDt { get; set; }

		public DateTime? heldToDt { get; set; }
	}
}
