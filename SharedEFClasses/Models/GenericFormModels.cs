using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using SharedEFClasses.Utilities;
using SharedEFClasses.Utilities.BouncyCastle;
using SharedEFClasses.Utilities.NewtonsoftExtensions;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public class PassDataItemCreation
    {
        public object Properties { get; set; }

        public string ReferenceDataSet { get; set; }

        public string ReferenceDataSetDecrypted
        {
            get
            {
                var json = JsonConvert.SerializeObject(new { ReferenceDataSet });

                var replaced = JToken.Parse(json).FindAndReplace(
                    "ReferenceDataSet",
                    (string message) => AESGCM.SimpleDecrypt(message, AESGCM.ProductMaintenanceKeyBytes)
                );

                return replaced["ReferenceDataSet"].Value<string>();
            }
        }
    }

    public class PassGenericFormSave
    {
        public string json { get; set; }
    }

    public class PassGenericFormSaveResponse
    {
        public bool Success { get; set; }
        public string ErrorMessage { get; set; }
        public IEnumerable<PassGenericFormSaveChangeSummary> ChangeSummary { get; set; }
    }

    public class PassGenericFormSaveChangeSummary
    {
        public string Table { get; set; }
        public string Change { get; set; }
        public int Count { get; set; }
    }

    public class PassListEnquiry
    {
        public string FieldName { get; set; }
        public string ReferenceDataSet { get; set; }
    
        public string ReferenceDataSetDecrypted
        {
            get
            {
                var json = JsonConvert.SerializeObject(new { ReferenceDataSet });

                var replaced = JToken.Parse(json).FindAndReplace(
                    "ReferenceDataSet",
                    (string message) => AESGCM.SimpleDecrypt(message, AESGCM.ProductMaintenanceKeyBytes)
                );

                return replaced["ReferenceDataSet"].Value<string>();
            }
        }
    }

    public class PassDataItemEnquiry
    {
        public string FieldName { get; set; }
        public object Value { get; set; }
        public string ReferenceDataSet { get; set; }

        public string ReferenceDataSetDecrypted
        {
            get
            {
                var json = JsonConvert.SerializeObject(new { ReferenceDataSet });

                var replaced = JToken.Parse(json).FindAndReplace(
                    "ReferenceDataSet",
                    (string message) => AESGCM.SimpleDecrypt(message, AESGCM.ProductMaintenanceKeyBytes)
                );

                return replaced["ReferenceDataSet"].Value<string>();
            }
        }
    }

    public class PassDataItemsEnquiry
    {
        public string FieldName { get; set; }
        public IEnumerable<object> Values { get; set; }
        public string ReferenceDataSet { get; set; }

        public string ReferenceDataSetDecrypted
        {
            get
            {
                var json = JsonConvert.SerializeObject(new { ReferenceDataSet });

                var replaced = JToken.Parse(json).FindAndReplace(
                    "ReferenceDataSet",
                    (string message) => AESGCM.SimpleDecrypt(message, AESGCM.ProductMaintenanceKeyBytes)
                );

                return replaced["ReferenceDataSet"].Value<string>();
            }
        }
    }

    public class MaintenanceListItem
    {
        public string Name { get; set; }
    }

    [Table("Colour", Schema = "Maintenance")]
    [ClassIdentifier("[Maintenance].[Colour]")]
    public class MaintenanceColour : MaintenanceListItem
    {
        [Key]
        public byte ColourID { get; set; }
    }

    [Table("Pattern", Schema = "Maintenance")]
    [ClassIdentifier("[Maintenance].[Pattern]")]
    public class MaintenancePattern : MaintenanceListItem
    {
        [Key]
        public byte PatternID { get; set; }
    }
}
