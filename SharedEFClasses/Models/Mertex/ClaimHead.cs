using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("ClaimHead", Schema = "Mertex")]
    public class ClaimHead
    {
        [Key]
        [Column("ClaimID")]
        [StringLength(25)]
        public string ClaimID { get; set; }

        [Column("OrderID")]
        [StringLength(25)]
        public string OrderID { get; set; }

        [StringLength(50)]
        public string DocumentNumber { get; set; }

        [StringLength(50)]
        public string InvoiceNumber { get; set; }

        [StringLength(50)]
        public string TradeAccountCode { get; set; }

        [Column("ClaimCreatedDT")]
        public DateTime? ClaimCreatedDT { get; set; }

        [StringLength(10)]
        public string ClaimTaker { get; set; }

        [StringLength(10)]
        public string CurrentPerson { get; set; }

        [StringLength(10)]
        public string CurrentDepartmentCode { get; set; }

        public bool? ClaimCompleted { get; set; }

        [StringLength(10)]
        public string Result { get; set; }

        [StringLength(2)]
        public string SalesMarketCode { get; set; }

        [StringLength(50)]
        public string ContactName { get; set; }

        [StringLength(50)]
        public string CollectionName { get; set; }

        [StringLength(60)]
        public string CollectionAddressLine1 { get; set; }

        [StringLength(60)]
        public string CollectionAddressLine2 { get; set; }

        [StringLength(50)]
        public string CollectionTown { get; set; }

        [StringLength(40)]
        public string CollectionCounty { get; set; }

        [StringLength(20)]
        public string CollectionPostcode { get; set; }

        [StringLength(3)]
        public string CollectionCountryCode { get; set; }

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

        [Column("ClaimLineFirstCheckedDT")]
        public DateTime? ClaimLineFirstCheckedDT { get; set; }

        [Column("ClaimLineLastCheckedDT")]
        public DateTime? ClaimLineLastCheckedDT { get; set; }

        [ForeignKey("OrderID")]
        public virtual OrderHeadLive OrderHead { get; set; }

        [NotMapped]
        public string Label
        {
            get
            {
                var l = $"CCR: {ClaimID}";

                if (!String.IsNullOrEmpty(OrderID))
                    l += $" - Sales Order Number: {OrderID}";

                if (!String.IsNullOrEmpty(TradeAccountCode))
                    l += $" - Customer: {TradeAccountCode} - {OrderHead?.TradeAccount?.Name}";

                return l;
            }
        }
    }
}