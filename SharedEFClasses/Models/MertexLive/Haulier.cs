using Newtonsoft.Json;
using SharedEFClasses.ReturnModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("Haulier", Schema = "Mertex")]
    public class Haulier
    {
        [Key]
        public string Code { get; set; }

        public string Name { get; set; }

        public object CutOffTime { get; set; }

        public bool ExpectParcelData { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [InverseProperty("Haulier")]
        public virtual ICollection<ReturnCollection> ReturnCollections { get; set; }
    }
}
