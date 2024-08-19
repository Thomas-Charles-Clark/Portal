using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using SharedEFClasses.Models.Components;

namespace Portal.Areas.Parcel.ViewModels
{
    public class ParcelPricingViewModel : BaseViewModel
    {
        private ParcelPricingViewModel(
            int memberId,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading) : base(properties, applicationHeading, applicationSubHeading)
        {

        }

        public static async Task<ParcelPricingViewModel> CreateAsync(
            int memberId,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new ParcelPricingViewModel(memberId, properties, applicationHeading, applicationSubHeading);

            await result.InitialiseAsync();

            return result;
        }

        protected async System.Threading.Tasks.Task InitialiseAsync()
        {
            var db = new SharedEFClasses.Models.PortalDbContext();
        }
    }
}