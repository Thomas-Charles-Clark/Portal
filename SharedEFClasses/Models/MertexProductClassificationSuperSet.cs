using Microsoft.Owin.Security;

using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Products;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SharedEFClasses.Models
{
    [Table("MertexProductClassificationSuperSet", Schema = "dbo")]
    public class MertexProductClassificationSuperSet
    {
        [Key]
        public int MertexProductClassificationSuperSetID { get; set; }

        public byte? BrandID { get; set; }

        public byte? ProductGroupID { get; set; }

        public short? ItemTypeID { get; set; }
        
        public short? CollectionID { get; set; }

        public short? LaunchID { get; set; }

        public short? QualityID { get; set; }

        public int? DesignID { get; set; }

        public int? SupplierID { get; set; }

        public string SupplierCode { get; set; }

        public string BuyerCode { get; set; }

        public string Status { get; set; }

        public byte? SupplierTypeID { get; set; }

        public byte? ProductLifeCycleID { get; set; }

        [ForeignKey("SupplierTypeID")]
        public virtual SupplierType SupplierType { get; set; }

        [ForeignKey("Status")]
        public virtual ProductStatus ProductStatus { get; set; }

        [ForeignKey("BuyerCode")]
        public virtual Buyer Buyer { get; set; }

        [ForeignKey("BrandID")]
        public virtual Brand Brand { get; set; }

        [ForeignKey("ProductGroupID")]
        public virtual ProductGroup ProductGroup { get; set; }

        [ForeignKey("ItemTypeID")]
        public virtual ItemType ItemType { get; set; }

        [ForeignKey("CollectionID")]
        public virtual Collection Collection { get; set; }

        [ForeignKey("LaunchID")]
        public virtual Launch Launch { get; set; }

        [ForeignKey("QualityID")]
        public virtual Quality Quality { get; set; }

        [ForeignKey("DesignID")]
        public virtual Design Design { get; set; }

        [ForeignKey("SupplierID")]
        public virtual Supplier Supplier { get; set; }

        [ForeignKey("ProductLifeCycleID")]
        public virtual ProductLifeCycle ProductLifeCycle { get; set; }
    }
}
