using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SharedEFClasses.Models.Marylebone;

namespace Portal.Areas.Marylebone.ViewModels
{
    public class MarylebonePackingViewModel : BaseViewModel
    {
        private MarylebonePackingViewModel(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading) : base(properties, applicationHeading, applicationSubHeading)
        {

        }

        public static MarylebonePackingViewModel Create(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new MarylebonePackingViewModel(properties, applicationHeading, applicationSubHeading);

            result.Initialise();

            return result;
        }

        protected void Initialise()
        {
            var db = new SharedEFClasses.Models.PortalDbContext();
        }
    }
}