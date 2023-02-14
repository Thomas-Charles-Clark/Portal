using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("Quality", Schema = "Mertex")]
    public class QualityLive
    {
        [Key]
        public string Code { get; set; }

        public string Name { get; set; }

        public decimal? GSM { get; set; }

        public decimal? GLM { get; set; }

        public string CompositionCode { get; set; }
    }
}
