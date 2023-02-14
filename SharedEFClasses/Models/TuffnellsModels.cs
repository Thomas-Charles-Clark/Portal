using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Tuffnells
{

    [Table("Account", Schema = "Tuffnells")]
    public class Account
    {
        [Key]
        public byte AccountID { get; set; }
        public string Name { get; set; }
        public string AccountNumber { get; set; }
        public DateTime CreatedDT { get; set; }

        [JsonIgnore]
        [InverseProperty("Account")]
        public virtual ICollection<TuffnellsConsignment> Consignments { get; set; }

        [JsonIgnore]
        [InverseProperty("Account")]
        public virtual ICollection<AccountAddress> Addresses { get; set; }
    }

    [Table("AccountAddress", Schema = "Tuffnells")]
    public class AccountAddress
    {
        [Key]
        public int AccountAddressID { get; set; }
        public byte AccountID { get; set; }
        public string AddressSequenceNumber { get; set; }
        public string Name { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }
        public string Postcode { get; set; }
        public int CountryID { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("AccountID")]
        public virtual Account Account { get; set; }

        [JsonIgnore]
        [InverseProperty("AccountAddress")]
        public virtual ICollection<TuffnellsConsignment> Consignments { get; set; }
    }

    [Table("Consignment", Schema = "Tuffnells")]
    public class TuffnellsConsignment
    {
        [Key]
        public int ConsignmentID { get; set; }
        public byte AccountID { get; set; }
        public int AccountAddressID { get; set; }
        public int ServiceID { get; set; }
        public int? ReturnCollectionID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Return { get; set; }

        public int TradeAccountID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string ConsignmentType { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string ConsignmentNumber { get; set; }

        public string URN { get; set; }
        public int DailySequenceNumber { get; set; }
        public string BarcodeNumber { get; set; }
        public string CompanyName { get; set; }
        public string ContactName { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }
        public string Postcode { get; set; }
        public int CountryID { get; set; }
        public string PhoneNumber { get; set; }
        public byte WeightKG { get; set; }
        public byte PackageType1ID { get; set; }
        public byte? PackageType2ID { get; set; }
        public byte PackageType1Count { get; set; }
        public byte? PackageType2Count { get; set; }
        public string SpecialInstructions { get; set; }
        public string TheirReference { get; set; }
        public string OurReference { get; set; }
        public string ThirdPartyIdentifier { get; set; }
        public string ThirdPartyDeliveryCompanyName { get; set; }
        public string ThirdPartyDeliveryAddressLine1 { get; set; }
        public string ThirdPartyDeliveryAddressLine2 { get; set; }
        public string ThirdPartyDeliveryTown { get; set; }
        public string ThirdPartyDeliveryCounty { get; set; }
        public string ThirdPartyDeliveryPostCode { get; set; }
        public string ThirdPartyDeliveryContactName { get; set; }
        public string ThirdPartyDeliveryPhoneNumber { get; set; }
        public string CustomerPackageReference { get; set; }
        public string TraderCode { get; set; }
        public decimal? GoodsValue { get; set; }
        public string GoodsDescription { get; set; }
        public string AddressLine3 { get; set; }
        public string EmailAddress { get; set; }
        public bool TailLiftRequiredCollection { get; set; }
        public bool TailLiftRequiredDelivery { get; set; }
        public bool ConsigneeAbsencePermitted { get; set; }
        public DateTime? DespatchedDT { get; set; }
        public string DespatchedBy { get; set; }
        public DateTime? SubmittedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Submitted { get; set; }

        public DateTime CreatedDT { get; set; }
        public DateTime? CancelledDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Cancelled { get; set; }

        public string TrackingJSON { get; set; }

        public DateTime? CompletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Completed { get; set; }


        [ForeignKey("AccountID")]
        public virtual Account Account { get; set; }

        [ForeignKey("AccountAddressID")]
        public virtual AccountAddress AccountAddress { get; set; }

        [ForeignKey("ServiceID")]
        public virtual Service Service { get; set; }

        [ForeignKey("PackageType1ID")]
        public virtual PackageType PackageType1 { get; set; }

        [ForeignKey("PackageType2ID")]
        public virtual PackageType PackageType2 { get; set; }

        [JsonIgnore]
        [ForeignKey("ReturnCollectionID")]
        public virtual ReturnModels.ReturnCollection ReturnCollection { get; set; }

        [ForeignKey("TradeAccountID")]
        public virtual TradeAccounts.TradeAccount TradeAccount { get; set; }
    }

    [Table("PackageType", Schema = "Tuffnells")]
    public class PackageType
    {
        [Key]
        public byte PackageTypeID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }

        [InverseProperty("PackageType1")]
        public virtual ICollection<TuffnellsConsignment> ConsignmentsWherePrimary { get; set; }

        [InverseProperty("PackageType2")]
        public virtual ICollection<TuffnellsConsignment> ConsignmentsWhereSecondary { get; set; }

    }

    [Table("Service", Schema = "Tuffnells")]
    public class Service
    {
        [Key]
        public int ServiceID { get; set; }
        public string Name { get; set; }
        public string ServiceCode { get; set; }
        public string LabelHeading { get; set; }

        [JsonIgnore]
        [InverseProperty("Service")]
        public virtual ICollection<TuffnellsConsignment> Consignments { get; set; }
    }
}
