using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
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

        [ForeignKey("MertexCurrencyCode")]
        [InverseProperty("Suppliers")]
        public virtual ExchangeRate MertexCurrencyCodeNavigation { get; set; }

        [JsonIgnore]
        [InverseProperty("DefaultSupplierCodeNavigation")]
        public virtual ICollection<ProductLive> Products { get; set; } = new List<ProductLive>();

        [JsonIgnore]
        [InverseProperty("SupplierCodeNavigation")]
        public virtual ICollection<PurchasePrice> PurchasePrices { get; set; } = new List<PurchasePrice>();

        [JsonIgnore]
        [InverseProperty("Supplier")]
        public virtual ICollection<MertexProductClassificationSuperSet> MertexProductClassificationSuperSetRecords { get; set; }
    }
}