using FileWriter;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Utilities.BouncyCastle;
using SharedEFClasses.Utilities.NewtonsoftExtensions;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation.Language;
using System.Threading.Tasks;
using System.Web;

namespace Portal.Areas.Press.ViewModels
{
    public class PressContactsViewModel : BaseViewModel
    {
        private PressContactsViewModel(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading) : base(properties, applicationHeading, applicationSubHeading)
        {

        }

        public static async Task<PressContactsViewModel> CreateAsync(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new PressContactsViewModel(properties, applicationHeading, applicationSubHeading);

            return result;
        }
    }
}