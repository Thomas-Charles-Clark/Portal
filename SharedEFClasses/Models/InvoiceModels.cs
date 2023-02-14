using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace SharedEFClasses.Models
{
    public class PassInvoiceSearch
    {
        public int? orderHeadId { get; set; }
        public string supplierInvoiceId { get; set; }
        public sbyte dateRangeId { get; set; }
    }

    public class PassSupplierInvoiceInfo
    {
        public DateTime? SupplierInvoiceDate { get; set; }
        public string SupplierInvoiceNumber { get; set; }
        public decimal? SupplierInvoiceCharge { get; set; }
        public string SupplierInvoiceComments { get; set; }
        public bool SupplierInvoiceApproved { get; set; }
    }

    public class TreatmentInvoiceInfo : PassSupplierInvoiceInfo
    {
        public long TreatmentOrderLineID { get; set; }
    }

    public class PaintInvoiceInfo : PassSupplierInvoiceInfo
    {
        public long PaintOrderLineID { get; set; }
    }

    public class FurnitureInvoiceInfo : PassSupplierInvoiceInfo
    {
        public long FurnitureOrderLineID { get; set; }
    }

    public class PassTreatmentInvoiceInfo
    {
        public List<TreatmentInvoiceInfo> models { get; set; }
    }

    public class PassPaintInvoiceInfo
    {
        public List<PaintInvoiceInfo> models { get; set; }
    }

    public class PassFurnitureInvoiceInfo
    {
        public List<FurnitureInvoiceInfo> models { get; set; }
    }

    public class TreatmentInvoiceLine
    {
        public string TradeAccountNumber { get; set; }
        public string TradeAccountName { get; set; }
        public long FabricOrderLineID { get; set; }
        public short FabricOrderLineNumber { get; set; }
        public byte FabricOrderLineStatusID { get; set; }
        public string FabricOrderLineStatus { get; set; }
        public string FabricOrderDate { get; set; }
        public int CustomerOrderHeadID { get; set; }
        public decimal? TreatmentCostPrice { get; set; }
        public string FabricCode { get; set; }
        public decimal FabricQuantity { get; set; }
        public string OrderContext { get; set; }
        public string TreatmentProviderName { get; set; }
        public string TreatmentName { get; set; }
        public long TreatmentOrderLineID { get; set; }
        public short TreatmentOrderLineNumber { get; set; }
        public byte TreatmentOrderLineStatusID { get; set; }
        public string TreatmentOrderLineStatus { get; set; }
        public string TreatmentCode { get; set; }
        public decimal TreatmentQuantity { get; set; }
        public int TransferOrderHeadID { get; set; }
        public byte TransferOrderLineStatusID { get; set; }
        public string TransferOrderLineStatus { get; set; }
        public string TransferCode { get; set; }
        public decimal TransferQuantity { get; set; }
        public string SupplierInvoiceNumber { get; set; }
        public DateTime? SupplierInvoiceDate { get; set; }
        public decimal? SupplierInvoiceCharge { get; set; }
        public string SupplierInvoiceComments { get; set; }
        public bool SupplierInvoiceApproved { get; set; }


        public string GroupingKey
        {
            get
            {
                return $"Trade Account: {TradeAccountNumber} - {TradeAccountName}<br/><span class=\"group-span\">Customer Order: {CustomerOrderHeadID}, Transfer Order: {TransferOrderHeadID}, Provider: {TreatmentProviderName}, Order Context: {OrderContext}</span>";
            }
            set
            {

            }
        }
    }

    public class TreatmentInvoiceLinesResult
    {
        public List<TreatmentInvoiceLine> Results { get; set; }
    }

    public class PaintInvoiceLine
    {
        public string TradeAccountNumber { get; set; }
        public string TradeAccountName { get; set; }
        public long PaintOrderLineID { get; set; }
        public string PaintOrderDate { get; set; }
        public short PaintOrderLineNumber { get; set; }
        public byte PaintOrderLineStatusID { get; set; }
        public string PaintOrderLineStatus { get; set; }
        public int PaintOrderHeadID { get; set; }
        public string Code { get; set; }
        public decimal Quantity { get; set; }
        public decimal? CostPrice { get; set; }
        public string TreatmentProviderName { get; set; }
        public string SupplierInvoiceNumber { get; set; }
        public DateTime? SupplierInvoiceDate { get; set; }
        public decimal? SupplierInvoiceCharge { get; set; }
        public string SupplierInvoiceComments { get; set; }
        public bool SupplierInvoiceApproved { get; set; }
    }

    public class PaintInvoiceLinesResult
    {
        public List<PaintInvoiceLine> Results { get; set; }
    }

    public class FurnitureInvoiceLinesResult
    {
        public List<FurnitureInvoiceLine> Results { get; set; }
    }

    public class FurnitureInvoiceLine
    {
        public string TradeAccountNumber { get; set; }
        public string TradeAccountName { get; set; }
        public long FurnitureOrderLineID { get; set; }
        public string FurnitureOrderDate { get; set; }
        public string FurnitureOrderLineNumber { get; set; }
        public string FurnitureOrderStatus { get; set; }
        public int FurnitureOrderHeadID { get; set; }
        public string FabricsAndTreatments { get; set; }
        public object fabricsAndTreatments
        {
            get
            {
                return JsonConvert.DeserializeObject(FabricsAndTreatments ?? "[]");
            }
            set 
            { }
        }
        public string FurnitureSurcharges { get; set; }
        public object furnitureSurcharges
        {
            get
            {
                return JsonConvert.DeserializeObject(FurnitureSurcharges ?? "[]");
            }
            set { }
        }
        public string Name { get; set; }
        public string Code { get; set; }
        public decimal Quantity { get; set; }
        public decimal? CostPrice { get; set; }
        public string FurnitureSupplierName { get; set; }
        public DateTime? SupplierInvoiceDate { get; set; }
        public bool SupplierInvoiceApproved { get; set; }
        public string SupplierInvoiceNumber { get; set; }
        public decimal? SupplierInvoiceCharge { get; set; }
        public string SupplierInvoiceComments { get; set; }
    }
}
