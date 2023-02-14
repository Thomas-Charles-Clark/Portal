using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Downloads.ViewModels
{
    public class DownloadProductsViewModel : BaseViewModel
    {
        public TradeAccount PreselectedTradeAccount { get; set; }

        public List<ProductFilter_SelectResult> ProductFilterButtons { get; set; }

        public List<ProductFilter_SelectResult> CompleteProductFilterButtonSet { get; set; }

        public List<Brand> BrandFilterButtons { get; set; }

        public List<Launch> LaunchFilterButtons { get; set; }

        public List<Pattern> PatternFilterButtons { get; set; }

        public List<ProductFilter_ItemTypeSelect> ItemTypeFilterButtons { get; set; }

        public List<ProductFilter_StockSelect> StockFilterButtons { get; set; }

        public List<Martindale> MartindaleFilterButtons { get; set; }

        public List<SizeOption> SizeFilterButtons { get; set; }

        public List<ProductSortOptionResult> SortOptions { get; set; }
        
        public DownloadProductsViewModel(
            PortalDbContext portalDb,
            TradeAccount preselectedTradeAccount,
            string applicationHeading,
            string applicationSubHeading,
            RoleProperties roleProperties) : base(roleProperties, applicationHeading, applicationSubHeading)
        {
            PreselectedTradeAccount = preselectedTradeAccount;

            var productSearchFilterDefault = new PassProductSearchFilter()
            {
                launchId = null,
                clearance = "all",
                searchNew = false,
                tradeAccountId = preselectedTradeAccount?.TradeAccountID ?? -1,
                applicationId = 76
            };

            var filterButtonResults = portalDb.FetchProductSearchFilters(productSearchFilterDefault);

            ProductFilterButtons = filterButtonResults.CurrentSet;

            CompleteProductFilterButtonSet = filterButtonResults.CompleteSet;

            StockFilterButtons = portalDb.ProductStockFilterSelect(productSearchFilterDefault);

            var brandIds = new List<byte>() { 1, 2, 6, 8, 9, 14 };

            BrandFilterButtons = portalDb.Brands.Where(p => brandIds.Contains(p.BrandID)).OrderBy(p => p.SortOrder).ToList();

            LaunchFilterButtons = portalDb.Launches.Where(p => p.TradeLaunchDate != null &&
                !p.Name.Contains("Mid")).OrderByDescending(p => p.LaunchID).Take(4).ToList();

            PatternFilterButtons = portalDb.Patterns.Where(p => p.Deleted == false).OrderBy(p => p.PatternID).ToList();

            ItemTypeFilterButtons = portalDb.ItemTypeSelect(new PassProductSearch() { productFilterId = null });

            MartindaleFilterButtons = portalDb.Martindales.OrderBy(p => p.MartindaleID).ToList();
            
            SortOptions = portalDb.FetchProductSortOptions();

            SizeFilterButtons = portalDb.FetchSizeOptions(null);
        }
    }
}