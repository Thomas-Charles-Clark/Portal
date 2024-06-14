using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBookRingFenceInspectData
    {
        public short RingFencePreAllocationID { get; set; }
        public string TradeAccountGroupCode { get; set; }
        public string TradeAccountGroupName { get; set; }
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public decimal? CurrentQuantity { get; set; }
        public string Piece { get; set; }
        public string Batch { get; set; }
    }
}
