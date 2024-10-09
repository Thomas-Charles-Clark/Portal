using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("Source", Schema = "mbr")]
    public class Source
    {
        [Key]
        public byte SourceID { get; set; }

        public string Name { get; set; }

        public bool Retail { get; set; }

        public byte SourceGroupID { get; set; }

        public string Notes { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public byte LawfulBasisID { get; set; }

        [Column("AlwaysDisplayAllMakertingPermissions")]
        public bool AlwaysDisplayAllMarketingPermissions { get; set; }

        [ForeignKey("SourceGroupID")]
        public virtual SourceGroup SourceGroup { get; set; }

        [ForeignKey("LawfulBasisID")]
        public virtual LawfulBasis LawfulBasis { get; set; }
    }
}
