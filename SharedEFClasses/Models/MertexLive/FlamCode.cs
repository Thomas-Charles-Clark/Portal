using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("FlamCode", Schema = "Mertex")]
    public class FlamCode
    {
        [Key]
        public string Code { get; set; }
        public string Value { get; set; }

        [JsonIgnore]
        public virtual ICollection<ProductLive> Products { get; set; }
    }
}
