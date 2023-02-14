using Portal.Models;
using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Orders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Orders.ViewModels
{
    public class TradeOrdersReturnsViewModel : BaseViewModel
    {
        public bool CanSearch { get; set; }

        public TradeAccountNumber_AutocompleteResult PreselectedTradeAccount { get; set; }

        public List<UPSAccount> UPSAccounts { get; set; }

        public TradeOrdersReturnsViewModel(
            TradeAccountNumber_AutocompleteResult preselected,
            List<UPSAccount> upsAccounts,
            RoleProperties properties, 
            string applicationHeading, 
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            CanSearch = properties?.AccountSelector_CanSearch ?? false;
            PreselectedTradeAccount = preselected;
            UPSAccounts = upsAccounts;
        }
    }
}