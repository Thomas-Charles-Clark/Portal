using SharedEFClasses.Models.Orders;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementTransferOrderResult
    {
        public long? ImageID { get; set; }
        public string Type { get; set; }
        public int SortOrder { get; set; }
        public int TradeAccountID { get; set; }
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
        public string OrderID { get; set; }
        public DateTime? OrderDT { get; set; }
        public string OrderLineID { get; set; }
        public long? BasketID { get; set; }
        public DateTime? BasketDT { get; set; }
        public long? BasketItemID { get; set; }
        public int ProductID { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public decimal QuantityOrdered { get; set; }
        public string DetailedLineStatus { get; set; }

        public string TradeAccountLabel
        {
            get
            {
                return $"{TradeAccountCode} - {TradeAccountName}";
            }
        }

        public string SecondaryGroupingLabel
        {
            get
            {
                if (OrderID != null)
                {
                    return $"Order ID: {OrderID} - {OrderDT?.ToString("dd/MM/yyyy")}";
                }
                else
                {
                    return $"Basket ID: {BasketID} - {BasketDT?.ToString("dd/MM/yyyy")}";
                }
            }
        }

        public string SecondarySorting
        {
            get
            {
                if (OrderID != null)
                {
                    return $"Order ID: {OrderID}";
                }
                else
                {
                    return $"Basket ID: {BasketID}";
                }
            }
        }
    }
}
