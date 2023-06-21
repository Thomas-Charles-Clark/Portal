using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Mertexer;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Samples;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Utilities;
using System.Collections.Generic;

using DeliveryTerm = SharedEFClasses.Models.Mertexer.DeliveryTerm;

namespace Portal.Areas.Sales.ViewModels
{
    public class LeadEnquiryViewModel : BaseViewModel
    {
        public long? LeadID { get; set; }
        public List<Channel> LeadChannels { get; set; }
        public List<LeadStatus> LeadStatuses { get; set; }
        public List<LeadSource> LeadSources { get; set; }
        public List<LeadContactType> LeadContactTypes { get; set; }
        public List<LeadMagnitude> LeadMagnitudes { get; set; }
        public List<ClientSideCountry> Countries { get; set; }
        public List<ClientSideLanguage> Languages { get; set; }
        public List<FormalTitle> Titles { get; set; }
        public List<Currency> Currencies { get; set; }
        public List<StringSelectOption> NextFiveFinancialYears { get; set; }
        public List<ByteSelectOption> TradingSinceOptions { get; set; }
        public List<BoolSelectOption> YesNoOptions { get; set; }
        public List<CompanyType> CompanyTypeOptions { get; set; } 
        public List<Competitor> Competitors { get; set; }
        public List<PaymentTerms> PaymentTerms { get; set; }
        public List<LeadType> LeadTypes { get; set; }
        public List<SalesMarket> SalesMarkets { get; set; }
        public List<AccountType> AccountTypes { get; set; }
        public List<CustomerType> CustomerTypes { get; set; }
        public List<Tag> Tags { get; set; }
        public List<PaymentOption> PaymentOptions { get; set; }
        public SalesRepresentative PreselectedSalesRep { get; set; }
        public bool LockedToRep { get; set; }
        public short PreselectedLaunchID { get; set; }
        public List<TradeAccountContactType> TradeAccountContactTypes { get; set; }
        public List<Tag> AvailableTags { get; set; }
        public List<RetailAppointmentType> RetailAppointmentTypes { get; set; }
        public List<TradeAccountClass> TradeAccountClasses { get; set; }
        public List<SharedEFClasses.Models.Mertexer.CreditController> CreditControllers { get; set; }
        public List<CreditController_SalesMarket> CreditControllerSalesMarketMap { get; set; }
        public List<Bank> Banks { get; set; }
        public List<Bank_SalesMarket> BankSalesMarketMap { get; set; }
        public List<TradeAccountGroup> TradeAccountGroups { get; set; }
        public List<SalesDivision> SalesDivisions { get; set; }
        public List<DeliveryTerm> DeliveryTerms { get; set; }

        public LeadEnquiryViewModel(
            long? leadId,
            List<Channel> channels,
            List<LeadStatus> statuses,
            List<LeadSource> sources,
            List<LeadContactType> leadContactTypes,
            List<LeadMagnitude> leadMagnitudes,
            List<ClientSideCountry> countries,
            List<ClientSideLanguage> languages,
            List<FormalTitle> titles,
            List<Currency> currencies,
            List<StringSelectOption> nextFiveFinancialYears,
            List<ByteSelectOption> tradingSinceOptions,
            List<BoolSelectOption> yesNoOptions,
            List<CompanyType> companyTypes,
            List<Competitor> competitors,
            List<PaymentTerms> paymentTerms,
            List<LeadType> leadTypes,
            List<SalesMarket> salesMarkets,
            List<AccountType> accountTypes,
            List<CustomerType> customerTypes,
            List<Tag> tags,
            List<PaymentOption> paymentOptions,
            SalesRepresentative preselectedSalesRep,
            List<TradeAccountContactType> tradeAccountContactTypes,
            List<RetailAppointmentType> retailAppointmentTypes,
            bool lockedToRep,
            short preselectedLaunchId,
            List<TradeAccountClass> tradeAccountClasses,
            List<SharedEFClasses.Models.Mertexer.CreditController> creditControllers,
            List<SharedEFClasses.Models.Mertexer.CreditController_SalesMarket> creditControllerSalesMarketMap,
            List<Bank> banks,
            List<Bank_SalesMarket> bankSalesMarketMap,
            List<TradeAccountGroup> tradeAccountGroups,
            //List<TradeHaulier> hauliers,
            //List<TradeCarriage> carriages,
            //List<TradeHaulier> sampleHauliers,
            //List<TradeCarriage> sampleCarriages,
            List<SalesDivision> salesDivisions,
            List<DeliveryTerm> deliveryTerms,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            LeadID = leadId;
            LeadChannels = channels;
            LeadStatuses = statuses;
            LeadSources = sources;
            LeadContactTypes = leadContactTypes;
            LeadMagnitudes = leadMagnitudes;
            Titles = titles;
            Countries = countries;
            Languages = languages;
            Currencies = currencies;
            NextFiveFinancialYears = nextFiveFinancialYears;
            TradingSinceOptions = tradingSinceOptions;
            YesNoOptions = yesNoOptions;
            CompanyTypeOptions = companyTypes;
            Competitors = competitors;
            PaymentTerms = paymentTerms;
            LeadTypes = leadTypes;
            SalesMarkets = salesMarkets;
            AccountTypes = accountTypes;
            CustomerTypes = customerTypes;
            PaymentOptions = paymentOptions;
            Tags = tags;
            PreselectedSalesRep = preselectedSalesRep;
            LockedToRep = lockedToRep;
            PreselectedLaunchID = preselectedLaunchId;
            TradeAccountContactTypes = tradeAccountContactTypes;
            RetailAppointmentTypes = retailAppointmentTypes;
            TradeAccountClasses = tradeAccountClasses;
            CreditControllers = creditControllers;
            CreditControllerSalesMarketMap = creditControllerSalesMarketMap;
            Banks = banks;
            BankSalesMarketMap = bankSalesMarketMap;
            TradeAccountGroups = tradeAccountGroups;
            
            //Hauliers = hauliers;
            //Carriages = carriages;
            //SampleHauliers = sampleHauliers;
            //SampleCarriages = sampleCarriages;
            SalesDivisions = salesDivisions;
            DeliveryTerms = deliveryTerms;
        }
    }
}