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
    public class BasketStatusViewModel : BaseViewModel
    {
        public TradeAccountNumber_AutocompleteResult PreselectedTradeAccount { get; set; }

        private BasketStatusViewModel(
            TradeAccountNumber_AutocompleteResult preselected,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading) : base(properties, applicationHeading, applicationSubHeading)
        {
            PreselectedTradeAccount = preselected;
        }

        public static async Task<BasketStatusViewModel> CreateAsync(
            TradeAccountNumber_AutocompleteResult preselected,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new BasketStatusViewModel(preselected, properties, applicationHeading, applicationSubHeading);

            await result.InitialiseAsync();

            return result;
        }

        protected async System.Threading.Tasks.Task InitialiseAsync()
        {
            var db = new SharedEFClasses.Models.PortalDbContext();
         }
    }
}