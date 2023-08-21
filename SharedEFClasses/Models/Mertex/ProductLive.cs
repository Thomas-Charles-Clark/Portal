using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("Product", Schema = "Mertex")]
    public partial class ProductLive
    {
        [Key]
        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(50)]
        public string StockCode { get; set; }

        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(1)]
        public string Status { get; set; }

        [StringLength(10)]
        public string GroupCode { get; set; }

        [StringLength(10)]
        public string ItemType { get; set; }

        [Column("JLStockReference")]
        [StringLength(50)]
        public string JlstockReference { get; set; }

        [Column("NewJLStockReference")]
        [StringLength(50)]
        public string NewJlstockReference { get; set; }

        [Column("ManufacturersID")]
        [StringLength(50)]
        public string ManufacturersID { get; set; }

        [Column("EUExportCommodityCodeDescription")]
        [StringLength(100)]
        public string EuexportCommodityCodeDescription { get; set; }

        [Column("EUExportCommodityCode")]
        public long? EuexportCommodityCode { get; set; }

        [Column("USCommodityCode")]
        public long? UscommodityCode { get; set; }

        [StringLength(3)]
        public string OriginCountry { get; set; }

        [Column(TypeName = "money")]
        public decimal? LatestCostPrice { get; set; }

        [StringLength(50)]
        public string DefaultSupplierCode { get; set; }

        [Column("CreatedDT")]
        public DateTime CreatedDT { get; set; }

        [Column("ModifiedDT")]
        public DateTime ModifiedDT { get; set; }

        [Column("DeletedDT")]
        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        [Column(TypeName = "money")]
        public decimal? PurchasePrice { get; set; }

        [StringLength(50)]
        public string RugSampleProductCode { get; set; }

        [StringLength(1)]
        public string UpholsteryGrade { get; set; }

        [StringLength(10)]
        public string DeliveryBand { get; set; }

        public byte? MaxFoldLength { get; set; }

        [Column()]
        public decimal? Width { get; set; }

        [Column()]
        public decimal? Length { get; set; }

        [Column()]
        public decimal? Height { get; set; }

        [Column()]
        public decimal? Diameter { get; set; }

        [StringLength(50)]
        public string Size { get; set; }

        [StringLength(50)]
        public string QualityCode { get; set; }

        [StringLength(1)]
        public string FlamCode { get; set; }

        public int? Martindale { get; set; }

        [Column()]
        public decimal? HorizontalPatternRepeat { get; set; }

        [Column()]
        public decimal? VerticalPatternRepeat { get; set; }

        [StringLength(300)]
        public string AdditionalInformation { get; set; }

        [Column("PileHeightMM")]
        public short? PileHeightMm { get; set; }

        [StringLength(5)]
        public string BrandCode { get; set; }

        [StringLength(50)]
        public string ColourName { get; set; }

        [StringLength(50)]
        public string DesignName { get; set; }

        [Column("EAN")]
        [StringLength(20)]
        public string Ean { get; set; }

        [Column(TypeName = "date")]
        public DateTime? LaunchDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? CarryForwardDate { get; set; }

        [StringLength(50)]
        public string OrderFormGroup { get; set; }

        [StringLength(100)]
        public string PriceListDescription { get; set; }

        public string AdditionalProducts { get; set; }

        [Column(TypeName = "date")]
        public DateTime? LimitedDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? DiscontinuedDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? CurrentDate { get; set; }

        [Column("ProductID")]
        public int? ProductID { get; set; }

        public string ErrorDetails { get; set; }

        public bool? Error { get; set; }

        [StringLength(20)]
        public string ImportCommodityCode { get; set; }

        [StringLength(200)]
        public string PackagingDescription { get; set; }

        [ForeignKey("DefaultSupplierCode")]
        [InverseProperty("Products")]
        public virtual Supplier DefaultSupplierCodeNavigation { get; set; }
    }
}