using Newtonsoft.Json;

using SharedEFClasses.Models.Payment;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Mertex
{
    [Table("PurchaseOrderHead", Schema = "Mertex")]
    public partial class PurchaseOrderHead
    {
        [Key]
        [Column("PurchaseOrderHeadID")]
        [StringLength(25)]
        public string PurchaseOrderHeadID { get; set; }

        [Column("OrderID")]
        [StringLength(25)]
        public string OrderID { get; set; }

        [Column("PurchaseOrderStatusID")]
        public byte? PurchaseOrderStatusID { get; set; }

        [StringLength(10)]
        public string StockLocationCode { get; set; }

        [StringLength(50)]
        public string SupplierCode { get; set; }

        [StringLength(10)]
        public string ProcessCode { get; set; }

        [StringLength(10)]
        public string AuthoriserCode { get; set; }

        public bool? CallOffIndicator { get; set; }

        [StringLength(50)]
        public string DeliveryName { get; set; }

        [StringLength(60)]
        public string DeliveryAddressLine1 { get; set; }

        [StringLength(60)]
        public string DeliveryAddressLine2 { get; set; }

        [StringLength(50)]
        public string DeliveryTown { get; set; }

        [StringLength(40)]
        public string DeliveryCounty { get; set; }

        [StringLength(20)]
        public string DeliveryPostcode { get; set; }

        [StringLength(3)]
        public string DeliveryCountryCode { get; set; }

        [StringLength(20)]
        public string DeliveryPhone { get; set; }

        [Column("CreatedDT")]
        public DateTime CreatedDT { get; set; }

        [Column("ModifiedDT")]
        public DateTime ModifiedDT { get; set; }

        [Column("DeletedDT")]
        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        [Column("CompletedDT")]
        public DateTime? CompletedDT { get; set; }

        public bool? Completed { get; set; }

        [StringLength(4000)]
        public string ErrorDetails { get; set; }

        public bool? Error { get; set; }

        [Column("PurchaseOrderLineFirstCheckedDT")]
        public DateTime? PurchaseOrderLineFirstCheckedDT { get; set; }

        [Column("PurchaseOrderLineLastCheckedDT")]
        public DateTime? PurchaseOrderLineLastCheckedDT { get; set; }

        [Column("PurchaseOrderRaisedDT")]
        public DateTime? PurchaseOrderRaisedDT { get; set; }

        [Column("SentToMylandsDT")]
        public DateTime? SentToMylandsDT { get; set; }

        [Column("EmailedToMylandsDT")]
        public DateTime? EmailedToMylandsDT { get; set; }

        [JsonIgnore]
        [InverseProperty("PurchaseOrderHead")]
        public virtual ICollection<PaymentRequest_PurchaseOrderHead> PaymentRequests { get; set; }
    }
}