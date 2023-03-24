using FileWriter;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Utilities.BouncyCastle;
using SharedEFClasses.Utilities.NewtonsoftExtensions;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation.Language;
using System.Threading.Tasks;
using System.Web;

namespace Portal.Areas.Products.ViewModels
{
    public class ProductMaintenanceViewModel : BaseViewModel
    {
        public List<Treatment> Treatments { get; set; }
        public List<TreatmentStatus> TreatmentStatuses { get; set; }
        public List<TreatmentProvider> TreatmentProviders { get; set; }
        public List<TreatmentType> TreatmentTypes { get; set; }

        public int MemberID { get; set; }

        public string FormJSON { get; set; }

        public string DataJSON { get; set; }

        private ProductMaintenanceViewModel(
            int memberId,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading) : base(properties, applicationHeading, applicationSubHeading)
        {
            MemberID = memberId;
        }

        public static async Task<ProductMaintenanceViewModel> CreateAsync(
            int memberId,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new ProductMaintenanceViewModel(memberId, properties, applicationHeading, applicationSubHeading);

            await result.InitialiseAsync();

            return result;
        }

        protected async System.Threading.Tasks.Task InitialiseAsync()
        {
            var db = new SharedEFClasses.Models.PortalDbContext();

            //Treatments = db.Treatments.Where(p => p.ProductFilterGroupID == 1 && p.Deleted == false).ToList();
            //TreatmentStatuses = db.TreatmentStatuses.OrderBy(p => p.SortOrder).ToList();
            //TreatmentProviders = db.TreatmentProviders.OrderBy(p => p.SortOrder).ToList();
            //TreatmentTypes = db.TreatmentTypes.OrderBy(p => p.SortOrder).ToList();

            FormJSON = await db.GetProductMaintenanceFormJsonAsync(MemberID);

            DataJSON = await db.GetProductMaintenanceFormDataJsonAsync();

            var firstParse = JToken.Parse(FormJSON);

            FormJSON = JsonConvert.SerializeObject(
                firstParse.FindAndReplace(
                    "ReferenceDataSet",
                    (string message) => AESGCM.SimpleEncrypt(System.Text.Encoding.UTF8.GetBytes(message), AESGCM.ProductMaintenanceKeyBytes)
                )
            );

            var decrypted = JsonConvert.SerializeObject(
                JToken.Parse(FormJSON).FindAndReplace(
                    "ReferenceDataSet",
                    (string message) => AESGCM.SimpleDecrypt(message, AESGCM.ProductMaintenanceKeyBytes)
                )
            );
         }
    }
}