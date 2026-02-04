using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Payment
{
	[Table("Period_Currency", Schema = "payment")]
	public class PaymentPeriod_Currency
	{
		[Key]
		[Column(Order = 1)]
		public int PeriodID { get; set; }

		[Key]
		[Column (Order = 2)]
		public string CurrencyCode { get; set; }

		public decimal GBPExchangeRate { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]	
		public DateTime CreatedDT { get; set; }

		public DateTime? ModifiedDT { get; set; }

		public byte CurrencyID { get; set; }

		public decimal? SupplierInvoices_Total { get; set; }

		public decimal? SupplierInvoices_NotDue { get; set; }

		public decimal? SupplierInvoices_Overdue { get; set; }

		public decimal? SupplierInvoices_Overdue_30Day { get; set; }

		public decimal? SupplierInvoices_Overdue_60Day { get; set; }

		public decimal? SupplierInvoices_Overdue_90Day { get; set; }

		public decimal? SupplierInvoices_Overdue_120DayPlus { get; set; }

		public int? RequestCount_All { get; set; }

		public int? RequestsCount_New { get; set; }

		public int? RequestCount_PartApproved { get; set; }

		public int? RequestCount_FullyApproved { get; set; }

		[ForeignKey("PeriodID")]
		public virtual PaymentPeriod PaymentPeriod { get; set; }
	}
}
