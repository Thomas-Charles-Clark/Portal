using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("EmailStatus", Schema = "IncomingEmail")]
    public class EmailStatus
    {
        [Key]
        public byte EmailStatusID { get; set; }
    
        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("EmailStatus")]
        public virtual ICollection<Email> Emails { get; set; }
    }
}
