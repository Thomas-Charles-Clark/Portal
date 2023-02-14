using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("OrderHead", Schema = "Mertex")]
    public class OrderHeadLive
    {
        [Key]
        public string OrderID { get; set; }

        public int OrderHeadID { get; set; }

        public string CustomerOrderReference { get; set; }

        public DateTime? OrderDT { get; set; }

        public string OrderTaker { get; set; }

        public byte? OrderPriority { get; set; }

        public byte? AllocationPriority { get; set; }

        public bool? HoldOrder { get; set; }

        public bool? HoldDelivery { get; set; }

        public string DeliveryName { get; set; }

        public string DeliveryAddressLine1 { get; set; }

        public string DeliveryAddressLine2 { get; set; }

        public string DeliveryTown { get; set; }

        public string DeliveryCounty { get; set; }

        public string DeliveryPostcode { get; set; }

        public string DeliveryCountryCode { get; set; }

        public string DeliveryAlertLandlinePhoneNumber { get; set; }

        public string DeliveryAlertMobilePhoneNumber { get; set; }

        public string DeliveryAlertEmail { get; set; }

        public string HaulierCode { get; set; }

        public string CarriageCode { get; set; }

        public decimal? TotalPaintWeight { get; set; }

        public string PaintMessage { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public DateTime? CompletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Completed { get; set; }

        public object ErrorDetails { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Error { get; set; }

        public DateTime? OrderLineFirstCheckedDT { get; set; }

        public DateTime? OrderLineLastCheckedDT { get; set; }

        public string TradeAccountCode { get; set; }

        public string TradeAccountName { get; set; }

        public decimal? DeliveryChargeSterling { get; set; }

        public string ChargeOn { get; set; }

        public string HaulierAccountNumberForShippingCharge { get; set; }

        public string HaulierAccountNumberForDuty { get; set; }

        public decimal? DeliveryChargeCurrency { get; set; }

        public string MertexCurrencyCode { get; set; }

        public decimal? SterlingExchangeRate { get; set; }

        public virtual ICollection<OrderLineLive> OrderLines { get; set; }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        [NotMapped]
        public string DeliveryAddress
        {
            get
            {
                return $@"{DeliveryName},
{DeliveryAddressLine1},
{DeliveryAddressLine2},
{DeliveryTown},
{DeliveryCounty},
{DeliveryPostcode},
{DeliveryCountryCode}";
            }
            set
            {

            }
        }

        [NotMapped]
        public string CarriageKey
        {
            get
            {
                return $"{CarriageCode}*{HaulierCode}";
            }
        }

        [NotMapped]
        public Haulier Haulier
        {
            get
            {
                return new PortalDbContext().Hauliers.Where(p => p.Code == HaulierCode).FirstOrDefault();
            }
        }

        [NotMapped]
        public Carriage Carriage 
        { 
            get
            {
                return new PortalDbContext().Carriages.Where(p => p.Key == CarriageKey).FirstOrDefault();
            }
        }

        [NotMapped]
        public TradeAccount TradeAccount
        {
            get
            {
                return new PortalDbContext().TradeAccounts.Where(p => p.Code == TradeAccountCode).FirstOrDefault();
            }
        }

        [NotMapped]
        public List<DespatchHead> DespatchHeads
        {
            get
            {
                var uniqueDespatchHeadIds = OrderLines.Select(q => q.DespatchHeadID).Distinct().ToList();

                return new PortalDbContext().DespatchHeads.Where(p => uniqueDespatchHeadIds.Contains(p.DespatchHeadID)).ToList();
            }
        }
    }
}
