using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Leads;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Customers.ViewModels
{
    public class TradeAccountCreationEmailMaintenanceViewModel : BaseViewModel
    {
        public TradeAccountNumber_AutocompleteResult PreselectedTradeAccount { get; set; }

        public List<SalesMarket> SalesMarkets { get; set; }


        public TradeAccountCreationEmailMaintenanceViewModel(
            TradeAccountNumber_AutocompleteResult preselectedTradeAccount,
            List<SalesMarket> salesMarkets,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            PreselectedTradeAccount = preselectedTradeAccount;
            SalesMarkets = salesMarkets;
        }
    }
}