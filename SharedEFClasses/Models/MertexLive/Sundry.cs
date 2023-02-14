using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("Sundry", Schema = "Mertex")]
    public class Sundry
    {
        [Key]
        public string Code { get; set; }

        public string Description { get; set; }

        public string ProductGroup { get; set; }

        public string ItemType { get; set; }

        public string CollectionCode { get; set; }

        public decimal? Amount { get; set; }

        public decimal? PriceEx { get; set; }

        public string VATCode { get; set; }
    }
}
