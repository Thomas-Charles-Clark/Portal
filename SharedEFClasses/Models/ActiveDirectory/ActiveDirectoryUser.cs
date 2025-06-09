using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

using SharedEFClasses.Models.MertexLive;

namespace SharedEFClasses.Models.ActiveDirectory
{
    [Table("User", Schema = "ad")]
    public class ActiveDirectoryUser
    {
        [Key]
        public int UserID { get; set; }

        public string Email { get; set; }

        [JsonIgnore]
        [InverseProperty("User")]
        public ICollection<ActiveDirectoryUser_ActiveDirectoryGroup> Groups { get; set; }

        [JsonIgnore]
        [InverseProperty("User")]
        public ICollection<BudgetHolder> BudgetHolders { get; set; }
    }
}
