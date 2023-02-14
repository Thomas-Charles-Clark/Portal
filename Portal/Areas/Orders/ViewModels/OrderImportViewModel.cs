using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Orders.ViewModels
{
    public class OrderImportViewModel : BaseViewModel
    {
        public bool CanSearch { get; set; }
        public TradeAccountNumber_AutocompleteResult PreselectedTradeAccount { get; set; }

        public OrderImportViewModel(
            TradeAccountNumber_AutocompleteResult preselected,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            CanSearch = properties?.AccountSelector_CanSearch ?? false;
            PreselectedTradeAccount = preselected;
        }
    }
}