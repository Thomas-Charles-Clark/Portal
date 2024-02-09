using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.General;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Customers.ViewModels
{
    public class ContractPricingViewModel : BaseViewModel
    {
        public TradeAccountNumber_AutocompleteResult PreselectedTradeAccount { get; set; }

        public IEnumerable<ContractProductRestriction> ContractProductRestrictions { get; set; }

        public IEnumerable<Brand> Brands { get; set; }

        public ContractPricingViewModel(
            PortalDbContext portalDb,
            TradeAccountNumber_AutocompleteResult preselectedTradeAccount,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            Brands = portalDb.Brands.Where(b => b.ParentID == null && b.Deleted == false).ToList();
            ContractProductRestrictions = portalDb.ContractProductRestrictions.Where(cpr => cpr.Deleted == false).ToList();
            PreselectedTradeAccount = preselectedTradeAccount;
        }
    }
}