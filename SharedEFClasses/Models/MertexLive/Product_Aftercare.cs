using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("Product_Aftercare", Schema = "Mertex")]
    public class Product_Aftercare
    {
        [Key]
        [Column(Order = 1)]
        public string ProductCode { get; set; }

        [Key]
        [Column(Order = 2)]
        public string AftercareCode { get; set; }

        public byte SortOrder { get; set; }

        [JsonIgnore]
        [ForeignKey("ProductCode")]
        public virtual ProductLive Product { get; set; }
    }
}
