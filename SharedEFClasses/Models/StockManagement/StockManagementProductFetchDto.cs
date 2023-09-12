using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models.StockManagement
{
    public class StockManagementProductFetchDto
    {
        //public int BranchGroupID { get; set; }
        //public int? BranchID { get; set; }
        public string BuyerCode { get; set; }
        public string SupplierCode { get; set; }
        public string ProductGroupCode { get; set; }
        public string ItemTypeCode { get; set; }
        public byte? ProductTypeID { get; set; }
        public short? LaunchID { get; set; }
        public byte? BrandID { get; set; }
        public int? ProductColourID { get; set; }
        public byte? StockLevelID { get; set; }
        public string CollectionCode { get; set; }
        public IEnumerable<short> AttributeIDs { get; set; }
        public byte? ProductFilterGroupID { get; set; }
        public byte? ProductFilterID { get; set; }
        public IEnumerable<char> StockStatuses { get; set; }
        public bool Clearance { get; set; }
    }
}