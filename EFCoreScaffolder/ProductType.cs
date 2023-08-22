using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.ProductPage;

[Table("ProductType")]
public partial class ProductType
{
    [Key]
    [Column("ProductTypeID")]
    public byte ProductTypeId { get; set; }

    [StringLength(50)]
    public string Name { get; set; } = null!;

    public byte SortOrder { get; set; }

    [Column("CreatedDT")]
    [Precision(2)]
    public DateTime CreatedDt { get; set; }

    [Column("DeletedDT")]
    [Precision(2)]
    public DateTime? DeletedDt { get; set; }

    [Required]
    public bool? AlternateColourways { get; set; }

    [Required]
    public bool? GiftWrappable { get; set; }

    [Column("StockLocationID")]
    public byte StockLocationId { get; set; }

    [Required]
    public bool? AllowReturns { get; set; }

    public bool NonStockedItem { get; set; }

    public short MaxSkuOrderQuantity { get; set; }

    public short MaxTotalOrderQuantity { get; set; }

    [Column("TargetGM", TypeName = "decimal(3, 2)")]
    public decimal TargetGm { get; set; }

    public byte? TranslationLogic { get; set; }

    [StringLength(10)]
    public string? SampleCodeFormat { get; set; }

    [Required]
    public bool? AlternateColourwayIncludeSize { get; set; }

    [Required]
    public bool? ShowInSearchDropDown { get; set; }

    public short TradeMaxSkuOrderQuantity { get; set; }

    public short TradeMaxTotalOrderQuantity { get; set; }

    [Column("ProductTypeGroupID")]
    public byte ProductTypeGroupId { get; set; }

    [StringLength(100)]
    public string? SearchKeywords { get; set; }

    public bool? Deleted { get; set; }

    public byte DispatchGroup { get; set; }

    public bool DisplaySize { get; set; }

    [Column(TypeName = "decimal(6, 1)")]
    public decimal MinimumOrderQuantity { get; set; }

    [Column("DeliveryGroupID")]
    public byte DeliveryGroupId { get; set; }

    public bool AllowZeroRetailPrice { get; set; }

    public bool AllowZeroTradePrice { get; set; }

    [Column(TypeName = "decimal(3, 2)")]
    public decimal? GrossMarginTarget { get; set; }

    [Column(TypeName = "decimal(3, 2)")]
    public decimal? SaleGrossMarginTarget { get; set; }

    [Column("StockUnitID")]
    public byte StockUnitId { get; set; }

    [Required]
    public bool? AllowReserves { get; set; }

    [Column(TypeName = "decimal(7, 2)")]
    public decimal RetailQuantityMinimum { get; set; }

    [Column(TypeName = "decimal(7, 2)")]
    public decimal RetailQuantityMaximum { get; set; }

    [Column(TypeName = "decimal(7, 2)")]
    public decimal RetailQuantityIncrement { get; set; }

    [Column(TypeName = "decimal(7, 2)")]
    public decimal TradeQuantityMinimum { get; set; }

    [Column(TypeName = "decimal(7, 2)")]
    public decimal TradeQuantityMaximum { get; set; }

    [Column(TypeName = "decimal(7, 2)")]
    public decimal TradeQuantityIncrement { get; set; }

    [Column("CategoryPageID")]
    public int? CategoryPageId { get; set; }

    [Column("TemplateID")]
    public byte TemplateId { get; set; }

    public bool IsDeliveryProductType { get; set; }

    [Column("URLKeywords")]
    [StringLength(50)]
    public string? Urlkeywords { get; set; }

    [StringLength(50)]
    public string? NamePlural { get; set; }

    [Required]
    public bool? IsActualProductType { get; set; }

    [InverseProperty("ProductType")]
    public virtual ICollection<Collection> Collections { get; set; } = new List<Collection>();

    [InverseProperty("ProductType")]
    public virtual ICollection<ProductPage> ProductPages { get; set; } = new List<ProductPage>();
}
