using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SharedEFClasses.Models.General;
using Newtonsoft.Json;
using SharedEFClasses.Models.ActiveDirectory;

namespace SharedEFClasses.Models
{

    public class Department
    {
        [Key]
        public short DepartmentID { get; set; }

        public byte LocationID { get; set; }

        public string Name { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [ForeignKey("LocationID")]
        public virtual Location Location { get; set; }

        //[JsonIgnore]
        public virtual ICollection<Member_Department> Members { get; set; }

        [NotMapped]
        public string DropDownTreeLocationID
        {
            get
            {
                return $"Location-{LocationID}";
            }
        }

        [NotMapped]
        public string DropDownTreeDepartmentID
        {
            get
            {
                return $"Department-{DepartmentID}";
            }
        }

        [JsonIgnore]
        [InverseProperty("Department")]
        public virtual ICollection<ActiveDirectoryGroup> ActiveDirectoryGroups { get; set; }
    }
}
