using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[PrimaryKey("ProductCode", "AftercareCode")]
[Table("Product_Aftercare", Schema = "Mertex")]
[Index("ProductCode", "AftercareCode", Name = "UQ_Mertex_Product_Aftercare", IsUnique = true)]
public partial class ProductAftercare
{
    [Key]
    [StringLength(50)]
    public string ProductCode { get; set; } = null!;

    [Key]
    [StringLength(5)]
    public string AftercareCode { get; set; } = null!;

    public byte SortOrder { get; set; }
}
