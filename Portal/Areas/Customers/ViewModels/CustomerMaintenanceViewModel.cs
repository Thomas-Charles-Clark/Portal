using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Customers.ViewModels
{
    public class CustomerMaintenanceViewModel : BaseViewModel
    {
        public TradeAccountNumber_AutocompleteResult PreselectedTradeAccount { get; set; }

        public CustomerMaintenanceViewModel(
            TradeAccountNumber_AutocompleteResult preselectedTradeAccount,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            PreselectedTradeAccount = preselectedTradeAccount;
        }
    }
}