using System.Collections.Generic;
using Portal.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models;
using SharedEFClasses;
using SharedEFClasses.Models.Applications;
using System.Linq;
using SharedEFClasses.Models.TradeAccounts;

namespace Portal.ViewModels.ComponentModels
{
    public class TradeAccountSelectorViewModel : BaseViewModel
    {
        public bool CanSearch { get; set; }
        public bool CanCollapse { get; set; }
        public bool OrderProductsExtension { get; set; }
        public List<TradeMarketStub> TradeMarkets { get; set; }
        public TradeAccountNumber_AutocompleteResult Selected { get; set; }
        public List<TradeAccountPrimaryAddress> PrimaryAddresses { get; set; }
        public List<TradeAccountSecondaryAddress> SecondaryAddresses { get; set; }
        public string ButtonCssOverride { get; set; }

        public TradeAccountSelectorViewModel(
            TradeAccountNumber_AutocompleteResult selected,
            TradeAccountAddressReturn addresses,
            bool canSearch,
            bool canCollapse,
            RoleProperties properties,
            bool orderProductsExtension = false,
            List<TradeMarket> tradeMarkets = null) : base(properties)
        {
            this.Selected = selected;
            this.CanSearch = canSearch;
            this.CanCollapse = canCollapse;
            this.PrimaryAddresses = addresses?.PrimaryAddresses ?? new List<TradeAccountPrimaryAddress>();
            this.SecondaryAddresses = addresses?.SecondaryAddresses ?? new List<TradeAccountSecondaryAddress>();
            this.OrderProductsExtension = orderProductsExtension;
            this.TradeMarkets = tradeMarkets.Select(p => new TradeMarketStub() { TradeMarketID = p.TradeMarketID, Name = p.Name }).ToList() ?? new List<TradeMarketStub>();

            if (this.TradeMarkets.Any())
            {
                this.TradeMarkets.Insert(0, new TradeMarketStub() { TradeMarketID = -1, Name = "All Markets" });
            }
        }
    }
}