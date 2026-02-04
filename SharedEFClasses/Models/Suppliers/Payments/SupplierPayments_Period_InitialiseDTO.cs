using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.Payments
{
	public class SupplierPayments_Period_InitialiseDTO
	{
		public DateTime? StartDate { get; set; }

		public int? NumberOfWeeks { get; set; }

		public SupplierPayments_Period_InitialiseDTO(
			DateTime? startDate,
			int? numberOfWeeks
			)
		{
			StartDate = startDate;
			NumberOfWeeks = numberOfWeeks;
		}
	}
}
