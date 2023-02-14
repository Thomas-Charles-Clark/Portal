using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Portal.Areas.Products.ViewModels
{
    public class ProductTypeMaintenanceViewModel : BaseViewModel
    {
        public List<MaintenanceProductType> ProductTypes { get; set; }

        public IEnumerable <MaintenanceFieldSelectResult> Fields { get; set; }
        
        private ProductTypeMaintenanceViewModel(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading) : base(properties, applicationHeading, applicationSubHeading)
        {

        }

        public static async Task<ProductTypeMaintenanceViewModel> CreateAsync(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new ProductTypeMaintenanceViewModel(properties, applicationHeading, applicationSubHeading);

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

            ProductTypes = db.MaintenanceProductTypes.OrderBy(mpt => mpt.ProductTypeID).ToList();

            Fields = await db.FieldList_Select();
        }
    }
}