using SharedEFClasses.Models.General;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("Supplier", Schema = "Mertex")]
    public class Supplier
    {
        [Key]
        public string Code { get; set; }

        public string Name { get; set; }

        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }

        public string Town { get; set; }

        public string County { get; set; }

        public string Postcode { get; set; }

        public string CountryCode { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public string MertexCurrencyCode { get; set; }

        [InverseProperty("Supplier")]
        public virtual ICollection<PurchasePriceObj> ProductPurchasePrices { get; set; }

        [ForeignKey("MertexCurrencyCode")]
        public virtual CurrencyLive Currency { get; set; }

        [NotMapped]
        public short? CountryID { get; set; }
    }
}