using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.Payments
{
	public class SupplierPayments_History_Summary_SelectDTO
	{
		// Matt removed these parameters to the procedure 03/03/2026
		// Further parameters may be required at some point; leaving this class here just in case.
		// Hopefully it doesn't hurt to have Dapper map an empty object to an empty parameter set.
		//
		// public int MemberID { get; set; }
		// public DateTime WeekCommencing { get; set; }
	}
}
