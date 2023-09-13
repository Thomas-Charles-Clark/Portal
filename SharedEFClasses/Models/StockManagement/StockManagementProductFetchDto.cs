using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models.StockManagement
{
    public class StockManagementProductFetchDto
    {
        public byte StatusGroupID { get; set; }
        public string BuyerCode { get; set; }
        public string SupplierCode { get; set; }
        public short? LaunchID { get; set; }
        public byte? BrandID { get; set; }
        public int? ProductColourID { get; set; }
        public byte? StockStatusID { get; set; }
        public string CollectionCode { get; set; }
        public byte? ProductFilterGroupID { get; set; }
        public byte? ProductFilterID { get; set; }
        public IEnumerable<short> AttributeIDs { get; set; }
    }
}