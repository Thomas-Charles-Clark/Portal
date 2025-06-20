using Newtonsoft.Json;

using SharedEFClasses.Models.Mertex;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.ReturnModels
{
    public class CollectionAddress
    {
        public string ContactName { get; set; }
        public string CompanyName { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }
        public string StateProvinceCode { get; set; }
        public string Postcode { get; set; }
        public short CountryID { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string CountryCodeISOAlpha2 { get; set; }
    }

    public class PassReturnRequest
    {
        public string ccrNumber { get; set; }
        public string orderNumber { get; set; }
        public string shipmentReference1 { get; set; }
        public string shipmentReference2 { get; set; }
        public string destinationUPSAccountNumber { get; set; }
        public CollectionAddress fromAddress { get; set; }
    }

    [Table("Return", Schema = "portal")]
    public class Return
    {
        [Key]
        public int ReturnID { get; set; }
        public int TradeAccountID { get; set; }
        public string ClaimID { get; set; }
        public string CollectionContactName { get; set; }
        public string CollectionCompanyName { get; set; }
        public string CollectionAddressLine1 { get; set; }
        public string CollectionAddressLine2 { get; set; }
        public string CollectionTown { get; set; }
        public string CollectionCounty { get; set; }
        public string CollectionStateProvinceCode { get; set; }
        public string CollectionPostcode { get; set; }
        public short CollectionCountryID { get; set; }
        public bool CollectionResidentialIndicator { get; set; }
        public string CollectionEmail { get; set; }
        public string CollectionPhoneNumber { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }


        [ForeignKey("TradeAccountID")]
        public virtual TradeAccount TradeAccount { get; set; }

        [ForeignKey("ClaimID")]
        public virtual ClaimHead Claim { get; set; }

        [ForeignKey("CollectionCountryID")]
        public virtual Models.General.Country CollectionCountry { get; set; }

        [InverseProperty("Return")]
        public virtual ICollection<ReturnParcel> ReturnParcels { get; set; }

        [InverseProperty("Return")]
        public virtual ICollection<ReturnCollection> Collections { get; set; }
    }

    [Table("ReturnParcel", Schema = "portal")]
    public class ReturnParcel
    {
        [Key]
        public long ReturnParcelID { get; set; }
        public int ReturnID { get; set; }
        public string HaulierCode { get; set; }
        public string ServiceCode { get; set; }
        public string SurchargeCode { get; set; }
        public string TrackingNumber { get; set; }
        public string TrackingURL { get; set; }
        public decimal? WeightKG { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("ReturnID")]
        public virtual Return Return { get; set; }

        [ForeignKey("HaulierCode")]
        public virtual Haulier Haulier { get; set; }

        [InverseProperty("ReturnParcel")]
        public virtual ICollection<ReturnParcel_Product> Products { get; set; }

        [InverseProperty("ReturnParcel")]
        public virtual ICollection<ReturnCollection_ReturnParcel> Collections { get; set; }
    }

    [Table("ReturnParcel_Product", Schema = "portal")]
    public class ReturnParcel_Product
    {
        [Key]
        public long ReturnParcelProductID { get; set; }
        public long ReturnParcelID { get; set; }
        public int ProductID { get; set; }
        public string ClaimLineID { get; set; }
        public string CommodityCode { get; set; }
        public string Description { get; set; }
        public string OriginCountryCode { get; set; }
        public string StockUnit { get; set; }
        public decimal Quantity { get; set; }
        public decimal Value { get; set; }
        public string OriginalTrackingNumber { get; set; } // This because UPS can give us discounts if we can provide an original tracking number as proof the shipment went OUT with them

        [ForeignKey("ReturnParcelID")]
        public virtual ReturnParcel ReturnParcel { get; set; }

        [ForeignKey("ClaimLineID")]
        public virtual ClaimLine ClaimLine { get; set; }

        [ForeignKey("ProductID")]
        public virtual Product Product { get; set; }
    }

    [Table("ReturnCollection", Schema = "portal")]
    public class ReturnCollection
    {
        [Key]
        public int ReturnCollectionID { get; set; }
        public int ReturnID { get; set; }
        public string HaulierCode { get; set; }
        public DateTime? CollectionDT { get; set; }
        public string CollectionReadyFrom { get; set; }
        public string CollectionClosedAt { get; set; }
        public string PickupRequestNumber { get; set; }
        public decimal? TotalChargeInc { get; set; }
        public string ChargesJSON { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? CancelledDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Cancelled { get; set; }

        [ForeignKey("ReturnID")]
        public virtual Return Return { get; set; }

        [ForeignKey("HaulierCode")]
        public virtual Haulier Haulier { get; set; }

        [InverseProperty("ReturnCollection")]
        public virtual ICollection<ReturnCollection_ReturnParcel> ReturnParcels { get; set; }

        [InverseProperty("ReturnCollection")]
        public virtual ICollection<Models.Tuffnells.TuffnellsConsignment> TuffnellsConsignments { get; set; }

        [InverseProperty("ReturnCollection")]
        public virtual ICollection<Models.UPS.UPSConsignment> UPSConsignments { get; set; }
    }

    [Table("ReturnCollection_ReturnParcel")]
    public class ReturnCollection_ReturnParcel
    {
        [Key]
        [Column(Order = 1)]
        public int ReturnCollectionID { get; set; }
        
        [Key]
        [Column(Order = 2)]
        public long ReturnParcelID { get; set; }

        [ForeignKey("ReturnCollectionID")]
        public virtual ReturnCollection ReturnCollection { get; set; }

        [ForeignKey("ReturnParcelID")]
        public virtual ReturnParcel ReturnParcel { get; set; }
    }

    public class PassReturnID
    {
        public int returnId { get; set; }
    }

    public class ReturnTracking
    {
        public string ShipmentIdentificationNumber { get; set; }
        public string CollectPostcode { get; set; }
        public string CollectCountryCode { get; set; }
    }
}