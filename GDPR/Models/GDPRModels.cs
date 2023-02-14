using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace GDPR.Models
{
    [Table("DataCategory", Schema = "gdpr")]
    public class DataCategory
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
        public byte DataCategoryID { get; set; }

        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }
        
        public virtual ICollection<DataType> DataTypes { get; set; }

        [JsonIgnore]
        public virtual ICollection<DataCategory_DataSource> DataSources { get; set; }

        [JsonIgnore]
        public virtual ICollection<DataCategory_DataStore> DataStores { get; set; }

        [JsonIgnore]
        public virtual ICollection<DataCategory_IndividualCategory> Individuals { get; set; }

        [JsonIgnore]
        public virtual ICollection<DataCategory_Supplier_DataTransmissionMethod> Supplier_DataTransmissionMethods { get; set; }
    }

    [Table("DataCategory_DataSource", Schema = "gdpr")]
    public class DataCategory_DataSource
    {
        [Key]
        [Column(Order = 1)]
        public byte DepartmentID { get; set; }

        [Key]
        [Column(Order = 2)]
        public byte DataCategoryID { get; set; }

        [Key]
        [Column(Order = 3)]
        public byte DataSourceID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }


        public virtual DataCategory DataCategory { get; set; }
        public virtual DataSource DataSource { get; set; }
    }

    [Table("DataCategory_DataStore", Schema = "gdpr")]
    public class DataCategory_DataStore
    {
        [Key]
        [Column(Order = 1)]
        public byte DepartmentID { get; set; }

        [Key]
        [Column(Order = 2)]
        public byte DataCategoryID { get; set; }

        [Key]
        [Column(Order = 3)]
        public byte DataStoreID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }


        public virtual DataCategory DataCategory { get; set; }
        public virtual DataStore DataStore { get; set; }
    }

    [Table("DataCategory_IndividualCategory", Schema = "gdpr")]
    public class DataCategory_IndividualCategory
    {
        [Key]
        [Column(Order = 1)]
        public byte DepartmentID { get; set; }

        [Key]
        [Column(Order = 2)]
        public byte DataCategoryID { get; set; }

        [Key]
        [Column(Order = 3)]
        public byte IndividualCategoryID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }


        public virtual DataCategory DataCategory { get; set; }
        public virtual IndividualCategory IndividualCategory { get; set; }
    }

    [Table("DataCategory_Supplier_DataTransmissionMethod", Schema = "gdpr")]
    public class DataCategory_Supplier_DataTransmissionMethod
    {
        [Key]
        [Column(Order = 1)]
        public byte DepartmentID { get; set; }

        [Key]
        [Column(Order = 2)]
        public byte DataCategoryID { get; set; }

        [Key]
        [Column(Order = 3)]
        public int SupplierID { get; set; }

        [Key]
        [Column(Order = 4)]
        public byte DataTransmissionMethodID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }


        public virtual DataCategory DataCategory { get; set; }
        public virtual DataTransmissionMethod DataTransmissionMethod { get; set; }
        //public virtual Supplier Supplier { get; set; }
    }

    [Table("DataSource", Schema = "gdpr")]
    public class DataSource
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
        public byte DataSourceID { get; set; }

        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }
    }

    [Table("DataStore", Schema = "gdpr")]
    public class DataStore
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
        public byte DataStoreID { get; set; }

        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public bool Portable { get; set; }
    }
    
    [Table("DataTransmissionMethod", Schema = "gdpr")]
    public class DataTransmissionMethod
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
        public byte DataTransmissionMethodID { get; set; }

        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }
    }

    [Table("DataType", Schema = "gdpr")]
    public class DataType
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
        public short DataTypeID { get; set; }

        public byte DataCategoryID { get; set; }

        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        [JsonIgnore]
        public virtual DataCategory DataCategory { get; set; }
    }

    [Table("Department", Schema = "gdpr")]
    public class Department
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
        public byte DepartmentID { get; set; }

        public byte? Number { get; set; }

        public string Name { get; set; }

        public DateTime? FirstReview { get; set; }

        public DateTime? LastReview { get; set; }

        public string Attendees { get; set; }

        [JsonIgnore]
        public virtual ICollection<DataCategory_DataSource> DataSources { get; set; }

        [JsonIgnore]
        public virtual ICollection<DataCategory_DataStore> DataStores { get; set; }

        [JsonIgnore]
        public virtual ICollection<DataCategory_IndividualCategory> Individuals { get; set; }

        [JsonIgnore]
        public virtual ICollection<DataCategory_Supplier_DataTransmissionMethod> Supplier_DataTransmissionMethods { get; set; }

        [JsonIgnore]
        public virtual ICollection<Supplier> Suppliers { get; set; }
    }

    [Table("IndividualCategory", Schema = "gdpr")]
    public class IndividualCategory
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
        public byte IndividualCategoryID { get; set; }
        
        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }
    }

    [Table("Supplier", Schema = "gdpr")]
    public class Supplier
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
        public int SupplierID { get; set; }

        public byte SupplierCategoryID { get; set; }

        public byte DepartmentID { get; set; }

        public string Name { get; set; }

        public string MertexReference { get; set; }

        public string ContactName { get; set; }

        public string ContactEmail { get; set; }

        public string ContactPhone { get; set; }

        public byte CreatedByDepartmentID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }
        
        public virtual SupplierCategory SupplierCategory { get; set; }

        public virtual Department Department { get; set; }

        //public virtual ICollection<DataCategory_Supplier_DataTransmissionMethod> DataCategory_Supplier_DataTransmissionMethods { get; set; }
    }

    [Table("SupplierCategory", Schema = "gdpr")]
    public class SupplierCategory
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
        public byte SupplierCategoryID { get; set; }

        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        [JsonIgnore]
        public virtual ICollection<Supplier> Suppliers { get; set; }
    }

    class DataCategory_IndividualCategoryEqualityComparer : IEqualityComparer<DataCategory_IndividualCategory>
    {
        public bool Equals(DataCategory_IndividualCategory x, DataCategory_IndividualCategory y)
        {
            if (y == null && x == null)
            {
                return true;
            }
            else if (x == null | y == null)
            {
                return false;
            }
            else if (x.DepartmentID == y.DepartmentID && 
                     x.DataCategoryID == y.DataCategoryID && 
                     x.IndividualCategoryID == y.IndividualCategoryID)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public int GetHashCode(DataCategory_IndividualCategory x)
        {
            int hCode = x.DepartmentID ^ x.DataCategoryID ^ x.IndividualCategoryID;
            return hCode.GetHashCode();
        }
    }

    class DataCategory_DataStoreEqualityComparer : IEqualityComparer<DataCategory_DataStore>
    {
        public bool Equals(DataCategory_DataStore x, DataCategory_DataStore y)
        {
            if (y == null && x == null)
            {
                return true;
            }
            else if (x == null | y == null)
            {
                return false;
            }
            else if (x.DepartmentID == y.DepartmentID &&
                     x.DataCategoryID == y.DataCategoryID &&
                     x.DataStoreID == y.DataStoreID)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public int GetHashCode(DataCategory_DataStore x)
        {
            int hCode = x.DepartmentID ^ x.DataCategoryID ^ x.DataStoreID;
            return hCode.GetHashCode();
        }
    }

    class DataCategory_DataSourceEqualityComparer : IEqualityComparer<DataCategory_DataSource>
    {
        public bool Equals(DataCategory_DataSource x, DataCategory_DataSource y)
        {
            if (y == null && x == null)
            {
                return true;
            }
            else if (x == null | y == null)
            {
                return false;
            }
            else if (x.DepartmentID == y.DepartmentID &&
                     x.DataCategoryID == y.DataCategoryID &&
                     x.DataSourceID == y.DataSourceID)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public int GetHashCode(DataCategory_DataSource x)
        {
            int hCode = x.DepartmentID ^ x.DataCategoryID ^ x.DataSourceID;
            return hCode.GetHashCode();
        }
    }

    class DataCategory_Supplier_DataTransmissionMethodEqualityComparer : IEqualityComparer<DataCategory_Supplier_DataTransmissionMethod>
    {
        public bool Equals(DataCategory_Supplier_DataTransmissionMethod x, DataCategory_Supplier_DataTransmissionMethod y)
        {
            if (y == null && x == null)
            {
                return true;
            }
            else if (x == null | y == null)
            {
                return false;
            }
            else if (x.DepartmentID == y.DepartmentID &&
                     x.DataCategoryID == y.DataCategoryID &&
                     x.SupplierID == y.SupplierID &&
                     x.DataTransmissionMethodID == y.DataTransmissionMethodID)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public int GetHashCode(DataCategory_Supplier_DataTransmissionMethod x)
        {
            int hCode = x.DepartmentID ^ x.DataCategoryID ^ x.SupplierID ^ x.DataTransmissionMethodID;
            return hCode.GetHashCode();
        }
    }
}