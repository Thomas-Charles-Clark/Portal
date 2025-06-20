using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SharedEFClasses.Models.Mertex
{
    [Table("OrderHead", Schema = "Mertex")]
    public partial class OrderHeadLive
    {
        [Key]
        [Column("OrderID")]
        [StringLength(25)]
        public string OrderID { get; set; }

        [Column("OrderHeadID")]
        public int? OrderHeadID { get; set; }

        [StringLength(500)]
        public string CustomerOrderReference { get; set; }

        [Column("OrderDT")]
        public DateTime? OrderDT { get; set; }

        [StringLength(50)]
        public string OrderTaker { get; set; }

        public byte? OrderPriority { get; set; }

        public byte? AllocationPriority { get; set; }

        public bool? HoldOrder { get; set; }

        public bool? HoldDelivery { get; set; }

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
        public string DeliveryAlertLandlinePhoneNumber { get; set; }

        [StringLength(20)]
        public string DeliveryAlertMobilePhoneNumber { get; set; }

        [StringLength(254)]
        public string DeliveryAlertEmail { get; set; }

        [StringLength(10)]
        public string HaulierCode { get; set; }

        [StringLength(10)]
        public string CarriageCode { get; set; }

        [Column()]
        public decimal? TotalPaintWeight { get; set; }

        [StringLength(500)]
        public string PaintMessage { get; set; }

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

        [Column("OrderLineFirstCheckedDT")]
        public DateTime? OrderLineFirstCheckedDT { get; set; }

        [Column("OrderLineLastCheckedDT")]
        public DateTime? OrderLineLastCheckedDT { get; set; }

        [StringLength(50)]
        public string TradeAccountCode { get; set; }

        [StringLength(50)]
        public string TradeAccountName { get; set; }

        [Column(TypeName = "money")]
        public decimal? DeliveryChargeSterling { get; set; }

        [StringLength(1)]
        public string ChargeOn { get; set; }

        [StringLength(20)]
        public string HaulierAccountNumberForShippingCharge { get; set; }

        [StringLength(20)]
        public string HaulierAccountNumberForDuty { get; set; }

        [Column(TypeName = "money")]
        public decimal? DeliveryChargeCurrency { get; set; }

        [StringLength(3)]
        public string MertexCurrencyCode { get; set; }

        [Column(TypeName = "money")]
        public decimal? SterlingExchangeRate { get; set; }

        [StringLength(100)]
        public string DeliveryGroup { get; set; }

        [Column("EORI")]
        [StringLength(20)]
        public string Eori { get; set; }

        [StringLength(20)]
        public string ContactPhone { get; set; }

        [StringLength(5)]
        public string OrderType { get; set; }

        [StringLength(256)]
        public string EmailTill { get; set; }

        [StringLength(256)]
        public string EcommEmail { get; set; }

        [StringLength(256)]
        public string MiscEmail { get; set; }

        [StringLength(256)]
        public string EndCustomer { get; set; }

        [InverseProperty("Order")]
        public virtual ICollection<OrderLineLive> OrderLines { get; set; } = new List<OrderLineLive>();

        [JsonIgnore]
        [InverseProperty("SaleOrder")]
        public virtual ICollection<GiftVoucher> GiftVouchersSold { get; set; }

        [JsonIgnore]
        [InverseProperty("RedeemOrder")]
        public virtual ICollection<GiftVoucher> GiftVouchersRedeemed { get; set; }

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
        public SharedEFClasses.Models.TradeAccounts.TradeAccount TradeAccount
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

        [NotMapped]
        public string ShortLabel 
        { 
            get
            {
                return $"{OrderID} - {CustomerOrderReference}";
            }
        }
    }
}
