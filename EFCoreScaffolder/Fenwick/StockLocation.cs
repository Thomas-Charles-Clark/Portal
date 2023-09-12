using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.Fenwicks;

[Table("StockLocation", Schema = "portal")]
[Index("Code", Name = "UQ__StockLocation_Code", IsUnique = true)]
public partial class StockLocation
{
    [Key]
    public short StockLocationID { get; set; }

    [StringLength(10)]
    public string Code { get; set; } = null!;

    [StringLength(50)]
    public string Name { get; set; } = null!;

    [Precision(2)]
    public DateTime CreatedDT { get; set; }

    [Precision(2)]
    public DateTime ModifiedDT { get; set; }

    [Precision(2)]
    public DateTime? DeletedDT { get; set; }

    public bool? Deleted { get; set; }

    public TimeSpan DespatchCutOff { get; set; }

    public short LocationCountryID { get; set; }

    public bool SplitByDeliveryGroup { get; set; }

    public byte? StockLocationSiteID { get; set; }

    public bool ThirdParty { get; set; }

    public bool AllowOverride { get; set; }

    public bool Visible { get; set; }

    public short? ParentStockLocationID { get; set; }

    public byte DefaultFulfilmentTypeID { get; set; }

    public byte? StockLocationGroupID { get; set; }

    public bool AllowBackOrder { get; set; }

    public short SortOrder { get; set; }

    public bool CheckStock { get; set; }

    public bool SampleStockLocation { get; set; }

    public byte? StockLocationTypeID { get; set; }

    public virtual ICollection<Branch> Branches { get; set; } = new List<Branch>();

    [InverseProperty("ParentStockLocation")]
    public virtual ICollection<StockLocation> InverseParentStockLocation { get; set; } = new List<StockLocation>();

    [ForeignKey("ParentStockLocationID")]
    [InverseProperty("InverseParentStockLocation")]
    public virtual StockLocation? ParentStockLocation { get; set; }
}
