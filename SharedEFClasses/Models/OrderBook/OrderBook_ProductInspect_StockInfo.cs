using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_ProductInspect_StockInfo
    {
        public short StockLocationID { get; set; }
        public byte StockLocationTypeID { get; set; }
        public string StockLocationType { get; set; }
        public string StockLocationName { get; set; }
        public int StockLocationSortOrder { get; set; } 
        public string ProductCode { get; set; }
        public int ProductID { get; set; }
        public string Batch { get; set; }
        public string Piece { get; set; }
        public int SortOrder { get; set; }
        public decimal AvailableNowQuantity { get; set; }
        public decimal BulkQuantity { get; set; }
        public decimal WaitingToBePutAwayQuantity { get; set; }
        public decimal OtherCustomerRingFencedQuantity { get; set; }
        public decimal OnReserveQuantity { get; set; }
        public decimal DueInQuantity { get; set; }
        public DateTime? DueInDate { get; set; }
        public string DueInMessage { get; set; }
        public string POConfirmed { get; set; }
        public string POOnCallOff { get; set; }
        public string DataSource { get; set; }
    }
}
