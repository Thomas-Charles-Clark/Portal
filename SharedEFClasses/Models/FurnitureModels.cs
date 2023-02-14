using Newtonsoft.Json;
using SharedEFClasses.Models.Products;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public class PassFurnitureGridSearch
    {
        public string productCode { get; set; }
    }

    [Table("Component", Schema = "furniture")]
    public class FurnitureComponent
    {
        [Key]
        public short ComponentID { get; set; }
        public string Name { get; set; }
        public short SortOrder { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
        public byte StockUnitID { get; set; }

        [JsonIgnore]
        [InverseProperty("Component")]
        public virtual ICollection<FurnitureMaterialBreakdown> MaterialBreakdowns { get; set; }
    }

    [Table("CoverType", Schema = "furniture")]
    public class FurnitureCoverType
    {
        [Key]
        public byte CoverTypeID { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [InverseProperty("CoverType")]
        public virtual ICollection<FurnitureDesign_Supplier_CoverType> Designs { get; set; }
    }

    [Table("CushionFilling", Schema = "furniture")]
    public class FurnitureCushionFilling
    {
        [Key]
        public short CushionFillingID { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [InverseProperty("CushionFilling")]
        public virtual ICollection<FurnitureDesign_SeatCushionFilling> DesignWithSeats { get; set; }

        [JsonIgnore]
        [InverseProperty("CushionFilling")]
        public virtual ICollection<FurnitureDesign_BackCushionFilling> DesignWithBacks { get; set; }
    }

    [Table("Design", Schema = "furniture")]
    public class FurnitureDesign
    {
        [Key]
        public short DesignID { get; set; }

        public string Name { get; set; }

        public bool PermitMixedFabric { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [InverseProperty("Design")]
        public virtual ICollection<FurnitureDesign_SeatCushionFilling> SeatCushionFillings { get; set; }

        [InverseProperty("Design")]
        public virtual ICollection<FurnitureDesign_BackCushionFilling> BackCushionFillings { get; set; }

        [InverseProperty("Design")]
        public virtual ICollection<FurnitureDesign_LegType> LegTypes { get; set; }

        [InverseProperty("Design")]
        public virtual ICollection<FurnitureDesign_Supplier_CoverType> CoverTypes { get; set; }

        [JsonIgnore]
        [InverseProperty("Design")]
        public virtual ICollection<FurnitureModel> Models { get; set; }

        [InverseProperty("Design")]
        public virtual ICollection<FurnitureFabricRestriction> FabricRestrictions { get; set; }

        [InverseProperty("Design")]
        public virtual ICollection<FurnitureDesignStitchColourRestriction> StitchColourRestrictions { get; set; }
    }

    [Table("Design_CushionFilling", Schema = "furniture")]
    public class FurnitureDesign_SeatCushionFilling
    {
        [Key]
        [Column(Order = 1)]
        public short DesignID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short CushionFillingID { get; set; }

        [JsonIgnore]
        [ForeignKey("DesignID")]
        public virtual FurnitureDesign Design { get; set; }

        [JsonIgnore]
        [ForeignKey("CushionFillingID")]
        public virtual FurnitureCushionFilling CushionFilling { get; set; }
    }

    [Table("Design_BackCushionFilling", Schema = "furniture")]
    public class FurnitureDesign_BackCushionFilling
    {
        [Key]
        [Column(Order = 1)]
        public short DesignID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short CushionFillingID { get; set; }

        [JsonIgnore]
        [ForeignKey("DesignID")]
        public virtual FurnitureDesign Design { get; set; }

        [JsonIgnore]
        [ForeignKey("CushionFillingID")]
        public virtual FurnitureCushionFilling CushionFilling { get; set; }
    }

    [Table("Design_LegType", Schema = "furniture")]
    public class FurnitureDesign_LegType
    {
        [Key]
        [Column(Order = 1)]
        public short DesignID { get; set; }

        [Key]
        [Column(Order = 2)]
        public byte LegTypeID { get; set; }

        [JsonIgnore]
        [ForeignKey("DesignID")]
        public virtual FurnitureDesign Design { get; set; }

        [JsonIgnore]
        [ForeignKey("LegTypeID")]
        public virtual FurnitureLegType LegType { get; set; }
    }

    [Table("Design_Supplier_CoverType", Schema = "furniture")]
    public class FurnitureDesign_Supplier_CoverType
    {
        [Key]
        [Column(Order = 1)]
        public short DesignID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short SupplierID { get; set; }

        [Key]
        [Column(Order = 3)]
        public byte CoverTypeID { get; set; }

        [JsonIgnore]
        [ForeignKey("DesignID")]
        public virtual FurnitureDesign Design { get; set; }

        [JsonIgnore]
        [ForeignKey("SupplierID")]
        public virtual FurnitureSupplier Supplier { get; set; }

        [JsonIgnore]
        [ForeignKey("CoverTypeID")]
        public virtual FurnitureCoverType CoverType { get; set; }
    }

    [Table("FabricPricePoint", Schema = "furniture")]
    public class FurnitureFabricPricePoint
    {
        [Key]
        public string Code { get; set; }
        public string Note { get; set; }
        public byte PricingSortCheapestToMostExpensive { get; set; }
    }

    [Table("LeatherColour", Schema = "furniture")]
    public class FurnitureLeatherColour
    {
        [Key]
        public short LeatherColourID { get; set; }
        public string Name { get; set; }
        public byte LeatherRangeID { get; set; }
        public string ProductCode { get; set; }
        public string SupplierCode { get; set; }
        public long? ImageID { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
        public int? ProductID { get; set; }

        [ForeignKey("LeatherRangeID")]
        public virtual FurnitureLeatherRange LeatherRange { get; set; }
    }

    [Table("LeatherRange", Schema = "furniture")]
    public class FurnitureLeatherRange
    {
        [Key]
        public byte LeatherRangeID { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [InverseProperty("LeatherRange")]
        public virtual ICollection<FurnitureLeatherColour> LeatherColours { get; set; }
    }

    [Table("Leg", Schema = "furniture")]
    public class FurnitureLeg
    {
        [Key]
        public short LegID { get; set; }
        public string Name { get; set; }
        public byte LegTypeID { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
    }

    [Table("LegType", Schema = "furniture")]
    public class FurnitureLegType
    {
        [Key]
        public byte LegTypeID { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [InverseProperty("LegType")]
        public virtual ICollection<FurnitureDesign_LegType> Designs { get; set; }
    }

    [Table("MaterialBreakdown", Schema = "furniture")]
    public class FurnitureMaterialBreakdown
    {
        [Key]
        [Column(Order = 1)]
        public int ModelID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short SupplierID { get; set; }

        [Key]
        [Column(Order = 3)]
        public short ComponentID { get; set; }

        [Key]
        [Column(Order = 4)]
        public short MaterialGroupID { get; set; }

        public decimal Quantity { get; set; }

        [JsonIgnore]
        [ForeignKey("ModelID")]
        public virtual FurnitureModel Model { get; set; }

        [JsonIgnore]
        [ForeignKey("SupplierID")]
        public virtual FurnitureSupplier Supplier { get; set; }

        [JsonIgnore]
        [ForeignKey("ComponentID")]
        public virtual FurnitureComponent Component { get; set; }

        [JsonIgnore]
        [ForeignKey("MaterialGroupID")]
        public virtual FurnitureMaterialGroup MaterialGroup { get; set; }
    }

    [Table("MaterialGroup", Schema = "furniture")]
    public class FurnitureMaterialGroup
    {
        [Key]
        public short MaterialGroupID { get; set; }
        public string Name { get; set; }
        public short SortOrder { get; set; }
        public decimal PlainMultiplier { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [InverseProperty("MaterialGroup")]
        public virtual ICollection<FurnitureMaterialBreakdown> MaterialBreakdowns { get; set; }
    }

    [Table("MixedFabricPricePoint", Schema = "furniture")]
    public class FurnitureMixedFabricPricePoint
    {
        [Key]
        [Column(Order = 1)]
        public string Code1 { get; set; }

        [Key]
        [Column(Order = 2)]
        public string Code2 { get; set; }

        public string ResultantCode { get; set; }
    }

    [Table("Model", Schema = "furniture")]
    public class FurnitureModel
    {
        [Key]
        public int ModelID { get; set; }
        public string Code { get; set; }
        public short DesignID { get; set; }
        public short SeatTypeID { get; set; }
        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public decimal Depth { get; set; }
        public decimal SeatHeight { get; set; }
        public decimal SeatDepth { get; set; }
        public byte SeatCount { get; set; }
        public byte SeatCushionCount { get; set; }
        public byte BackCushionCount { get; set; }
        public bool Interline { get; set; }
        public bool Button { get; set; }
        public bool Trim { get; set; }
        public bool Stiching { get; set; }
        public bool LeatherAvailable { get; set; }
        public bool LegsRemovable { get; set; }
        public string LegNotes { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
        public long? ImageID { get; set; }
        public bool Discontinued { get; set; }
        public bool WoodenArms { get; set; }
        public string Comments { get; set; }

        public bool PermitAdditionalCover { get; set; }

        [InverseProperty("Model")]
        public virtual ICollection<FurnitureMaterialBreakdown> MaterialBreakdowns { get; set; }

        [ForeignKey("DesignID")]
        public virtual FurnitureDesign Design { get; set; }

        [ForeignKey("SeatTypeID")]
        public virtual FurnitureSeatType SeatType { get; set; }

        [NotMapped]
        public string Label
        {
            get
            {
                return $"{Code} - {Design.Name} - {SeatType.Name}";
            }
        }
    }

    [Table("SeatType", Schema = "furniture")]
    public class FurnitureSeatType
    {
        [Key]
        public short SeatTypeID { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [InverseProperty("SeatType")]
        public virtual ICollection<FurnitureModel> Models { get; set; }
    }

    [Table("StitchColour", Schema = "furniture")]
    public class FurnitureStitchColour
    {
        [Key]
        public short StitchColourID { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [InverseProperty("StitchColour")]
        public virtual ICollection<FurnitureFabricRestriction> DefaultStitchFor { get; set; }

        [JsonIgnore]
        [InverseProperty("StitchColour")]
        public virtual ICollection<FurnitureDesignStitchColourRestriction> DesignStitchColourRestrictions { get; set; }
    }

    [Table("Supplier", Schema = "furniture")]
    public class FurnitureSupplier
    {
        [Key]
        public short SupplierID { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [NotMapped]
        public string FurnitureSupplierName
        {
            get
            {
                return Name;
            }
            set { }
        }

        [JsonIgnore]
        [InverseProperty("Supplier")]
        public virtual ICollection<FurnitureMaterialBreakdown> MaterialBreakdowns { get; set; }

        [JsonIgnore]
        [InverseProperty("Supplier")]
        public virtual ICollection<FurnitureDesign_Supplier_CoverType> CoverTypes { get; set; }
    }


    [Table("FabricRestriction", Schema = "furniture")]
    public class FurnitureFabricRestriction
    {
        [Key]
        [Column(Order = 1)]
        public short DesignID { get; set; }

        [Key]
        [Column(Order = 2)]
        public int ProductID { get; set; }

        public short? StitchColourID { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual FurnitureDesign Design { get; set; }

        [JsonIgnore]
        public virtual Product Product { get; set; }

        [NotMapped]
        public string Name
        {
            get
            {
                return Product.BasketName;
            }
            set
            {

            }
        }

        [NotMapped]
        public string Code
        {
            get
            {
                return Product.Code;
            }
            set
            {

            }
        }

        [NotMapped]
        public long? ImageID
        {
            get
            {
                return Product.ImageID;
            }
            set
            {

            }
        }

        public virtual FurnitureStitchColour StitchColour { get; set; }
    }

    public class PassFurnitureModelID
    {
        public int modelId { get; set; }
    }

    public class PassFurnitureMaterialBreakdown
    {
        public int modelId { get; set; }
        public short designId { get; set; }
        public decimal width { get; set; }
        public decimal height { get; set; }
        public decimal depth { get; set; }
        public decimal seatHeight { get; set; }
        public decimal seatDepth { get; set; }
        public byte seatCount { get; set; }
        public byte seatCushionCount { get; set; }
        public byte backCushionCount { get; set; }
        public bool interline { get; set; }
        public bool button { get; set; }
        public bool trim { get; set; }
        public bool stitching { get; set; }
        public bool leatherAvailable { get; set; }
        public bool legsRemovable { get; set; }
        public string legNotes { get; set; }
        public long? imageId { get; set; }
        public bool discontinued { get; set; }
        public bool permitAdditionalCover { get; set; }
        public bool woodenArms { get; set; }
        public string comments { get; set; }
        public List<PassDesignCushionFillingRecord> designSeatCushionFillingIds { get; set; }
        public List<PassDesignCushionFillingRecord> designBackCushionFillingIds { get; set; }
        public List<PassDesignSupplierCoverTypeRecord> designSupplierCoverTypeIds { get; set; }
        public List<PassDesignLegTypeRecord> designLegTypeIds { get; set; }
        public bool designPermitMixedFabric { get; set; }
        public List<PassDesignFabricRestriction> designFabricRestrictions { get; set; }
        public List<PassDesignStitchColourRestriction> designStitchColourRestrictions { get; set; }
        public List<PassFurnitureMaterialBreakdownRecord> records { get; set; }

        public PassFurnitureMaterialBreakdown()
        {
            designSeatCushionFillingIds = new List<PassDesignCushionFillingRecord>();
            designBackCushionFillingIds = new List<PassDesignCushionFillingRecord>();
            designSupplierCoverTypeIds = new List<PassDesignSupplierCoverTypeRecord>();
            designLegTypeIds = new List<PassDesignLegTypeRecord>();
            designFabricRestrictions = new List<PassDesignFabricRestriction>();
            designStitchColourRestrictions = new List<PassDesignStitchColourRestriction>();
            records = new List<PassFurnitureMaterialBreakdownRecord>();
        }
    }

    public class PassDesignStitchColourRestriction
    {
        public short stitchColourId { get; set; }
    }

    public class PassDesignFabricRestriction
    {
        public int productId { get; set; }
    }

    public class PassFurnitureMaterialBreakdownRecord
    {
        public short SupplierID { get; set; }
        public short ComponentID { get; set; }
        public short MaterialGroupID { get; set; }
        public decimal Quantity { get; set; }
    }

    public class PassDesignCushionFillingRecord
    {
        public short cushionFillingId { get; set; }
    }

    public class PassDesignSupplierCoverTypeRecord
    {
        public short supplierId { get; set; }
        public short coverTypeId { get; set; }
    }

    public class PassDesignLegTypeRecord
    {
        public byte legTypeId { get; set; }
    }

    public class DesignFabricSearchResultWrapper
    {
        public List<DesignFabricSearchResult> Results { get; set; }
    }

    public class DesignFabricSearchResult
    {
        public int ProductID { get; set; }
        public long ImageID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string RecommendedStitchColour { get; set; }
        public short? RecommendedStitchColourID { get; set; }
    }

    public class PassDesignFabricSearch
    {
        public short designId { get; set; }
        public string searchTerm { get; set; }
    }
    
    [Table("StitchColourRestriction", Schema = "furniture")]
    public class FurnitureDesignStitchColourRestriction
    {
        [Key]
        [Column(Order = 1)]
        public short DesignID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short StitchColourID { get; set; }

        [NotMapped]
        public string Name
        {
            get
            {
                return StitchColour.Name;
            }
            set { }
        }

        [JsonIgnore]
        [ForeignKey("DesignID")]
        public virtual FurnitureDesign Design { get; set; }
        
        [JsonIgnore]
        [ForeignKey("StitchColourID")]
        public virtual FurnitureStitchColour StitchColour { get; set; }
    }

    public class PassFabricRestrictionRecommendedStitchColour
    {
        public short designId { get; set; }
        public int productId { get; set; }
        public short stitchColourId { get; set; }
    }
}