using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Keyless]
[Table("User_Computer", Schema = "Mertex")]
public partial class UserComputer
{
    [Column("MertexUserID")]
    [StringLength(30)]
    public string MertexUserId { get; set; } = null!;

    [StringLength(30)]
    public string ComputerName { get; set; } = null!;
}
