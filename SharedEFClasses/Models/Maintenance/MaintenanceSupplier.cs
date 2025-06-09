using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Maintenance
{
    [Table("Supplier", Schema = "Maintenance")]
    public class MaintenanceSupplier
    {
        [Key]
        public string SupplierCode { get; set; }

        public string Name { get; set; }

        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }
        public string Postcode { get; set; }
        public string CountryCode { get; set; }

        [Column("Currency")]
        public string MertexCurrencyCode { get; set; }

        public decimal DutyPercentage { get; set; }
        public decimal InlandChargesPercentage { get; set; }
        public decimal MiscellaneousPercentage { get; set; }
        public decimal ImportChargePerUnit { get; set; }
        public decimal MiscellaneousCharge { get; set; }
        public string Label { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public int ModifiedMemberID { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public DateTime? SyncedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Synced { get; set; }

        public byte? PaymentTermsID { get; set; }

        [ForeignKey("ModifiedMemberID")]
        public virtual Member LastModifiedBy { get; set; }

        [ForeignKey("PaymentTermsID")]
        public virtual PaymentTerms PaymentTerms { get; set; }
    }
}
