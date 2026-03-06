using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentApproval
{
	public class SupplierPaymentApproval_SupplierSummaryRecord
	{
		// Supplier
		public string SupplierCode { get; set; }
		public string SupplierName { get; set; }
		public string SupplierType { get; set; }
		public string BudgetHolder { get; set; }
		public string SupplierCurrencyCode { get; set; }
		public string SupplierCurrencyFormattingCulture { get; set; }

		// Orders
		public int BackOrderQuantity { get; set; }
		public decimal BackOrderValueGBP { get; set; }

		// New Collection Products
		public int NewCollectionProductCount_1 { get; set; }
		public int NewCollectionProductCount_2 { get; set; }
		public int NewCollectionProductCount_3 { get; set; }

		// Supplier Aged Debt
		public decimal TotalValue { get; set; }
		public decimal RegisterValue { get; set; }
		public decimal NotDueTotalValue { get; set; }
		public decimal OverdueTotalValue { get; set; }
		public decimal Debt30DayValue { get; set; }
		public decimal Debt60DayValue { get; set; }
		public decimal Debt90DayValue { get; set; }
		public decimal Debt120DayValue { get; set; }

		// Supplier Aged Debt GBP
		public decimal TotalValueGBP { get; set; }
		public decimal RegisterValueGBP { get; set; }
		public decimal NotDueTotalValueGBP { get; set; }
		public decimal OverdueTotalValueGBP { get; set; }
		public decimal Debt30DayValueGBP { get; set; }
		public decimal Debt60DayValueGBP { get; set; }
		public decimal Debt90DayValueGBP { get; set; }
		public decimal Debt120DayValueGBP { get; set; }

		// Problems
		public bool ProductionStopped { get; set; }
		public bool ShippingStopped { get; set; }

		// Payment Requests
		public decimal? PaymentRequestPaymentPlanTotal { get; set; }
		public decimal? PaymentRequestGoneLegalTotal { get; set; }
		public decimal? PaymentRequestOtherTotal { get; set; }


		[NotMapped]
		public IEnumerable<SupplierPaymentApproval_SupplierDetailRecord> Details { get; set; }
	}
}
