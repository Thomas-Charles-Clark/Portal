using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.Payments
{
	public class SupplierPayments_SupplierRecord
	{
		[Key]
		public string SupplierCode { get; set; }

		public string SupplierName { get; set; }

		public string SupplierType { get; set; }

		public string BudgetHolder { get; set; }

		public bool ProductionStopped { get; set; }

		public bool ShippingStopped { get; set; }

		public string SupplierCurrencyCode { get; set; }

		public string SupplierCurrencyFormattingCulture { get; set; }
		
		public decimal TotalValue { get; set; }

		public decimal NotDueTotalValue { get; set; }

		public decimal OverdueTotalValue { get; set; }

		public decimal Debt30DayValue { get; set; }

		public decimal Debt60DayValue { get; set; }

		public decimal Debt90DayValue { get; set; }

		public decimal Debt120DayValue { get; set; }
	}
}
