using Newtonsoft.Json;

using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    public class OrderTrackingSearchResultWrapper
    {
        // emailer params
        public string email { get; set; }
        public string replyTo { get; set; }
        public string subject { get; set; }
        public string body { get; set; }
        public List<OrderParcelDetail> despatched { get; set; }
        public List<ParcelContent> undespatched { get; set; }
        //

        public string OrderNumber { get; set; }
        public string CustomerOrderReference { get; set; }
        public string DateOnFile { get; set; }
        public string CustomerReference { get; set; }
        public string CustomerName { get; set; }
        public string DeliveryName { get; set; }
        public string DeliveryAddress { get; set; }
        public string EmailAddress { get; set; }
        public string HaulierCode { get; set; }
        public string HaulierName { get; set; }
        public string ResultStatus { get; set; }

        public List<OrderLineRecord> OrderLines { get; set; }

        public List<DeliveryNoteHeadRecord> DeliveryNotes { get; set; }

        public List<MertexReportDataOrderSearchResult> MertexReportDataOrderSearchResults { get; set; }

        public OrderTrackingSearchResultWrapper()
        {
            OrderNumber = null;
            CustomerOrderReference = null;
            HaulierCode = null;
            HaulierName = null;
            ResultStatus = null;
            OrderLines = new List<OrderLineRecord>();

            DeliveryNotes = new List<DeliveryNoteHeadRecord>();

            MertexReportDataOrderSearchResults = new List<MertexReportDataOrderSearchResult>();
        }


        public string OrderDate
        {
            get
            {
                DateTime dt = DateTime.MinValue;

                string result = dt.ToString();

                if (DateTime.TryParseExact(DateOnFile, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-GB"), System.Globalization.DateTimeStyles.None, out dt))
                {
                    if (dt.Day.ToString("d").Length == 1)
                    {
                        result = dt.ToString("d MMMM yyyy").Insert(1, Framework.GetDaySuffix(dt.Day));
                    }
                    else
                    {
                        result = dt.ToString("dd MMMM yyyy").Insert(2, Framework.GetDaySuffix(dt.Day));
                    }

                    result = $"{dt.ToString("dddd")} {result}";

                    return result;
                }
                else
                {
                    return DateOnFile;
                }
            }
            set
            {

            }
        }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }
    }

    public class OrderLineRecord
    {
        public int LineNumber { get; set; }
        public string OrderNumber { get; set; }
        public string LineKey { get; set; }
        public string ProductCode { get; set; }
        public string ProductDescription { get; set; }
        public decimal QuantityOrdered { get; set; }
        public decimal QuantityCancelled { get; set; }
        public string MertexStockUnit { get; set; }
        public string Status { get; set; }
        public string StatusDescription { get; set; }
        public string DeliveryNoteNumber { get; set; }
        public string DeliveryNoteLineNumber { get; set; }
        public string EstimatedDespatchDateOnFile { get; set; }

        public OrderLineRecord(
            int lineNumber,
            string orderNumber,
            string lineKey,
            string productCode,
            string productDescription,
            decimal quantityOrdered,
            decimal quantityCancelled,
            string stockUnit,
            string status,
            string statusDescription,
            string deliveryNoteNumber,
            string deliveryNoteLineNumber,
            string estimatedDespatchDateOnFile)
        {
            LineNumber = lineNumber;
            OrderNumber = orderNumber;
            LineKey = lineKey;
            ProductCode = productCode;
            ProductDescription = productDescription;
            QuantityOrdered = quantityOrdered;
            QuantityCancelled = quantityCancelled;
            MertexStockUnit = stockUnit;
            Status = status;
            StatusDescription = statusDescription;
            DeliveryNoteNumber = deliveryNoteNumber;
            DeliveryNoteLineNumber = deliveryNoteLineNumber;
            EstimatedDespatchDateOnFile = estimatedDespatchDateOnFile;
        }

        public string StockUnit
        {
            get
            {
                var stockUnit = MertexStockUnit?.ToLowerInvariant() ?? "";

                if (stockUnit == "ea") // I always hated this.
                    stockUnit = "";

                return stockUnit;
            }
            set
            {

            }
        }

        public decimal Quantity
        {
            get
            {
                return (QuantityOrdered - QuantityCancelled); // because Mertex holds Quantity multiplied up
            }
            set
            {

            }
        }

        public string EstimatedDespatchDate
        {
            get
            {
                try
                {
                    DateTime dt = DateTime.MinValue;

                    string result = dt.ToString();

                    if (DateTime.TryParseExact(EstimatedDespatchDateOnFile, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-GB"), System.Globalization.DateTimeStyles.None, out dt))
                    {
                        if (dt.Day.ToString("d").Length == 1)
                        {
                            result = dt.ToString("d MMMM yyyy").Insert(1, Framework.GetDaySuffix(dt.Day));
                        }
                        else
                        {
                            result = dt.ToString("dd MMMM yyyy").Insert(2, Framework.GetDaySuffix(dt.Day));
                        }

                        result = $"{dt.ToString("dddd")} {result}";

                        return result;
                    }
                    else
                    {
                        return EstimatedDespatchDateOnFile;
                    }
                }
                catch (Exception)
                {
                    return EstimatedDespatchDateOnFile;
                }
            }
            set
            {

            }
        }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }
    }

    public class DeliveryNoteHeadRecord
    {
        public string DeliveryNoteIdentifier { get; set; }
        public List<DeliveryNoteLineRecord> DeliveryNoteLines { get; set; }
        public ParcelHeadResult ParcelHead { get; set; }

        // default ctor - for passing back to OrderTrackingAPIController
        public DeliveryNoteHeadRecord() { }

        public DeliveryNoteHeadRecord(string deliveryNoteId, IEnumerable<string> deliveryNoteLineIds)
        {
            DeliveryNoteIdentifier = deliveryNoteId;
            DeliveryNoteLines = deliveryNoteLineIds.Select(p => new DeliveryNoteLineRecord(p)).ToList();
            ParcelHead = new ParcelHeadResult();
        }
    }

    public class DeliveryNoteLineRecord
    {
        public string DeliveryNoteLineID { get; set; }

        // default ctor - for passing back to OrderTrackingAPIController
        public DeliveryNoteLineRecord() { }

        public DeliveryNoteLineRecord(string deliveryNoteLineId)
        {
            DeliveryNoteLineID = deliveryNoteLineId;
        }
    }

    public class ParcelHeadResult
    {
        public string HaulierName { get; set; }
        public string HaulierCode { get; set; }
        public string TrackingURL { get; set; }
        public string Untrackable { get; set; }
        public string DespatchedDateOnFile { get; set; }

        public List<PickingListLineIdentifier> PickingLines { get; set; }

        public List<OrderParcelDetail> Parcels { get; set; }

        public ParcelHeadResult()
        {
            HaulierName = null;
            HaulierCode = null;
            TrackingURL = null;
            Untrackable = null;
            DespatchedDateOnFile = null;
            PickingLines = new List<PickingListLineIdentifier>();
            Parcels = new List<OrderParcelDetail>();
        }

        public string DespatchedDate
        {
            get
            {
                try
                {
                    var dt = DateTime.ParseExact("31/12/1967", "dd/MM/yyyy", new System.Globalization.CultureInfo("en-GB")).AddDays(Double.Parse(DespatchedDateOnFile));

                    if (dt.Day.ToString("d").Length == 1)
                    {
                        return dt.ToString("d MMMM yyyy").Insert(1, Framework.GetDaySuffix(dt.Day));
                    }
                    else
                    {
                        return dt.ToString("dd MMMM yyyy").Insert(2, Framework.GetDaySuffix(dt.Day));
                    }
                }
                catch (Exception)
                {
                    return DespatchedDateOnFile;
                }
            }
            set
            {

            }
        }
    }

    public class PickingListLineIdentifier
    {
        public string PickingListLineID { get; set; }

        public PickingListLineIdentifier(string pickingListLineId)
        {
            PickingListLineID = pickingListLineId;
        }
    }

    public class OrderParcelDetail
    {
        public int ParcelIndex { get; set; }

        public string ParcelNumber { get; set; }

        public string HaulierCode { get; set; }

        public string ParcelIdentifier { get; set; }

        public string DespatchedDateOnFile { get; set; }

        public string TrackingURL { get; set; }

        public List<OrderLineStub> OrderLines { get; set; }

        public List<ParcelContent> ParcelContents { get; set; }

        public OrderParcelDetail(
            int parcelIndex,
            string parcelNumber,
            string haulierCode,
            string despatchedDateOnFile,
            string trackingUrl)
        {
            ParcelIndex = parcelIndex;
            ParcelNumber = parcelNumber;
            HaulierCode = haulierCode;
            ParcelIdentifier = $"{haulierCode}/{parcelNumber}";
            DespatchedDateOnFile = despatchedDateOnFile;
            TrackingURL = trackingUrl;
            OrderLines = new List<OrderLineStub>();
            ParcelContents = new List<ParcelContent>();
        }

        public string DespatchDate
        {
            get
            {
                try
                {
                    var dt = DateTime.ParseExact("31/12/1967", "dd/MM/yyyy", new System.Globalization.CultureInfo("en-GB")).AddDays(Double.Parse(DespatchedDateOnFile));

                    if (dt.Day.ToString("d").Length == 1)
                    {
                        return dt.ToString("d MMMM yyyy").Insert(1, Framework.GetDaySuffix(dt.Day));
                    }
                    else
                    {
                        return dt.ToString("dd MMMM yyyy").Insert(2, Framework.GetDaySuffix(dt.Day));
                    }
                }
                catch (Exception)
                {
                    return DespatchedDateOnFile;
                }
            }
            set
            {

            }
        }
    }

    public class OrderLineStub
    {
        public string OrderLineKey { get; set; }
        public string ParcelNumber { get; set; }
        public string ProductCode { get; set; }
        public string PickingListLineIdentifier { get; set; }

        public OrderLineStub(
            string orderLineKey,
            string parcelNumber,
            string productCode,
            string pickingListLineId)
        {
            OrderLineKey = orderLineKey;
            ParcelNumber = parcelNumber;
            ProductCode = productCode;
            PickingListLineIdentifier = pickingListLineId;
        }
    }

    public class ParcelContent
    {
        public int Index { get; set; }
        public string ProductCode { get; set; }
        public string ProductDescription { get; set; }
        public decimal Quantity { get; set; }
        public string ParcelNumber { get; set; }
        public string OrderLineKey { get; set; }
        public decimal OrderLineQuantity { get; set; }
        public string StockUnit { get; set; }
        public string PieceNumber { get; set; }
        public string PickingListIdentifier { get; set; }
        public decimal? RemainingToDespatchQuantity { get; set; }

        public ParcelContent(
            int index,
            string productCode,
            string productDescription,
            decimal quantity,
            string parcelNumber,
            string orderLineKey,
            decimal orderLineQuantity,
            string stockUnit,
            string pieceNumber,
            string pickingListIdentifier,
            decimal? remainingToDespatchQuantity)
        {
            Index = index;
            ProductCode = productCode;
            ProductDescription = productDescription;
            Quantity = quantity;
            ParcelNumber = parcelNumber;
            OrderLineKey = orderLineKey;
            OrderLineQuantity = orderLineQuantity;
            StockUnit = stockUnit;
            PieceNumber = pieceNumber;
            PickingListIdentifier = pickingListIdentifier;
            RemainingToDespatchQuantity = remainingToDespatchQuantity;
        }
    }

    public class MertexReportDataOrderSearchResult
    {
        public string OrderNumber { get; set; }
        public string TradeAccountCode { get; set; }
        public string DateOnFile { get; set; }
        public string CustomerOrderReference { get; set; }

        public MertexReportDataOrderSearchResult() { }

        public MertexReportDataOrderSearchResult(
            string orderNumber,
            string tradeAccountCode,
            string dateOnFile,
            string customerOrderReference)
        {
            OrderNumber = orderNumber;
            TradeAccountCode = tradeAccountCode;
            DateOnFile = dateOnFile;
            CustomerOrderReference = customerOrderReference;
        }

        public string OrderDate
        {
            get
            {
                var dt = DateTime.MinValue;

                if (DateTime.TryParseExact(DateOnFile, "yyyyddMM", new System.Globalization.CultureInfo("en-GB"), System.Globalization.DateTimeStyles.None, out dt))
                {
                    if (dt.Day.ToString("d").Length == 1)
                    {
                        return dt.ToString("d MMMM yyyy").Insert(1, Framework.GetDaySuffix(dt.Day));
                    }
                    else
                    {
                        return dt.ToString("dd MMMM yyyy").Insert(2, Framework.GetDaySuffix(dt.Day));
                    }
                }
                else
                {
                    return DateOnFile;
                }
            }
            set
            {

            }
        }
    }

    // Used when POSTing from the Order Tracking app to the OrderTrackingAPIController - when sending the email.
    public class PassOrderSearchResultWrapper
    {
        public byte LanguageID { get; set; }
        public short CountryID { get; set; }
        public string email { get; set; }
        public string replyTo { get; set; }
        public string subject { get; set; }
        public string body { get; set; }
        public string OrderNumber { get; set; }
        public string OrderDate { get; set; }
        public string CustomerOrderReference
        { get; set; }
        public string CustomerName { get; set; }
        public string DeliveryName { get; set; }
        public string DeliveryAddress { get; set; }
        public string EmailAddress { get; set; }
        public string StatusDescription { get; set; }
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
        public List<PassOrderSearchLineRecord> OrderLines { get; set; }

        public PassOrderSearchResultWrapper()
        {
            OrderLines = new List<PassOrderSearchLineRecord>();
        }
    }

    public class PassOrderSearchLineRecord
    {
        public int LineNumber { get; set; }
        public string OrderNumber { get; set; }
        public string LineKey { get; set; }
        public string Status { get; set; }
        public string PickingListDocumentNumber { get; set; }
        public string StatusDescription { get; set; }
        public List<string> TrackingURLs { get; set; }
        public string HaulierCode { get; set; }
        public string ParcelDocumentKeys { get; set; }
        public string Code { get; set; }
        public string StockUnit { get; set; }
        public decimal Quantity { get; set; }
        public string ProductDescription { get; set; }

        public PassOrderSearchLineRecord()
        {
            TrackingURLs = new List<string>();
        }
    }
}
