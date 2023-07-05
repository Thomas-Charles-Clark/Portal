using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    [Table("Mertex_Language", Schema = "adm")]
    public class MertexLanguage
    {
        [Key]
        public string LanguageCode { get; set; }

        public string Name { get; set; }

        public byte? SortOrder { get; set; }
        
        public string DisplayName { get; set; }


        [JsonIgnore]
        [InverseProperty("MertexLanguage")]
        public virtual ICollection<TradeAccountCreationEmail> TradeAccountCreationEmails { get; set; }
    }
}
