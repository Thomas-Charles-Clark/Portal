using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models.Applications;
using SharedEFClasses.Models.Attributes;
using SharedEFClasses.Models.DotDigital;
using SharedEFClasses.Models.Fenwick;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Maintenance;
using SharedEFClasses.Models.Marketing;
using SharedEFClasses.Models.Mertexer;
using SharedEFClasses.Models.OrderBook;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Parcel;
using SharedEFClasses.Models.Press;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.Retail;
using SharedEFClasses.Models.Samples;
using SharedEFClasses.Models.StockManagement;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Models.TradeOrders;
using SharedEFClasses.ReturnModels;

using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.Migrations;

using DeliveryTerm = SharedEFClasses.Models.Mertexer.DeliveryTerm;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public PortalDbContext() : base("vm-sql")
        {
            // for debugging with - this throws every time fetchAlerts is called on the signalR hub...
            // but that can be ignored. Very handy way to get dbContext output, this:
            //this.Database.Log = (s) => System.Diagnostics.Debug.WriteLine(s);
        }

        public PortalDbContext(string connectionName = "vm-sql")
            : base(connectionName)
        {
        }

        static PortalDbContext()
        {
            // Set the database intializer which is run once during application start
            // This seeds the database with admin user credentials and admin role
            System.Data.Entity.Database.SetInitializer<PortalDbContext>(new ApplicationDbInitializer());
        }

        public static PortalDbContext Create()
        {
            return new PortalDbContext();
        }

        #region Properties

        #region General

        public DbSet<GlobalVariable> GlobalVariables { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<MertexLanguage> MertexLanguages { get; set; }
        public DbSet<CountryLanguage> CountryLanguages { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<Channel> Channels { get; set; }
        public DbSet<ChannelGroup> ChannelGroups { get; set; }
        public DbSet<FormalTitle> Titles { get; set; }
        public DbSet<Gender> Genders { get; set; }
        public DbSet<ProductTypeGroup> ProductTypeGroups { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Mertex_ExchangeRate> MertexExchangeRates { get; set; }
        public DbSet<Competitor> Competitors { get; set; }
        public DbSet<CompanyType> CompanyTypes { get; set; }
        public DbSet<PriceList> PriceLists { get; set; }
        public DbSet<SalesRepresentative> SalesRepresentatives { get; set; }
        public DbSet<SalesRepresentative_SalesMarket> SalesRepresentative_SalesMarkets { get; set; }
        public DbSet<SalesAgent> SalesAgents { get; set; }
        public DbSet<SalesArea> SalesAreas { get; set; }
        public DbSet<PaymentTerms> PaymentTerms { get; set; }
        public DbSet<PaymentTermsType> PaymentTermsTypes { get; set; }
        public DbSet<SalesMarket> SalesMarkets { get; set; }
        public DbSet<Colour> Colours { get; set; }
        public DbSet<Pattern> Patterns { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Member_Department> Member_Departments { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<Resource_Language> Resource_Languages { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<DocumentResource> DocumentResources { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Mertex.OrderTaker> OrderTakers { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }

        #endregion

        #region Product

        public DbSet<Product> Products { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<StockStatus> StockStatuses { get; set; }
        public DbSet<ProductType> ProductTypes { get; set; }
        public DbSet<Products.Collection> Collections { get; set; }
        public DbSet<Product_Collection> Product_Collections { get; set; }
        public DbSet<Design> Designs { get; set; }
        public DbSet<ItemType> ItemTypes { get; set; }
        public DbSet<ProductGroup> ProductGroups { get; set; }
        public DbSet<Launch> Launches { get; set; }
        public DbSet<Season> Seasons { get; set; }
        public DbSet<Market> Markets { get; set; }
        public DbSet<Quality> Qualities { get; set; }
        public DbSet<SampleRequestSlicerData> SampleRequestSlicerData { get; set; }
        public DbSet<Attribute> Attributes { get; set; }
        public DbSet<AttributeGroup> AttributeGroups { get; set; }
        public DbSet<Filter_Product> Filters_Products { get; set; }
        public DbSet<Martindale> Martindales { get; set; }
        public DbSet<AdvertisingImage> AdvertisingImages { get; set; }
        public DbSet<Treatment> Treatments { get; set; }
        public DbSet<TreatmentType> TreatmentTypes { get; set; }
        public DbSet<TreatmentStatus> TreatmentStatuses { get; set; }
        public DbSet<TreatmentProvider> TreatmentProviders { get; set; }
        public DbSet<Mertex_ProductType> Mertex_ProductTypes { get; set; }
        public DbSet<ProductPage> ProductPages { get; set; }
        public DbSet<ProductFilter> ProductFilters { get; set; }
        public DbSet<ProductFilterGroup> ProductFilterGroups { get; set; }

        public DbSet<ContractProductRestriction> ContractProductRestrictions { get; set; }

        public DbSet<MertexProductClassificationSuperSet> MertexProductClassificationSuperSet { get; set; }
        public DbSet<MertexTradeAccountClassificationSuperSet> MertexTradeAccountClassificationSuperSet { get; set; }

        #endregion

        #region Maintenance

        public DbSet<MaintenanceProductType> MaintenanceProductTypes { get; set; }

        public DbSet<MaintenanceColour> MaintenanceColours { get; set; }

        public DbSet<MaintenancePattern> MaintenancePatterns { get; set; }

        public DbSet<MaintenanceBuyer> MaintenanceBuyers { get; set; }

        public DbSet<MaintenanceSupplier> MaintenanceSuppliers { get; set; }

        #endregion


        #region PreAllocations 

        public DbSet<RingFencePreAllocation> RingFencePreAllocations { get; set; }

        #endregion

        #region Delivery

        public DbSet<DeliveryGroup> DeliveryGroups { get; set; }
        public DbSet<DefaultDeliveryService> DefaultDeliveryServices { get; set; }
        public DbSet<AlternateDeliveryService> AlternateDeliveryServices { get; set; }
        public DbSet<TradeDeliveryContractPrice> TradeDeliveryContractPrices { get; set; }
        public DbSet<FulfilmentType> FulfilmentTypes { get; set; }
        public DbSet<DeliveryThresholdType> DeliveryThresholdTypes { get; set; }
        public DbSet<TransferType> TransferTypes { get; set; }
        public DbSet<DeliveryZone> DeliveryZones { get; set; }
        public DbSet<DeliveryChargingLogic> DeliveryChargingLogics { get; set; }
        public DbSet<CarriageCodeMap> CarriageCodeMaps { get; set; }
        public DbSet<UPSAccount> UPSAccounts { get; set; }

        #endregion

        #region returns
        public DbSet<Return> Returns { get; set; }
        public DbSet<ReturnParcel> ReturnParcels { get; set; }
        public DbSet<ReturnParcel_Product> ReturnParcelProducts { get; set; }
        public DbSet<ReturnCollection> ReturnCollections { get; set; }
        public DbSet<ReturnCollection_ReturnParcel> ReturnCollectionParcels { get; set; }
        #endregion

        #region Tuffnells 

        public DbSet<Tuffnells.Account> TuffnellsAccounts { get; set; }
        public DbSet<Tuffnells.AccountAddress> TuffnellsAccountAddresses { get; set; }
        public DbSet<Tuffnells.TuffnellsConsignment> TuffnellsConsignments { get; set; }
        public DbSet<Tuffnells.PackageType> TuffnellsPackageTypes { get; set; }
        public DbSet<Tuffnells.Service> TuffnellsServices { get; set; }

        #endregion

        #region UPS

        public DbSet<UPS.UPSConsignment> UPSConsignments { get; set; }

        #endregion

        #region Application

        public DbSet<Application> Applications { get; set; }
        public DbSet<ApplicationGroup> ApplicationGroups { get; set; }

        #endregion

        #region Trade

        public DbSet<TradeAccount> TradeAccounts { get; set; }
        public DbSet<TradeAccountAddress> TradeAccountAddresses { get; set; }
        public DbSet<TradeLanguage> TradeLanguages { get; set; }
        public DbSet<TradeAccountGroup> TradeAccountGroups { get; set; }
        public DbSet<TradeAccountVisit> TradeAccountVisits { get; set; }
        public DbSet<TradeAccountVisit_TradeAccountContact> TradeAccountVisit_TradeAccountContacts { get; set; }
        public DbSet<TradeAccountVisit_Product> TradeAccountVisit_Products { get; set; }
        public DbSet<TradeDeliveryType> TradeDeliveryTypes { get; set; }
        public DbSet<TradeHaulier> TradeHauliers { get; set; }
        public DbSet<TradeCarriage> TradeCarriages { get; set; }
        public DbSet<TradeCarriage_Country> TradeCarriageCountryRestrictions { get; set; }
        public DbSet<TradeCarriage_Price> TradeCarriagePrices { get; set; }
        public DbSet<DeliveryTerm> DeliveryTerms { get; set; }
        public DbSet<SalesDivision> SalesDivisions { get; set; }
        public DbSet<TradeAccountClass> TradeAccountClasses { get; set; }
        public DbSet<MertexOperator> MertexOperators { get; set; }
        public DbSet<TradePriceList> TradePriceLists { get; set; }
        public DbSet<TradePriceListType> TradePriceListTypes { get; set; }
        public DbSet<TradeArea> TradeAreas { get; set; }
        public DbSet<TradeAccount_Competitor> TradeAccount_Competitors { get; set; }
        public DbSet<TradeAccountCompetitorNote> TradeAccount_CompetitorNotes { get; set; }
        public DbSet<TradeAccountPotential> TradeAccountPotential { get; set; }
        public DbSet<TradeAdvertiser> TradeAdvertisers { get; set; }
        public DbSet<TradeAccount_TradeAdvertiser> TradeAccount_TradeAdvertisers { get; set; }
        public DbSet<TradeAccount_Tag> TradeAccount_Tags { get; set; }
        public DbSet<TradeAccountFilter> TradeAccountFilters { get; set; }
        public DbSet<TradeAccountType> TradeAccountTypes { get; set; }
        public DbSet<TradeAccountNote> TradeAccountNotes { get; set; }
        public DbSet<TradeAccountContact> TradeAccountContacts { get; set; }

        public DbSet<TradeAccountContact_Tag> TradeAccountContactTags { get; set; }
        public DbSet<TradeAccountAddress_Tag> TradeAccountAddressTags { get; set; }
        public DbSet<TradeAccount_TradeHaulier_Override> TradeAccountTradeHaulierOverrides { get; set; }

        public DbSet<TradeAccount_InvoiceAddress_LoqateSuggestion> TradeAccountInvoiceAddressLoqateSuggestions { get; set; }

        public DbSet<Models.Mertexer.Bank> Banks { get; set; }
        public DbSet<Models.Mertexer.Bank_SalesMarket> BankSalesMarketMap { get; set; }
        public DbSet<Models.Mertexer.CreditController> CreditControllers { get; set; }
        public DbSet<Models.Mertexer.CreditController_SalesMarket> CreditControllerSalesMarketMap { get; set; }

        public DbSet<TradeAccountCreationEmail> TradeAccountCreationEmails { get; set; }
        public DbSet<TradeAccountCreationEmailAttachment> TradeAccountCreationEmailAttachments { get; set; }
        public DbSet<CreditControlRegion> CreditControlRegions { get; set; }
        public DbSet<CreditControlRegion_SalesMarket> CreditControlRegions_SalesMarkets { get; set; }
        public DbSet<TradeAccountCreationEmail_TradeAccountCreationEmailAttachment> TradeAccountCreationEmails_TradeAccountCreationEmailAttachments { get; set; }

        #endregion

        #region Order

        public DbSet<OrderHead> OrderHeads { get; set; }
        public DbSet<OrderStatus> OrderStatuses { get; set; }
        public DbSet<ProductRangeButton> ProductRangeButtons { get; set; }
        public DbSet<OrderLineStatus> OrderLineStatuses { get; set; }
        public DbSet<OrderLineStatusGroup> OrderLineStatusGroups { get; set; }
        public DbSet<OrderLineDetailedStatus> OrderLineDetailedStatuses { get; set; }
        public DbSet<OrderLineDetailedStatusGroup> OrderLineDetailedStatusGroups { get; set; }
        public DbSet<TradePromotionCode> TradePromotionCodes { get; set; }
        public DbSet<OrderGroup> OrderGroups { get; set; }

        public DbSet<Member_Basket> MemberBaskets { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<BasketItem> BasketItems { get; set; }
        public DbSet<BasketItemLineMemo> BasketItemLineMemos { get; set; }
        public DbSet<LineMemoType> LineMemoTypes { get; set; }
        public DbSet<BasketPreAllocation> BasketPreAllocations { get; set; }
        public DbSet<DeliveryFOCReason> DeliveryFOCReasons { get; set; }
        public DbSet<DiscountReason> DiscountReasons { get; set; }
        public DbSet<SavedBasketReason> SavedBasketReasons { get; set; }
        public DbSet<TransactionType> TransactionTypes { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<DocumentType> DocumentTypes { get; set; }
        public DbSet<CallType> CallTypes { get; set; }
        public DbSet<TradeAccountAddressCleanse> TradeAccountAddressCleanses { get; set; }
        public DbSet<OrderLine> OrderLines { get; set; }
        public DbSet<OrderImportSource> OrderImportSources { get; set; }
        public DbSet<TransactionHoldReason> TransactionHoldReasons { get; set; }
        public DbSet<Mertex_DeliveryType> DeliveryTypes { get; set; }

        #endregion

        #region Furniture 

        public DbSet<FurnitureComponent> FurnitureComponents { get; set; }
        public DbSet<FurnitureCoverType> FurnitureCoverTypes { get; set; }
        public DbSet<FurnitureCushionFilling> FurnitureCushionFillings { get; set; }
        public DbSet<FurnitureDesign> FurnitureDesigns { get; set; }
        public DbSet<FurnitureDesign_SeatCushionFilling> FurnitureDesignSeatCushionFillings { get; set; }
        public DbSet<FurnitureDesign_BackCushionFilling> FurnitureDesignBackCushionFillings { get; set; }
        public DbSet<FurnitureDesign_LegType> FurnitureDesignLegTypes { get; set; }
        public DbSet<FurnitureDesign_Supplier_CoverType> FurnitureDesignSupplierCoverTypes { get; set; }
        public DbSet<FurnitureFabricPricePoint> FurnitureFabricPricePoints { get; set; }
        public DbSet<FurnitureLeatherColour> FurnitureLeatherColours { get; set; }
        public DbSet<FurnitureLeatherRange> FurnitureLeatherRanges { get; set; }
        public DbSet<FurnitureLeg> FurnitureLegs { get; set; }
        public DbSet<FurnitureLegType> FurnitureLegTypes { get; set; }
        public DbSet<FurnitureMaterialBreakdown> FurnitureMaterialBreakdowns { get; set; }
        public DbSet<FurnitureMaterialGroup> FurnitureMaterialGroups { get; set; }
        public DbSet<FurnitureMixedFabricPricePoint> FurnitureMixedFabricPricePoints { get; set; }
        public DbSet<FurnitureModel> FurnitureModels { get; set; }
        public DbSet<FurnitureSeatType> FurnitureSeatTypes { get; set; }
        public DbSet<FurnitureStitchColour> FurnitureStitchColours { get; set; }
        public DbSet<FurnitureFabricRestriction> FurnitureFabricRestrictions { get; set; }
        public DbSet<FurnitureSupplier> FurnitureSuppliers { get; set; }
        public DbSet<HoldReason> HoldReasons { get; set; }

        #endregion

        #region Mertex live

        //public DbSet<MertexLive.Carriage> Carriages { get; set; }
        //public DbSet<MertexLive.ClaimHead> ClaimHeads { get; set; }
        //public DbSet<MertexLive.ClaimLine> ClaimLines { get; set; }
        //public DbSet<MertexLive.CommodityCodeObj> CommodityCodes { get; set; }
        //public DbSet<MertexLive.CommodityGroupCodeObj> CommodityGroupCodes { get; set; }
        //public DbSet<MertexLive.Composition> Compositions { get; set; }
        //public DbSet<MertexLive.CurrencyLive> Currencies_Live { get; set; }
        //public DbSet<MertexLive.DespatchHead> DespatchHeads { get; set; }
        //public DbSet<MertexLive.DespatchLine> DespatchLines { get; set; }
        //public DbSet<MertexLive.ExchangeRate> ExchangeRates { get; set; }
        //public DbSet<MertexLive.FlamCode> FlamCodes { get; set; }
        //public DbSet<MertexLive.Haulier> Hauliers { get; set; }
        //public DbSet<MertexLive.OrderHeadLive> OrderHeads_Live { get; set; }
        //public DbSet<MertexLive.OrderLineLive> OrderLines_Live { get; set; }
        //public DbSet<MertexLive.ParcelHead> ParcelHeads { get; set; }
        //public DbSet<MertexLive.ParcelLine> ParcelLines { get; set; }
        //public DbSet<MertexLive.ProductLive> Products_Live  { get; set; }
        //public DbSet<MertexLive.Product_Aftercare> Product_Aftercares_Live { get; set; }
        //public DbSet<MertexLive.PurchaseOrderHead> PurchaseOrderHeads { get; set; }
        //public DbSet<MertexLive.PurchaseOrderLine> PurchaseOrderLines { get; set; }
        //public DbSet<MertexLive.PurchaseOrderStatus> PurchaseOrderStatuses { get; set; }
        //public DbSet<MertexLive.PurchasePriceObj> PurchasePrices { get; set; }
        //public DbSet<MertexLive.QualityLive> Qualities_Live { get; set; }
        //public DbSet<MertexLive.Sundry> Sundries { get; set; }
        //public DbSet<MertexLive.Supplier> Suppliers { get; set; }





        public virtual DbSet<MertexLive.Carriage> Carriages { get; set; }

        public virtual DbSet<MertexLive.ClaimHead> ClaimHeads { get; set; }

        public virtual DbSet<MertexLive.ClaimLine> ClaimLines { get; set; }

        public virtual DbSet<MertexLive.CommodityCode> CommodityCodes { get; set; }

        public virtual DbSet<MertexLive.CommodityGroupCode> CommodityGroupCodes { get; set; }

        public virtual DbSet<MertexLive.Composition> Compositions { get; set; }

        public virtual DbSet<MertexLive.CurrencyLive> Currencies_Live { get; set; }

        public virtual DbSet<MertexLive.DespatchHead> DespatchHeads { get; set; }

        public virtual DbSet<MertexLive.DespatchLine> DespatchLines { get; set; }

        public virtual DbSet<MertexLive.ExchangeRate> ExchangeRates { get; set; }

        public virtual DbSet<MertexLive.FlamCode> FlamCodes { get; set; }

        public virtual DbSet<MertexLive.Haulier> Hauliers { get; set; }

        public virtual DbSet<MertexLive.HeldForSalesReason> HeldForSalesReasons { get; set; }

        public virtual DbSet<MertexLive.InvoiceHead> InvoiceHeads { get; set; }

        public virtual DbSet<MertexLive.InvoiceLine> InvoiceLines { get; set; }

        public virtual DbSet<MertexLive.OrderHeadLive> OrderHeads_Live { get; set; }

        public virtual DbSet<MertexLive.OrderLineLive> OrderLines_Live { get; set; }

        public virtual DbSet<MertexLive.OrderSyncReport> OrderSyncReports { get; set; }

        public virtual DbSet<MertexLive.ParcelHead> ParcelHeads { get; set; }

        public virtual DbSet<MertexLive.ParcelLine> ParcelLines { get; set; }

        public virtual DbSet<MertexLive.PriceListMap> PriceListMaps { get; set; }

        public virtual DbSet<MertexLive.ProductLive> Products_Live { get; set; }

        public virtual DbSet<MertexLive.ProductAftercare> ProductAftercares_Live { get; set; }

        public virtual DbSet<MertexLive.PurchaseOrderHead> PurchaseOrderHeads { get; set; }

        public virtual DbSet<MertexLive.PurchaseOrderLine> PurchaseOrderLines { get; set; }

        public virtual DbSet<MertexLive.PurchaseOrderStatus> PurchaseOrderStatuses { get; set; }

        public virtual DbSet<MertexLive.PurchasePrice> PurchasePrices { get; set; }

        public virtual DbSet<MertexLive.QualityLive> Qualities_Live { get; set; }

        public virtual DbSet<MertexLive.Sundry> Sundries { get; set; }

        public virtual DbSet<MertexLive.SupplierLive> Suppliers_Live { get; set; }

        public virtual DbSet<MertexLive.TradeAccountLive> TradeAccounts_Live { get; set; }

        public virtual DbSet<MertexLive.TradeAccountContactLive> TradeAccountContacts_Live { get; set; }

        public virtual DbSet<MertexLive.TradeAccountContactType> TradeAccountContactTypes { get; set; }

        public virtual DbSet<MertexLive.TradeAccountInvoiceAccount> TradeAccountInvoiceAccounts { get; set; }

        public virtual DbSet<MertexLive.ProductColour> ProductColours { get; set; }

        public virtual DbSet<MertexLive.CollectionLive> Collections_Live { get; set; }

        public virtual DbSet<OrderBookRecord> OrderBooks { get; set; }

        #endregion


        #region Lead

        public DbSet<Lead> Leads { get; set; }

        public DbSet<LeadAddress> LeadAddresses { get; set; }

        public DbSet<LeadContact> LeadContacts { get; set; }

        public DbSet<LeadMagnitude> LeadMagnitudes { get; set; }

        public DbSet<LeadSource> LeadSources { get; set; }

        public DbSet<LeadSourceGroup> LeadSourceGroups { get; set; }

        public DbSet<LeadStatus> LeadStatuses { get; set; }

        public DbSet<LeadStatusGroup> LeadStatusGroups { get; set; }

        public DbSet<LeadContactType> LeadContactTypes { get; set; }

        public DbSet<LeadPotential> LeadPotential { get; set; }

        public DbSet<ProductTypeGroup_Brand_Country> ProductTypeGroup_Brand_Country { get; set; }

        public DbSet<LeadInterest> LeadInterests { get; set; }

        public DbSet<LeadNote> LeadNotes { get; set; }
        public DbSet<LeadType> LeadTypes { get; set; }
        public DbSet<AccountType> AccountTypes { get; set; }
        public DbSet<CustomerType> CustomerTypes { get; set; }
        public DbSet<Lead_Tag> Lead_Tags { get; set; }
        public DbSet<PaymentOption> PaymentOptions { get; set; }

        public DbSet<RetailAppointmentType> RetailAppointmentType { get; set; }
        public DbSet<RetailAppointmentAgenda> RetailAppointmentAgenda { get; set; }
        public DbSet<Lead_TradeAccountCreationEmailAttachment> CreationEmailAttachments { get; set; }

        #endregion

        #region Marketing

        public DbSet<MarketingMessage> MarketingMessages { get; set; }

        public DbSet<MarketingChannelObject> MarketingChannels { get; set; }

        public DbSet<MarketingBudget> MarketingBudgetRecords { get; set; }

        #endregion

        #region Tasks

        public DbSet<PortalTask> Tasks { get; set; }
        public DbSet<TaskType> TaskTypes { get; set; }
        public DbSet<TaskStatus> TaskStatuses { get; set; }
        public DbSet<TaskStatusGroup> TaskStatusGroups { get; set; }
        public DbSet<ExternalStatus> ExternalStatuses { get; set; }
        public DbSet<ExternalCompany> ExternalCompanies { get; set; }
        public DbSet<TaskAssignmentHistory> TaskAssignmentHistories { get; set; }
        public DbSet<TaskChase> TaskChases { get; set; }
        public DbSet<TaskComment> TaskComments { get; set; }
        public DbSet<TaskDue> TaskDues { get; set; }
        public DbSet<Task_Attachment> TaskAttachments { get; set; }

        #endregion

        #region Projects

        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectCategory> ProjectCategories { get; set; }
        public DbSet<ProjectNote> ProjectNotes { get; set; }
        public DbSet<ProjectStatus> ProjectStatuses { get; set; }
        public DbSet<Project_Competitor> Project_Competitors { get; set; }
        public DbSet<Project_CompetitorQuote> Project_CompetitorQuotes { get; set; }
        public DbSet<ProjectType> ProjectTypes { get; set; }
        public DbSet<TradeMarket> TradeMarkets { get; set; }
        public DbSet<ProjectStakeholder> ProjectStakeholders { get; set; }
        public DbSet<ProjectStakeholderType> ProjectStakeholderTypes { get; set; }
        public DbSet<Project_Attachment> ProjectAttachments { get; set; }

        #endregion

        #region Paint

        public DbSet<MixingLocation> MixingLocations { get; set; }

        public DbSet<MixingSession> MixingSessions { get; set; }

        public DbSet<PaintOrderHead> PaintOrderHeads { get; set; }

        public DbSet<PaintOrderLine> PaintOrderLines { get; set; }

        public DbSet<PaintProduct> PaintProducts { get; set; }

        #endregion

        #region DotDigital

        public DbSet<DotDigitalAccount> DotDigitalAccounts { get; set; }

        public DbSet<SyncAction> SyncActions { get; set; }

        public DbSet<RetailStoreMember> RetailStoreMembers { get; set; }

        public DbSet<PressContact> PressContacts { get; set; }

        public DbSet<Source> Sources { get; set; }

        public DbSet<SourceGroup> SourceGroups { get; set; }

        public DbSet<LawfulBasis> LawfulBases { get; set; } // bey-seez if you please

        public DbSet<Mertex_Operator> Mertex_Operators { get; set; }

        #endregion

        #region Stock Management 

        public DbSet<StockManagement.Branch> Branches { get; set; }
        public DbSet<BranchGroup> BranchGroups { get; set; }
        public DbSet<Branch_BranchGroup> BranchGroupAssignments { get; set; }
        public DbSet<BranchStockLocation> BranchStockLocations { get; set; }
        public DbSet<Range> Ranges { get; set; }
        public DbSet<StockManagementProduct> StockManagementProducts { get; set; }
        public DbSet<StatusGroup> StatusGroups { get; set; }
        public DbSet<StockLocation> StockLocations { get; set; }
        public DbSet<StockLocationGroup> StockLocationGroups { get; set; }
        public DbSet<StockLocationOrderBookGroup> StockLocationOrderBookGroups { get; set; }

        #endregion

        #region Fenwicks Related Stuff

        public DbSet<FenwickBranch> FenwickBranches { get; set; }

        public DbSet<SelfBillInvoice> FenwickSelfBillInvoices { get; set; }

        public DbSet<Invoice> FenwickInvoices { get; set; }

        public DbSet<InvoiceFile> FenwickInvoiceFiles { get; set; }

        #endregion


        #region Parcel Calculator related stuff

        public DbSet<ParcelType> ParcelTypes { get; set; }
        public DbSet<ParcelDeliveryService> ParcelDeliveryServices { get; set; }
        public DbSet<ParcelDeliveryServiceSurcharge> ParcelDeliveryServiceSurcharges { get; set; }
        public DbSet<ParcelDestination> ParcelDestinations { get; set; }
        public DbSet<ParcelRate> ParcelRates { get; set; }

        #endregion

        public DbSet<GiftVoucher> GiftVouchers { get; set; }

        public DbSet<GiftVoucherType> GiftVoucherTypes { get; set; }

        #endregion

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            string portalSchema = "portal";
            string generalSchema = "dbo";
            string memberSchema = "mbr";
            string appSchema = "app";
            string adminSchema = "adm";

            #region General Models

            modelBuilder.Entity<Country>().HasKey(p => p.CountryID).ToTable("Country", generalSchema);
            modelBuilder.Entity<Language>().HasKey(p => p.LanguageID).ToTable("Language", generalSchema);
            modelBuilder.Entity<Currency>().ToTable("Currency", generalSchema);
            modelBuilder.Entity<Language>().ToTable("Language", generalSchema);
            modelBuilder.Entity<Channel>().ToTable("Channel", generalSchema);
            modelBuilder.Entity<ChannelGroup>().ToTable("ChannelGroup", generalSchema);
            modelBuilder.Entity<Country>().ToTable("Country", generalSchema);
            modelBuilder.Entity<FormalTitle>().ToTable("Title", generalSchema);
            modelBuilder.Entity<Gender>().ToTable("Gender", generalSchema);
            modelBuilder.Entity<ProductTypeGroup>().HasKey(p => p.ProductTypeGroupID).ToTable("ProductTypeGroup", generalSchema);
            modelBuilder.Entity<Brand>().HasKey(p => p.BrandID).ToTable("Brand", generalSchema);
            modelBuilder.Entity<Competitor>().HasKey(p => p.CompetitorID).ToTable("Competitor", generalSchema).Property(p => p.Deleted).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);
            modelBuilder.Entity<CompanyType>().HasKey(p => p.CompanyTypeID).ToTable("CompanyType", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<PaymentTerms> paymentTerms = modelBuilder.Entity<PaymentTerms>().ToTable("PaymentTerms", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<PriceList> priceList = modelBuilder.Entity<PriceList>().ToTable("PriceList", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<SalesRepresentative> salesRep = modelBuilder.Entity<SalesRepresentative>().Map(p => p.Requires("Deleted").HasValue(false)).ToTable("SalesRepresentative", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<SalesRepresentative_SalesMarket> salesRepresentativeSalesMarket = modelBuilder.Entity<SalesRepresentative_SalesMarket>().ToTable("SalesRepresentative_SalesMarket", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<SalesAgent> salesAgent = modelBuilder.Entity<SalesAgent>().ToTable("SalesAgent", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<SalesArea> salesArea = modelBuilder.Entity<SalesArea>().ToTable("SalesArea", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<SalesMarket> salesMarket = modelBuilder.Entity<SalesMarket>().ToTable("SalesMarket", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Mertex_ExchangeRate> mertexExchangeRate = modelBuilder.Entity<Mertex_ExchangeRate>().ToTable("Mertex_ExchangeRate", adminSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Colour> colour = modelBuilder.Entity<Colour>().ToTable("Colour", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Pattern> pattern = modelBuilder.Entity<Pattern>().ToTable("Pattern", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Tag> tag = modelBuilder.Entity<Tag>().ToTable("Tag", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Department> department = modelBuilder.Entity<Department>().ToTable("Department", portalSchema);


            // This messing about is necessary because the CurrencyCode on which the table is keyed does not conform to the ISO_4217 standard. Ugh.
            mertexExchangeRate.Property(p => p.Code).HasColumnName("CurrencyCode");
            mertexExchangeRate.HasKey(p => p.Code);
            mertexExchangeRate.Property(p => p.CurrencyCode).HasColumnName("ISO_4217_Code");

            paymentTerms.HasOptional<SalesMarket>(p => p.SalesMarket)
                     .WithMany(p => p.PaymentTerms)
                     .HasForeignKey(p => p.SalesMarketID);

            priceList.HasRequired<Currency>(p => p.Currency)
                     .WithMany(p => p.PriceLists)
                     .HasForeignKey(p => p.CurrencyID);

            //salesRep.HasOptional(p => p.SalesMarket)
            //    .WithMany(p => p.SalesRepresentatives)
            //    .HasForeignKey(p => p.SalesMarketID);

            salesRepresentativeSalesMarket.HasRequired(p => p.SalesRepresentative)
                .WithMany(p => p.SalesRepresentative_SalesMarkets)
                .HasForeignKey(p => p.SalesRepresentativeID);

            salesRepresentativeSalesMarket.HasRequired(p => p.SalesMarket)
                .WithMany(p => p.SalesRepresentative_SalesMarkets)
                .HasForeignKey(p => p.SalesMarketID);

            salesAgent.HasOptional(p => p.SalesMarket)
                .WithMany(p => p.SalesAgents)
                .HasForeignKey(p => p.SalesMarketID);

            salesArea.HasOptional(p => p.SalesMarket)
                .WithMany(p => p.SalesAreas)
                .HasForeignKey(p => p.SalesMarketID);

            #endregion

            #region Product Models

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Product> product = modelBuilder.Entity<Product>().ToTable("Product", generalSchema);

            product.Property(p => p.Deleted).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);

            product.HasRequired(p => p.ProductType)
                   .WithMany(p => p.Products)
                   .HasForeignKey(p => p.ProductTypeID);

            product.HasRequired(p => p.Stock)
                   .WithRequiredPrincipal(p => p.Product)
                   .WillCascadeOnDelete(false);

            product.HasRequired(p => p.Launch)
                .WithMany(p => p.Products)
                .HasForeignKey(p => p.LaunchID);

            product.HasOptional(p => p.Design)
                .WithMany(p => p.Products)
                .HasForeignKey(p => p.DesignID);

            product.HasRequired(p => p.ItemType)
                .WithMany(p => p.Products)
                .HasForeignKey(p => p.ItemTypeID);

            product.HasRequired(p => p.ProductGroup)
                .WithMany(p => p.Products)
                .HasForeignKey(p => p.ProductGroupID);

            product.HasOptional(p => p.Quality)
                .WithMany(p => p.Products)
                .HasForeignKey(p => p.QualityID);

            product.HasRequired(p => p.Brand)
                .WithMany(p => p.Products)
                .HasForeignKey(p => p.BrandID);

            product.HasOptional(p => p.Colour)
                .WithMany(p => p.Products)
                .HasForeignKey(p => p.ColourID);

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ProductTypeGroup> productTypeGroup = modelBuilder.Entity<ProductTypeGroup>().ToTable("ProductTypeGroup", generalSchema);

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ProductType> productType = modelBuilder.Entity<ProductType>().ToTable("ProductType", generalSchema);

            productType.HasRequired(p => p.ProductTypeGroup)
                .WithMany(p => p.ProductTypes)
                .HasForeignKey(p => p.ProductTypeGroupID);

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Collection> collection = modelBuilder.Entity<Products.Collection>().ToTable("Collection", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Design> design = modelBuilder.Entity<Design>().ToTable("Design", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ItemType> itemType = modelBuilder.Entity<ItemType>().ToTable("Mertex_ItemType", adminSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ProductGroup> productGroup = modelBuilder.Entity<ProductGroup>().ToTable("Mertex_ProductGroup", adminSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Launch> launch = modelBuilder.Entity<Launch>().ToTable("Launch", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Market> market = modelBuilder.Entity<Market>().ToTable("Mertex_Market", adminSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Quality> quality = modelBuilder.Entity<Quality>().ToTable("Quality", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Attribute> attribute = modelBuilder.Entity<Attribute>().ToTable("Attribute", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<AttributeGroup> attributeGroup = modelBuilder.Entity<AttributeGroup>().ToTable("AttributeGroup", generalSchema);

            attribute.HasRequired(p => p.AttributeGroup)
                     .WithMany(p => p.Attributes)
                     .HasForeignKey(p => p.AttributeGroupID);

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Product_Collection> product_collection = modelBuilder.Entity<Product_Collection>().HasKey(p => new { p.ProductID, p.CollectionID }).ToTable("Product_Collection", generalSchema);

            product_collection
                .HasRequired(p => p.Product)
                .WithMany(p => p.Collections)
                .HasForeignKey(p => p.ProductID);

            product_collection
                .HasRequired(p => p.Collection)
                .WithMany(p => p.Products)
                .HasForeignKey(p => p.CollectionID);

            launch.HasRequired(p => p.Season)
                .WithMany(p => p.Launches)
                .HasForeignKey(p => p.SeasonID);

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Season> season = modelBuilder.Entity<Season>().ToTable("Season", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Stock> stocks = modelBuilder.Entity<Stock>().ToTable("Stock", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<StockStatus> stockStatus = modelBuilder.Entity<StockStatus>().ToTable("StockStatus", generalSchema);

            stockStatus.Property(p => p.Name).HasColumnName("StockStatus");

            stocks.HasRequired(p => p.StockStatus)
                .WithMany(p => p.Stocks)
                .HasForeignKey(p => p.StockStatusID);

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<SampleRequestSlicerData> sampleRequestSlicerData = modelBuilder.Entity<SampleRequestSlicerData>().ToTable("SampleRequest_Slicer_Data", portalSchema);

            #endregion

            #region Member Models

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Member> member = modelBuilder.Entity<Member>().HasKey(p => p.Id)
                .ToTable("Member", memberSchema);

            member.Ignore(p => p.MemberID);
            member.Ignore(p => p.AccessFailedCount);
            member.Ignore(p => p.PhoneNumberConfirmed);
            member.Ignore(p => p.TwoFactorEnabled);

            member.Property(p => p.Email).HasColumnName("Email");
            member.Property(p => p.EmailConfirmed).HasColumnName("EmailConfirmed");
            member.Property(p => p.UserName).HasColumnName("UserName").HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);
            member.Property(p => p.Deleted).HasColumnName("Deleted").HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);
            member.Property(p => p.Id).HasColumnName("MemberID");
            member.Property(p => p.FullName).HasColumnName("FullName");
            member.Property(p => p.LockoutEnabled).HasColumnName("LockoutEnabled");
            member.Property(p => p.LockoutEndDateUtc).HasColumnName("LockoutEndDT");
            member.Property(p => p.SecurityStamp).HasColumnName("SecurityStamp");
            member.Property(p => p.PasswordHash).HasColumnName("Password");
            member.Property(p => p.PhoneNumber).HasColumnName("PhoneNumber");
            member.Property(p => p.DefaultMertexOperatorCode).HasColumnName("DefaultOrderTaker");

            member.HasMany(p => p.Roles)
                .WithRequired(p => p.Member)
                .HasForeignKey(p => p.UserId);

            member.HasMany(p => p.RecentlyUsedMembers)
                .WithRequired(p => p.Member)
                .HasForeignKey(p => p.MemberID);

            //member.HasOptional(p => p.TradeAccount)
            //    .WithMany(p => p.Members)
            //    .HasForeignKey(p => p.TradeAccountID);

            member.HasOptional(p => p.DefaultMertexOperator)
                  .WithMany(p => p.Members)
                  .HasForeignKey(p => p.DefaultMertexOperatorCode);

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Member_Role> member_role = modelBuilder.Entity<Member_Role>().HasKey(p => new { p.UserId, p.RoleId }).ToTable("Member_Role", memberSchema);
            member_role.Property(p => p.UserId).HasColumnName("MemberID");
            member_role.Property(p => p.RoleId).HasColumnName("RoleID");

            member_role.HasRequired(p => p.Member)
                .WithMany(p => p.Roles)
                .HasForeignKey(p => p.UserId);
            member_role.HasRequired(p => p.Role)
                .WithMany(p => p.Users)
                .HasForeignKey(p => p.RoleId);

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Member_RecentlyUsedMember> member_recentlyUsedMember = modelBuilder.Entity<Member_RecentlyUsedMember>().ToTable("Member_RecentlyUsedMember", memberSchema);
            member_recentlyUsedMember.Property(p => p.MemberID).HasColumnName("MemberID");
            member_recentlyUsedMember.Property(p => p.OtherMemberID).HasColumnName("OtherMemberID");
            member_recentlyUsedMember.Property(p => p.UsedDT).HasColumnName("UsedDT").HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);

            member_recentlyUsedMember
                .HasRequired(p => p.Member)
                .WithMany(p => p.RecentlyUsedMembers)
                .HasForeignKey(p => p.MemberID);

            //member_recentlyUsedMember
            //    .HasRequired(p => p.OtherMember)
            //    .WithMany(p => p.RecentlyUsedMembers)
            //    .HasForeignKey(p => p.OtherMemberID);

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Member_Login> member_login = modelBuilder.Entity<Member_Login>().ToTable("MemberLogin", memberSchema);
            member_login.Property(p => p.UserId).HasColumnName("MemberID");

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Member_Claim> member_claim = modelBuilder.Entity<Member_Claim>().ToTable("MemberClaim", memberSchema);
            member_claim.Property(p => p.UserId).HasColumnName("MemberID");
            member_claim.Property(p => p.Id).HasColumnName("ClaimID");

            #endregion

            #region Application & Role Models

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Role> role = modelBuilder.Entity<Role>().ToTable("Role", memberSchema);
            role.Property(p => p.Id).HasColumnName("RoleID");
            role.Property(p => p.Name).HasColumnName("Name");
            role.Property(p => p.Precedence).HasColumnName("Precedence");
            role.Property(p => p.PortalJSON).HasColumnName("PortalJSON");
            role.Ignore(p => p.Properties);

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Application> application = modelBuilder.Entity<Application>().HasKey(p => p.ApplicationID).ToTable("Application", appSchema);
            application.HasRequired(p => p.Status).WithMany().HasForeignKey(p => p.ApplicationStatusID);
            application.Property(p => p.Deleted).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Application_Role> application_Role = modelBuilder.Entity<Application_Role>().HasKey(p => new { p.ApplicationID, p.RoleID }).ToTable("Application_Role", appSchema);

            application_Role.Property(p => p.ApplicationID).HasColumnName("ApplicationID");
            application_Role.Property(p => p.RoleID).HasColumnName("RoleID");
            application_Role.Property(p => p.SortOrder).HasColumnName("SortOrder");

            application_Role
                .HasRequired(p => p.Application)
                .WithMany(p => p.Application_Roles)
                .HasForeignKey(p => p.ApplicationID);

            application_Role
                .HasRequired(p => p.Role)
                .WithMany(p => p.Application_Roles)
                .HasForeignKey(p => p.RoleID);

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ApplicationStatus> applicationStatus = modelBuilder.Entity<ApplicationStatus>().HasKey(p => p.ApplicationStatusID).ToTable("ApplicationStatus", appSchema);
            applicationStatus.Property(p => p.ApplicationStatusID).HasColumnName("ApplicationStatusID");

            #endregion

            #region Trade Models

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeAccount> tradeAccount = modelBuilder.Entity<TradeAccount>().HasKey(p => p.TradeAccountID).ToTable("TradeAccount", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeLanguage> tradeLanguage = modelBuilder.Entity<TradeLanguage>().ToTable("TradeLanguage", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<MertexOperator> mertexOperator = modelBuilder.Entity<MertexOperator>().HasKey(p => p.Code).ToTable("Trade_MertexOperator", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeAccountGroup> tradeAccountGroup = modelBuilder.Entity<TradeAccountGroup>().HasKey(p => p.TradeAccountGroupID).ToTable("TradeAccountGroup", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeHaulier> tradeHaulier = modelBuilder.Entity<TradeHaulier>().HasKey(p => p.HAULCODE).ToTable("TradeHaulier", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeCarriage> tradeCarriage = modelBuilder.Entity<TradeCarriage>().HasKey(p => new { p.HAULCODE, p.CARRCODE }).ToTable("TradeCarriage", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeCarriage_Country> tradeCarriageCountryRestriction = modelBuilder.Entity<TradeCarriage_Country>().ToTable("TradeCarriage_Country", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeCarriage_Price> tradeCarriagePrice = modelBuilder.Entity<TradeCarriage_Price>().ToTable("TradeCarriage_Price", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradePriceList> tradePriceList = modelBuilder.Entity<TradePriceList>().ToTable("TradePriceList", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradePriceListType> tradePriceListType = modelBuilder.Entity<TradePriceListType>().ToTable("TradePriceListType", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeAccountType> tradeAccountType = modelBuilder.Entity<TradeAccountType>().ToTable("TradeAccountType", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeArea> tradeArea = modelBuilder.Entity<TradeArea>().ToTable("TradeArea", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeAccount_Competitor> tradeAccount_Competitor = modelBuilder.Entity<TradeAccount_Competitor>().ToTable("TradeAccount_Competitor", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeAccountCompetitorNote> tradeAccount_CompetitorNote = modelBuilder.Entity<TradeAccountCompetitorNote>().ToTable("TradeAccountCompetitorNote", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeAccountPotential> tradeAccountPotential = modelBuilder.Entity<TradeAccountPotential>().ToTable("TradeAccountPotential", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeAdvertiser> tradeAdvertisers = modelBuilder.Entity<TradeAdvertiser>().ToTable("TradeAdvertiser", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeAccount_TradeAdvertiser> tradeAccount_TradeAdvertisers = modelBuilder.Entity<TradeAccount_TradeAdvertiser>().ToTable("TradeAccount_TradeAdvertiser", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeAccountVisit> tradeAccountVisit = modelBuilder.Entity<TradeAccountVisit>().ToTable("TradeAccountVisit", generalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeAccountContact> tradeAccountContact = modelBuilder.Entity<TradeAccountContact>();
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeAccountVisit_TradeAccountContact> tradeAccountVisit_tradeAccountContact = modelBuilder.Entity<TradeAccountVisit_TradeAccountContact>();

            tradeCarriage.HasRequired(p => p.Haulier)
                .WithMany(p => p.CarriageServices)
                .HasForeignKey(p => p.HAULCODE);

            tradeCarriageCountryRestriction.HasRequired(p => p.Country)
                .WithMany(p => p.TradeCarriageCharges)
                .HasForeignKey(p => p.CountryID);

            tradeCarriageCountryRestriction.HasRequired(p => p.CarriageService)
                .WithMany(p => p.CountryRestrictions)
                .HasForeignKey(p => new { p.HAULCODE, p.CARRCODE });

            tradeCarriagePrice.HasRequired(p => p.CarriageService)
                .WithMany(p => p.Prices)
                .HasForeignKey(p => new { p.HAULCODE, p.CARRCODE });

            tradePriceList.HasOptional(p => p.SalesMarket)
                .WithMany(p => p.TradePriceLists)
                .HasForeignKey(p => p.SalesMarketID);

            tradeAccountVisit
                .HasRequired(p => p.TradeAccount)
                .WithMany(p => p.Visits)
                .HasForeignKey(p => p.TradeAccountID);

            tradeAccount_Competitor
                .HasRequired(p => p.TradeAccount)
                .WithMany(p => p.Competitors)
                .HasForeignKey(p => p.TradeAccountID);

            tradeAccount_Competitor
                .HasRequired(p => p.Competitor)
                .WithMany(p => p.TradeAccounts)
                .HasForeignKey(p => p.CompetitorID);

            tradeAccount_Competitor
                .HasRequired(p => p.ProductTypeGroup)
                .WithMany(p => p.TradeAccount_Competitors)
                .HasForeignKey(p => p.ProductTypeGroupID);

            tradeAccount_CompetitorNote.Ignore(p => p.CreatedLine);
            tradeAccount_CompetitorNote.Ignore(p => p.Editable);
            tradeAccount_CompetitorNote.Property(p => p.Deleted).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);
            tradeAccount_CompetitorNote.Property(p => p.CreatedDT).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);

            tradeAccount_CompetitorNote
                .HasRequired(p => p.TradeAccount_Competitor)
                .WithMany(p => p.Notes)
                .HasForeignKey(p => p.TradeAccountCompetitorID);

            tradeAccount_CompetitorNote
                .HasRequired(p => p.CreatedBy)
                .WithMany(p => p.TradeAccount_CompetitorNotes_Created)
                .HasForeignKey(p => p.CreatedMemberID);

            tradeAccount_CompetitorNote
                .HasOptional(p => p.DeletedBy)
                .WithMany(p => p.TradeAccount_CompetitorNotes_Deleted)
                .HasForeignKey(p => p.DeletedMemberID);

            tradeAccount.HasOptional(p => p.TradeAccountGroup)
                .WithMany(p => p.TradeAccounts)
                .HasForeignKey(p => p.TradeAccountGroupID);

            tradeAccount.HasOptional(p => p.SalesRepresentative)
                .WithMany(p => p.TradeAccounts)
                .HasForeignKey(p => p.SalesRepresentativeID);

            tradeAccount.HasRequired(p => p.TradePriceList)
                .WithMany(p => p.TradeAccounts)
                .HasForeignKey(p => p.TradePriceListID);

            tradeAccount.HasOptional(p => p.Currency)
                .WithMany(p => p.TradeAccounts)
                .HasForeignKey(p => p.CurrencyID);

            tradeAccount.HasRequired(p => p.TradeArea)
                .WithMany(p => p.TradeAccounts)
                .HasForeignKey(p => p.TradeAreaID);

            tradeAccount.HasOptional(p => p.Language)
                .WithMany(p => p.TradeAccounts)
                .HasForeignKey(p => p.LanguageID);

            tradeAccount.HasOptional(p => p.TradeAccountType)
                .WithMany(p => p.TradeAccounts)
                .HasForeignKey(p => p.TradeAccountTypeID);

            tradeAccount.HasRequired(p => p.Country)
                .WithMany(p => p.TradeAccounts)
                .HasForeignKey(p => p.CountryID);

            tradeAccount.HasOptional(p => p.TradeLanguage)
                .WithMany(p => p.TradeAccounts)
                .HasForeignKey(p => p.SampleLetterLanguageCode);

            tradeAccount.HasMany(p => p.Visits)
                .WithRequired(p => p.TradeAccount)
                .HasForeignKey(p => p.TradeAccountID);

            tradePriceList.Property(p => p.Deleted).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);

            tradePriceList.HasOptional(p => p.PriceList)
                .WithMany(p => p.TradePriceLists)
                .HasForeignKey(p => p.PriceListID);

            tradePriceList.HasOptional(p => p.Market)
                .WithMany(p => p.TradePriceLists)
                .HasForeignKey(p => p.MarketID);

            tradePriceList.HasOptional(p => p.Currency)
                .WithMany(p => p.TradePriceLists)
                .HasForeignKey(p => p.CurrencyID);

            tradeAccountPotential.Ignore(p => p.NoPotentialSince);

            tradeAccountPotential.Property(p => p.PotentialID).HasColumnName("TradeAccountPotentialID");

            tradeAccountPotential.HasRequired(p => p.TradeAccount)
                .WithMany(p => p.TradeAccountPotential)
                .HasForeignKey(p => p.TradeAccountID);

            tradeAccountPotential.HasRequired(p => p.Brand)
                .WithMany(p => p.TradeAccountPotential)
                .HasForeignKey(p => p.BrandID);

            tradeAccountPotential.HasRequired(p => p.ProductTypeGroup)
                .WithMany(p => p.TradeAccountPotential)
                .HasForeignKey(p => p.ProductTypeGroupID);

            tradeAccountPotential.HasRequired(p => p.LastModifiedBy)
                .WithMany(p => p.TradeAccountPotentials_Modified)
                .HasForeignKey(p => p.ModifiedMemberID);

            tradeAccount_TradeAdvertisers
                .HasRequired(p => p.TradeAccount)
                .WithMany(p => p.TradeAdvertisers)
                .HasForeignKey(p => p.TradeAccountID);

            tradeAccount_TradeAdvertisers
                .HasRequired(p => p.Advertiser)
                .WithMany(p => p.TradeAccounts)
                .HasForeignKey(p => p.AdvertiserCode);

            #endregion

            #region Order Models

            modelBuilder.Entity<OrderStatus>().HasKey(p => p.OrderStatusID).ToTable("OrderStatus", memberSchema);

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ProductRangeButton> productRangeButton = modelBuilder.Entity<ProductRangeButton>().ToTable("ProductRange", portalSchema);
            productRangeButton.Property(p => p.Deleted).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);

            #endregion

            #region Lead Models

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Lead> lead = modelBuilder.Entity<Lead>().ToTable("Lead", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<LeadAddress> leadAddress = modelBuilder.Entity<LeadAddress>().ToTable("LeadAddress", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<LeadContact> leadContact = modelBuilder.Entity<LeadContact>().ToTable("LeadContact", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<LeadContactType> leadContactType = modelBuilder.Entity<LeadContactType>().ToTable("LeadContactType", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<LeadMagnitude> leadMagnitude = modelBuilder.Entity<LeadMagnitude>().ToTable("LeadMagnitude", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<LeadSource> leadSource = modelBuilder.Entity<LeadSource>().ToTable("LeadSource", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<LeadSourceGroup> leadSourceGroup = modelBuilder.Entity<LeadSourceGroup>().ToTable("LeadSourceGroup", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<LeadStatus> leadStatus = modelBuilder.Entity<LeadStatus>().ToTable("LeadStatus", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<LeadStatusGroup> leadStatusGroup = modelBuilder.Entity<LeadStatusGroup>().ToTable("LeadStatusGroup", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<LeadPotential> leadPotential = modelBuilder.Entity<LeadPotential>().HasKey(p => p.LeadPotentialID).ToTable("LeadPotential", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ProductTypeGroup_Brand_Country> productTypeGroup_Brand_Country = modelBuilder.Entity<ProductTypeGroup_Brand_Country>().HasKey(p => new { p.ProductTypeGroupID, p.BrandID, p.CountryID }).ToTable("ProductTypeGroup_Brand_Country", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Lead_Competitor> competitor_Lead = modelBuilder.Entity<Lead_Competitor>().HasKey(p => new { p.CompetitorID, p.LeadID }).ToTable("Lead_Competitor", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<LeadInterest> leadInterest = modelBuilder.Entity<LeadInterest>().HasKey(p => new { p.LeadID, p.BrandID, p.ProductTypeGroupID }).ToTable("LeadInterest", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<LeadNote> leadNote = modelBuilder.Entity<LeadNote>().ToTable("LeadNote", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<LeadType> leadType = modelBuilder.Entity<LeadType>().ToTable("LeadType", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<AccountType> accountType = modelBuilder.Entity<AccountType>().ToTable("AccountType", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<CustomerType> customerType = modelBuilder.Entity<CustomerType>().ToTable("CustomerType", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Lead_Tag> lead_tag = modelBuilder.Entity<Lead_Tag>().ToTable("Lead_Tag", portalSchema);
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TradeAccount_Tag> tradeAccount_tag = modelBuilder.Entity<TradeAccount_Tag>().ToTable("TradeAccount_Tag", generalSchema);

            lead_tag.HasRequired(p => p.Lead)
                .WithMany(p => p.Tags)
                .HasForeignKey(p => p.LeadID);

            lead_tag.HasRequired(p => p.Tag)
                .WithMany(p => p.Leads)
                .HasForeignKey(p => p.TagID);

            tradeAccount_tag.HasRequired(p => p.TradeAccount)
                .WithMany(p => p.Tags)
                .HasForeignKey(p => p.TradeAccountID);

            tradeAccount_tag.HasRequired(p => p.Tag)
                .WithMany(p => p.TradeAccounts)
                .HasForeignKey(p => p.TagID);

            competitor_Lead
                .HasRequired(p => p.Lead)
                .WithMany(p => p.BrandsWorkedWith)
                .HasForeignKey(p => p.LeadID);

            competitor_Lead
                .HasRequired(p => p.Competitor)
                .WithMany(p => p.Leads)
                .HasForeignKey(p => p.CompetitorID);

            productTypeGroup_Brand_Country.HasRequired(p => p.ProductTypeGroup)
                                  .WithMany(p => p.Brands)
                                  .HasForeignKey(p => p.ProductTypeGroupID);

            productTypeGroup_Brand_Country.HasRequired(p => p.Brand)
                                  .WithMany(p => p.ProductTypeGroups)
                                  .HasForeignKey(p => p.BrandID);

            lead.Ignore(p => p.CreatedSince);
            lead.Ignore(p => p.ModifiedSince);
            lead.Ignore(p => p.AssignedSince);
            lead.Ignore(p => p.TotalPotential);
            lead.Ignore(p => p.TradingSinceID);
            lead.Ignore(p => p.Competitors);

            lead.Property(p => p.Deleted).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);
            lead.Property(p => p.Converted).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);

            lead.HasOptional(p => p.SalesMarket)
                .WithMany(p => p.Leads)
                .HasForeignKey(p => p.SalesMarketID);

            lead.HasOptional(p => p.CustomerType)
                .WithMany(p => p.Leads)
                .HasForeignKey(p => p.CustomerTypeID);

            lead.HasOptional(p => p.AccountType)
                .WithMany(p => p.Leads)
                .HasForeignKey(p => p.AccountTypeID);

            lead.HasOptional(p => p.LeadType)
                .WithMany(p => p.Leads)
                .HasForeignKey(p => p.LeadTypeID);

            lead.HasOptional(p => p.PaymentOption)
                .WithMany(p => p.Leads)
                .HasForeignKey(p => p.PaymentOptionID);

            lead.HasOptional(p => p.TradePriceList)
                .WithMany(p => p.Leads)
                .HasForeignKey(p => p.TradePriceListID);

            lead.HasOptional(p => p.SalesRepresentative)
                .WithMany(p => p.RepresentativeForLeads)
                .HasForeignKey(p => p.SalesRepresentativeID);

            lead.HasOptional(p => p.SalesAgent)
                .WithMany(p => p.AgentForLeads)
                .HasForeignKey(p => p.SalesAgentID);

            lead.HasOptional(p => p.SalesArea)
                .WithMany(p => p.Leads)
                .HasForeignKey(p => p.SalesAreaID);

            lead.HasOptional(p => p.PaymentTerms)
                .WithMany(p => p.GrantedToLeads)
                .HasForeignKey(p => p.PaymentTermsID);

            lead.HasMany(p => p.LeadNotes)
                .WithRequired(q => q.Lead)
                .HasForeignKey(p => p.LeadID);

            leadNote.HasRequired(p => p.CreatedBy)
                .WithMany(q => q.LeadNotes)
                .HasForeignKey(p => p.MemberID);

            lead.HasOptional(p => p.OwnerMember)
                .WithMany(p => p.LeadsOwned)
                .HasForeignKey(p => p.OwnerMemberID);

            lead.HasRequired(p => p.LeadSource)
                .WithMany(p => p.Leads)
                .HasForeignKey(p => p.LeadSourceID);

            lead.HasRequired(p => p.SourceMember) // lead has sourceMember
                .WithMany(p => p.LeadsOriginated) // sourceMember has leadsOriginated
                .HasForeignKey(p => p.SourceMemberID); // lead touches sourceMember via sourceMemberId

            ////////////
            //  crickey moses...
            //  https://stackoverflow.com/questions/39247771/entity-framework-code-first-one-to-zero-to-one-and-one-to-many-relationship-to
            //
            lead.HasMany(p => p.SecondaryContacts)
                .WithRequired(p => p.Lead)
                .HasForeignKey(p => p.LeadID);
            lead.HasOptional(p => p.LeadContact) // must be optional 
                .WithMany()
                .HasForeignKey(p => p.LeadContactID);
            //
            ///////////

            lead.HasMany(p => p.LeadInterests)
                .WithRequired(p => p.Lead)
                .HasForeignKey(p => p.LeadID);

            lead.HasMany(p => p.Potentials)
                .WithRequired(p => p.Lead)
                .HasForeignKey(p => p.LeadID);

            leadAddress.Ignore(p => p.AppleMapsButton);
            leadAddress.Ignore(p => p.WazeButton);
            leadAddress.Ignore(p => p.GoogleStreetViewButton);

            leadSource.HasRequired(p => p.LeadSourceGroup)
                .WithMany(p => p.LeadSources)
                .HasForeignKey(p => p.LeadSourceGroupID);

            leadPotential.Ignore(p => p.CreatedSince);
            leadPotential.Ignore(p => p.NoPotentialSince);
            leadPotential.Property(p => p.CreatedDT).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);
            leadPotential.Property(p => p.LeadPotentialID).HasColumnName("LeadPotentialID");

            lead.HasMany(p => p.BrandsWorkedWith)
                .WithRequired(p => p.Lead)
                .HasForeignKey(p => p.LeadID);

            lead.HasOptional(p => p.CompanyType)
                .WithMany(p => p.Leads)
                .HasForeignKey(p => p.CompanyTypeID);

            #endregion

            #region Marketing Models

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<MarketingMessage> marketingMessage = modelBuilder.Entity<MarketingMessage>().ToTable("MarketingMessage", portalSchema);

            marketingMessage.Property(p => p.Deleted).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);

            marketingMessage.Property(p => p.CreatedDT).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Computed);

            #endregion

            #region Task Models

            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<PortalTask> task = modelBuilder.Entity<PortalTask>();
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<TaskAssignmentHistory> taskAssignmentHistory = modelBuilder.Entity<TaskAssignmentHistory>();
            System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ExternalStatus> externalStatus = modelBuilder.Entity<ExternalStatus>();

            externalStatus.HasRequired(p => p.Company)
                .WithMany(p => p.Statuses)
                .HasForeignKey(p => p.ExternalCompanyID);

            task.HasRequired(p => p.Author)
                .WithMany(p => p.AuthoredTasks)
                .HasForeignKey(p => p.AuthorMemberID);

            task.HasRequired(p => p.OwnerMember)
                .WithMany(p => p.CurrentlyAssignedTasks)
                .HasForeignKey(p => p.OwnerMemberID);

            task.HasOptional(p => p.OwnerExternalCompany)
                .WithMany(p => p.CurrentlyAssignedTasks)
                .HasForeignKey(p => p.ExternalCompanyID);

            task.HasOptional(p => p.ExternalStatus)
                .WithMany(p => p.Tasks)
                .HasForeignKey(p => p.ExternalStatusID);

            taskAssignmentHistory.HasOptional(p => p.AssignedToMember)
                .WithMany(p => p.TasksReceivedHistory)
                .HasForeignKey(p => p.AssignedToMemberID);

            taskAssignmentHistory.HasRequired(p => p.AssignedByMember)
                .WithMany(p => p.TasksAssignedToOthersHistory)
                .HasForeignKey(p => p.AssignedByMemberID);

            #endregion
        }

        public void Resource_Language_Initialise()
        {
            _ = this.Database.ExecuteSqlCommand("portal.Resource_Language_Initialise");
        }
    }
}