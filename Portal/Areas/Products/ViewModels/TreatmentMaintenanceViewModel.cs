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
    public class TreatmentMaintenanceViewModel : BaseViewModel
    {
        public List<Treatment> Treatments { get; set; }
        public List<TreatmentStatus> TreatmentStatuses { get; set; }
        public List<TreatmentProvider> TreatmentProviders { get; set; }
        public List<TreatmentType> TreatmentTypes { get; set; }

        private TreatmentMaintenanceViewModel(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading) : base(properties, applicationHeading, applicationSubHeading)
        {

        }

        public static TreatmentMaintenanceViewModel Create(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new TreatmentMaintenanceViewModel(properties, applicationHeading, applicationSubHeading);

            result.Initialise();

            return result;
        }

        protected void Initialise()
        {
            var db = new SharedEFClasses.Models.PortalDbContext();

            Treatments = db.Treatments.Where(p => p.ProductFilterGroupID == 1 && p.Deleted == false).ToList();
            TreatmentStatuses = db.TreatmentStatuses.OrderBy(p => p.SortOrder).ToList();
            TreatmentProviders = db.TreatmentProviders.OrderBy(p => p.SortOrder).ToList();
            TreatmentTypes = db.TreatmentTypes.OrderBy(p => p.SortOrder).ToList();
        }
    }
}