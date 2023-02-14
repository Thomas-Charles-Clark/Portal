using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("PurchaseOrderHead", Schema = "Mertex")]
    public class PurchaseOrderHead
    {
        [Key]
        public string PurchaseOrderHeadID { get; set; }
        
        public string OrderID { get; set; }

        public byte? PurchaseOrderStatusID { get; set; }

        public string StockLocationCode { get; set; }

        public string SupplierCode { get; set; }

        public string ProcessCode { get; set; }

        public string AuthoriserCode { get; set; }

        public bool? CallOffIndicator { get; set; }

        public string DeliveryName { get; set; }

        public string DeliveryAddressLine1 { get; set; }

        public string DeliveryAddressLine2 { get; set; }

        public string DeliveryTown { get; set; }

        public string DeliveryCounty { get; set; }

        public string DeliveryPostcode { get; set; }

        public string DeliveryCountryCode { get; set; }

        public string DeliveryPhone { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public DateTime CompletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Completed { get; set; }

        public string ErrorDetails { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Error { get; set; }

        public DateTime? PurchaseOrderLineFirstCheckedDT { get; set; }

        public DateTime? PurchaseOrderLineLastCheckedDT { get; set; }

        public DateTime? PurchaseOrderRaisedDT { get; set; }

        public DateTime? SentToMylandsDT { get; set; }

        public DateTime? EmailedToMylandsDT { get; set; }

        [ForeignKey("PurchaseOrderStatusID")]
        public virtual PurchaseOrderStatus PurchaseOrderStatus { get; set; }

        public virtual ICollection<PurchaseOrderLine> PurchaseOrderLines { get; set; }
    }
}
