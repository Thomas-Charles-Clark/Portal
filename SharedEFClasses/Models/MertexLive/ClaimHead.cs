using Newtonsoft.Json;
using SharedEFClasses.Models.General;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("ClaimHead", Schema = "Mertex")]
    public class ClaimHead
    {
        [Key]
        public string ClaimID { get; set; }

        public string OrderID { get; set; }

        public string DocumentNumber { get; set; }

        public string InvoiceNumber { get; set; }

        public string TradeAccountCode { get; set; }

        public DateTime? ClaimCreatedDT { get; set; }

        public string ClaimTaker { get; set; }

        public string CurrentPerson { get; set; }

        public string CurrentDepartmentCode { get; set; }

        public bool? ClaimCompleted { get; set; }

        public string Result { get; set; }

        public string ContactName { get; set; }

        public string CollectionName { get; set; }

        public string CollectionAddressLine1 { get; set; }

        public object CollectionAddressLine2 { get; set; }

        public object CollectionTown { get; set; }

        public string CollectionCounty { get; set; }

        public string CollectionPostcode { get; set; }

        public string CollectionCountryCode { get; set; }

        public object DeliveryName { get; set; }

        public object DeliveryAddressLine1 { get; set; }

        public object DeliveryAddressLine2 { get; set; }

        public object DeliveryTown { get; set; }

        public object DeliveryCounty { get; set; }

        public object DeliveryPostcode { get; set; }

        public object DeliveryCountryCode { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public DateTime? CompletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Completed { get; set; }

        public string ErrorDetails { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Error { get; set; }

        public DateTime? ClaimLineFirstCheckedDT { get; set; }

        public DateTime? ClaimLineLastCheckedDT { get; set; }


        [ForeignKey("OrderID")]
        public virtual OrderHeadLive OrderHead { get; set; }

        public virtual ICollection<ClaimLine> ClaimLines { get; set; }

        [JsonIgnore]
        [InverseProperty("Claim")]
        public virtual ICollection<SharedEFClasses.ReturnModels.Return> Returns { get; set; }

        [NotMapped]
        public Country Country 
        {
            get
            {
                return new PortalDbContext().Countries.Where(p => p.Code == CollectionCountryCode).SingleOrDefault();
            }
        }

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