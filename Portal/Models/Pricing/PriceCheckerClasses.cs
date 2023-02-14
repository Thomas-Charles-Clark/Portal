using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Portal.Models.Pricing
{
    public class PriceCheckerSlicersInitialValues
    {
        public List<SlicerBrand> Brands { get; set; }
        public List<SlicerProductTypeGroup> ProductTypeGroups { get; set; }
        public List<SlicerProductType> ProductTypes { get; set; }
        public List<SlicerItemType> ItemTypes { get; set; }
        public List<SlicerLaunch> Launches { get; set; }
        public List<SlicerSeason> Seasons { get; set; }
        public List<SlicerQuality> Qualities { get; set; }

        public PriceCheckerSlicersInitialValues()
        {
            Brands = new List<SlicerBrand>();
            ProductTypeGroups = new List<SlicerProductTypeGroup>();
            ProductTypes = new List<SlicerProductType>();
            ItemTypes = new List<SlicerItemType>();
            Launches = new List<SlicerLaunch>();
            Seasons = new List<SlicerSeason>();
            Qualities = new List<SlicerQuality>();
        }
    }

    public class PriceCheckerSlicerValue
    {
        [Key]
        public byte BrandID { get; set; }
        public byte ProductTypeGroupID { get; set; }
        public byte ProductTypeID { get; set; }
        public short ItemTypeID { get; set; }
        public short LaunchID { get; set; }
        public byte SeasonID { get; set; }
    }

    public class SlicerMarket
    {
        [Key]
        public byte MarketID { get; set; }
        public string Name { get; set; }
        public byte CurrencyID { get; set; }
    }

    public class SlicerTradePriceList
    {
        [Key]
        public short TradePriceListID { get; set; }
        public string Name { get; set; }
        public byte CurrencyID { get; set; }
    } 

    public class SlicerCurrency
    {
        [Key]
        public byte CurrencyID { get; set; }
        public CurrencyShim Currency { get; set; }
    }

    public class CurrencyShim
    {
        public string Name { get; set; }
        public string FormattingCulture { get; set; }
        public string Code { get; set; }
    }
    
    public class SlicerQuality
    {
        [Key]
        public short QualityID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }

    public class SlicerBrand
    {
        [Key]
        public byte BrandID { get; set; }
        public string Name { get; set; }
    }

    public class SlicerProductGroup
    {
        [Key]
        public byte ProductGroupID { get; set; }
        public string Name { get; set; }
    }

    public class SlicerProductTypeGroup
    {
        [Key]
        public byte ProductTypeGroupID { get; set; }
        public string Name { get; set; }
    }
    
    public class SlicerProductType
    {
        [Key]
        public byte ProductTypeID { get; set; }
        public string Name { get; set; }
    }

    public class SlicerItemType
    {
        [Key]
        public short ItemTypeID { get; set; }
        public string Name { get; set; }
    }

    public class SlicerLaunch
    {
        [Key]
        public short LaunchID { get; set; }
        public string Name { get; set; }
    }

    public class SlicerSeason
    {
        [Key]
        public byte SeasonID { get; set; }
        public string Name { get; set; }
    }

    public class SlicerProduct
    {
        [Key]
        public int ProductID { get; set; }
        public string Name { get; set; }
        public byte BrandID { get; set; }
        public byte ProductTypeGroupID { get; set; }
        public byte ProductTypeID { get; set; }
        public short? ItemTypeID { get; set; }
        public short LaunchID { get; set; }
        public byte SeasonID { get; set; }
        public bool Clearance { get; set; }
        public bool Sample { get; set; }
        public string Code { get; set; }
    }

    public class SlicerShowClearance
    {
        [Key]
        public bool Value { get; set; }
        public string Name { get; set; }
    }

    public class SlicerIncludeSample
    {
        [Key]
        public bool Value { get; set; }
        public string Name { get; set; }
    }
}