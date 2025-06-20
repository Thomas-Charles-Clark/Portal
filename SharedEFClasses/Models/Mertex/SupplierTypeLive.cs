using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Newtonsoft.Json;

namespace SharedEFClasses.Models.Mertex
{
    [Table("SupplierType", Schema = "Mertex")]
    public class SupplierTypeLive
    {
        [Key]
        public string Code { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("SupplierType")]
        public virtual ICollection<SupplierLive> Suppliers { get; set; }
    }
}
