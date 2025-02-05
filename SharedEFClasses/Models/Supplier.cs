using Newtonsoft.Json;

using SharedEFClasses.Models.Products;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("Supplier", Schema = "dbo")]
    public class Supplier
    {
        [Key]
        public int SupplierID { get; set; }

        public string Code { get; set; }

        public string Name { get; set; }

        public byte? SupplierTypeID { get; set; }

        [JsonIgnore]
        [InverseProperty("DefaultSupplier")]
        public virtual ICollection<Product> DefaultSupplierForProducts { get; set; }

        [ForeignKey("SupplierTypeID")]
        public virtual SupplierType SupplierType { get;  set; }

        [JsonIgnore]
        [InverseProperty("Supplier")]
        public virtual ICollection<MertexProductClassificationSuperSet> MertexProductClassificationSuperSetRecords { get; set; }
    }

    public class SupplierSelectResult
    {

        [Key]
        public int SupplierID { get; set; }

        public string Code { get; set; }

        public string Name { get; set; }

        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }

        public string Town { get; set; }
        
        public string County { get; set; }

        public string Postcode { get; set; }

        public string CountryCode { get; set; }

        public short CountryID { get; set; }

        public string CountryName { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }
    }
}
