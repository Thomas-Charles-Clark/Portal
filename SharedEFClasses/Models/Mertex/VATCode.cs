using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace SharedEFClasses.Models.Mertex
{
    [Table("Mertex_VAT", Schema = "adm")]
    public class VATCode
    {
        [Key]
        public string Code { get; set; }

        public decimal VATRate { get; set; }

        public string Name { get; set; }

        public int? SortOrder { get; set; }

        [JsonIgnore]
        [InverseProperty("VATCode")]
        public virtual ICollection<SupplierLive> Suppliers { get; set; }
    }
}
