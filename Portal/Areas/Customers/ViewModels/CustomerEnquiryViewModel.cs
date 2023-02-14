using Portal.Models;
using Portal.Utilities;
using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Customers;
using SharedEFClasses.Models.General;
using SharedEFClasses.Utilities;
using System.Collections.Generic;

namespace Portal.Areas.Customers.ViewModels
{
    public class CustomerEnquiryViewModel : BaseViewModel
    {
        public int? TradeAccountGroupID { get; set; }
        public int? TradeAccountID { get; set; }
        public bool CanSearch { get; set; }
        public TradeAccountNumber_AutocompleteResult PreselectedTradeAccount { get; set; }
        public CustomerEnquiryViewResult CustomerDetails { get; set; }
        public List<Competitor> Competitors { get; set; }
        public List<ProductTypeGroup> ProductTypeGroups { get; set; }
        public List<Brand> Brands { get; set; }
        public List<Currency> Currencies { get; set; }
        public List<StringSelectOption> NextFiveFinancialYears { get; set; }

        public CustomerEnquiryViewModel(
            CustomerEnquiryViewResult details, 
            int? tradeAccountGroupId, 
            int? tradeAccountId,
            TradeAccountNumber_AutocompleteResult preselectedTradeAccount,
            List<Competitor> competitors,
            List<ProductTypeGroup> productTypeGroups,
            List<Brand> brands,
            List<Currency> currencies,
            List<StringSelectOption> nextFiveFinancialYears,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            this.CustomerDetails = details;
            this.TradeAccountGroupID = tradeAccountGroupId;
            this.TradeAccountID = tradeAccountId;
            this.PreselectedTradeAccount = preselectedTradeAccount;
            this.Competitors = competitors;
            this.ProductTypeGroups = productTypeGroups;
            this.Brands = brands;
            this.Currencies = currencies;
            this.NextFiveFinancialYears = nextFiveFinancialYears;
        }
    }
}