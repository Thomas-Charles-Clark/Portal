using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("PurchaseOrderStatus", Schema = "Mertex")]
    public class PurchaseOrderStatus
    {
        [Key]
        public byte PurchaseOrderStatusID { get; set; }

        public string Name { get; set; }

        public virtual ICollection<PurchaseOrderHead> PurchaseOrderHeads { get; set; }
    }
}
