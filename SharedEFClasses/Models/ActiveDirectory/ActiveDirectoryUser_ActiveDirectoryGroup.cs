using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace SharedEFClasses.Models.ActiveDirectory
{
    [Table("User_Group", Schema = "ad")]
    public class ActiveDirectoryUser_ActiveDirectoryGroup
    {
        [Key]
        [Column(Order = 1)]
        public int UserID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short GroupID { get; set; }

        [JsonIgnore]
        [ForeignKey("UserID")]
        public virtual ActiveDirectoryUser User { get; set; }

        [ForeignKey("GroupID")]
        public virtual ActiveDirectoryGroup Group { get; set; }
    }
}
