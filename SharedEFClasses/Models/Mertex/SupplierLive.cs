using Newtonsoft.Json;

using SharedEFClasses.Models.IncomingEmail;
using SharedEFClasses.Models.Mertex;
using SharedEFClasses.Models.Payment;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Mertex
{
    [Table("Supplier", Schema = "Mertex")]
    public partial class SupplierLive
    {
        [Key]
        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        [StringLength(60)]
        public string AddressLine1 { get; set; }

        [StringLength(60)]
        public string AddressLine2 { get; set; }

        [StringLength(50)]
        public string Town { get; set; }

        [StringLength(40)]
        public string County { get; set; }

        [StringLength(20)]
        public string Postcode { get; set; }

        [StringLength(100)]
        public string SortName { get; set; }

        [StringLength(3)]
        public string CountryCode { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }

        [StringLength(254)]
        public string Email { get; set; }

        public short? CountryID { get; set; }

        [Column("CreatedDT")]
        public DateTime CreatedDT { get; set; }

        [Column("ModifiedDT")]
        public DateTime ModifiedDT { get; set; }

        [Column("DeletedDT")]
        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        [StringLength(5)]
        public string MertexCurrencyCode { get; set; }

        public string BudgetHolderCode { get; set; }

        public string SupplierTypeCode { get; set; }

        public string PaymentTermsCode { get; set; }

        public string DefaultVATCode { get; set; }

        public byte? CurrencyID { get; set; }

        public int InvoiceWarningThresholdGBP { get; set; }

        public DateTime? AccountClosedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool AccountClosed { get; set; }

        public bool ProductionStopped { get; set; }

        public bool ShippingStopped { get; set; }

        [ForeignKey("MertexCurrencyCode")]
        [InverseProperty("Suppliers")]
        public virtual ExchangeRate ExchangeRate { get; set; }

        [JsonIgnore]
        [InverseProperty("DefaultSupplierCodeNavigation")]
        public virtual ICollection<ProductLive> Products { get; set; } = new List<ProductLive>();

        [JsonIgnore]
        [InverseProperty("SupplierCodeNavigation")]
        public virtual ICollection<PurchasePrice> PurchasePrices { get; set; } = new List<PurchasePrice>();
        
        [JsonIgnore]
        [InverseProperty("Supplier")]
        public virtual ICollection<BudgetHolderSuperSet> BudgetHolderSuperSetRecords { get; set; }

        [JsonIgnore]
        [InverseProperty("Supplier")]
        public virtual ICollection<Email> IncomingInvoiceEmails { get; set; }

        [ForeignKey("BudgetHolderCode")]
        public virtual BudgetHolder BudgetHolder { get; set; }

        [ForeignKey("PaymentTermsCode")]
        public virtual SupplierPaymentTerms PaymentTerms { get; set; }

        [ForeignKey("SupplierTypeCode")]
        public virtual SupplierTypeLive SupplierType { get; set; }

        [ForeignKey("CurrencyID")]
        public virtual General.Currency Currency { get; set; }

        [ForeignKey("DefaultVATCode")]
        public virtual VATCode VATCode { get; set; }

        [NotMapped]
        public string AddressDisplaySingleLine
        {
            get
            {
                var parts = new List<string>();

                if (!String.IsNullOrEmpty(AddressLine1))
                    parts.Add(AddressLine1);

                if (!String.IsNullOrEmpty(AddressLine2))
                    parts.Add(AddressLine2);

                if (!String.IsNullOrEmpty(Town))
                    parts.Add(Town);

                if (!String.IsNullOrEmpty(County))
                    parts.Add(County);

                if (!String.IsNullOrEmpty(CountryCode))
                    parts.Add(CountryCode);

                return String.Join(", ", parts);
            }
		}

		//[JsonIgnore]
		//[InverseProperty("Supplier")]
		//public virtual ICollection<PaymentRequest> PaymentRequests { get; set; }
	}
}