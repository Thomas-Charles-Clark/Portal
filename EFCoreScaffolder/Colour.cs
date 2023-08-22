using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.ProductPage;

[Table("Colour")]
public partial class Colour
{
    [Key]
    [Column("ColourID")]
    public byte ColourId { get; set; }

    [StringLength(50)]
    public string Name { get; set; } = null!;

    public byte SortOrder { get; set; }

    public byte HotToCold { get; set; }

    [Column("HEX")]
    [StringLength(6)]
    [Unicode(false)]
    public string Hex { get; set; } = null!;

    [Column("DeletedDT", TypeName = "datetime")]
    public DateTime? DeletedDt { get; set; }

    [Column("AttributeID")]
    public short? AttributeId { get; set; }

    [Column("MertexID")]
    public short? MertexId { get; set; }

    [Required]
    public bool? RecognisedColour { get; set; }

    public bool? Deleted { get; set; }

    [InverseProperty("Colour")]
    public virtual ICollection<ProductPage> ProductPages { get; set; } = new List<ProductPage>();
}
