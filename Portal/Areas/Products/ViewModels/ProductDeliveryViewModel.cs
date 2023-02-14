using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Products.ViewModels
{
    public class ProductDeliveryViewModel : BaseViewModel
    {
        //public List<Treatment> Treatments { get; set; }
        //public List<TreatmentStatus> TreatmentStatuses { get; set; }
        //public List<TreatmentProvider> TreatmentProviders { get; set; }
        //public List<TreatmentType> TreatmentTypes { get; set; }

        public ProductDeliveryViewModel(
            //List<Treatment> treatments,
            //List<TreatmentStatus> treatmentStatuses,
            //List<TreatmentProvider> treatmentProviders,
            //List<TreatmentType> treatmentTypes,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            //this.Treatments = treatments;
            //this.TreatmentStatuses = treatmentStatuses;
            //this.TreatmentProviders = treatmentProviders;
            //this.TreatmentTypes = treatmentTypes;
        }
    }
}