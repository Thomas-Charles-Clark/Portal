using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Portal.Models
{
    public class TradeOrderEnquiryResult
    {
        public int TotalResultsCount { get; set; }
        public List<TradeOrderEnquiryHeadResult> SearchResults { get; set; }
    }

    public class TradeOrderEnquiryHeadResult
    {
        public long OrderHeadID { get; set; }
        public DateTime OrderDate { get; set; }
        public string CustomerOrderReference { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }
        public string Postcode { get; set; }
        public string Country { get; set; }
        public byte? ContactPreference { get; set; }

        public List<TradeOrderEnquiryLineResult> OrderLines { get; set; }
    }

    public class TradeOrderEnquiryLineResult
    {
        public long OrderHeadID { get; set; }
        public DateTime OrderDate { get; set; }
        public string ProductCode { get; set; }
        public decimal Quantity { get; set; }
        public string Description { get; set; }
        public string CustomerOrderReference { get; set; }
        public string TrackingURL { get; set; }
        public string OrderStatus { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }
        public string Postcode { get; set; }
        public string Country { get; set; }
        public byte? ContactPreference { get; set; }
        public long? ImageID { get; set; }
    }

    public class OrderStatus
    {
        public byte OrderStatusID { get; set; }
        public string Name { get; set; }
    }
}