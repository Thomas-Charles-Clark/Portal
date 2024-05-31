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
using SharedEFClasses.Models.StockManagement;
using SharedEFClasses.Models.Attributes;
using Attribute = SharedEFClasses.Models.Attributes.Attribute;
using SharedEFClasses.Models.MertexLive;
using SharedEFClasses.Models.Fenwick;
using SharedEFClasses.Models.Maintenance;

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
            odataBuilder.EntitySet<Attribute>("Attributes");
            odataBuilder.EntitySet<AttributeGroup>("AttributeGroups");
            odataBuilder.EntitySet<Language>("Languages");
            odataBuilder.EntitySet<Colour>("Colours");
            odataBuilder.EntitySet<ProductColour>("ProductColours");
            odataBuilder.EntitySet<ProductGroup>("ProductGroups");
            odataBuilder.EntitySet<ItemType>("ItemTypes");
            odataBuilder.EntitySet<Haulier>("Hauliers");
            odataBuilder.EntitySet<ProductFilter>("ProductFilters");
            odataBuilder.EntitySet<ProductFilterGroup>("ProductFilterGroups");
            odataBuilder.EntitySet<Collection>("Collections");
            odataBuilder.EntitySet<Brand>("Brands");
            odataBuilder.EntitySet<MaintenanceBuyer>("Buyers");
            odataBuilder.EntitySet<SharedEFClasses.Models.Maintenance.MaintenanceSupplier>("Suppliers");
            odataBuilder.EntitySet<Launch>("Launches");
            odataBuilder.EntitySet<ProductType>("ProductTypes");
            odataBuilder.EntitySet<Quality>("Qualities");
            odataBuilder.EntitySet<SalesMarket>("SalesMarkets");
            odataBuilder.EntitySet<Mertex_ProductType>("Mertex_ProductTypes");
            odataBuilder.EntitySet<Product>("Products");
            odataBuilder.EntitySet<ProductPage>("ProductPages");
            odataBuilder.EntitySet<Branch>("Branches");
            odataBuilder.EntitySet<BranchGroup>("BranchGroups");
            odataBuilder.EntitySet<StatusGroup>("StatusGroups");
            odataBuilder.EntitySet<OrderLineDetailedStatus>("OrderLineDetailedStatus");
            odataBuilder.EntitySet<OrderLineDetailedStatusGroup>("OrderLineDetailedStatusGroups");
            odataBuilder.EntitySet<Range>("Ranges");
            odataBuilder.EntitySet<BranchStockLocation>("BranchStockLocations");
            odataBuilder.EntitySet<TradeAccount>("TradeAccounts");
            odataBuilder.EntitySet<TradeAccountType>("TradeAccountTypes");
            odataBuilder.EntitySet<TradeAccountGroup>("TradeAccountGroups");
            odataBuilder.EntitySet<StockLocation>("StockLocations");
            odataBuilder.EntitySet<StockLocationGroup>("StockLocationGroups");
            odataBuilder.EntitySet<StockLocationOrderBookGroup>("StockLocationOrderBookGroups");
            odataBuilder.EntitySet<StockStatus>("StockStatuses");
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
            odataBuilder.EntitySet<MarketingBudget>("MarketingBudgets");
            odataBuilder.EntitySet<SelfBillInvoice>("SelfBillInvoices");
            odataBuilder.EntitySet<SalesRepresentative>("SalesRepresentatives");
            odataBuilder.EntitySet<OrderHeadLive>("Orders");
            odataBuilder.EntitySet<OrderGroup>("OrderGroups");
            odataBuilder.EntitySet<TransactionType>("TransactionTypes");

            // This because it's not mapped to SQL and has the [NotMapped] attribute
            odataBuilder.StructuralTypes.First(t => t.ClrType == typeof(Mertex_ProductType)).AddProperty(typeof(Mertex_ProductType).GetProperty("Label"));
            odataBuilder.StructuralTypes.First(t => t.ClrType == typeof(Mertex_ProductType)).AddProperty(typeof(Mertex_ProductType).GetProperty("PseudoKey"));

            odataBuilder.StructuralTypes.First(t => t.ClrType == typeof(ProductFilterGroup)).AddProperty(typeof(ProductFilterGroup).GetProperty("ProductTypeIDs"));

            odataBuilder.StructuralTypes.First(t => t.ClrType == typeof(SalesMarket)).AddProperty(typeof(SalesMarket).GetProperty("Label"));
            odataBuilder.StructuralTypes.First(t => t.ClrType == typeof(SalesRepresentative)).AddProperty(typeof(SalesRepresentative).GetProperty("Label"));
            odataBuilder.StructuralTypes.First(t => t.ClrType == typeof(TradeAccount)).AddProperty(typeof(TradeAccount).GetProperty("ShortLabel"));
            //odataBuilder.StructuralTypes.First(t => t.ClrType == typeof(TradeAccountGroup)).AddProperty(typeof(TradeAccountGroup).GetProperty("ShortLabel"));
            //odataBuilder.StructuralTypes.First(t => t.ClrType == typeof(TradeAccountType)).AddProperty(typeof(TradeAccountType).GetProperty("ShortLabel"));
            odataBuilder.StructuralTypes.First(t => t.ClrType == typeof(Haulier)).AddProperty(typeof(Haulier).GetProperty("ShortLabel"));
            odataBuilder.StructuralTypes.First(t => t.ClrType == typeof(Product)).AddProperty(typeof(Product).GetProperty("ShortLabel"));
            odataBuilder.StructuralTypes.First(t => t.ClrType == typeof(Quality)).AddProperty(typeof(Quality).GetProperty("ShortLabel"));
            odataBuilder.StructuralTypes.First(t => t.ClrType == typeof(Collection)).AddProperty(typeof(Collection).GetProperty("ShortLabel"));
            odataBuilder.StructuralTypes.First(t => t.ClrType == typeof(OrderHeadLive)).AddProperty(typeof(OrderHeadLive).GetProperty("ShortLabel"));

            var transactionTypeValueMapperFunction = odataBuilder.EntityType<TransactionType>()
                .Collection
                .Function("TransactionTypeValueMapper")
                .ReturnsCollectionFromEntitySet<TransactionType>("TransactionTypes");

            transactionTypeValueMapperFunction.Parameter<byte?>("transactionTypeId");



            var orderGroupValueMapperFunction = odataBuilder.EntityType<OrderGroup>()
                .Collection
                .Function("OrderGroupValueMapper")
                .ReturnsCollectionFromEntitySet<OrderGroup>("OrderGroups");

            orderGroupValueMapperFunction.Parameter<byte?>("orderGroupId");


            var stockLocationGroupValueMapperFunction = odataBuilder.EntityType<StockLocationGroup>()
                .Collection
                .Function("StockLocationGroupValueMapper")
                .ReturnsCollectionFromEntitySet<StockLocationGroup>("StockLocationGroups");

            stockLocationGroupValueMapperFunction.Parameter<byte?>("stockLocationGroupId");


            var stockLocationOrderBookGroupValueMapperFunction = odataBuilder.EntityType<StockLocationOrderBookGroup>()
                .Collection
                .Function("StockLocationOrderBookGroupValueMapper")
                .ReturnsCollectionFromEntitySet<StockLocationOrderBookGroup>("StockLocationOrderBookGroups");

            stockLocationOrderBookGroupValueMapperFunction.Parameter<byte?>("stockLocationOrderBookGroupId");


            var orderLineDetailedStatusValueMapperFunction = odataBuilder.EntityType<OrderLineDetailedStatus>()
                .Collection
                .Function("OrderLineDetailedStatusValueMapper")
                .ReturnsCollectionFromEntitySet<OrderLineDetailedStatus>("OrderLineDetailedStatuses");

            orderLineDetailedStatusValueMapperFunction.Parameter<byte?>("orderLineDetailedStatusId");


            var orderLineDetailedStatusGroupValueMapperFunction = odataBuilder.EntityType<OrderLineDetailedStatusGroup>()
                .Collection
                .Function("OrderLineDetailedStatusGroupValueMapper")
                .ReturnsCollectionFromEntitySet<OrderLineDetailedStatusGroup>("OrderLineDetailedStatusGroups");

            orderLineDetailedStatusGroupValueMapperFunction.Parameter<byte?>("orderLineDetailedStatusGroupId");




            var orderValueMapper = odataBuilder.EntityType<OrderHeadLive>()
                .Collection
                .Function("OrderValueMapper")
                .ReturnsCollectionFromEntitySet<OrderHeadLive>("Orders");

            orderValueMapper.Parameter<string>("orderId");

            var orderOrderBookSummaryFilterFunction = odataBuilder.EntityType<OrderHeadLive>()
                .Collection
                .Function("GetOrdersForOrderBookSummary")
                .ReturnsCollectionFromEntitySet<OrderHeadLive>("Orders");


            odataBuilder.EntityType<Resource_Language>().HasKey(p => new { p.ResourceID, p.LanguageID });

            var ringFencePreAllocationsFilterFunction = odataBuilder.EntityType<RingFencePreAllocation>()
                .Collection
                .Function("FilterRingFencePreAllocations")
                .ReturnsCollectionFromEntitySet<RingFencePreAllocation>("RingFencePreAllocations");

            ringFencePreAllocationsFilterFunction.Parameter<int?>("TradeAccountGroupID");
            ringFencePreAllocationsFilterFunction.Parameter<int?>("TradeAccountID");
            ringFencePreAllocationsFilterFunction.Parameter<int?>("ProductID");

            var productValueMapperFunction = odataBuilder.EntityType<Product>()
                .Collection
                .Function("ProductValueMapper")
                .ReturnsCollectionFromEntitySet<Product>("Products");

            productValueMapperFunction.Parameter<int?>("productId");

            var productOrderBookSummaryFilterFunction = odataBuilder.EntityType<Product>()
                .Collection
                .Function("GetProductsForOrderBookSummary")
                .ReturnsCollectionFromEntitySet<Product>("Products");


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

            var tradeAccountOrderBookFilterFunction = odataBuilder.EntityType<TradeAccount>()
                .Collection
                .Function("TradeAccountOrderBookFilter")
                .ReturnsCollectionFromEntitySet<TradeAccount>("TradeAccounts");

            tradeAccountOrderBookFilterFunction.Parameter<byte?>("salesMarketId");
            tradeAccountOrderBookFilterFunction.Parameter<short?>("tradeAccountTypeId");
            tradeAccountOrderBookFilterFunction.Parameter<int?>("tradeAccountGroupId");





            var tradeAccountTypeFilterFunction = odataBuilder.EntityType<TradeAccount>()
                .Collection
                .Function("TradeAccountTypeFilter")
                .ReturnsCollectionFromEntitySet<TradeAccount>("TradeAccounts");

            tradeAccountTypeFilterFunction.Parameter<short?>("tradeAccountTypeId");




            var tradeAccountTypeOrderBookFilterFunction = odataBuilder.EntityType<TradeAccountType>()
                .Collection
                .Function("TradeAccountTypeOrderBookFilter")
                .ReturnsCollectionFromEntitySet<TradeAccountType>("TradeAccountTypes");

            tradeAccountTypeOrderBookFilterFunction.Parameter<byte?>("salesMarketId");
            tradeAccountTypeOrderBookFilterFunction.Parameter<int?>("tradeAccountGroupId");
            tradeAccountTypeOrderBookFilterFunction.Parameter<int?>("tradeAccountId");




            var tradeAccountTypeValueMapperFunction = odataBuilder.EntityType<TradeAccountType>()
                .Collection
                .Function("TradeAccountTypeValueMapper")
                .ReturnsCollectionFromEntitySet<TradeAccountType>("TradeAccountTypes");

            tradeAccountTypeValueMapperFunction.Parameter<short?>("tradeAccountTypeId");






            var tradeAccountGroupValueMapperFunction = odataBuilder.EntityType<TradeAccountGroup>()
                .Collection
                .Function("TradeAccountGroupValueMapper")
                .ReturnsCollectionFromEntitySet<TradeAccountGroup>("TradeAccountGroups");

            tradeAccountGroupValueMapperFunction.Parameter<int?>("tradeAccountGroupId");


            var tradeAccountGroupOrderBookFilterFunction = odataBuilder.EntityType<TradeAccountGroup>()
                .Collection
                .Function("TradeAccountGroupOrderBookFilter")
                .ReturnsCollectionFromEntitySet<TradeAccountGroup>("TradeAccountGroups");

            tradeAccountGroupOrderBookFilterFunction.Parameter<byte?>("salesMarketId");
            tradeAccountGroupOrderBookFilterFunction.Parameter<int?>("tradeAccountId");
            tradeAccountGroupOrderBookFilterFunction.Parameter<short?>("tradeAccountTypeId");







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



            var brandValueMapperFunction = odataBuilder.EntityType<Brand>()
                .Collection
                .Function("BrandValueMapper")
                .ReturnsCollectionFromEntitySet<Brand>("Brands");

            brandValueMapperFunction.Parameter<byte?>("brandId");


            var buyerMapperFunction = odataBuilder.EntityType<MaintenanceBuyer>()
                .Collection
                .Function("BuyerValueMapper")
                .ReturnsCollectionFromEntitySet<MaintenanceBuyer>("Buyers");

            buyerMapperFunction.Parameter<string>("buyerCode");


            var supplierMapperFunction = odataBuilder.EntityType<SharedEFClasses.Models.Maintenance.MaintenanceSupplier>()
                .Collection
                .Function("SupplierValueMapper")
                .ReturnsCollectionFromEntitySet<SharedEFClasses.Models.Maintenance.MaintenanceSupplier>("Suppliers");

            supplierMapperFunction.Parameter<string>("supplierCode");



            var colourValueMapperFunction = odataBuilder.EntityType<Colour>()
                .Collection
                .Function("ColourValueMapper")
                .ReturnsCollectionFromEntitySet<Colour>("Colours");

            colourValueMapperFunction.Parameter<byte?>("colourId");


            var qualityValueMapperFunction = odataBuilder.EntityType<Quality>()
                .Collection
                .Function("QualityValueMapper")
                .ReturnsCollectionFromEntitySet<Quality>("Quality");

            qualityValueMapperFunction.Parameter<string>("name");



            var productColourValueMapperFunction = odataBuilder.EntityType<ProductColour>()
                .Collection
                .Function("ProductColourValueMapper")
                .ReturnsCollectionFromEntitySet<ProductColour>("ProductColours");

            productColourValueMapperFunction.Parameter<string>("name");


            var productGroupValueMapperFunction = odataBuilder.EntityType<ProductGroup>()
                .Collection
                .Function("ProductGroupValueMapper")
                .ReturnsCollectionFromEntitySet<ProductGroup>("ProductGroups");

            productGroupValueMapperFunction.Parameter<byte>("productGroupId");

            var productGroupsForContractPricing = odataBuilder.EntityType<ProductGroup>()
                .Collection
                .Function("GetProductGroupsForContractPricing")
                .ReturnsCollectionFromEntitySet<ProductGroup>("ProductGroups");


            var itemTypeValueMapperFunction = odataBuilder.EntityType<ItemType>()
                .Collection
                .Function("ItemTypeValueMapper")
                .ReturnsCollectionFromEntitySet<ItemType>("ItemTypes");

            itemTypeValueMapperFunction.Parameter<byte>("itemTypeId");

            var itemTypesForContractPricing = odataBuilder.EntityType<ItemType>()
                .Collection
                .Function("GetItemTypesForContractPricing")
                .ReturnsCollectionFromEntitySet<ProductGroup>("ItemType");



            var haulierValueMapperFunction = odataBuilder.EntityType<Haulier>()
                .Collection
                .Function("HaulierValueMapper")
                .ReturnsCollectionFromEntitySet<Haulier>("Hauliers");

            haulierValueMapperFunction.Parameter<string>("haulierCode");


            var productFilterValueMapperFunction = odataBuilder.EntityType<ProductFilter>()
                .Collection
                .Function("ProductFilterValueMapper")
                .ReturnsCollectionFromEntitySet<ProductFilter>("ProductFilters");

            productFilterValueMapperFunction.Parameter<byte?>("productFilterId");



            var productFilterGroupValueMapperFunction = odataBuilder.EntityType<ProductFilterGroup>()
                .Collection
                .Function("ProductFilterGroupValueMapper")
                .ReturnsCollectionFromEntitySet<ProductFilterGroup>("ProductFilterGroups");

            productFilterGroupValueMapperFunction.Parameter<byte?>("productFilterGroupId");


            var collectionValueMapperFunction = odataBuilder.EntityType<Collection>()
                .Collection
                .Function("CollectionValueMapper")
                .ReturnsCollectionFromEntitySet<Collection>("Collections");

            collectionValueMapperFunction.Parameter<short?>("collectionId");


            var launchValueMapperFunction = odataBuilder.EntityType<Launch>()
                .Collection
                .Function("LaunchValueMapper")
                .ReturnsCollectionFromEntitySet<Launch>("Launches");

            launchValueMapperFunction.Parameter<short?>("launchId");



            var stockLocationValueMapperFunction = odataBuilder.EntityType<StockLocation>()
                .Collection
                .Function("StockLocationValueMapper")
                .ReturnsCollectionFromEntitySet<StockLocation>("StockLocations");

            stockLocationValueMapperFunction.Parameter<short?>("stockLocationId");


            var stockStatusValueMapperFunction = odataBuilder.EntityType<StockStatus>()
                .Collection
                .Function("StockStatusValueMapper")
                .ReturnsCollectionFromEntitySet<StockStatus>("StockStatuses");

            stockStatusValueMapperFunction.Parameter<byte?>("stockStatusId");


            var tradeDeliveryContractPriceFilterFunction = odataBuilder
                .EntityType<TradeDeliveryContractPrice>()
                .Collection
                .Function("Filter")
                .ReturnsCollectionFromEntitySet<TradeDeliveryContractPrice>("TradeDeliveryContractPrices");

            tradeDeliveryContractPriceFilterFunction.Parameter<int?>("tradeAccountId");
            tradeDeliveryContractPriceFilterFunction.Parameter<short?>("destinationCountryId");
            tradeDeliveryContractPriceFilterFunction.Parameter<byte?>("deliveryGroupId");


            var marketingBudgetFilterFunction = odataBuilder
                .EntityType<MarketingBudget>()
                .Collection
                .Function("Filter")
                .ReturnsCollectionFromEntitySet<MarketingBudget>("MarketingBudgets");

            marketingBudgetFilterFunction.Parameter<byte?>("priceListId");
            marketingBudgetFilterFunction.Parameter<short?>("marketingChannelId");
            marketingBudgetFilterFunction.Parameter<string>("period");


            var languageGetExceptFunction = odataBuilder
                .EntityType<Language>()
                .Collection
                .Function("GetExcept")
                .ReturnsCollectionFromEntitySet<Language>("Languages");

            languageGetExceptFunction.Parameter<byte>("exceptLanguageId");



            var branchValueMapperFunction = odataBuilder.EntityType<Branch>()
                .Collection
                .Function("BranchValueMapper")
                .ReturnsCollectionFromEntitySet<Branch>("Branch");

            branchValueMapperFunction.Parameter<int?>("branchId");


            var branchGroupValueMapperFunction = odataBuilder.EntityType<BranchGroup>()
                .Collection
                .Function("BranchGroupValueMapper")
                .ReturnsCollectionFromEntitySet<BranchGroup>("BranchGroup");

            branchGroupValueMapperFunction.Parameter<int?>("branchGroupId");


            var branchGroupFilterFunction = odataBuilder.EntityType<Branch>()
                .Collection
                .Function("BranchGroupFilter")
                .ReturnsCollectionFromEntitySet<Branch>("Branches");

            branchGroupFilterFunction.Parameter<int?>("branchGroupId");


            var statusGroupValueMapperFunction = odataBuilder.EntityType<StatusGroup>()
                .Collection
                .Function("StatusGroupValueMapper")
                .ReturnsCollectionFromEntitySet<StatusGroup>("StatusGroup");

            statusGroupValueMapperFunction.Parameter<byte?>("statusGroupId");


            var attributeGroupValueMapperFunction = odataBuilder.EntityType<AttributeGroup>()
                .Collection
                .Function("AttributeGroupValueMapper")
                .ReturnsCollectionFromEntitySet<AttributeGroup>("AttributeGroup");

            attributeGroupValueMapperFunction.Parameter<byte?>("attributeGroupId");


            var attributeValueMapperFunction = odataBuilder.EntityType<Attribute>()
                .Collection
                .Function("AttributeValueMapper")
                .ReturnsCollectionFromEntitySet<Attribute>("Attribute");

            attributeValueMapperFunction.Parameter<short?>("attributeId");




            var salesMarketValueMapperFunction = odataBuilder.EntityType<SalesMarket>()
                .Collection
                .Function("SalesMarketValueMapper")
                .ReturnsCollectionFromEntitySet<SalesMarket>("SalesMarket");

            salesMarketValueMapperFunction.Parameter<byte?>("salesMarketId");



            var salesMarketOrderBookFilterFunction = odataBuilder.EntityType<SalesMarket>()
                .Collection
                .Function("SalesMarketOrderBookFilter")
                .ReturnsCollectionFromEntitySet<SalesMarket>("SalesMarkets");

            salesMarketOrderBookFilterFunction.Parameter<int?>("tradeAccountId");
            salesMarketOrderBookFilterFunction.Parameter<short?>("tradeAccountTypeId");
            salesMarketOrderBookFilterFunction.Parameter<int?>("tradeAccountGroupId");





            var salesRepresentativeValueMapperFunction = odataBuilder.EntityType<SalesRepresentative>()
                .Collection
                .Function("SalesRepresentativeValueMapper")
                .ReturnsCollectionFromEntitySet<SalesRepresentative>("SalesRepresentative");

            salesRepresentativeValueMapperFunction.Parameter<short?>("salesRepresentativeId");


            var productTypeValueMapperFunction = odataBuilder.EntityType<ProductType>()
                .Collection
                .Function("ProductTypeValueMapper")
                .ReturnsCollectionFromEntitySet<ProductType>("ProductType");

            productTypeValueMapperFunction.Parameter<byte?>("productTypeId");


            var mertexProductTypeValueMapperFunction = odataBuilder.EntityType<Mertex_ProductType>()
                .Collection
                .Function("Mertex_ProductTypeValueMapper")
                .ReturnsCollectionFromEntitySet<Mertex_ProductType>("Mertex_ProductType");

            mertexProductTypeValueMapperFunction.Parameter<byte?>("productGroupId");
            mertexProductTypeValueMapperFunction.Parameter<short?>("itemTypeId");



            var selfBillInvoiceValueMapperFunction = odataBuilder.EntityType<SelfBillInvoice>()
                .Collection
                .Function("SelfBillInvoiceValueMapper")
                .ReturnsCollectionFromEntitySet<SelfBillInvoice>("SelfBillInvoice");

            selfBillInvoiceValueMapperFunction.Parameter<int?>("selfBillInvoiceId");


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
            builder.EntitySet<Launch>("Launches");
            builder.EntitySet<Colour>("Colours");
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
