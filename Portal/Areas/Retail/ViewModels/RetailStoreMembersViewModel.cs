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

namespace Portal.Areas.Products.ViewModels
{
    public class RetailStoreMembersViewModel : BaseViewModel
    {
        private RetailStoreMembersViewModel(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading) : base(properties, applicationHeading, applicationSubHeading)
        {

        }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
        public static async Task<RetailStoreMembersViewModel> CreateAsync(
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new RetailStoreMembersViewModel(properties, applicationHeading, applicationSubHeading);

            return result;
        }
    }
}