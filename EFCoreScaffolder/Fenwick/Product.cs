using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.Fenwicks;

[Table("Product")]
[Index("ProductID", Name = "NonClusteredIndex-20210707-164324")]
[Index("Code", Name = "UC_Product_Code", IsUnique = true)]
[Index("Status", "BrandID", "ItemTypeID", Name = "idx_Price_Enquiry_SlicerValues_Cover")]
[Index("BasketName", Name = "idx_Product_BasketName")]
[Index("BrandID", "ItemTypeID", Name = "idx_Product_Brand_ItemTypeID_ProductTypeID")]
[Index("Deleted", "ProductFilterID", Name = "idx_Product_Deleted_ProductFilter")]
[Index("Deleted", "ProductPageID", Name = "idx_Product_Deleted_ProductPageID")]
[Index("Deleted", "SalesChannelID", Name = "idx_Product_Deleted_SalesChannelID")]
[Index("DesignID", "BrandID", "Deleted", Name = "idx_Product_DesignID_BrandID_Deleted_Plus2")]
[Index("Enabled", "Deleted", Name = "idx_Product_Enabled_Deleted")]
[Index("Enabled", "Deleted", "Status", Name = "idx_Product_Enabled_Deleted_Status")]
[Index("Enabled", "ProductPageID", Name = "idx_Product_Enabled_ProductPageID")]
[Index("ProductFilterID", "SalesChannelID", "ProductLifeCycleID", Name = "idx_Product_ProductFilterID_SalesChannelID_ProductLifeCycleID")]
[Index("ProductFilterID", Name = "idx_Product_ProductFilter_Plus35")]
[Index("ProductPageID", Name = "idx_Product_ProductPageID")]
[Index("ProductPageID", Name = "idx_Product_ProductPageID_Clearance")]
[Index("ProductTypeID", Name = "idx_Product_ProductType")]
[Index("ProductTypeID", Name = "idx_Product_ProductTypeID_BrandID_ProductGroupID")]
[Index("ProductTypeID", Name = "idx_Product_ProductTypeID_ItemTypeID")]
[Index("ProductTypeID", Name = "idx_Product_ProductTypeID_ProductID")]
[Index("ProductTypeID", "ProductGroupID", Name = "idx_Product_ProductType_ProductGroup_Code")]
[Index("QualityID", Name = "idx_Product_QualityID")]
[Index("RLPortalProduct", Name = "idx_Product_RLPortalProduct_Plus6")]
public partial class Product
{
    [Key]
    public int ProductID { get; set; }

    [StringLength(255)]
    public string? Description { get; set; }

    /// <summary>
    /// Mertex Product Code
    /// </summary>
    [StringLength(50)]
    public string Code { get; set; } = null!;

    [StringLength(100)]
    public string? Name { get; set; }

    [StringLength(1)]
    public string Status { get; set; } = null!;

    [Required]
    public bool? Enabled { get; set; }

    public int? DesignID { get; set; }

    public short LaunchID { get; set; }

    public byte ProductTypeID { get; set; }

    public byte BrandID { get; set; }

    public byte? OrderFormGroupID { get; set; }

    [StringLength(100)]
    public string OrderFormName { get; set; } = null!;

    [StringLength(100)]
    public string BasketName { get; set; } = null!;

    [Precision(2)]
    public DateTime CreatedDT { get; set; }

    [Precision(2)]
    public DateTime? ModifiedDT { get; set; }

    [Precision(2)]
    public DateTime? DeletedDT { get; set; }

    [Column(TypeName = "money")]
    public decimal? CostSterling { get; set; }

    public int? ProductPageID { get; set; }

    public byte SortOrder { get; set; }

    [StringLength(50)]
    public string? SizeMetric { get; set; }

    [StringLength(50)]
    public string? SizeImperial { get; set; }

    public short? QualityID { get; set; }

    [StringLength(2)]
    public string UKVATCode { get; set; } = null!;

    [StringLength(20)]
    public string? EAN { get; set; }

    public bool MadeToOrder { get; set; }

    public byte? ColourID { get; set; }

    public bool Clearance { get; set; }

    public int? SampleProductID { get; set; }

    public int? LargeSampleProductID { get; set; }

    public int? MerchandiserID { get; set; }

    [StringLength(5)]
    public string? MarketRestrictionCode { get; set; }

    [Column(TypeName = "decimal(3, 1)")]
    public decimal? RollLength { get; set; }

    [Column(TypeName = "decimal(3, 2)")]
    public decimal? RollWidth { get; set; }

    public short? ItemTypeID { get; set; }

    public byte? ProductGroupID { get; set; }

    public bool? Deleted { get; set; }

    public long? CommodityCode { get; set; }

    public long? Intrastat { get; set; }

    [StringLength(2)]
    public string? OriginCountry { get; set; }

    public bool? Bundle { get; set; }

    public bool Sample { get; set; }

    [Column(TypeName = "decimal(10, 3)")]
    public decimal? NetWeight { get; set; }

    public int? MasterSortOrder { get; set; }

    public int? ParentProductID { get; set; }

    public short? CarryForwardLaunchID { get; set; }

    [Column(TypeName = "decimal(6, 1)")]
    public decimal? MinimumOrderQuantity { get; set; }

    public byte? DeliveryGroupID { get; set; }

    public short? TradePromotionProductGroupID { get; set; }

    [Column(TypeName = "money")]
    public decimal? ClearanceDiscountPercentage { get; set; }

    public byte? ProductFilterID { get; set; }

    public short? LatestCollectionID { get; set; }

    public short? OriginalCollectionID { get; set; }

    public byte? SalesChannelID { get; set; }

    public byte? ProductLifeCycleID { get; set; }

    public byte? MartindaleID { get; set; }

    public bool? WideWidth { get; set; }

    public byte? PatternID { get; set; }

    public bool Velvet { get; set; }

    [StringLength(50)]
    public string? ExtraInfo { get; set; }

    public int? BespokeProductID { get; set; }

    public int? LinkedProductID { get; set; }

    public byte? SizeID { get; set; }

    public bool PieceLevel { get; set; }

    public byte StockUnitID { get; set; }

    public byte MaxFoldLength { get; set; }

    public bool AllocationPermitted { get; set; }

    [StringLength(1)]
    public string MaintainMinimumStockLevel { get; set; } = null!;

    public bool LaunchProduct { get; set; }

    [StringLength(50)]
    public string? SupplierPartNumber { get; set; }

    [StringLength(100)]
    public string? SearchName { get; set; }

    public int? BruProductID { get; set; }

    [StringLength(1)]
    public string? WideWidthFabricDefaultPoleWidth { get; set; }

    [StringLength(1)]
    public string? PickListGroup { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? MaxLengthPerPole { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? StockedLength { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? StockedWidth { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? StockedHeight { get; set; }

    [Column(TypeName = "money")]
    public decimal? DimensionalWeight { get; set; }

    [StringLength(50)]
    public string? StockCode { get; set; }

    [StringLength(1)]
    public string? UpholsteryGrade { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Width { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Length { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Height { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Diameter { get; set; }

    public bool IsSundry { get; set; }

    public bool IsService { get; set; }

    public bool FullDespatchOnly { get; set; }

    [StringLength(100)]
    public string? BuyerName { get; set; }

    [StringLength(254)]
    public string? BuyerEmail { get; set; }

    public int? DefaultSupplierID { get; set; }

    [StringLength(50)]
    public string? AKACode { get; set; }

    [StringLength(100)]
    public string? AKAName { get; set; }

    [StringLength(255)]
    public string? SearchKeywords { get; set; }

    public bool RLPortalProduct { get; set; }

    [StringLength(50)]
    public string? Colourway { get; set; }

    public byte DeliveryProductTypeID { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? PaintVolumeLitres { get; set; }

    public byte? PaintTinSizeID { get; set; }

    public byte? PaintFinishID { get; set; }

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    [InverseProperty("Product")]
    public virtual ICollection<Range> Ranges { get; set; } = new List<Range>();
}
