using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Linq;

namespace SharedEFClasses.Models.Mertex
{
    [Table("InvoiceHead", Schema = "Mertex")]
    public partial class InvoiceHead
	{
		[Key]
		public string InvoiceID { get; set; }

		public DateTime? InvoiceDT { get; set; }

		public string TradeAccountCode { get; set; }

		public string OrderID { get; set; }

		public byte InvoiceOrCredit { get; set; }

		public decimal? CarriageValue { get; set; }

		public decimal? CarriageValueCurrency { get; set; }

		public string MertexCurrencyCode { get; set; }

		public DateTime CreatedDT { get; set; }

		public DateTime? ModifiedDT { get; set; }

		public DateTime? CompletedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Completed { get; set; }

		public string ErrorDetails { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Error { get; set; }

		public DateTime? InvoiceLineFirstCheckedDT { get; set; }

		public DateTime? InvoiceLineLastCheckedDT { get; set; }

		public DateTime? DeletedDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool Deleted { get; set; }

		public string Terms { get; set; }

		public decimal? TotalValue { get; set; }

		public decimal? TotalVAT { get; set; }

		public decimal? TotalValueCurrency { get; set; }

		public decimal? TotalVATCurrency { get; set; }

		public string MiscellaneousChargeCode { get; set; }

		public decimal? MiscellaneousChargeValue { get; set; }

		public decimal? MiscellaneousChargeValueCurrency { get; set; }

		public decimal? MiscellaneousChargeVAT { get; set; }

		public decimal? MiscellaneousChargeVATCurrency { get; set; }

		public string CarriageVATCode { get; set; }

		public decimal? CarriageVAT { get; set; }

		public decimal? CarriageVATCurrency { get; set; }

		public DateTime? SavedAsPDFDT { get; set; }

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public bool SavedAsPDF { get; set; }

		public string SavedAsPDFPath { get; set; }

		public string SavedAsPDFFileName { get; set; }

		public int SavedAsPDFAttempts { get; set; }

		public Guid InvoiceGUID { get; set; }

		public DateTime? DueDT { get; set; }

		public DateTime? DespatchedDT { get; set; }

		[InverseProperty("Invoice")]
        public virtual ICollection<InvoiceLine> InvoiceLines { get; set; } = new List<InvoiceLine>();

		[NotMapped]
		public string ShortLabel
		{
			get
			{
				return $"{InvoiceID} created {CreatedDT:dd/MM/yyyy}{(String.IsNullOrEmpty(OrderID) ? "" : $" - Order: {OrderID}")}";
			}
		}
	}
}