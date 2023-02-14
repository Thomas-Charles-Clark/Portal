using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Portal.Models
{
    public class PassOrderEntryProductSearch
    {
        public int TradeAccountID { get; set; }
        public byte? ProductTypeGroupID { get; set; }
        public string SearchTerm { get; set; }
        public byte? ProductTypeID { get; set; }
        public byte? BrandID { get; set; }
        public short? CollectionID { get; set; }
        public short? QualityID { get; set; }
        public int? ProductID { get; set; }
        public string CodeLike { get; set; }
        public string CodeNotLike { get; set; }
        public string ProductRangeFilter { get; set; }
        public bool Seasonal { get; set; }
    }

    public class ProductRangeButton
    {
        [Key]
        public byte ProductRangeID { get; set; }
        public byte? ProductTypeID { get; set; }
        public byte? ProductTypeGroupID { get; set; }
        public string Name { get; set; }
        public byte SortOrder { get; set; }
        public bool Deleted { get; set; }
        public string CodeLike { get; set; }
        public string CodeNotLike { get; set; }
        public bool Seasonal { get; set; }
    }

    public class ProductRangeButtonCacheResult
    {
        public List<ProductRangeButton> Buttons { get; set; }
    }
}