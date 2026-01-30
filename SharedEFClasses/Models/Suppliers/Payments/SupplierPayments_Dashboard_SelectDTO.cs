using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.Payments
{
	public class SupplierPayments_Dashboard_SelectDTO
	{
		public int MemberID { get; set; }

		public DateTime? WeekCommencing { get; set; }
	}
}
