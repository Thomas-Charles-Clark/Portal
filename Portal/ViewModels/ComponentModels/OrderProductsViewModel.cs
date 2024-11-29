using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.ViewModels.ComponentModels
{
    public class OrderProductsViewModel
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

        public List<DeliveryFOCReason> DeliveryFOCReasons { get; set; }

        public List<DiscountReason> DiscountReasons { get; set; }

        public List<ProductSortOptionResult> SortOptions { get; set; }

        public List<SavedBasketReason> SavedBasketReasons { get; set; }
        
        public List<TransactionType> TransactionTypes { get; set; }
        public List<DiscountFOCPromoCode> TradePromotionCodes { get; set; }
        public List<Country> VATCountries { get; set; }
        public List<CallType> CallTypes { get; set; }

        public OrderProductsViewModel(
            TradeAccount preselectedTradeAccount,
            PortalDbContext portalDb)
        {
            PreselectedTradeAccount = preselectedTradeAccount;

            var productSearchFilterDefault = new PassProductSearchFilter()
            {
                launchId = null,
                clearance = "all",
                searchNew = false,
                tradeAccountId = preselectedTradeAccount?.TradeAccountID ?? -1
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

            DeliveryFOCReasons = portalDb.DeliveryFOCReasons.OrderBy(p => p.DeliveryFOCReasonID).ToList();

            DiscountReasons = portalDb.DiscountReasons.OrderBy(d => d.Name).ToList();

            SortOptions = portalDb.FetchProductSortOptions();

            SizeFilterButtons = portalDb.FetchSizeOptions(null);

            SavedBasketReasons = portalDb.SavedBasketReasons.OrderBy(p => p.SavedBasketReasonID).ToList();

            TransactionTypes = portalDb.TransactionTypes.OrderBy(p => p.TransactionTypeID).ToList();

            TradePromotionCodes = portalDb.TradePromotionCodeSelect();

            VATCountries = portalDb.Countries.Where(p => p.EU == true && p.IsCountry == true && p.DeletedDT == null).OrderBy(p => p.Name).ToList();

            CallTypes = portalDb.CallTypes.OrderBy(p => p.CallTypeID).ToList();
        }
    }
}