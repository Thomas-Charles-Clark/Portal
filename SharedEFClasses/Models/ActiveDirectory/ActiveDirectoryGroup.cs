using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

using SharedEFClasses.Models.IncomingEmail;

namespace SharedEFClasses.Models.ActiveDirectory
{
    [Table("Group", Schema = "ad")]
    public class ActiveDirectoryGroup
    {
        [Key]
        public short GroupID { get; set; }

        public string GUID { get; set; }

        public string Name { get; set; }
        
        public int? RoleID { get; set; }

        public short? DepartmentID { get; set; }

        [ForeignKey("DepartmentID")]
        public virtual Department Department { get; set; }

        [JsonIgnore]
        [InverseProperty("Department")]
        public virtual ICollection<BudgetHolderSuperSet> BudgetHolderSuperSetRecords { get; set; }

        [JsonIgnore]
        [InverseProperty("Group")]
        public virtual ICollection<ActiveDirectoryUser_ActiveDirectoryGroup> Users { get; set; }
    }
}
