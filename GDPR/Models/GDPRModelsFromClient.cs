using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GDPR.Models
{
    public class PassName
    {
        public string Name { get; set; }
    }
    
    public class PassDataType
    {
        public byte DataCategoryID { get; set; }
        public string Name { get; set; }
    }
    
    public class PassPartner
    {
        public int? SupplierID { get; set; }
        public byte DepartmentID { get; set; }
        public string Name { get; set; }
        public byte PartnerCategoryID { get; set; }
        public string ContactName { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string MertexReference { get; set; }
    }
    
    public class PassDepartmentStage
    {
        public byte DepartmentID { get; set; }
        public string Attendees { get; set; }
    }

    public class PassPersonalInfoWorkedStage
    {
        public byte DepartmentID { get; set; }
        public List<DataCategory_IndividualCategory> DataCategories_IndividualCategories { get; set; }
    }

    public class PassPersonalInfoStoredStage
    {
        public byte DepartmentID { get; set; }
        public List<DataCategory_DataStore> DataCategories_DataStores { get; set; }
    }

    public class PassHowDoYouCollectStage
    {
        public byte DepartmentID { get; set; }
        public List<DataCategory_DataSource> DataCategories_DataSources { get; set; }
    }

    public class PassWhoDoYouShareWithStage
    {
        public byte DepartmentID { get; set; }
        public List<DataCategory_Supplier_DataTransmissionMethod> DataCategories_Suppliers_DataTransmissionMethods { get; set; }
    }
}