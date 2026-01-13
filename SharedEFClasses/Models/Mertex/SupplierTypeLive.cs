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

        /// <summary>
        /// 1 = Mandatory
        /// 0 = not required (do not present Designers Guild Company control in Invoice Registration app)
        /// NULL = optional
        /// </summary>
        public bool? CollectDGCompany { get; set; }

        [JsonIgnore]
        [InverseProperty("SupplierType")]
        public virtual ICollection<SupplierLive> Suppliers { get; set; }
    }
}
