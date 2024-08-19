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
    public class ParcelCalculatorViewModel : BaseViewModel
    {
        public TradeAccountNumber_AutocompleteResult PreselectedTradeAccount { get; set; }

        private ParcelCalculatorViewModel(
            int memberId,
            TradeAccountNumber_AutocompleteResult preselected,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading) : base(properties, applicationHeading, applicationSubHeading)
        {
            PreselectedTradeAccount = preselected;
        }

        public static async Task<ParcelCalculatorViewModel> CreateAsync(
            int memberId,
            TradeAccountNumber_AutocompleteResult preselected,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new ParcelCalculatorViewModel(memberId, preselected, properties, applicationHeading, applicationSubHeading);

            await result.InitialiseAsync();

            return result;
        }

        protected async System.Threading.Tasks.Task InitialiseAsync()
        {
            var db = new SharedEFClasses.Models.PortalDbContext();
        }
    }
}