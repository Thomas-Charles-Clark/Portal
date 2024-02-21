using SharedEFClasses.Models.DotDigital;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SharedEFClasses.Models.Press
{
    [Table("PressContact", Schema = "DotDigital")]
    public class PressContact
    {
        [Key]
        public int PressContactID { get; set; }

        public string Title { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string PersonalisationName { get; set; }

        public string Email { get; set; }

        public string Segment { get; set; }

        public string Market { get; set; }

        public string Status { get; set; }

        public byte? SyncActionID { get; set; }

        [JsonIgnore]
        public DateTime CreatedDT { get; set; }

        [JsonIgnore]
        public DateTime ModifiedDT { get; set; }

        public int ModifiedMemberID { get; set; }

        [JsonIgnore]
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [ForeignKey("SyncActionID")]
        public virtual SyncAction SyncAction { get; set; }

        [JsonIgnore]
        [ForeignKey("ModifiedMemberID")]
        public virtual Member LastModifiedBy { get; set; }

        public string LastModifiedByName
        {
            get
            {
                return LastModifiedBy?.Name;
            }
        }
    }
}
