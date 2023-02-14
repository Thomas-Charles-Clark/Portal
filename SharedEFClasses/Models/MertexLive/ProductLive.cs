using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("Product", Schema = "Mertex")]
    public class ProductLive
    {
        [Key]
        public string Code { get; set; }

        public string StockCode { get; set; }

        public string Name { get; set; }

        public string Status { get; set; }

        public string GroupCode { get; set; }

        public string ItemType { get; set; }

        public string JLStockReference { get; set; }

        public string NewJLStockReference { get; set; }

        public string ManufacturersID { get; set; }

        public string EUExportCommodityCodeDescription { get; set; }

        public long? EUExportCommodityCode { get; set; }

        public long? USCommodityCode { get; set; }

        public string OriginCountry { get; set; }

        public decimal? LatestCostPrice { get; set; }

        public string DefaultSupplierCode { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public decimal? PurchasePrice { get; set; }

        public string RugSampleProductCode { get; set; }

        public string UpholsteryGrade { get; set; }

        public string DeliveryBand { get; set; }

        public byte? MaxFoldLength { get; set; }

        public decimal? Width { get; set; }

        public decimal? Length { get; set; }

        public decimal? Height { get; set; }

        public decimal? Diameter { get; set; }

        public string Size { get; set; }

        public string QualityCode { get; set; }

        public string FlamCode { get; set; }

        public int? Martindale { get; set; }

        public decimal? HorizontalPatternRepeat { get; set; }

        public decimal? VerticalPatternRepeat { get; set; }

        public string AdditionalInformation { get; set; }

        public short? PileHeightMM { get; set; }

        public string BrandCode { get; set; }

        [ForeignKey("FlamCode")]
        public virtual FlamCode FlamCodeObj { get; set; }

        public virtual ICollection<Product_Aftercare> AftercareCodes { get; set; }
    }
}
