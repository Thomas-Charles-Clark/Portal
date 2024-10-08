using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.DotDigital
{
    [Table("Account", Schema = "DotDigital")]
    public class DotDigitalAccount
    {
        [Key]
        [Column("AccountID")]
        public byte DotDigitalAccountID { get; set; }

        [Column("AccountTypeID")]
        public byte DotDigitalAccountTypeID { get; set; }

        public string Name { get; set; }

        public short CountryID { get; set; }

        [JsonIgnore]
        [InverseProperty("DotDigitalAccount")]
        public ICollection<Member> Members { get; set; }
    }
}
