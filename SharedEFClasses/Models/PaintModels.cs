using Kendo.Mvc.UI;

using Microsoft.AspNet.SignalR;

using Newtonsoft.Json;

using Org.BouncyCastle.Asn1.Mozilla;

using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeAccounts;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("MixingLocation", Schema = "Paint")]
    public class MixingLocation
    {
        [Key]
        public short MixingLocationID { get; set; }
        public string Name { get; set; }
        public string URLKeywords { get; set; }
        public short CountryID { get; set; }
        public bool PlaceBasePaintStockOrder { get; set; }
        public string BasePaintOrderStockLocationCode { get; set; }
        public string BasePaintOrderTradeAccountCode { get; set; }
        public string BasePaintOrderDeliveryName { get; set; }
        public string BasePaintOrderDeliveryAddressLine1 { get; set; }
        public string BasePaintOrderDeliveryAddressLine2 { get; set; }
        public string BasePaintOrderDeliveryTown { get; set; }
        public string BasePaintOrderDeliveryCounty { get; set; }
        public string BasePaintOrderDeliveryCountryCode { get; set; }
        public string BasePaintOrderDeliveryPhoneNumber { get; set; }
        public string BasePaintOrderEmail { get; set; }
        public string BasePaintOrderHaulierCode { get; set; }
        public string BasePaintOrderCarriageCode { get; set; }
        public bool TransferRequiredPriorToDespatch { get; set; }
        public string TransferDescription { get; set; }

        [ForeignKey("CountryID")]
        public virtual Country Country { get; set; }

        [JsonIgnore]
        [InverseProperty("MixingLocation")]
        public virtual ICollection<PaintOrderHead> OrderHeads { get; set; }
    }

    [Table("MixingSession", Schema = "Paint")]
    public class MixingSession
    {
        [Key]
        public long MixingSessionID { get; set; }
        public int MixedByMemberID { get; set; }
        public short BoxCount { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime ModifiedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        public bool PlaceBasePaintStockOrder { get; set; }
        public DateTime? BasePaintOrderedDT { get; set; }
        public int? BasePaintOrderedByMemberID { get; set; }
        public int? BasePaintTransactionID { get; set; }
        public DateTime? TransferredDT { get; set; }
        public int? TransferredByMemberID { get; set; }


        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool BasePaintOrdered { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Transferred { get; set; }

        [ForeignKey("MixedByMemberID")]
        public Member MixedBy { get; set; }

        [ForeignKey("BasePaintOrderedByMemberID")]
        public Member BasePaintOrderedByMember { get; set; }

        [ForeignKey("TransferredByMemberID")]
        public Member TransferredByMember { get; set; }

        [InverseProperty("MixingSession")]
        public virtual ICollection<PaintOrderLine> OrderLines { get; set; }
    }

    [Table("OrderHead", Schema = "paint")]
    public class PaintOrderHead
    {
        [Key]
        public string OrderID { get; set; }

        public string TradeAccountCode { get; set; }
        public string DeliveryCountryCode { get; set; }
        public string HaulierCode { get; set; }
        public string CarriageCode { get; set; }
        public short MixingLocationID { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime ModifiedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        public DateTime? LockedDT { get; set; }
        public int? LockedByMemberID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Locked { get; set; }

        [ForeignKey("MixingLocationID")]
        public virtual MixingLocation MixingLocation { get; set; }

        [ForeignKey("LockedByMemberID")]
        public virtual Member LockedBy { get; set; }

        [InverseProperty("OrderHead")]
        public virtual ICollection<PaintOrderLine> OrderLines { get; set; }
    }

    [Table("OrderLine", Schema = "paint")]
    public class PaintOrderLine
    {
        [Key]
        public string OrderLineID { get; set; }

        public string OrderID { get; set; }
        public string ProductCode { get; set; }
        public string BasePaintProductCode { get; set; }
        public decimal QuantityOrdered { get; set; }
        public byte LineStatusID { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime ModifiedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        public DateTime? CancelledDT { get; set; }
        public DateTime? DispatchedDT { get; set; }
        public long? MixingSessionID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Cancelled { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Mixed { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Dispatched { get; set; }

        [JsonIgnore]
        [ForeignKey("MixingSessionID")]
        public virtual MixingSession MixingSession { get; set; }

        [JsonIgnore]
        [ForeignKey("OrderID")]
        public virtual PaintOrderHead OrderHead { get; set; }

        [ForeignKey("ProductCode")]
        public virtual PaintProduct Product { get; set; }
    }

    [Table("Product", Schema = "paint")]
    public class PaintProduct
    {
        [Key]
        public string ProductCode { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Size { get; set; }
        public string Colour { get; set; }
        public string ColourNumber { get; set; }
        public string BaseProductCode { get; set; }
        public string BaseProductName { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime ModifiedDT { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [InverseProperty("Product")]
        public virtual ICollection<PaintOrderLine> OrderLines { get; set; }
    }

    /*
     * 
     * 
     * 
     */

    public class PassPaintOrderHeadSelect
    {
        public short MixingLocationID { get; set; }
        public int MemberID { get; set; }
    }

    public class PassPaintOrderHistorySelect
    {
        public short MixingLocationID { get; set; }
        public int MemberID { get; set; }
        public DateTime? FromDT { get; set; }
        public DateTime? ToDT { get; set; }
    }

    public class PaintOrderHeadSelectResponse
    {
        public IEnumerable<PaintOrderHeadSelect> Orders { get; set; }
    }
    
    public class PaintOrderHeadSelect
    {
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
        public string OrderID { get; set; }
        public DateTime OrderDT { get; set; }
        public string CustomerOrderReference { get; set; }
        public string HaulierCode { get; set; }
        public string CarriageCode { get; set; }
        public bool Locked { get; set; }
        public string Status { get; set; }
        public int Priority { get; set; }
        public string DeliveryDescription { get; set; }
    }

    /*
     * 
     * 
     * 
     */

    public class PassPaintOrdersToInvoice : PassPaintOrderHeadSelect
    {

    }

    public class PaintBasePaintOrdersToInvoiceResponse
    {
        public IEnumerable<BasePaintOrderToInvoice> Orders { get; set; }
    }

    public class BasePaintOrderToInvoice
    {
        public string BasePaintOrderID { get; set; }
        public string BasePaintOrderStatus { get; set; }
        public DateTime OrderDT { get; set; }
        public bool RequiresInvoicing { get; set; }
        public int MixingSessionID { get; set; }
        public string CustomerOrderID { get; set; }
        public string CustomerOrderReference { get; set; }
    }

    /*
     * 
     * 
     * 
     */

    public class PassPaintOrderLineSelect
    {
        public string OrderID { get; set; }
        public int MemberID { get; set; }
    }

    public class PaintOrderLineSelectResponse
    {
        public IEnumerable<PaintOrderLineSelect> OrderLines { get; set; }

        public IEnumerable<PaintOrderLineMixingSession> MixingSessions { get; set; }
        public PaintNotice Notices { get; set; } 
    }

    public class PaintOrderLineSelect
    {
        public short LineNumber { get; set; }
        public string OrderLineID { get; set; }
        public decimal QuantityOrdered { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string BaseProductCode { get; set; }
        public string BaseProductName { get; set; }
        public bool Locked { get; set; }
        public string Status { get; set; }
        public int? MixingSessionID { get; set; }
    }

    public class PaintOrderLineMixingSession
    {
        public short MixingSessionID { get; set; }
        public DateTime MixedDT { get; set; }
        public string MixedBy { get; set; }
        public int BoxCount { get; set; }
    }

    public class PaintNotice
    {
        public string ErrorMessage { get; set; }
        public string Notification { get; set; }
    }

    /*
     * 
     * 
     * 
     */

    public class PassPaintOrderLineSave
    {
        public string OrderID { get; set; }
        public int MemberID { get; set; }
        public IEnumerable<string> OrderLineIDs { get; set; }
        public int BoxCount { get; set; }
    }

    public class PaintOrderLineSaveResponse
    {
        public string ErrorMessage { get; set; }
        public string Notification { get; set; }
        public long MixingSessionID { get; set; }
    }

    /*
     * 
     * 
     * 
     */

    public class PassPaintOrderLineCancel
    {
        public string OrderID { get; set; }
        public int MemberID { get; set; }
    }

    public class PaintOrderLineCancelResponse
    {
        public PaintNotice Notices { get; set; }
    }

    /*
     * 
     * 
     * 
     */

    public class PassMixingSessionID
    {
        public long MixingSessionID { get; set; }
    }

    public class PaintBoxLabel
    {
        public string DespatchGroup { get; set; }
        public int PageNumber { get; set; }
        public string Contents { get; set; }
        public short BoxCount { get; set; }
    }

    public class PaintGenerateBoxLabelResponse
    {
        public IEnumerable<PaintBoxLabel> BoxLabels { get; set; }
        public PaintNotice Notices { get; set; }
        public byte[] DocumentBytes { get; set; }
    }

    /*
     * 
     * 
     * 
     */

    public class PassTransferGridSelect : PassPaintOrderHeadSelect
    {

    }

    public class PaintTransferOrdersResponse
    {
        public IEnumerable<PaintTransferOrder> Orders { get; set; }
        public PaintNotice Notices { get; set; }
    }

    public class PaintTransferOrder
    {
        public string OrderID { get; set; }
        public int BoxCount { get; set; }
        public int MixingSessionID { get; set; }
        public DateTime? LastPrintedDT { get; set; }
    }

    public class PassPaintTransferSave
    {
        public int MixingLocationID { get; set; }
        public IEnumerable<PaintTransferOrder> TransferOrders { get; set; }
    }

    public class TransferSaveResult : PaintTransferOrder
    {

    }

    public class PaintTransferSaveResponse
    {
        public PaintNotice Notices { get; set; }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        public string TransferDescription { get; set; }
        public IEnumerable<PaintTransferOrder> TransferOrders { get; set; }
        public byte[] DocumentBytes { get; set; }
    }

    public class PaintUpdateOrderStatusResult 
    { 
    
    }
}