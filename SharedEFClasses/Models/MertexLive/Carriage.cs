using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("Carriage", Schema = "Mertex")]
    public class Carriage
    {
        [Key]
        public string Key { get; set; }
        public string Code { get; set; }
        public string HaulierCode { get; set; }
        public string Description { get; set; }
        public bool? PriorityOrder { get; set; }
    }
}
