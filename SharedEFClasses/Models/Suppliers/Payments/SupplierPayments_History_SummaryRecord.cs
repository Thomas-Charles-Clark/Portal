using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.Payments
{
	public class SupplierPayments_History_SummaryRecord
	{
		public string ID { get; set; }

		public decimal SortOrder { get; set; }

		public bool IsTotalRow { get; set; }
		
		public string Label { get; set; }

		public string Status { get; set; }

		public string CurrencyCode { get; set; }

		public decimal? GBPExchangeRate { get; set; }

		public string FormattingCulture { get; set; }

		public decimal? Budget { get; set; }

		public int? RequestCount_All { get; set; }

		public int? RequestCount_New { get; set; }

		public int? RequestCount_PartApproved { get; set; }

		public int? RequestCount_FullyApproved { get; set; }

		public decimal? SupplierInvoices_Total { get; set; }

		public decimal? SupplierInvoices_NotDue { get; set; }

		public decimal? SupplierInvoices_Overdue { get; set; }

		public decimal? SupplierInvoices_Overdue_30Day { get; set; }

		public decimal? SupplierInvoices_Overdue_60Day { get; set; }

		public decimal? SupplierInvoices_Overdue_90Day { get; set; }

		public decimal? SupplierInvoices_Overdue_120DayPlus { get; set; }
	}
}
