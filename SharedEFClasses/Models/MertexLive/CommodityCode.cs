using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("CommodityCode", Schema = "Mertex")]
    public class CommodityCodeObj
    {
        [Key]
        public long CommodityCode { get; set; }
        public string CommodityDescription { get; set; }
        public long CommodityGroupCode { get; set; }

        [ForeignKey("CommodityGroupCode")]
        public virtual CommodityGroupCodeObj CommodityGroupCodeObj { get; set; }
    }
}
