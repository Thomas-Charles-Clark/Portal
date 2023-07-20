using Newtonsoft.Json;

using SharedEFClasses.Models.Retail;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.DotDigital
{
    [Table("SyncAction", Schema = "DotDigital")]
    public class SyncAction
    {
        [Key]
        public byte SyncActionID { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("SyncAction")]
        public virtual ICollection<RetailStoreMember> RetailStoreMembers { get; set; }
    }
}
