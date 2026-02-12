using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.Payments
{
	public class SupplierPayment_Decision_FinaliseRecord
	{
		public int ErrorNumber { get; set; }
		public string ErrorMessage { get; set; }
		public string SuccessMessage { get; set; }
	}
}
