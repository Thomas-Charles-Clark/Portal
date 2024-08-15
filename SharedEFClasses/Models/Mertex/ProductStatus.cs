using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("ProductStatus", Schema = "dbo")]
    public class ProductStatus
    {
        [Key]
        public string Code { get; set; }
        public string Name { get; set; }

        public virtual ICollection<MertexProductClassificationSuperSet> MertexProductClassificationSuperSetRecords { get; set; }
    }
}
