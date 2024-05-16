using Microsoft.AspNet.OData.Builder;
using Newtonsoft.Json;

using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Maintenance;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.StockManagement;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models.Products
{
    public class ContractAgreementCheckResult
    {
        public List<ContractAgreementTradeContractPrices> TradeContractPrices { get; set; }
        public List<ContractAgreementTradeContractDiscounts> TradeContractDiscounts { get; set; }
    }

    public class ContractAgreementTradeContractPrices
    {
        public decimal Price { get; set; }
        public DateTime? OnDate { get; set; }
        public DateTime? OffDate { get; set; }
        public short QuantityBreak { get; set; }
        public long TradeContractPriceID { get; set; }
    }

    public class ContractAgreementTradeContractDiscounts
    {
        public decimal Discount { get; set; }
        public DateTime? OnDate { get; set; }
        public DateTime? OffDate { get; set; }
        public short QuantityBreak { get; set; }
        public long TradeContractDiscountID { get; set; }
    }

    public class ProductType
    {
        [Key]
        public byte ProductTypeID { get; set; }
        public byte ProductTypeGroupID { get; set; }
        public string Name { get; set; }
        public bool IsActualProductType { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public virtual ProductTypeGroup ProductTypeGroup { get; set; }

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }

        [JsonIgnore]
        public virtual ICollection<Mertex_ProductType> Mertex_ProductTypes { get; set; }

        [JsonIgnore]
        [InverseProperty("ProductType")]
        public virtual ICollection<ProductPage> ProductPages { get; set; }

        [JsonIgnore]
        [InverseProperty("ProductType")]
        public virtual IEnumerable<ProductFilter> ProductFilters { get; set; }
    }

    public class Product
    {
        [Key]
        public int ProductID { get; set; }
        public byte ProductTypeID { get; set; }
        public byte? ProductGroupID { get; set; }
        public short? ItemTypeID { get; set; }
        public short LaunchID { get; set; }
        public byte BrandID { get; set; }
        public int? DesignID { get; set; }
        public short? QualityID { get; set; }
        public byte? ColourID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string BasketName { get; set; }
        public string OrderFormName { get; set; }
        public string Status { get; set; }
        public bool Enabled { get; set; }
        public bool Deleted { get; set; }
        public decimal? MaxLengthPerPole { get; set; }
        public decimal? RollLength { get; set; }
        public decimal? RollWidth { get; set; }
        public string WideWidthFabricDefaultPoleWidth { get; set; }
        public byte StockUnitID { get; set; }
        public byte? DeliveryGroupID { get; set; }

        public int? ProductPageID { get; set; }

        public virtual ProductType ProductType { get; set; }
        public virtual ItemType ItemType { get; set; }
        public virtual ProductGroup ProductGroup { get; set; }

        [InverseProperty("Product")]
        public virtual Stock Stock { get; set; }

        public virtual Launch Launch { get; set; }
        public virtual Design Design { get; set; }
        public virtual Quality Quality { get; set; }
        public virtual Colour Colour { get; set; }
        public virtual Brand Brand { get; set; }

        public virtual ICollection<Product_Collection> Collections { get; set; }

        [JsonIgnore]
        [InverseProperty("Product")]
        public virtual ICollection<Treatment> Treatments { get; set; }

        [JsonIgnore]
        [InverseProperty("Product")]
        public virtual ICollection<TradeAccounts.TradeAccountVisit_Product> OrderedFromVisits { get; set; }

        [NotMapped]
        public string AutocompleteLabel
        {
            get
            {
                return $"{Code} - {Name}";
            }
        }

        [AutoExpand]
        [InverseProperty("Product")]
        public virtual ICollection<Product_Image> Product_Images { get; set; }

        [JsonIgnore]
        [InverseProperty("Product")]
        public virtual ICollection<RingFencePreAllocation> RingFencePreAllocations { get; set; }

        [JsonIgnore]
        [InverseProperty("Product")]
        public virtual ICollection<BasketItem> BasketItems { get; set; }

        [JsonIgnore]
        [InverseProperty("Product")]
        public virtual ICollection<FurnitureFabricRestriction> FurnitureDesignRestrictions { get; set; }

        [JsonIgnore]
        [InverseProperty("Product")]
        public virtual ICollection<Range> RetailBranchRanges { get; set; }


        [AutoExpand]
        [ForeignKey("StockUnitID")]
        public virtual StockUnit StockUnit { get; set; }

        [AutoExpand]
        [NotMapped]
        public long? ImageID
        {
            set
            {

            }
            get
            {
                return Product_Images?.Where(p => p.PerspectiveID == 1).Select(p => p.ImageID).FirstOrDefault();
            }
        }

        [JsonIgnore]
        [InverseProperty("Product")]
        public virtual ICollection<SharedEFClasses.ReturnModels.ReturnParcel_Product> ReturnParcels { get; set; }

        [NotMapped]
        public bool ShouldShipViaTuffnells
        {
            get
            {
                return DeliveryGroupID == 13 || DeliveryGroupID == 14 || DeliveryGroupID == 15;
            }
        }
        
        [NotMapped]
        public string ShortLabel
        {
            get
            {
                return $"{Code} - {OrderFormName}";
            }
        }

        [ForeignKey("ProductPageID")]
        public virtual ProductPage ProductPage { get; set; }
    }

    [Table("Product_Image", Schema = "dbo")]
    public class Product_Image
    {
        [Key]
        [Column(Order = 1)]
        public int ProductID { get; set; }

        [Key]
        [Column(Order = 2)]
        public long ImageID { get; set; }

        [Key]
        [Column(Order = 3)]
        public byte PerspectiveID { get; set; }

        [JsonIgnore]
        [ForeignKey("ProductID")]
        public virtual Product Product { get; set; }
    }

    public class Product_Collection
    {
        [Key]
        [Column(Order = 1)]
        public int ProductID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short CollectionID { get; set; }

        [JsonIgnore]
        public virtual Product Product { get; set; }

        public virtual Collection Collection { get; set; }
    }

    public class Stock
    {
        [Key, ForeignKey("Product")]
        public int ProductID { get; set; }
        public decimal FreeStock { get; set; }
        public byte StockStatusID { get; set; }

        [JsonIgnore]
        public virtual StockStatus StockStatus { get; set; }

        [JsonIgnore]
        [InverseProperty("Stock")]
        public virtual Product Product { get; set; }
    }

    [Table("StockUnit", Schema = "dbo")]
    public class StockUnit
    {
        public byte StockUnitID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Units { get; set; }

        [JsonIgnore]
        [InverseProperty("StockUnit")]
        public virtual ICollection<Product> Products { get; set; }
    }

    public class StockStatus
    {
        [Key]
        public byte StockStatusID { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Stock> Stocks { get; set; }
    }

    public class Launch
    {
        public short LaunchID { get; set; }
        public string Name { get; set; }
        public byte SeasonID { get; set; }

        public DateTime LaunchDate { get; set; }

        public DateTime? TradeLaunchDate { get; set; }

        public virtual Season Season { get; set; }

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }

        [NotMapped]
        public string AbbreviatedName
        {
            get
            {
                return $"{Season.Code}{LaunchDate.ToString("yy")}";
            }
        }

        [JsonIgnore]
        [InverseProperty("Launch")]
        public virtual ICollection<ProductPage> ProductPages { get; set; }
    }

    public class Season
    {
        public byte SeasonID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }

        [JsonIgnore]
        public virtual ICollection<Launch> Launches { get; set; }
    }

    public class Collection
    {
        [Key]
        public short CollectionID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Heading { get; set; }
        public string SubHeading { get; set; }

        [NotMapped]
        public string ShortLabel
        {
            get
            {
                return $"{Code} - {Name}";
            }
        }

        [JsonIgnore]
        public virtual ICollection<Product_Collection> Products { get; set; }

        [JsonIgnore]
        [InverseProperty("CanonicalCollection")]
        public virtual ICollection<ProductPage> CanonForProductPages { get; set; }
    }

    public class Design
    {
        [Key]
        public int DesignID { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }
    }

    public class ItemType
    {
        [Key]
        public short ItemTypeID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }

        [JsonIgnore]
        [InverseProperty("ItemType")]
        public virtual ICollection<Mertex_ProductType> Mertex_ProductTypes { get; set; }

        [JsonIgnore]
        [InverseProperty("ItemType")]
        public virtual ICollection<ContractProductRestriction> ContractProductRestrictions { get; set; }
    }

    public class ItemTypeEqualityComparer : IEqualityComparer<ItemType>
    {
        public bool Equals(ItemType it1, ItemType it2)
        {
            if (ReferenceEquals(it1, it2))
                return true;

            if (it2 is null || it1 is null)
                return false;

            return it1.ItemTypeID == it2.ItemTypeID;
        }

        public int GetHashCode(ItemType pg) => pg.ItemTypeID;
    }

    public class ProductGroup
    {
        [Key]
        public byte ProductGroupID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }

        [JsonIgnore]
        public virtual ICollection<Mertex_ProductType> Mertex_ProductTypes { get; set; }

        [JsonIgnore]
        [InverseProperty("ProductGroup")]
        public virtual ICollection<ContractProductRestriction> ContractProductRestrictions { get; set; }
    }

    public class ProductGroupEqualityComparer : IEqualityComparer<ProductGroup>
    {
        public bool Equals(ProductGroup pg1, ProductGroup pg2)
        {
            if (ReferenceEquals(pg1, pg2))
                return true;

            if (pg2 == null || pg1 == null)
                return false;

            return pg1.ProductGroupID == pg2.ProductGroupID;
        }

        public int GetHashCode(ProductGroup pg) => pg.ProductGroupID;
    }

    public class Quality
    {
        [Key]
        public short QualityID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        [NotMapped]
        public string ShortLabel
        {
            get
            {
                return $"{Code} - {Name}";
            }
        }

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }

        [JsonIgnore]
        [InverseProperty("Quality")]
        public virtual ICollection<Treatment_Quality> Treatments { get; set; }
    }

    public class ProductSortOptionResult
    {
        public byte? ProductFilterGroupID { get; set; }
        public string Lifecycle { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public byte SortOrder { get; set; }
        public bool Default { get; set; }
    }

    [Table("Filter_Product", Schema = "Portal")]
    public class Filter_Product
    {
        [Key]
        [Column(Order = 1)]
        public byte BrandID { get; set; }
        public string BrandName { get; set; }

        [Key]
        [Column(Order = 2)]
        public byte ProductGroupID { get; set; }
        public string ProductGroupName { get; set; }

        [Key]
        [Column(Order = 3)]
        public short ItemTypeID { get; set; }
        public string ItemTypeName { get; set; }

        [Key]
        [Column(Order = 4)]
        public short LaunchID { get; set; }
        public string LaunchName { get; set; }
    }

    public class PassFetchProductStockInfo
    {
        public int? TradeAccountID { get; set; }
        public List<int> ProductIDs { get; set; }
        public string EnquiryType { get; set; } = "P";
    }

    public class PassFetchProductStockInfoSingular
    {
        public int TradeAccountID { get; set; }
        public int? ProductID { get; set; }
        public string ProductCode { get; set; } 
    }

    public class ProductSearchResult
    {
        public long? ImageID { get; set; }
        public int ProductID { get; set; }
        public string Code { get; set; }
        public string BasketName { get; set; }
        public string OrderFormName { get; set; }
        public byte BrandID { get; set; }
        public string Brand { get; set; }
        public string Status { get; set; }
        public string StockStatus { get; set; }
        public decimal? FreeStock { get; set; }
        public decimal? POFreeStock { get; set; }
        public DateTime? PODueDate { get; set; }
        public decimal? ListPrice { get; set; }
        public decimal? FinalPrice { get; set; }
        public decimal? RRP { get; set; }
        public string ProductType { get; set; }
        public string Units
        {
            get
            {
                return UnitsA;
            }
        }
        public short SortOrder { get; set; }
        public int? ProductPageID { get; set; }
        public string ProductPageName { get; set; }
        public long? ProductPageImageID { get; set; }
        public string OrderFormGroup { get; set; }
        public string Collection { get; set; }
        public string ProductPageDescription { get; set; }
        public bool Grouped { get; set; }
        public string ParentStockStatus { get; set; }
        public decimal? ParentFreeStock { get; set; }
        public decimal? ParentPOFreeStock { get; set; }
        public DateTime? ParentPODueDate { get; set; }
        public string Tag { get; set; }
        public int? DesignID { get; set; }
        public string Design { get; set; }
        public decimal? ClearanceDiscountPercentage { get; set; }
        public bool? BespokeProduct { get; set; }
        public byte? ProductFilterID { get; set; }
        public string EAN { get; set; }
        public string StockLocationA { get; set; }
        public decimal StockLocationA_Available { get; set; }
        public decimal StockLocationA_Incoming { get; set; }
        public byte QuantityPrecisionA { get; set; }
        public string UnitsA { get; set; }
        public string LastCheckedA { get; set; }
        public string StockLocationB { get; set; }
        public decimal? StockLocationB_Available { get; set; }
        public decimal? StockLocationB_Incoming { get; set; }
        public byte QuantityPrecisionB { get; set; }
        public string UnitsB { get; set; }
        public string LastCheckedB { get; set; }
        public string StockLocationC { get; set; }
        public decimal? StockLocationC_Available { get; set; }
        public decimal? StockLocationC_Incoming { get; set; }
        public byte QuantityPrecisionC { get; set; }
        public string UnitsC { get; set; }
        public string LastCheckedC { get; set; }
        public byte ProductFilterFulfilmentGroupID { get; set; }
        public decimal? ReserveOrderOverAllocationAllowance { get; set; }
        public short? QualityID { get; set; }
        public decimal? NetWeight { get; set; }
        public bool? WideWidth { get; set; }
        public byte MaxFoldLength { get; set; }
        public byte ProductTypeID { get; set; }
        public string Size { get; set; }
        public bool MadeToOrder { get; set; }
        public decimal? MaxLengthPerPole { get; set; }
        public string SupplierAvailabilityMessage { get; set; }
        public string WideWidthFabricDefaultPoleWidth { get; set; }
        public string BespokeFurnitureJSON { get; set; }
        public string AKA { get; set; }

        public object StockData
        {
            get
            {
                return new
                {
                    StockLocationA = new
                    {
                        Name = this.StockLocationA,
                        Available = this.StockLocationA_Available,
                        AvailableClass = $"{(this.StockLocationA_Available > 0 ? "" : "no-stock-text")}",
                        Incoming = this.StockLocationA_Incoming,
                        IncomingClass = $"{(this.StockLocationA_Incoming > 0 ? "" : "no-stock-text")}",
                        Units = this.UnitsA,
                        QuantityPrecision = this.QuantityPrecisionA,
                        LastChecked = this.LastCheckedA
                    },
                    StockLocationB = new
                    {
                        Name = this.StockLocationB,
                        Available = this.StockLocationB_Available,
                        AvailableClass = $"{(this.StockLocationB_Available > 0 ? "" : "no-stock-text")}",
                        Incoming = this.StockLocationB_Incoming,
                        IncomingClass = $"{(this.StockLocationB_Incoming > 0 ? "" : "no-stock-text")}",
                        Units = this.UnitsB,
                        QuantityPrecision = this.QuantityPrecisionB,
                        LastChecked = this.LastCheckedB
                    },
                    StockLocationC = new
                    {
                        Name = this.StockLocationC,
                        Available = this.StockLocationC_Available,
                        AvailableClass = $"{(this.StockLocationC_Available > 0 ? "" : "no-stock-text")}",
                        Incoming = this.StockLocationC_Incoming,
                        IncomingClass = $"{(this.StockLocationC_Incoming > 0 ? "" : "no-stock-text")}",
                        Units = this.UnitsC,
                        QuantityPrecision = this.QuantityPrecisionC,
                        LastChecked = this.LastCheckedC
                    }
                };
            }
        }
    }

    public class ProductSearchResultExtension
    {
        public byte FulfilmentTypeID { get; set; }
        public decimal Quantity { get; set; }
        public bool BackOrder { get; set; }
        public short StockLocationID { get; set; }
        public string LineReference { get; set; }
        public DateTime? ForwardOrderDate { get; set; }
        public byte OrderTypeID { get; set; }
        public byte BasketItemTypeID { get; set; }
        public string ProcessAnswersJSON { get; set; }
        public string CutLengthJSON { get; set; }
        public string BespokeFurnitureJSON { get; set; }
    }

    public class BasketItem_Edit_SelectResult
    {
        public ProductSearchResult SearchResult { get; set; }
        public ProductSearchResultExtension ExtensionFields { get; set; }
        public List<Components.ProductCode_Autocomplete_Samples_Result> ArchitectRingSamples { get; set; }
    }

    public class ProductFilter_SelectResult
    {
        public byte ProductFilterID { get; set; }
        public byte? ProductTypeID { get; set; }

        public byte ProductFilterGroupID { get; set; }
        public string ProductFilterGroup { get; set; }
        public byte ProductFilterGroupSortOrder { get; set; }

        public string Name { get; set; }
        public string Value { get; set; }
        public byte SortOrder { get; set; }
        public bool IsProduct { get; set; }

        public int RowCount { get; set; }
        public bool Seasonal { get; set; }
        public byte QuantityPrecision { get; set; }
        public decimal QuantityMinimum { get; set; }
        public decimal QuantityIncrement { get; set; }
        public bool AddAll { get; set; }

        public bool ShowStockFilter { get; set; }
        public bool ShowColourFilter { get; set; }
        public bool ShowBrandFilter { get; set; }
        public bool ShowNewFilter { get; set; }
        public bool ShowLaunchFilter { get; set; }
        public bool ShowPatternFilter { get; set; }
        public bool ShowProductTypeFilter { get; set; }
        public bool ShowMartindaleFilter { get; set; }
        public bool ShowWidthFilter { get; set; }
        public bool ShowSizeFilter { get; set; }

        public bool ShowOrderTab { get; set; }
        public bool ShowStockTab { get; set; }
        public bool ShowTechTab { get; set; }
        public bool ShowCareTab { get; set; }
        public bool ShowColourwayTab { get; set; }
        public bool ShowAlternativeProductTab { get; set; }
        public bool ShowCoordinatingTab { get; set; }
        public bool ShowUSPTab { get; set; }
        public bool ShowPatternBookTab { get; set; }
        public bool ShowSamplingTab { get; set; }
        public bool ShowAlsoLookAtTab { get; set; }
        public bool ShowSamplingOptionsButton { get; set; }
        public bool ShowBespokeOptionTab { get; set; }
        public bool ShowTreatmentTab { get; set; }
        public bool ShowLinkedDocumentsTab { get; set; }
        public bool ShowSupplierTab { get; set; }
        public bool DisplayRRP { get; set; }
        public string DefaultLayout { get; set; }

        public bool ResaleAllowed { get; set; }
        public bool AllowReserveOrders { get; set; }
        public bool AllowBatchCutting { get; set; }
        public bool AllowForwardOrders { get; set; }
        public bool AllowQuickAddToBasket { get; set; }

        public byte ProductFilterFulfilmentGroupID { get; set; }

        public short DefaultPageSize { get; set; }

        public string StockMessageOverride { get; set; }

        public bool BespokeProduct { get; set; }
        public bool ExcludeFromDuplicateLineCheck { get; set; }
    }


    public class QuickDisplay_Result
    {
        public int QuickDisplayID { get; set; }
        public string Name { get; set; }
        public long ImageID { get; set; }
    }

    public class ProductFilter_StockSelect
    {
        public byte StockFilterID { get; set; }
        public string Name { get; set; }
    }

    public class ProductFilter_ItemTypeSelect
    {
        public short ItemTypeID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
    }

    public class Product_SelectByQualityResult
    {
        public int ProductID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal? FreeStock { get; set; }
        public string StockStatus { get; set; }
        public decimal? POFreeStock { get; set; }
        public DateTime? PODueDate { get; set; }
        public long? ImageID { get; set; }
        public decimal? RollLength { get; set; }
    }

    public class QuickDisplay_Product_Result
    {
        public int ProductID { get; set; }
        public decimal Quantity { get; set; }
        public short SortOrder { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Brand { get; set; }
        public string Status { get; set; }
        public string StockStatus { get; set; }
        public int MyProperty { get; set; }
    }

    public class Product_TechInfo_Result
    {
        public Product_TechInfo Core { get; set; }
        public List<Product_TechInfo_Collection> Collections { get; set; }
        public List<Product_TechInfo_Test> Tests { get; set; }
        public List<Product_TechInfo_Usage> Usages { get; set; }
        public List<Product_TechInfo_Attribute> Attributes { get; set; }

        public List<Product_TechInfo_Aftercare> FabricWallpaperAftercares { get; set; }
        public List<Product_TechInfo_Attribute> FinishedProductAftercares { get; set; }
    }

    public class Product_TechInfo
    {
        public double? Width { get; set; }
        public double? Weight { get; set; }
        public double? HorizontalPatternRepeat { get; set; }
        public double? VerticalPatternRepeat { get; set; }
        public double? Martindale { get; set; }
        public string Composition { get; set; }
        public string PatternMatch { get; set; }
        public string Flamcode { get; set; }
        public string ContractFR { get; set; }
        public string DomesticFR { get; set; }
        public string Type { get; set; }
        public string AdditionalInfo { get; set; }
        public string WideWidthFabricDefaultPoleWidth { get; set; }
        public Byte? MaxFoldLength { get; set; }
        public long? CommodityCode { get; set; }
        public string OriginCountry { get; set; }
        public string BuyerName { get; set; }
        public string BuyerEmail { get; set; }
    }

    public class Product_TechInfo_Aftercare
    {
        public string Aftercare { get; set; }
    }

    public class Product_TechInfo_Collection
    {
        public string Collection { get; set; }
    }

    public class Product_TechInfo_Test
    {
        public string Test { get; set; }
    }

    public class Product_TechInfo_Usage
    {
        public string Usage { get; set; }
    }

    public class Product_TechInfo_Attribute
    {
        public string AttributeGroup { get; set; }
        public string Attribute { get; set; }
    }

    public class ProductSearchKeyword
    {
        public string Suggestion { get; set; }
        public string ProductType { get; set; }
        public string Type { get; set; }
        public short? CollectionID { get; set; }
        public string BrandCode { get; set; }
        public string Label { get; set; }
    }

    public class ProductPageImage
    {
        public long ImageID { get; set; }
        public string TitleText { get; set; }
        public string AltText { get; set; }
    }

    public class PatternBookSaturation
    {
        public int ProductID { get; set; }
        public short Quantity { get; set; }
        public DateTime? LastPurchasedDT { get; set; }
        public int? LatestOrderHeadID { get; set; }
    }

    public class FilterButtonSelectResult
    {
        public List<ProductFilter_SelectResult> CurrentSet { get; set; }
        public List<ProductFilter_SelectResult> CompleteSet { get; set; }
    }

    public class ProductSearchResultWrapper
    {
        public List<ProductSearchResult> Results { get; set; }

        public List<PatternBookSaturation> PatternBookSaturation { get; set; }
    }

    public class DownloadSearchResultWrapper
    {
        public int ResultCount { get; set; }

        public List<DownloadSearchResult> Results { get; set; }
    }

    public class DownloadSearchResult
    {
        public byte ProductFilterID { get; set; }
        public int ProductPageID { get; set; }
        public int SortOrder { get; set; }
        public string Heading { get; set; }
        public string SubHeading { get; set; }
        public string Description { get; set; }
        public string URL { get; set; }

        public string RecordID
        {
            get
            {
                return $"{ProductPageID}-{ProductFilterID}";
            }
        }

        public List<DownloadSearchImageResult> Images { get; set; }
    }

    public class DownloadSearchImageResult
    {
        public byte ProductFilterID { get; set; }
        public int ProductPageID { get; set; }
        public long ImageID { get; set; }
        public byte SortOrder { get; set; }
    }

    public class BasketRefreshPricesStockResult
    {
        public int ProductID { get; set; }
        public decimal Quantity { get; set; }
        public byte OrderTypeID { get; set; }
        public decimal? ListPrice { get; set; }
        public decimal? FinalPrice { get; set; }
        public byte? StockStatusID { get; set; }
        public string StockStatus { get; set; }
        public decimal? FreeStock { get; set; }
        public DateTime? PODueDate { get; set; }
        public decimal? POFreeStock { get; set; }

        public string ParentStockStatus { get; set; }
        public decimal? ParentFreeStock { get; set; }
        public decimal? ParentPOFreeStock { get; set; }

        public short RowNumber { get; set; }
        public decimal? NetWeight { get; set; }
    }

    public class FulfilmentOptionSelectResult
    {
        public string ProductFilterFulfilmentGroup { get; set; }
        public byte ProductFilterFulfilmentGroupID { get; set; }
        public string FulfilmentType { get; set; }
        public byte FulfilmentTypeID { get; set; }
        public short StockLocationID { get; set; }
        public string StockLocationCode { get; set; }
        public string StockLocation { get; set; }
        public bool AllowBackOrder { get; set; }
        public bool AllowForwardOrder { get; set; }
        public bool AllowReserveOrder { get; set; }
        public string TransferDestinationStockLocationCode { get; set; }
        public string TransferDestinationStockLocation { get; set; }
        public long Preference { get; set; }
        public long SortOrder { get; set; }
    }

    [Table("Member_Basket", Schema = "portal")]
    public class Member_Basket
    {
        [Key]
        public int MemberBasketID { get; set; }
        public int MemberID { get; set; }
        public int TradeAccountID { get; set; }
        public string OrderReference { get; set; }
        public string OrderJSON { get; set; }
        public string PreferredEmail { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime? ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("MemberID")]
        public virtual Member Owner { get; set; }

        [ForeignKey("TradeAccountID")]
        public virtual TradeAccount TradeAccount { get; set; }
    }

    [Table("DeliveryFOCReason", Schema = "portal")]
    public class DeliveryFOCReason
    {
        [Key]
        public byte DeliveryFOCReasonID { get; set; }
        public string Name { get; set; }
    }

    public class USP_Result
    {
        public int SortOrder { get; set; }
        public string USP { get; set; }
    }

    public class ProductTreatmentOptionResult
    {
        public short CountryID { get; set; }
        public string CountryName { get; set; }
        public short CountrySortOrder { get; set; }
        public byte TreatmentTypeID { get; set; }
        public string TreatmentTypeName { get; set; }
        public byte TreatmentID { get; set; }
        public string TreatmentName { get; set; }
        public string TreatmentStatusName { get; set; }
        public string TreatmentStatusHover { get; set; }
    }

    [Table("DiscountReason", Schema = "portal")]
    public class DiscountReason
    {
        [Key]
        public byte DiscountReasonID { get; set; }
        public string Name { get; set; }
        public bool CommentRequired { get; set; }
        public bool PriceIncrease { get; set; }
    }

    [Table("SavedBasketReason", Schema = "portal")]
    public class SavedBasketReason
    {
        [Key]
        public short SavedBasketReasonID { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("SavedBasketReason")]
        public virtual ICollection<Basket> BasketsSavedForReason { get; set; }
    }

    [Table("TransactionType", Schema = "portal")]
    public class TransactionType
    {
        [Key]
        public byte TransactionTypeID { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("TransactionType")]
        public virtual ICollection<Basket> Baskets { get; set; }
    }

    public class BespokeProductPrice
    {
        public decimal? ListPrice { get; set; }
        public decimal? FinalPrice { get; set; }
    }

    public class ProductTreatmentResult
    {
        public List<ProductTreatment> Treatments { get; set; }
    }

    public class BasketItemTreatmentResult
    {
        public List<BasketItemTreatmentProvider> Treatments { get; set; }
        public List<ExpressTreatmentPrice> ExpressTreatmentPrices { get; set; }
        public List<TreatmentNotice> TreatmentNotes { get; set; }
        public ExpressTreatmentSelected Express { get; set; }
        public List<TreatmentTypeMandatory> TreatmentTypeMandates { get; set; }
    }

    public class TreatmentTypeMandatory
    {
        public byte TreatmentTypeID { get; set; }
        public string TreatmentTypeName { get; set; }
    }

    public class TreatmentNotice
    {
        public string TreatmentNote { get; set; }
        public bool AcknowledgementRequired { get; set; }
        public string AlertClass { get; set; }
        public byte? TreatmentTypeID { get; set; }
    }

    public class ExpressTreatmentSelected
    {
        public bool Selected { get; set; }
    }

    public class BasketItemTreatmentProvider
    {
        public byte TreatmentProviderID { get; set; }
        public string TreatmentProviderName { get; set; }
        public byte TreatmentProviderSortOrder { get; set; }
        public byte TreatmentTypeID { get; set; }
        public string TreatmentTypeName { get; set; }
        public byte TreatmentTypeSortOrder { get; set; }
        public byte TreatmentDisplayGroupID { get; set; }
        public string TreatmentDisplayGroupName { get; set; }
        public byte TreatmentID { get; set; }
        public string TreatmentName { get; set; }
        public string TreatmentDescription { get; set; }
        public byte? TreatmentStatusID { get; set; }
        public string TreatmentStatus { get; set; }
        public string TreatmentStatusHover { get; set; }
        public byte StandardLeadTimeDays { get; set; }
        public byte ExpressLeadTimeDays { get; set; }
        public decimal UnitPriceEx { get; set; }
        public decimal? MinimumPriceEx { get; set; }
        public decimal PriceEx { get; set; }
        public long TreatmentSortOrder { get; set; }
        public bool Selected { get; set; }
        public bool AllowOrder { get; set; }
        public decimal? ExpressPrice { get; set; }
        public string Note { get; set; }
        public string SupplierProductCode { get; set; }
        public string ProductCode { get; set; }
        public long? ImageID { get; set; }

    }

    public class TreatmentOptionResult
    {
        public List<BasketItemTreatmentProvider> Treatments { get; set; }
        public List<ProductTestPassed> TestsPassed { get; set; }
        public List<QualityComposition> QualityCompositions { get; set; }
    }

    public class ProductTestPassed
    {
        public string Test { get; set; }
        public string Code { get; set; }
    }

    public class ExpressTreatmentPrice
    {
        public byte TreatmentProviderID { get; set; }
        public decimal PriceEx { get; set; }
    }

    public class BasketClauseResult
    {
        public List<BasketSplitResult> Orders { get; set; }
        public List<OrderClause> Clauses { get; set; }
        public List<BasketSplitClause> ExistingClauses { get; set; }
    }

    public class BasketSplitClause
    {
        public long BasketID { get; set; }
        public short BasketClauseID { get; set; }
        public string BasketSplitID { get; set; }
        public string Clause { get; set; }
        public bool ReadOnly { get; set; }
    }

    public class OrderClause
    {
        public short ClauseID { get; set; }
        public string Name { get; set; }
        public string Clause { get; set; }
        public bool Mandatory { get; set; }
    }

    public class PassOrderClauses
    {
        public long BasketID { get; set; }
        public List<BasketSplitClause> Clauses { get; set; }
    }

    public class BasketItemMemoResult
    {
        public List<DocumentType> DocumentTypes { get; set; }
        public List<BasketItemLineMemoPass> LineMemos { get; set; }
        public List<BasketItemLineMemoDocumentType> DocumentTypeCodes { get; set; }
    }

    [Table("BasketItemLineMemo", Schema = "portal")]
    public class BasketItemLineMemo
    {
        [Key]
        [Column(Order = 1)]
        public long BasketItemID { get; set; }

        [Key]
        [Column(Order = 2)]
        public byte BasketItemLineMemoID { get; set; }

        [Key]
        [Column(Order = 3)]
        public byte LineMemoTypeID { get; set; }

        public string LineMemo { get; set; }

        [NotMapped]
        public string ProductCode
        {
            get
            {
                return BasketItem?.Product?.Code;
            }
        }

        [NotMapped]
        public long? ProductImageID
        {
            get
            {
                return BasketItem?.Product?.Product_Images.Where(p => p.PerspectiveID == 1).Select(p => p.ImageID).FirstOrDefault();
            }
        }

        [NotMapped]
        public string ProductName
        {
            get
            {
                return BasketItem?.Product?.BasketName;
            }
        }

        [NotMapped]
        public decimal? ProductQuantity
        {
            get
            {
                return BasketItem?.Quantity;
            }
        }

        [JsonIgnore]
        [ForeignKey("BasketItemID")]
        public virtual BasketItem BasketItem { get; set; }

        [ForeignKey("BasketItemLineMemoID")]
        public virtual LineMemoType LineMemoType { get; set; }
    }

    [Table("LineMemoType", Schema = "portal")]
    public class LineMemoType
    {
        [Key]
        public byte LineMemoTypeID { get; set; }
        public string Name { get; set; }
        public bool ReadOnly { get; set; }
        public byte SortOrder { get; set; }
        public bool AlertOperator { get; set; }

        [JsonIgnore]
        [InverseProperty("LineMemoType")]
        public virtual ICollection<BasketItemLineMemo> BasketItemLineMemos { get; set; }
    }

    [NotMapped]
    public class BasketItemLineMemoPass : BasketItemLineMemo
    {
        public bool ReadOnly { get; set; }
    }

    [NotMapped]
    public class PassBasketItemLineMemo : BasketItemLineMemo
    {
        public List<string> SelectedDocumentTypes { get; set; }
    }

    public class BasketItemLineMemoDocumentType
    {
        public byte BasketItemLineMemoID { get; set; }
        public byte LineMemoTypeID { get; set; }
        public string DocumentTypeCode { get; set; }
    }

    public class PassBasketItemMemoSave
    {
        public long BasketItemID { get; set; }
        public List<PassBasketItemLineMemo> LineMemos { get; set; }
    }

    public class BasketCommentResult
    {
        public List<DocumentType> DocumentTypes { get; set; }
        public List<BasketComment> Comments { get; set; }
        public List<BasketCommentDocumentType> DocumentTypeCodes { get; set; }
    }

    public class BasketComment
    {
        public long BasketID { get; set; }
        public short BasketCommentID { get; set; }
        public string BasketSplitID { get; set; }
        public byte BasketCommentTypeID { get; set; }
        public string Comment { get; set; }
        public bool ReadOnly { get; set; }
    }

    public class PassBasketComment : BasketComment
    {
        public List<string> SelectedDocumentTypes { get; set; }
    }

    public class BasketCommentDocumentType
    {
        public long BasketID { get; set; }
        public short BasketCommentID { get; set; }
        public string BasketSplitID { get; set; }
        public byte BasketCommentTypeID { get; set; }
        public string DocumentTypeCode { get; set; }
    }

    public class PassBasketCommentSave
    {
        public long BasketID { get; set; }

        public byte BasketCommentTypeID
        {
            get
            {
                return 1;
            }
        }

        public bool ReadOnly
        {
            get
            {
                return false;
            }
        }

        public List<PassBasketComment> Comments { get; set; }
    }

    public class BasketNoteResult
    {
        public List<BasketNote> Notes { get; set; }
    }

    public class BasketNote
    {
        public long BasketID { get; set; }
        public short BasketNoteID { get; set; }
        public byte BasketNoteTypeID { get; set; }
        public string BasketSplitID { get; set; }
        public string Note { get; set; }
        public bool ReadOnly { get; set; }
    }

    public class PassBasketNoteSave
    {
        public long BasketID { get; set; }
        public List<BasketNote> Notes { get; set; }
    }

    public class ProductTreatment
    {
        public byte TreatmentOptionID { get; set; }
        public string Name { get; set; }
    }

    public class PassBasketItemTreatmentSave
    {
        public long BasketItemID { get; set; }
        public byte? TreatmentProviderID { get; set; }
        public List<int> BasketItemTreatments { get; set; }
        public bool ExpressTreatment { get; set; }
    }

    public class TreatmentSave
    {
        public byte TreatmentID { get; set; }
        public byte TreatmentProviderID { get; set; }
        public byte TreatmentTypeID { get; set; }
    }

    public class SizeOption
    {
        public byte SizeID { get; set; }
        public string Name { get; set; }
        public byte SortOrder { get; set; }
    }

    [Table("AdvertisingImage", Schema = "portal")]
    public class AdvertisingImage
    {
        [Key]
        public int AdvertisingImageID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ThumbnailFilename { get; set; }
        public string UniqueThumbnailFilename { get; set; }
        public string WebQualityFilename { get; set; }
        public string UniqueWebQualityFilename { get; set; }
        public string PrintQualityFilename { get; set; }
        public string UniquePrintQualityFilename { get; set; }
        public int SortOrder { get; set; }
        public DateTime? OnDate { get; set; }
        public DateTime? OffDate { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        public bool Deleted { get; set; }
    }

    public class AdvertisingImageResult
    {
        public List<AdvertisingImage_Select> Images { get; set; }
        public int ResultCount { get; set; }
    }

    public class AdvertisingImage_Select
    {
        public int AdvertisingImageID { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string ThumbnailFilename { get; set; }

        public string UniqueThumbnailFilename { get; set; }

        public string WebQualityFilename { get; set; }

        public string UniqueWebQualityFilename { get; set; }

        public string UniquePrintQualityFilename { get; set; }
    }

    public class DownloadBasketSummaryResponse
    {
        public List<DownloadProductFilterCount> BasketContents { get; set; }

        public DownloadBasketSummaryResponse()
        {
            BasketContents = new List<DownloadProductFilterCount>();
        }
    }

    public class DownloadProductFilterCount
    {
        public string ProductFilter { get; set; }
        public int BasketCount { get; set; }
    }

    public class PassNewBasketPreamble
    {
        public int TradeAccountID { get; set; }
        public int MemberID { get; set; }
    }

    public class BasketPreambleParameters
    {
        public byte? PaymentTermsID { get; set; }
        public string PaymentTermsName { get; set; }
        public bool AllowAllocation { get; set; }
        public short? SalesRepresentativeID { get; set; }
        public string SalesRepresentativeName { get; set; }
        public string OrderTakerCode { get; set; }
        public string OrderTakerName { get; set; }
        public string OrderReference { get; set; }
    }

    public class BasketParametersResult
    {
        public List<PatternBookSchemeResult> PatternBookSchemes { get; set; }
        public BasketDetail BasketDetails { get; set; }
    }

    public class BasketDetail
    {
        public bool USTaxExemptionCertificateRequired { get; set; }
        public string USTaxExemptionCertificate { get; set; }
        public bool PurchaseOrderNumberRequired { get; set; }
        public byte AllowEUExitCode { get; set; } // 0 = Hide EU Exit Details, 1 = Allow Exit Code, 2 = Delivering into EU but Exit Code forbidden on account
        public bool? EUExitingConfirmed { get; set; }
        public string VATCountryCode { get; set; }
        public string VATNumber { get; set; }
    }

    public class PatternBookSchemeResult
    {
        public int PatternBookSchemeID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public DateTime? StartDate { get; set; }
        public decimal? Charge { get; set; }
        public decimal? PaidToDate { get; set; }

        public string Label
        {
            get
            {
                return $"{Code} - {Name}{(StartDate.HasValue ? $" ({StartDate.Value.ToString("dd/MM/yyyy")})" : "")}";
            }
        }
    }

    public class PassBasketParameters
    {
        public int BasketID { get; set; }
        public string OrderReference { get; set; }
        public string Email { get; set; }
        public string OrderTaker { get; set; }
        public byte PaymentTermsID { get; set; }
        public short SalesRepresentativeID { get; set; }
        public short? SalesAgentID { get; set; }
        public byte TransactionTypeID { get; set; }
        public string RaisedAsResultOfClaim { get; set; }
        public string HaulierAccountShipping { get; set; }
        public string HaulierAccountDuty { get; set; }
        public bool AllocateProforma { get; set; }
        public bool FullDespatch { get; set; }
        public bool HeldForSales { get; set; }
        public string HeldForSalesReasonCode { get; set; }
        public bool ContractOrder { get; set; }
        public string USTaxExemptionCertificate { get; set; }
        public string VATCountryCode { get; set; }
        public string VATNumber { get; set; }
        public bool? ValidVATNumber { get; set; }
        public string EORINumber { get; set; }
        public string ReplacementOrderComment { get; set; }
        public byte CallTypeID { get; set; }
        public string CallerName { get; set; }
        public string VIESConsultationNumber { get; set; }
    }

    public class PassBasketEUExitParameters
    {
        public int BasketID { get; set; }
        public string EUExitCode { get; set; }
        public bool EUExitingConfirmed { get; set; }
        public PassMiscellaneousInvoiceAddress Address { get; set; }
    }

    public class PassBespokeAutocomplete
    {
        public string term { get; set; }
        public byte? productGroupId { get; set; }
        public short? itemTypeId { get; set; }
        public int tradeAccountId { get; set; }
    }

    public class GBEORIResult
    {
        public string eori { get; set; }
        public bool valid { get; set; }
        public GBEORICompanyDetail companyDetails { get; set; }
        public string name
        {
            get
            {
                return companyDetails?.name;
            }
            set
            {

            }
        }
    }

    public class GBEORICompanyDetail
    {
        [JsonProperty("traderName")]
        public string name { get; set; }
    }

    public class PassDeliveryServiceOptions
    {
        public int BasketID { get; set; }
        public string BasketSplitID { get; set; }
    }

    public class DeliveryServicesRefreshResult
    {
        public List<DeliveryServiceResult> DeliveryServices { get; set; }
    }

    public class PassCustomerTransportAccountNumber
    {
        public int BasketID { get; set; }
        public string BasketSplitID { get; set; }
        public string CustomerTransportAccountNumber { get; set; }
    }

    public class SaveCustomerTransportAccountNumberReturn
    {
        public int Result { get; set; }
    }

    public class PassSaveBasketReason
    {
        public int BasketID { get; set; }
        public short? SavedBasketReasonID { get; set; }
    }

    public class BasketReviewResult
    {
        public List<BasketSummaryNotice> SummaryNotices { get; set; }
        public List<BasketItemNotice> BasketItemNotices { get; set; }
        public List<SalesManager> SalesManagers { get; set; }
        public List<DeliveryServiceResult> DeliveryServiceUpdates { get; set; }
        public DatabaseJSONResult Notifications { get; set; }
    }

    public class PassBasketReviewSave
    {
        public long BasketID { get; set; }
        public int? DiscountApprovedByManagerMemberID { get; set; }
        public bool? DuplicateLineAcknowledgement { get; set; }
        public string DiscountManagerMessage { get; set; }
        public string HeldForSalesReasonCode { get; set; }
        public bool? Halt { get; set; }
        public string HeldForSalesAdditionalInformation { get; set; }
    }

    public class BasketSummaryNotice
    {
        public byte CheckStageID { get; set; }
        public string OperatorNotice { get; set; }
    }

    public class BasketItemNotice : BasketSummaryNotice
    {
        public short? RowNumber { get; set; }
        public long? BasketItemID { get; set; }
        public long? SortOrder { get; set; }
        public int? TradePromotionCodeID { get; set; }
    }

    public class SalesManager
    {
        public int MemberID { get; set; }
        public string Label { get; set; }
        public string Email { get; set; }
    }

    public class BasketItemPreAllocationSelectResult
    {
        public List<BasketItemPreAllocationInfo> PreAllocations { get; set; }
    }

    public class BasketItemPreAllocationInfo
    {
        public long BasketPreAllocationID { get; set; }
        public Guid PreAllocationCode { get; set; }
        public decimal Quantity { get; set; }
        public string Batch { get; set; }
        public string Piece { get; set; }
    }

    [Table("Treatment", Schema = "portal")]
    public class Treatment
    {
        [Key]
        public byte TreatmentID { get; set; }
        public string Name { get; set; }
        public byte SortOrder { get; set; }
        public byte TreatmentTypeID { get; set; }
        public byte ProductFilterGroupID { get; set; }
        public byte TreatmentProviderID { get; set; }
        public int ProductID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public string Description { get; set; }

        [ForeignKey("ProductID")]
        public virtual Product Product { get; set; }

        [ForeignKey("TreatmentTypeID")]
        public virtual TreatmentType TreatmentType { get; set; }

        [ForeignKey("ProductFilterGroupID")]
        public virtual ProductFilterGroup ProductFilterGroup { get; set; }

        [JsonIgnore]
        [ForeignKey("TreatmentProviderID")]
        public virtual TreatmentProvider TreatmentProvider { get; set; }

        [JsonIgnore]
        [InverseProperty("Treatment")]
        public virtual ICollection<Treatment_Quality> Qualities { get; set; }

        [InverseProperty("Treatment")]
        public virtual ICollection<Treatment_Country> Countries { get; set; }

        public string AutocompleteLabel
        {
            get
            {
                return $"{TreatmentProvider.Name} - {TreatmentType.Name} - {Name}";
            }
        }

        [NotMapped]
        public string TreatmentName
        {
            get
            {
                return Name;
            }
            set
            {

            }
        }
    }

    [Table("Treatment_Country", Schema = "portal")]
    public class Treatment_Country
    {
        [Key]
        [Column(Order = 1)]
        public byte TreatmentID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short CountryID { get; set; }

        [JsonIgnore]
        [ForeignKey("TreatmentID")]
        public virtual Treatment Treatment { get; set; }

        [ForeignKey("CountryID")]
        public virtual Country Country { get; set; }
    }

    [Table("Treatment_Quality", Schema = "portal")]
    public class Treatment_Quality
    {
        [Key]
        [Column(Order = 1)]
        public byte TreatmentID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short QualityID { get; set; }

        public byte TreatmentStatusID { get; set; }

        public string Note { get; set; }

        [ForeignKey("TreatmentID")]
        public virtual Treatment Treatment { get; set; }

        [ForeignKey("TreatmentStatusID")]
        public virtual TreatmentStatus TreatmentStatus { get; set; }

        [ForeignKey("QualityID")]
        public virtual Quality Quality { get; set; }
    }

    [Table("TreatmentStatus", Schema = "portal")]
    public class TreatmentStatus
    {
        [Key]
        public byte TreatmentStatusID { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public string ShortName { get; set; }
        public byte SortOrder { get; set; }

        [JsonIgnore]
        [InverseProperty("TreatmentStatus")]
        public virtual ICollection<Treatment_Quality> TreatmentQualityRecords { get; set; }
    }

    [Table("TreatmentType", Schema = "portal")]
    public class TreatmentType
    {
        [Key]
        public byte TreatmentTypeID { get; set; }
        public string Name { get; set; }
        public byte SortOrder { get; set; }

        [JsonIgnore]
        [InverseProperty("TreatmentType")]
        public virtual ICollection<Treatment> Treatments { get; set; }
    }

    [Table("TreatmentProvider", Schema = "portal")]
    public class TreatmentProvider
    {
        [Key]
        public byte TreatmentProviderID { get; set; }
        public string Name { get; set; }
        public byte SortOrder { get; set; }
        public string DeliveryName { get; set; }
        public string DeliveryCompanyName { get; set; }
        public string DeliveryAddressLine1 { get; set; }
        public string DeliveryAddressLine2 { get; set; }
        public string DeliveryTown { get; set; }
        public string DeliveryCounty { get; set; }
        public string DeliveryPostcode { get; set; }
        public short? DeliveryCountryID { get; set; }
        public string DeliveryPhoneNumber { get; set; }
        public byte StandardLeadTimeDays { get; set; }
        public byte ExpressLeadTimeDays { get; set; }
        public int? ExpressProductID { get; set; }
        public int? MinimumChargeProductID { get; set; }

        [InverseProperty("TreatmentProvider")]
        public virtual ICollection<Treatment> Treatments { get; set; }

        [NotMapped]
        public string TreatmentProviderName
        {
            get
            {
                return Name;
            }
            set
            {

            }
        }
    }

    public class DeliveryGroupBulkDiscountResult
    {
        public List<DeliveryGroupBulkDiscountProductResult> Products { get; set; }
    }

    public class DeliveryGroupBulkDiscountProductResult
    {
        public long BasketItemID { get; set; }
        public string ProductName { get; set; }
        public decimal Quantity { get; set; }
        public bool BulkDiscountDenied { get; set; }
        public string BulkDiscountDeniedReason { get; set; }
    }

    [Table("StockLocation", Schema = "portal")]
    public class StockLocation
    {
        [Key]
        public short StockLocationID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }

        [JsonIgnore]
        public virtual ICollection<RingFencePreAllocation> RingFencePreAllocations { get; set; }

        [JsonIgnore]
        [InverseProperty("StockLocation")]
        public virtual ICollection<BranchStockLocation> BranchStockLocations { get; set; }

        [JsonIgnore]
        [InverseProperty("WarehouseStockLocation")]
        public virtual ICollection<BranchStockLocation> WarehouseStockLocations { get; set; }
    }

    [Table("RingFencePreAllocation", Schema = "portal")]
    public class RingFencePreAllocation
    {
        [Key]
        public long RingFencePreAllocationID { get; set; }

        public int? TradeAccountID { get; set; }

        public int? TradeAccountGroupID { get; set; }

        public Guid PreAllocationCode { get; set; }

        public int ProductID { get; set; }

        public decimal InitialQuantity { get; set; }

        public decimal CurrentQuantity { get; set; }

        public short StockLocationID { get; set; }

        public string Batch { get; set; }

        public string Piece { get; set; }

        public DateTime ExpiryDT { get; set; }

        public DateTime CreatedDT { get; set; }

        public int CreatedMemberID { get; set; }

        public DateTime ModifiedDT { get; set; }

        public int ModifiedMemberID { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        //[AutoExpand]
        [ForeignKey("TradeAccountID")]
        public virtual TradeAccount TradeAccount { get; set; }

        //[AutoExpand]
        [ForeignKey("TradeAccountGroupID")]
        public virtual TradeAccountGroup TradeAccountGroup { get; set; }

        //[AutoExpand]
        [ForeignKey("ProductID")]
        public virtual Product Product { get; set; }

        //[AutoExpand]
        [ForeignKey("StockLocationID")]
        public virtual StockLocation StockLocation { get; set; }

        //[AutoExpand]
        [ForeignKey("CreatedMemberID")]
        public virtual Member CreatedMember { get; set; }

        //[AutoExpand]
        [ForeignKey("ModifiedMemberID")]
        public virtual Member ModifiedMember { get; set; }

        //[AutoExpand]
        [ForeignKey("RingFencePreAllocationID")]
        public virtual ICollection<BasketPreAllocation> BasketPreAllocations { get; set; }
    }

    public class PassFurnitureThing
    {
        public long? basketItemId { get; set; }
    }

    public class PassFurnitureDesign : PassFurnitureThing
    {
        public short designId { get; set; }
    }

    public class PassFurnitureModel : PassFurnitureThing
    {
        public int modelId { get; set; }
    }

    public class PassFurnitureSupplier : PassFurnitureThing
    {
        public int modelId { get; set; }
        public short supplierId { get; set; }
        public bool additionalCover { get; set; }
        public string furnitureDeliveryTo { get; set; }
    }

    public class FurnitureDesign
    {
        public short designId { get; set; }
        public string name { get; set; }
        public bool permitMixedFabric { get; set; }
    }

    public class FetchFurnitureDesignResult
    {
        public List<FurnitureDesign> designs { get; set; }
    }

    public class FurnitureModel
    {
        public int modelId { get; set; }
        public string name { get; set; }
    }

    public class FetchFurnitureModelResult
    {
        public List<FurnitureModel> models { get; set; }
    }

    public class FurnitureSupplier
    {
        public short supplierId { get; set; }
        public string name { get; set; }
    }

    public class FetchFurnitureSupplierResult
    {
        public List<FurnitureSupplier> suppliers { get; set; }
    }

    public class FurnitureMaterial
    {
        public short? ComponentID { get; set; }
        public string Component { get; set; }
        public short ComponentSortOrder { get; set; }
        public string ComponentGroup { get; set; }
        public byte ComponentGroupID { get; set; }
        public short MaterialGroupID { get; set; }
        public string MaterialGroup { get; set; }
        public short MaterialGroupSortOrder { get; set; }
        public string QuantityRequired { get; set; }
    }

    public class FurnitureMaterialBreakdownResult
    {
        public List<FurnitureMaterial> results { get; set; }
    }

    public class PassFurnitureJSON
    {
        public long basketItemId { get; set; }
        public decimal advancedOrderStepId { get; set; }
        public string json { get; set; }
        public short supplierId { get; set; }
        public string destinationId { get; set; }
    }

    public class PassFurnitureSearch
    {
        public long basketItemId { get; set; }
        public int modelId { get; set; }
        public short supplierId { get; set; }
        public short? componentId { get; set; }
        public string materialTypeId { get; set; }
        public string searchString { get; set; }
        public float? customersOwnWidth { get; set; }
        public float? customersOwnPatternRepeat { get; set; }
        public bool additionalCover { get; set; }
    }

    public class FurnitureMaterialSearchResult
    {
        public int? ProductID { get; set; }
        public long? ImageID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public double? Width { get; set; }
        public double? VerticalPatternRepeat { get; set; }
        public bool? WideWidth { get; set; }
        public decimal? QuantityRequired { get; set; }
        public string UpholsteryGrade { get; set; }
        public bool Available { get; set; }
        public string UnavailableMessage { get; set; }
        public short? RecommendedStitchColourID { get; set; }
    }

    public class MaterialGroup
    {
        public int? ProductID { get; set; }
        public long? ImageID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public float? Width { get; set; }
        public float? VerticalPatternRepeat { get; set; }
        public bool? WideWidth { get; set; }
        public string UpholsteryGrade { get; set; }
        public short MaterialGroupID { get; set; }
        public decimal QuantityRequired { get; set; }
    }

    public class BespokeFurnitureMaterialSearchResult
    {
        public List<FurnitureMaterialSearchResult> results { get; set; }
    }

    public class PassBasketRetailParameters
    {
        public long basketId { get; set; }
        public string retailTillNumber { get; set; }
        public string retailSessionNumber { get; set; }
        public List<BasketSplitRetailPayment> retailPayments { get; set; }
    }

    public class BasketSplitRetailPayment
    {
        public string basketSplitId { get; set; }
        public List<RetailPaymentEntry> payments { get; set; }
    }

    public class RetailPaymentEntry
    {
        public string paymentTypeId { get; set; }
        public string paymentTypeName { get; set; }
        public decimal paymentAmount { get; set; }
        public string paymentReference { get; set; }
    }

    public class PassStockBatchPiece
    {
        public string productCode { get; set; }
        public string stockLocation { get; set; }
        public string enquiryType { get; set; }
    }

    public class DatabaseBatchPieceResult
    {
        public List<BatchPieceResult> Results { get; set; }
    }

    public class BatchPieceResult
    {
        public string Type { get; set; }
        public string ProductCode { get; set; }
        public string LocationCode { get; set; }
        public string Batch { get; set; }
        public string Piece { get; set; }
        public bool Pickable { get; set; }
        public string Rack { get; set; }
        public string RackType { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? OnReserve { get; set; }
        public DateTime? PODueDate { get; set; }
        public String PODueMessage { get; set; }
        public string POStatus { get; set; }
    }

    public class PassCreateRingFence
    {
        public int? tradeAccountId { get; set; }
        public int? tradeAccountGroupId { get; set; }
        public int productId { get; set; }
        public short stockLocationId { get; set; }
        public DateTime expiryDt { get; set; }
        public List<PassCreateRingFencePieceLength> pieces { get; set; }
    }

    public class PassCreateRingFencePieceLength
    {
        public decimal quantity { get; set; }
        public string piece { get; set; }
        public string batch { get; set; }
    }

    public class PassDeleteRingFence
    {
        public long ringFencePreAllocationId { get; set; }
    }

    [Table("Mertex_ProductType", Schema = "adm")]
    public class Mertex_ProductType
    {
        [Key]
        [Column(Order = 1)]
        public byte ProductGroupID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short ItemTypeID { get; set; }

        public string ProductGroupCode { get; set; }

        public string ItemTypeCode { get; set; }

        public byte? ProductTypeID { get; set; }

        public bool HasQuality { get; set; }

        public short? AttributeID { get; set; }

        [ForeignKey("ProductTypeID")]
        public virtual ProductType ProductType { get; set; }

        [ForeignKey("ItemTypeID")]
        public virtual ItemType ItemType { get; set; }

        [ForeignKey("ProductGroupID")]
        public virtual ProductGroup ProductGroup { get; set; }

        [NotMapped]
        public List<CodeDescriptionCount> Counts { get; set; }

        [NotMapped]
        public string Label
        {
            get
            {
                return $"{ProductType?.Name} (({ProductGroup?.Code}) {ProductGroup?.Name} - ({ItemType?.Code}) {ItemType?.Name})";
            }
        }

        [NotMapped]
        public string PseudoKey
        {
            get
            {
                return $"{ProductGroupID};{ItemTypeID}";
            }
        }
    }

    [Table("ProductType", Schema = "Maintenance")]
    public class MaintenanceProductType
    {
        [Key]
        public short ProductTypeID { get; set; }

        [MaxLength(50)]
        public string Name { get; set; }

        public string EditFormJSON { get; set; }
    }

    public class PassProductTypeCore
    {
        public short productTypeId { get; set; }
        public string name { get; set; }
    }

    public class PassProductTypeJson
    {
        public short productTypeId { get; set; }
        public string json { get; set; }
    }

    public class MaintenanceFieldSelectResult
    {
        public string SchemaName { get; set; }
        public string TableName { get; set; }
        public string ColumnName { get; set; }
        public string ColumnDescription { get; set; }
        public string DataType { get; set; }
        public byte? NumericPrecision { get; set; }
        public byte? NumericScale { get; set; }
        public byte? DateTimePrecision { get; set; }
        public int? MaximumCharacterLength { get; set; }
        public string Collation { get; set; }
        public string DataDefinition { get; set; }
        public bool IsNullable { get; set; }
        public bool IsPrimaryKey { get; set; }
        public bool IsIdentity { get; set; }
        public bool HasForeignKey { get; set; }
        public bool IsComputed { get; set; }
        public bool IsNumeric { get; set; }
        public string FK_ReferencedSchemaName { get; set; }
        public string FK_ReferencedTableName { get; set; }
        public string FK_ReferencedColumnName { get; set; }
        public string FieldLabel { get; set; }
        public string MertexFileName { get; set; }
        public string MertexFieldName { get; set; }
        public string MertexFieldIndex { get; set; }
    }

    public class MaintenanceFieldTableGroupingKey
    {
        public string SchemaName { get; set; }
        public string TableName { get; set; }
    }

    public class PassImageForm 
    { 
        public string Destination { get; set; }
    }

    public class FetchLinkedDocumentsResult
    {
        public List<LinkedDocument> LinkedDocuments { get; set; }

        public FetchLinkedDocumentsResult()
        {
            LinkedDocuments = new List<LinkedDocument>();
        }
    }

    public class LinkedDocument
    {
        public string Path { get; set; }
        public string Description { get; set; }

        [NotMapped]
        public string FileName
        {
            get
            {
                return Path.Substring(Path.LastIndexOf("\\") + 1);
            }
            set { }
        }
    }
}