using Microsoft.AspNet.OData.Builder;
using Microsoft.OData.Edm;
using Newtonsoft.Json;

using SharedEFClasses.Models.Documents;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("Resource", Schema = "portal")]
    public class Resource
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
        public short ResourceID { get; set; }

        public string Name { get; set; }

        public string Value { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [InverseProperty("Resource")]
        public virtual ICollection<Resource_Language> Translations { get; set; }

        [JsonIgnore]
        [InverseProperty("Resource")]
        public virtual ICollection<DocumentResource> Documents { get; set; }
    }

    [Table("Resource_Language", Schema = "portal")]
    public class Resource_Language
    {
        [Key]
        [Column(Order = 1)]
        public short ResourceID { get; set; }

        [Key]
        [Column(Order = 2)]
        public byte LanguageID { get; set; }

        public string Value { get; set; }

        public int? MemberID { get; set; }

        public DateTime? ModifiedDT { get; set; }

        [JsonIgnore]
        [AutoExpand]
        [ForeignKey("ResourceID")]
        public virtual Resource Resource { get; set; }

        [ForeignKey("LanguageID")]
        [AutoExpand]
        public virtual Language Language { get; set; }

        [ForeignKey("MemberID")]
        public virtual Member ModifiedBy { get; set; }
    }

    public class ResourceSelect
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }
}