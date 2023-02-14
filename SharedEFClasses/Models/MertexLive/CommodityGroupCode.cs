using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("CommodityGroupCode", Schema = "Mertex")]
    public class CommodityGroupCodeObj
    {
        [Key]
        public long CommodityGroupCode { get; set; }
        public string CommodityGroupCodeDescription { get; set; }

        public virtual ICollection<CommodityCodeObj> CommodityCodes { get; set; }
    }
}
