using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Customers.ViewModels
{
    public class CustomerInviteViewModel : BaseViewModel
    {
        public int? TradeAccountGroupID { get; set; }
        public int? TradeAccountID { get; set; }
        public bool CanSearch { get; set; }
        public TradeAccountNumber_AutocompleteResult PreselectedTradeAccount { get; set; }

        public CustomerInviteViewModel(
            TradeAccountNumber_AutocompleteResult preselectedTradeAccount,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            this.PreselectedTradeAccount = preselectedTradeAccount;
        }
    }
}