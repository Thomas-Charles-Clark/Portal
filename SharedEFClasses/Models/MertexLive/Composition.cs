using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("Composition", Schema = "Mertex")]
    public class Composition
    {
        [Key]
        public string Code { get; set; }

        public string Description1 { get; set; }
        public string Description2 { get; set; }
        public string Description3 { get; set; }
        public string Description4 { get; set; }
        public string Description5 { get; set; }

        public string Description { get; set; }
    }
}
