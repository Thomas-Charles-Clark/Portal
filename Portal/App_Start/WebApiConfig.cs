using Portal.Models;
using System.Web.Http;
using Microsoft.OData.Edm;
using System.Linq;
using System.Collections.Generic;
using Microsoft.Owin.Security.OAuth;
using SharedEFClasses.Models.Pricing;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Applications;
using SharedEFClasses.Models;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Models.Products;
using System;
using Microsoft.OData;
using System.Globalization;
using Microsoft.AspNet.OData.Extensions;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNet.OData.Batch;

namespace Portal
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            //builder.ComplexType<Lead>().ComplexProperty<Country>(p => p.Country);
            //builder.ComplexType<Lead>().ComplexProperty<LeadContact>(p => p.LeadContact);

            //config.MapODataServiceRoute("odata", "odata", GetEFModel());

            config.SuppressDefaultHostAuthentication();

            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            config.MapHttpAttributeRoutes();

            config.SetTimeZoneInfo(TimeZoneInfo.Local);

            config.MapODataServiceRoute("pricing", "pricing-odata", GetPricingModel());

            config.AddODataQueryFilter();

            var odataBuilder = new ODataConventionModelBuilder();

            odataBuilder.EntitySet<Country>("Countries");
            odataBuilder.EntitySet<Application>("Applications");
            odataBuilder.EntitySet<Language>("Languages");
            odataBuilder.EntitySet<Product>("Products");
            odataBuilder.EntitySet<TradeAccount>("TradeAccounts");
            odataBuilder.EntitySet<TradeAccountGroup>("TradeAccountGroups");
            odataBuilder.EntitySet<StockLocation>("StockLocations");
            odataBuilder.EntitySet<ApplicationGroup>("ApplicationGroups");
            odataBuilder.EntitySet<Resource>("Resources");
            odataBuilder.EntitySet<Resource_Language>("Resource_Languages");
            odataBuilder.EntitySet<TradeDeliveryContractPrice>("TradeDeliveryContractPrices");
            odataBuilder.EntitySet<DeliveryChargingLogic>("DeliveryChargingLogics");
            odataBuilder.EntitySet<DeliveryThresholdType>("DeliveryThresholdTypes");
            odataBuilder.EntitySet<DeliveryGroup>("DeliveryGroups");
            odataBuilder.EntitySet<Currency>("Currencies");
            odataBuilder.EntitySet<TradeAccount_TradeHaulier_Override>("TradeAccount_TradeHaulier_Overrides");
            odataBuilder.EntitySet<RingFencePreAllocation>("RingFencePreAllocations");
            odataBuilder.EntitySet<Document>("Documents");
            odataBuilder.EntitySet<Treatment>("Treatments");
            odataBuilder.EntitySet<Member>("Members");

            odataBuilder.EntityType<Resource_Language>().HasKey(p => new { p.ResourceID, p.LanguageID });

            var ringFencePreAllocationsFilterFunction = odataBuilder.EntityType<RingFencePreAllocation>()
                .Collection
                .Function("FilterRingFencePreAllocations")
                .ReturnsCollectionFromEntitySet<RingFencePreAllocation>("RingFencePreAllocations");

            ringFencePreAllocationsFilterFunction.Parameter<int?>("TradeAccountGroupID");
            ringFencePreAllocationsFilterFunction.Parameter<int?>("TradeAccountID");
            ringFencePreAllocationsFilterFunction.Parameter<int?>("ProductID");

            var ringFenceableProductsFilterFunction = odataBuilder.EntityType<Product>()
                .Collection
                .Function("GetRingFenceableProducts")
                .ReturnsCollectionFromEntitySet<Product>("Products");


            var tradeAccountValueMapperFunction = odataBuilder.EntityType<TradeAccount>()
                .Collection
                .Function("TradeAccountValueMapper")
                .ReturnsCollectionFromEntitySet<TradeAccount>("TradeAccounts");

            tradeAccountValueMapperFunction.Parameter<int?>("tradeAccountId");


            var tradeAccountGroupFilterFunction = odataBuilder.EntityType<TradeAccount>()
                .Collection
                .Function("TradeAccountGroupFilter")
                .ReturnsCollectionFromEntitySet<TradeAccount>("TradeAccounts");

            tradeAccountGroupFilterFunction.Parameter<int?>("tradeAccountGroupId");

            var tradeAccountGroupValueMapperFunction = odataBuilder.EntityType<TradeAccountGroup>()
                .Collection
                .Function("TradeAccountGroupValueMapper")
                .ReturnsCollectionFromEntitySet<TradeAccountGroup>("TradeAccountGroups");

            tradeAccountGroupValueMapperFunction.Parameter<int?>("tradeAccountGroupId");


            var memberFilterFunction = odataBuilder.EntityType<TradeAccount>()
                .Collection
                .Function("MemberFilter")
                .ReturnsCollectionFromEntitySet<Member>("Members");

            memberFilterFunction.Parameter<string>("searchTerm");

            var memberValueMapperFunction = odataBuilder.EntityType<Member>()
                .Collection
                .Function("MemberValueMapper")
                .ReturnsCollectionFromEntitySet<Member>("Members");

            memberValueMapperFunction.Parameter<int?>("id");



            var stockLocationValueMapperFunction = odataBuilder.EntityType<StockLocation>()
                .Collection
                .Function("StockLocationValueMapper")
                .ReturnsCollectionFromEntitySet<StockLocation>("StockLocations");

            stockLocationValueMapperFunction.Parameter<short?>("stockLocationId");


            var productValueMapperFunction = odataBuilder.EntityType<Product>()
                .Collection
                .Function("ProductValueMapper")
                .ReturnsCollectionFromEntitySet<Product>("Products");

            productValueMapperFunction.Parameter<int?>("productId");


            var tradeDeliveryContractPriceFilterFunction = odataBuilder
                .EntityType<TradeDeliveryContractPrice>()
                .Collection
                .Function("Filter")
                .ReturnsCollectionFromEntitySet<TradeDeliveryContractPrice>("TradeDeliveryContractPrices");

            tradeDeliveryContractPriceFilterFunction.Parameter<int?>("tradeAccountId");
            tradeDeliveryContractPriceFilterFunction.Parameter<short?>("destinationCountryId");
            tradeDeliveryContractPriceFilterFunction.Parameter<byte?>("deliveryGroupId");

            var languageGetExceptFunction = odataBuilder
                .EntityType<Language>()
                .Collection
                .Function("GetExcept")
                .ReturnsCollectionFromEntitySet<Language>("Languages");

            languageGetExceptFunction.Parameter<byte>("exceptLanguageId");

            var odataBatchHandler = new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer);
            
            config.MapODataServiceRoute(routeName: "OData", routePrefix: "odata", model: odataBuilder.GetEdmModel(), odataBatchHandler);

            config.Select().Expand().Filter().OrderBy().MaxTop(500).Count();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // what are we trying to sort out? Multiple routes to the same-named CONTROLLER. The EntityType defines the controller name.
            // therefore we can only have one controller per entity type>#
        }

        private static IEdmModel GetPricingModel()
        {
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();

            builder.EntitySet<SlicerBrand>("SlicerBrands");
            builder.EntitySet<SlicerProductTypeGroup>("SlicerProductTypeGroups");
            builder.EntitySet<SlicerProductType>("SlicerProductTypes");
            builder.EntitySet<SlicerItemType>("SlicerItemTypes");
            builder.EntitySet<SlicerLaunch>("SlicerLaunches");
            builder.EntitySet<SlicerSeason>("SlicerSeasons");
            builder.EntitySet<SlicerProduct>("SlicerProducts");
            builder.EntitySet<SlicerMarket>("SlicerMarkets");
            builder.EntitySet<SlicerTradePriceList>("SlicerTradePriceLists");
            builder.EntitySet<SlicerCurrency>("SlicerCurrencies");
            builder.EntitySet<SlicerShowClearance>("SlicerShowClearances");
            builder.EntitySet<SlicerIncludeSample>("SlicerIncludeSamples");

            builder.Namespace = "Functions";

            var mFilter = builder.EntityType<SlicerMarket>().Collection.Function("Filter");
            mFilter.ReturnsCollectionFromEntitySet<SlicerMarket>("SlicerMarkets");
            mFilter.Parameter<PreSlicerFunctionFilter>("f1");

            var tplFilter = builder.EntityType<SlicerTradePriceList>().Collection.Function("Filter");
            tplFilter.ReturnsCollectionFromEntitySet<SlicerTradePriceList>("SlicerTradePriceLists");
            tplFilter.Parameter<PreSlicerFunctionFilter>("f1");

            var cuFilter = builder.EntityType<SlicerCurrency>().Collection.Function("Filter");
            cuFilter.ReturnsCollectionFromEntitySet<SlicerCurrency>("SlicerCurrencies");
            cuFilter.Parameter<PreSlicerFunctionFilter>("f1");
            
            var bFilter = builder.EntityType<SlicerBrand>().Collection.Function("Filter");
            bFilter.ReturnsCollectionFromEntitySet<SlicerBrand>("SlicerBrands");
            bFilter.Parameter<PricingQueryFilter>("f1");

            var ptgFilter = builder.EntityType<SlicerProductTypeGroup>().Collection.Function("Filter");
            ptgFilter.ReturnsCollectionFromEntitySet<SlicerProductTypeGroup>("SlicerProductTypeGroups");
            ptgFilter.Parameter<PricingQueryFilter>("f1");

            var ptFilter = builder.EntityType<SlicerProductType>().Collection.Function("Filter");
            ptFilter.ReturnsCollectionFromEntitySet<SlicerProductType>("SlicerProductTypes");
            ptFilter.Parameter<PricingQueryFilter>("f1");

            var itFilter = builder.EntityType<SlicerItemType>().Collection.Function("Filter");
            itFilter.ReturnsCollectionFromEntitySet<SlicerItemType>("SlicerItemTypes");
            itFilter.Parameter<PricingQueryFilter>("f1");

            var lFilter = builder.EntityType<SlicerLaunch>().Collection.Function("Filter");
            lFilter.ReturnsCollectionFromEntitySet<SlicerLaunch>("SlicerLaunches");
            lFilter.Parameter<PricingQueryFilter>("f1");

            var sFilter = builder.EntityType<SlicerSeason>().Collection.Function("Filter");
            sFilter.ReturnsCollectionFromEntitySet<SlicerSeason>("SlicerSeasons");
            sFilter.Parameter<PricingQueryFilter>("f1");
            
            return builder.GetEdmModel();
        }

        private static IEdmModel GetEFModel()
        {
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<Lead>("LeadsOData");
            builder.EntitySet<Channel>("Channels");
            builder.EntitySet<Country>("Countries");
            builder.EntitySet<Currency>("Currencies");
            builder.EntitySet<Language>("Languages");
            builder.EntitySet<LeadContact>("LeadContacts");
            builder.EntitySet<LeadSource>("LeadSources");
            builder.EntitySet<LeadMagnitude>("LeadMagnitudes");
            builder.EntitySet<Member>("Members");
            builder.EntitySet<Member_RecentlyUsedMember>("MemberRecentlyUsedMembers");
            builder.EntitySet<LeadStatus>("LeadStatus");
            builder.EntitySet<Application>("Applications");
            builder.EntitySet<Role>("Roles");
            builder.EntitySet<Competitor>("Competitors");
            builder.EntitySet<PriceList>("PriceLists");
            builder.EntitySet<TradePriceList>("TradePriceLists");
            builder.EntitySet<TradePriceListType>("TradePriceListTypes");
            builder.EntitySet<TradeAccount>("TradeAccounts");
            builder.EntitySet<TradeAccountType>("TradeAccountTypes");
            builder.EntitySet<TradeArea>("TradeAreas");
            builder.EntitySet<SalesRepresentative>("SalesRepresentatives");
            builder.EntitySet<TradeAccount_Competitor>("TradeAccountCompetitors");
            builder.EntitySet<TradeAccountCompetitorNote>("TradeAccountCompetitorNotes");
            builder.EntitySet<Competitor>("Competitors");

            // used in CustomerEnquiryODataController
            builder.EntitySet<ProductTypeGroup>("ProductTypeGroups");
            builder.EntitySet<ProductType>("ProductTypes");
            builder.EntitySet<Brand>("Brands");
            builder.EntitySet<Product>("Products");
            builder.EntitySet<Stock>("Stocks");

            builder.EntitySet<Design>("Designs");
            builder.EntitySet<Collection>("Collections");
            builder.EntitySet<Product_Collection>("Product_Collections").EntityType
                .HasKey(p => new { ProductID = p.ProductID, CollectionID = p.CollectionID });

            var itemType = builder.EntitySet<ItemType>("ItemTypes");
            var launch = builder.EntitySet<Launch>("Launches");
            var season = builder.EntitySet<Season>("Seasons");
            var tradePriceList = builder.EntitySet<TradePriceList>("TradePriceLists");
            var currency = builder.EntitySet<Currency>("Currencies");

            builder.EntitySet<ProductTypeGroup_Brand_Country>("ProductTypeGroupBrandCountries").EntityType
                .HasKey(p => new { ProductTypeGroupID = p.ProductTypeGroupID, BrandID = p.BrandID, CountryID = p.CountryID });

            var memberRole = builder.EntitySet<Member_Role>("MemberRoles");
            memberRole.EntityType.HasKey(p => new { p.UserId, p.RoleId });

            var applicationRole = builder.EntitySet<Application_Role>("ApplicationRoles");
            applicationRole.EntityType.HasKey(p => new { p.ApplicationID, p.RoleID });

            var leadPotential = builder.EntitySet<LeadPotential>("LeadPotential");
            leadPotential.EntityType.HasKey(p => p.LeadID);

            var competitorLeads = builder.EntitySet<Lead_Competitor>("CompetitorLeads");
            competitorLeads.EntityType.HasKey(p => new { p.CompetitorID, p.LeadID });

            var leadInterests = builder.EntitySet<LeadInterest>("LeadInterests");
            leadInterests.EntityType.HasKey(p => new { p.LeadID, p.BrandID, p.ProductTypeGroupID });

            return builder.GetEdmModel();
        }
    }
}
