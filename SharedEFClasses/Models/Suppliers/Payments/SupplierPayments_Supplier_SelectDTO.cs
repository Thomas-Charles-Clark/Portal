using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.Payments
{
	public class SupplierPayments_Supplier_SelectDTO
	{
		public int? MemberID { get; set; }

		public int PeriodID { get; set; }

		public bool OnlyShowSuppliersWhereProductionHasStopped { get; set; }

		public bool OnlyShowSuppliersWhereShippingHasStopped { get; set; }
	}
}