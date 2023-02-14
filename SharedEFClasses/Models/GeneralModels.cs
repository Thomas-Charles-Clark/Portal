using Newtonsoft.Json;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.Samples;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.ReturnModels;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models.General
{
    [Table("Member_Department", Schema = "portal")]
    public class Member_Department
    {
        [Key]
        [Column(Order = 1)]
        public int MemberID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short DepartmentID { get; set; }

        [NotMapped]
        public string Name
        {
            get
            {
                return Member.Name;
            }
        }

        //[JsonIgnore]
        [ForeignKey("MemberID")]
        public virtual Member Member { get; set; }

        [ForeignKey("DepartmentID")]
        [JsonIgnore]
        public virtual Department Department { get; set; }
    }

    public class Department
    {
        [Key]
        public short DepartmentID { get; set; }

        public byte LocationID { get; set; }

        public string Name { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [ForeignKey("LocationID")]
        public virtual Location Location { get; set; }

        //[JsonIgnore]
        public virtual ICollection<Member_Department> Members { get; set; }

        [NotMapped]
        public string DropDownTreeLocationID
        {
            get
            {
                return $"Location-{LocationID}";
            }
        }

        [NotMapped]
        public string DropDownTreeDepartmentID
        {
            get
            {
                return $"Department-{DepartmentID}";
            }
        }
    }

    [Table("Location", Schema = "portal")]
    public class Location
    {
        [Key]
        public byte LocationID { get; set; }

        public string Name { get; set; }

        [NotMapped]
        public string DropDownTreeLocationID
        {
            get
            {
                return $"Location-{LocationID}";
            }
        }

        public virtual ICollection<Department> Departments { get; set; }
    }

    public class Tag
    {
        [Key]
        public int TagID { get; set; }
        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead_Tag> Leads { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount_Tag> TradeAccounts { get; set; }

        [JsonIgnore]
        public virtual ICollection<Project_Tag> Projects { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccountAddress_Tag> TradeAccountAddresses { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccountContact_Tag> TradeAccountContacts { get; set; }
    }

    public class CreditController_SelectResult
    {
        public List<CreditController> CreditControllers { get; set; }
    }

    public class CreditController
    {
        public int MemberID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public bool DefaultCreditController { get; set; }
    }

    public class PassCountryID
    {
        public short CountryID { get; set; }
    }

    public class PassNullableCountryID
    {
        public short? CountryID { get; set; }
    }

    public class PassLoadSPA
    {
        public int TradeAccountID { get; set; }
        public int ProductID { get; set; }
        public short? Quantity { get; set; }
    }

    public class Colour
    {
        [Key]
        public byte ColourID { get; set; }
        public string Name { get; set; }
        public byte SortOrder { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }
    }

    public class Pattern
    {
        [Key]
        public byte PatternID { get; set; }
        public string Name { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
    }

    [Table("Martindale", Schema = "dbo")]
    public class Martindale
    {
        [Key]
        public byte MartindaleID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int MinMartindale { get; set; }
        public int MaxMartindale { get; set; }
    }

    public class PassMemberSubscribe
    {
        public string Email { get; set; }
        public string FullName { get; set; }
        public short CountryID { get; set; }
        public byte LanguageID { get; set; }
        public byte SourceID { get; set; }
        public short MarketingCountryID { get; set; }
        public byte MarketingLanguageID { get; set; }
    }

    public class CustomerType
    {
        public byte CustomerTypeID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead> Leads { get; set; }
    }

    public class PassTARFData
    {
        public bool immediateOrderRequested { get; set; }
        public string email { get; set; }
        public string name { get; set; }
        public string phone { get; set; }
        public byte languageId { get; set; }
        public short countryId { get; set; }
    }

    public class PassResendTARFData
    {
        public long leadId { get; set; }
        public string email { get; set; }
        public byte languageId { get; set; }
        public short countryId { get; set; }
    }


    public class PassNameString
    {
        public string Name { get; set; }
    }

    public class Currency
    {
        [Key]
        public byte CurrencyID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Symbol { get; set; }
        public decimal SterlingExchangeRate { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime ModifiedDT { get; set; }
        public string MertexCurrencyCode { get; set; }
        public string FormattingCulture { get; set; }
        public string ISO_4217 { get; set; }

        [JsonIgnore]
        public virtual ICollection<Basket> Basket { get; set; }

        [JsonIgnore]
        public virtual ICollection<PriceList> PriceLists { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradePriceList> TradePriceLists { get; set; }

        [JsonIgnore]
        public virtual ICollection<Project> Projects { get; set; }

        [JsonIgnore]
        [InverseProperty("Currency")]
        public virtual ICollection<Project_CompetitorQuote> Project_CompetitorQuotes { get; set; }

        [JsonIgnore]
        [InverseProperty("Currency")]
        public virtual ICollection<DefaultDeliveryService> DefaultDeliveryServices { get; set; }

        [JsonIgnore]
        [InverseProperty("Currency")]
        public virtual ICollection<TradeDeliveryContractPrice> TradeDeliveryContractPrices { get; set; }
    }

    public class Language
    {
        [Key]
        public byte LanguageID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string DotNetCulture { get; set; }
        public string LocalName { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }

        [JsonIgnore]
        public virtual ICollection<CountryLanguage> CountryLanguages { get; set; }

        [JsonIgnore]
        [InverseProperty("Language")]
        public virtual ICollection<Resource_Language> Resources { get; set; }
    }

    [Table("Country_Language", Schema = "dbo")]
    public class CountryLanguage
    {
        [Key]
        public byte Country_Language_ID { get; set; }

        public short CountryID { get; set; }

        public byte LanguageID { get; set; }

        public string Name { get; set; }

        public string URL { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("CountryID")]
        public virtual Country Country { get; set; }

        [ForeignKey("LanguageID")]
        public virtual Language Language { get; set; }
    }

    public class ClientSideLanguage
    {
        public byte LanguageID { get; set; }
        public string Name { get; set; }
    }

    public class ClientSideMemberID
    {
        public int MemberID { get; set; }
    }

    public class ClientSideMember
    {
        public int? MemberID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
    }

    public class Channel
    {
        [Key]
        public byte ChannelID { get; set; }

        public byte ChannelGroupID { get; set; }
        public virtual ChannelGroup ChannelGroup { get; set; }

        public byte SortOrder { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool Deleted { get; set; }
    }

    public class ChannelGroup
    {
        [Key]
        public byte ChannelGroupID { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool Deleted { get; set; }
    }

    public class FormalTitle
    {
        [Key]
        public byte TitleID { get; set; }

        [StringLength(10)]
        public string Title { get; set; }

        public byte GenderID { get; set; }

        public virtual Gender Gender { get; set; }

        public DateTime CreatedDT { get; set; }
    }

    public class Gender
    {
        [Key]
        public byte GenderID { get; set; }

        [StringLength(10)]
        public string Name { get; set; }

        public DateTime CreatedDT { get; set; }
    }

    public class Country
    {
        [Key]
        public short CountryID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string LocalName { get; set; }
        public byte? RegionID { get; set; }
        public byte? ContinentID { get; set; }
        public byte? PriceListID { get; set; }
        public bool IsCountry { get; set; }
        public short SortOrder { get; set; }
        public bool Metric { get; set; }
        public bool Postcode { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        public bool ShopEnabled { get; set; }
        public bool VATExempt { get; set; }
        public short? ProxyCountryID { get; set; }
        public bool AddressLookup { get; set; }
        public string ThreeDigitCode { get; set; }
        public bool AllowCrossBorderStockistsSearch { get; set; }
        public decimal? VATRegistrationThreshold { get; set; }
        public bool EcommerceEnabled { get; set; }
        public Guid? Sub2LicenseKey { get; set; }
        public byte MarketID { get; set; }
        public bool AllowContactReferral { get; set; }
        public bool AllowTradeOrders { get; set; }
        public byte? TradeMarketID { get; set; }
        public bool EU { get; set; }

        [ForeignKey("ContinentID")]
        public virtual Continent Continent { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeCarriage_Country> TradeCarriageCharges { get; set; }

        [JsonIgnore]
        public virtual ICollection<Project> Projects { get; set; }

        [JsonIgnore]
        public virtual TradeMarket TradeMarket { get; set; }

        [JsonIgnore]
        [InverseProperty("Country")]
        public virtual ICollection<ProjectStakeholder> ProjectStakeholders { get; set; }

        [JsonIgnore]
        public virtual ICollection<CountryLanguage> CountryLanguages { get; set; }

        [JsonIgnore]
        [InverseProperty("DeliveryCountry")]
        public virtual ICollection<Basket> DeliveryCountryForBaskets { get; set; }

        [JsonIgnore]
        [InverseProperty("Country")]
        public virtual ICollection<Treatment_Country> Treatments { get; set; }

        [JsonIgnore]
        [InverseProperty("OriginCountry")]
        public virtual ICollection<DefaultDeliveryService> DefaultDeliveryServicesOrigin { get; set; }

        [JsonIgnore]
        [InverseProperty("DestinationCountry")]
        public virtual ICollection<DefaultDeliveryService> DefaultDeliveryServicesDestination { get; set; }

        [JsonIgnore]
        [InverseProperty("DestinationCountry")]
        public virtual ICollection<TradeDeliveryContractPrice> TradeDeliveryContractPricesDestination { get; set; }

        [JsonIgnore]
        [InverseProperty("CollectionCountry")]
        public virtual ICollection<Return> Returns { get; set; }

        [NotMapped]
        public string ContinentName
        {
            get
            {
                return Continent?.Name;
            }
        }
    }

    [Table("Continent", Schema = "dbo")]
    public class Continent
    {
        [Key]
        public byte ContinentID { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("Continent")]
        public virtual ICollection<Country> Countries { get; set; }
    }

    public class ClientSideCountry
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string ThreeDigitCode { get; set; }
        public short? CountryID { get; set; }
    }

    public class ProductTypeGroup
    {
        public byte ProductTypeGroupID { get; set; }
        public string Name { get; set; }
        public byte SortOrder { get; set; }

        [JsonIgnore]
        public virtual ICollection<ProductType> ProductTypes { get; set; }

        [JsonIgnore]
        public virtual ICollection<ProductTypeGroup_Brand_Country> Brands { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount_Competitor> TradeAccount_Competitors { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccountPotential> TradeAccountPotential { get; set; }
    }

    public class Brand
    {
        public byte BrandID { get; set; }
        public string Name { get; set; }
        public byte SortOrder { get; set; }
        public string Code { get; set; }

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }

        [JsonIgnore]
        public virtual ICollection<ProductTypeGroup_Brand_Country> ProductTypeGroups { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccountPotential> TradeAccountPotential { get; set; }
    }

    /// <summary>
    /// adm.Mertex_ExchangeRate
    /// </summary>
    public class Mertex_ExchangeRate
    {
        public string CurrencyCode { get; set; }
        public decimal ExchangeRate { get; set; }
        public string Code { get; set; }
    }

    public class Competitor
    {
        public short CompetitorID { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead_Competitor> Leads { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount_Competitor> TradeAccounts { get; set; }

        [JsonIgnore]
        public virtual ICollection<Project_Competitor> CompetingForProjects { get; set; }
    }

    public class TradeAccount_Competitor
    {
        [Key]
        public long TradeAccountCompetitorID { get; set; }
        public int TradeAccountID { get; set; }
        public short CompetitorID { get; set; }
        public byte ProductTypeGroupID { get; set; }
        public decimal? Value { get; set; }
        public DateTime CreatedDT { get; set; }

        [JsonIgnore]
        public virtual TradeAccount TradeAccount { get; set; }

        public virtual Competitor Competitor { get; set; }

        public virtual ProductTypeGroup ProductTypeGroup { get; set; }

        public virtual ICollection<TradeAccountCompetitorNote> Notes { get; set; }
    }

    public class TradeAccountCompetitorNote
    {
        [Key]
        public long NoteID { get; set; }
        public long TradeAccountCompetitorID { get; set; }
        [StringLength(500)]
        public string Note { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        public bool Deleted { get; set; }
        public int CreatedMemberID { get; set; }
        public int? DeletedMemberID { get; set; }

        public string CreatedLine
        {
            get
            {
                return String.Format("{0} by {1}",
                    PortalFramework.DateTimeDistanceString(CreatedDT, true, true),
                    CreatedBy?.FullName
                );
            }
        }

        public bool Editable
        {
            get
            {
                return Math.Abs((this.CreatedDT - DateTime.Now.AddDays(-1)).Days) < 1;
            }
        }

        [JsonIgnore]
        public virtual TradeAccount_Competitor TradeAccount_Competitor { get; set; }

        [JsonIgnore]
        public virtual Member CreatedBy { get; set; }

        [JsonIgnore]
        public virtual Member DeletedBy { get; set; }
    }

    public class CompanyType
    {
        public byte CompanyTypeID { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead> Leads { get; set; }
    }

    public class PriceList
    {
        [Key]
        public byte PriceListID { get; set; }
        public string Name { get; set; }
        public byte CurrencyID { get; set; }

        [JsonIgnore]
        public virtual Currency Currency { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradePriceList> TradePriceLists { get; set; }

        [JsonIgnore]
        [InverseProperty("PriceList")]
        public virtual ICollection<MarketingBudget> MarketingBudgetRecords { get; set; }
    }

    public class SalesRepresentative
    {
        [Key]
        public short SalesRepresentativeID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string MobileNumber { get; set; }
        //public byte? SalesMarketID { get; set; }
        public DateTime? DeletedDT { get; set; }

        //[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        //public bool Deleted { get; set; }

        public int? MemberID { get; set; }
        public bool Visible { get; set; }

        [JsonIgnore]
        [InverseProperty("SalesRepresentative")]
        public virtual ICollection<Basket> Baskets { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }

        [JsonIgnore]
        public ICollection<Lead> RepresentativeForLeads { get; internal set; }

        [JsonIgnore]
        public ICollection<Lead> AgentForLeads { get; internal set; }

        //[JsonIgnore]
        //public virtual SalesMarket SalesMarket { get; set; }

        [JsonIgnore]
        public virtual ICollection<SalesRepresentative_SalesMarket> SalesRepresentative_SalesMarkets { get; set; }

        //[JsonIgnore] // ... Why was this ever enabled...? The Leads -> Misc Trade Account assignment modal demands MiscTradeAccounts ?
        // - Tom, 18-02-20
        [InverseProperty("SalesRepresentative")]
        public virtual ICollection<SalesRepresentative_TradeAccount> MiscTradeAccounts { get; set; }

        [NotMapped]
        public byte? SalesMarketID { get; set; }
    }

    public class SalesRepresentative_SalesMarket
    {
        [Key]
        [Column(Order = 1)]
        public short SalesRepresentativeID { get; set; }

        [Key]
        [Column(Order = 2)]
        public byte SalesMarketID { get; set; }

        [JsonIgnore]
        public virtual SalesRepresentative SalesRepresentative { get; set; }

        [JsonIgnore]
        public virtual SalesMarket SalesMarket { get; set; }
    }

    public class SalesRepresentative_TradeAccount
    {
        [Key]
        [Column(Order = 1)]
        public short SalesRepresentativeID { get; set; }

        [Key]
        [Column(Order = 2)]
        public int TradeAccountID { get; set; }

        [JsonIgnore]
        public virtual SalesRepresentative SalesRepresentative { get; set; }

        [JsonIgnore]
        public virtual TradeAccount TradeAccount { get; set; }

        [NotMapped]
        public string AccountNumber
        {
            get
            {
                return TradeAccount?.Code;
            }
        }
    }

    public class SalesAgent
    {
        [Key]
        public short SalesAgentID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public byte? SalesMarketID { get; set; }

        [JsonIgnore]
        public ICollection<Lead> Leads { get; internal set; }

        [JsonIgnore]
        public virtual SalesMarket SalesMarket { get; set; }

        [JsonIgnore]
        [InverseProperty("SalesAgent")]
        public virtual ICollection<Basket> Baskets { get; set; }
    }

    public class SalesArea
    {
        [Key]
        public short SalesAreaID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public short? CountryID { get; set; }
        public byte? SalesMarketID { get; set; }

        [JsonIgnore]
        public ICollection<Lead> Leads { get; internal set; }
        [JsonIgnore]
        public virtual SalesMarket SalesMarket { get; set; }
    }

    public class PaymentTerms
    {
        [Key]
        public byte PaymentTermsID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Terms { get; set; }
        public bool Visible { get; set; }
        public byte? SalesMarketID { get; set; }
        public bool RequirePaymentDetails { get; set; }

        [JsonIgnore]
        public virtual ICollection<Basket> Baskets { get; set; }

        [JsonIgnore]
        public virtual SalesMarket SalesMarket { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead> GrantedToLeads { get; set; }

        [JsonIgnore]
        [InverseProperty("PaymentTerms")]
        public virtual ICollection<TradeAccount> GrantedToTradeAccounts { get; set; }

        [NotMapped]
        public string Label
        {
            set
            {

            }
            get
            {
                return $"({Code}) {Name}";
            }
        }
    }

    public class PricingQueryFilter
    {
        public int? TradeAccountID { get; set; }
        public short? TradePriceListID { get; set; }
        public byte? MarketID { get; set; }
        public byte? CurrencyID { get; set; }
        public string SearchTerm { get; set; }
        public short? CollectionID { get; set; }
        public short? QualityID { get; set; }
        public int? ProductID { get; set; }
        public byte? BrandID { get; set; }
        public byte? ProductTypeID { get; set; }
        public bool IncludeClearance { get; set; }
        public bool IncludeSamples { get; set; }
        public List<byte> BrandIDs { get; set; }
        public List<byte> ProductTypeGroupIDs { get; set; }
        public List<byte> ProductTypeIDs { get; set; }
        public List<short?> ItemTypeIDs { get; set; }
        public List<short> LaunchIDs { get; set; }
        public List<byte> SeasonIDs { get; set; }
        public bool CacheBuster { get; set; } // not included in the key computation: if true, we want to invalidate the key presented
                                              // by all other options.

        public PricingQueryFilter()
        {
            BrandIDs = new List<byte>();
            ProductTypeGroupIDs = new List<byte>();
            ProductTypeIDs = new List<byte>();
            ItemTypeIDs = new List<short?>();
            LaunchIDs = new List<short>();
            SeasonIDs = new List<byte>();
        }

        public override int GetHashCode()
        {
            unchecked
            {
                int hash = 17;

                hash = hash * 23 + (TradeAccountID?.GetHashCode() ?? 0);
                hash = hash * 23 + (TradePriceListID?.GetHashCode() ?? 0);
                hash = hash * 23 + (MarketID?.GetHashCode() ?? 0);
                hash = hash * 23 + (CurrencyID?.GetHashCode() ?? 0);
                hash = hash * 23 + (SearchTerm?.GetHashCode() ?? 0);
                hash = hash * 23 + (CollectionID?.GetHashCode() ?? 0);
                hash = hash * 23 + (QualityID?.GetHashCode() ?? 0);
                hash = hash * 23 + (ProductID?.GetHashCode() ?? 0);
                hash = hash * 23 + (BrandID?.GetHashCode() ?? 0);
                hash = hash * 23 + (ProductTypeID?.GetHashCode() ?? 0);
                hash = hash * 23 + (IncludeClearance.GetHashCode());
                hash = hash * 23 + (IncludeSamples.GetHashCode());

                if (BrandIDs != null)
                    foreach (var b in BrandIDs)
                        hash = hash * 23 + b.GetHashCode();

                if (ProductTypeGroupIDs != null)
                    foreach (var ptg in ProductTypeGroupIDs)
                        hash = hash * 23 + ptg.GetHashCode();

                if (ProductTypeIDs != null)
                    foreach (var pt in ProductTypeIDs)
                        hash = hash * 23 + pt.GetHashCode();

                if (ItemTypeIDs != null)
                    foreach (var it in ItemTypeIDs)
                        hash = hash * 23 + it.GetHashCode();

                if (LaunchIDs != null)
                    foreach (var l in LaunchIDs)
                        hash = hash * 23 + l.GetHashCode();

                if (SeasonIDs != null)
                    foreach (var s in SeasonIDs)
                        hash = hash * 23 + s.GetHashCode();

                return hash;
            }
        }
    }

    public class PreSlicerFunctionFilter
    {
        public short? MarketID { get; set; }
        public short? TradePriceListID { get; set; }
        public byte? CurrencyID { get; set; }
    }

    public class PassAddress
    {
        public string name { get; set; }
        public string addressLine1 { get; set; }
        public string addressLine2 { get; set; }
        public string town { get; set; }
        public string county { get; set; }
        public string postcode { get; set; }
        public short? countryId { get; set; }
    }

    public class PassCurrency
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public byte CurrencyID { get; set; }
    }

    public class PassProductSearch
    {
        public int tradeAccountId { get; set; }
        public PassProductFilter widget { get; set; }
        public string searchTerm { get; set; }
        public byte? brandId { get; set; }
        public short? launchId { get; set; }
        public short? collectionId { get; set; }
        public byte? productTypeId { get; set; }
        public bool seasonal { get; set; }
        public string clearance { get; set; }
        public bool searchNew { get; set; }
        public byte? productFilterId { get; set; }
        public byte? productFilterGroupId { get; set; }
        public byte? productTypeGroupId { get; set; }
        public byte? productGroupId { get; set; }
        public short? itemTypeId { get; set; }
        public byte? stockFilterId { get; set; }
        public bool metric { get; set; }
        public byte? colourId { get; set; }
        public byte? patternId { get; set; }
        public byte? martindaleId { get; set; }
        public bool? wideWidth { get; set; }
        public string sortOrder { get; set; }
        public byte? sizeId { get; set; }
        public int? page { get; set; } // used by downloads
        public short? pageSize { get; set; }
        public string priceOperator { get; set; }
        public decimal? priceMin { get; set; }
        public decimal? priceMax { get; set; }
        public string stockOperator { get; set; }
        public decimal? stock { get; set; }
    }

    //public class PassDownloadSearch : PassProductSearch
    //{
    //    public int Page { get; set; }
    //    public int? PageSize { get; set; }
    //    public new ProductFilter_SelectResult widget { get; set; }
    //}

    public class PassDownloadBasket
    {
        public int TradeAccountID { get; set; }
        public bool DisplayPrices { get; set; }
        public bool EarlyAccess { get; set; }
        public bool UnitOfMeasurement { get; set; }
        public List<string> IDs { get; set; }
    }

    public class PassProductFetchByQuality
    {
        public string code { get; set; }
        public short? qualityId { get; set; }
        public byte productTypeId { get; set; }
        public int tradeAccountId { get; set; }
        public string status { get; set; }
    }

    public class PassProductBasket
    {
        public int? memberBasketId { get; set; }
        public int tradeAccountId { get; set; }
        public string addressLine1 { get; set; }
        public string addressLine2 { get; set; }
        public string town { get; set; }
        public string county { get; set; }
        public bool quote { get; set; }
        public short? countryId { get; set; }
        public string postcode { get; set; }
        public string orderReference { get; set; }
        public List<PassBasketItemPotato> basketItems { get; set; }
    }

    public class PassOrderSave
    {
        public PassProductBasket basket { get; set; }

        public PassBasketAddress address { get; set; }

        public List<PassDispatchOption> dispatchOptions { get; set; }
    }

    public class PassDispatchOption
    {
        public byte deliveryGroupId { get; set; }
        public byte deliveryServiceId { get; set; }
        public byte? deliveryFoCReasonId { get; set; }
    }

    public class SubmitBasketResult
    {
        public string ProcessingResultJson { get; set; }
        public object processingResults
        {
            get
            {
                return JsonConvert.DeserializeObject(ProcessingResultJson ?? "[]");
            }
            set
            {

            }
        }

        public List<HeldOrderSelectResult> SubmissionResults { get; set; }
    }

    public class PassBasketItemPotato
    {
        public ProductSearchResult record { get; set; }
        public decimal quantity { get; set; }
        public byte? discount { get; set; }
        public long rowNumber { get; set; }

        public byte deliveryGroupId { get; set; }

        /* Bespoke Fields */
        public decimal? bespokeSize { get; set; }

        /* Product Filter ID */

        public byte productFilterId { get; set; }

        /* Fabric Hanger */

        public int? designProductId { get; set; }
        public int? fabricProductId { get; set; }
        public byte? headerWidth { get; set; }
        public int? feelerLength { get; set; }
        public string memo { get; set; }
        public bool? waterfall { get; set; }

        /* Fabric Showlength (catered for by Fabric Hanger) */

        /* Wallpaper Showlength */
        public int? wallpaperProductId { get; set; }

        /* Rug */
        public short? width { get; set; }
        public short? length { get; set; }
        public short? diameter { get; set; }

        /* Furniture */
        public int? modelProductId { get; set; }

        /* Errata! */
        public long? basketSplitId { get; set; }
        public short? treatmentId { get; set; }
        public byte orderTypeId { get; set; }
        public byte? fulfilmentTypeId { get; set; }
        public short? stockLocationId { get; set; }
        public decimal? finalPrice { get; set; }
        public decimal? netWeight { get; set; }
    }

    public class PassProductFilter
    {
        public byte? ProductFilterID { get; set; }
        public byte? ProductFilterGroupID { get; set; }
        public string Value { get; set; }
    }

    public class PassProductSearchFilter
    {
        public int tradeAccountId { get; set; }
        public short? launchId { get; set; }
        public string clearance { get; set; }
        public bool searchNew { get; set; }
        public short? applicationId { get; set; }
    }

    public class PassQuickDisplayProductSelect
    {
        public int QuickDisplayID { get; set; }
    }

    public class QuickDisplayProductQuantity
    {
        public int ProductID { get; set; }
        public decimal Quantity { get; set; }
    }

    public class QuickDisplayProductSelectResult
    {
        public List<ProductSearchResult> Products { get; set; }
        public List<QuickDisplayProductQuantity> Quantities { get; set; }
    }

    public class PassStockViewerLoad
    {
        public int? ProductPageID { get; set; }
        public int? ProductID { get; set; }
        public int TradeAccountID { get; set; }
    }

    public class PassSendProductInfo
    {
        public string recipient { get; set; }
        public ProductSearchResult product { get; set; }
    }

    public class PassSendPatternBookDiscoInfo
    {
        public string recipient { get; set; }

        public string patternBookCode { get; set; }

        public string patternBookName { get; set; }

        public List<ProductSearchResult> limitedDiscoItems { get; set; }
    }

    public class PassSendPatternBookCurrentInfo : PassSendPatternBookDiscoInfo
    {
        public List<ProductSearchResult> currentItems { get; set; }
    }

    public class PassBespokeProductSize
    {
        public int tradeAccountId { get; set; }
        public int productId { get; set; }
        public decimal bespokeSize { get; set; }
    }

    public class PassAdvertisingGenerate
    {
        public byte Page { get; set; }
        public byte PageSize { get; set; }
    }

    public class PassAdvertisingImageUsage
    {
        public int MemberID { get; set; }
        public int AdvertisingImageID { get; set; }
        public bool AdvertisingImageTypeID { get; set; }
        public short CountryID { get; set; }
        public byte LanguageID { get; set; }
    }

    public class PassTradeAccountVisit
    {
        public long TradeAccountVisitID { get; set; }
    }

    public class CustomerPatternBookResult
    {
        public List<NewPatternBookResult> newPatternBooks { get; set; }

        public List<BestPatternBookResult> bestPatternBooks { get; set; }
    }

    public class NewPatternBookResult
    {
        public int ProductID { get; set; }
        public string Group { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public decimal? FreeStock { get; set; }
        public string StockStatus { get; set; }
        public byte ProductFilterID { get; set; }
        public bool Held { get; set; }
        public long? ImageID { get; set; }
    }

    public class BestPatternBookResult
    {
        public string Group { get; set; }
        public long? Rank { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public decimal? FreeStock { get; set; }
        public string StockStatus { get; set; }
        public byte ProductFilterID { get; set; }
        public bool Held { get; set; }
        public long ImageID { get; set; }
    }

    [Table("CarriageCodeMap", Schema = "portal")]
    public class CarriageCodeMap
    {
        [Key]
        public short CarriageCodeMapID { get; set; }
        public string HAULCODE { get; set; }
        public string HaulierServiceCode { get; set; }
        public string MertexCurrencyCode { get; set; }
        public byte SalesMarketID { get; set; }
        public string CARRCODE { get; set; }
        public bool ExpressService { get; set; }
        public string DeliveryWeekDay { get; set; }

        [ForeignKey("SalesMarketID")]
        public virtual SalesMarket SalesMarket { get; set; }
    }

    [Table("GlobalVariables", Schema = "dbo")]
    public class GlobalVariable
    {
        [Key]
        public short GlobalVariableID { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
    }

    [Table("Image", Schema = "dbo")]
    public class Image
    {
        public long ImageID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public byte PerspectiveID { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
    }

    public class PassImageID
    {
        public long imageId { get; set; }
    }

    [Table("Document", Schema = "portal")]
    public class Document
    {
        [Key]
        public short DocumentID { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? ModifiedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [InverseProperty("Document")]
        public virtual ICollection<DocumentResource> Resources { get; set; }
    }

    [Table("Document_Resource", Schema = "portal")]
    public class DocumentResource
    {
        [Key]
        [Column(Order = 1)]
        public short DocumentID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short ResourceID { get; set; }

        [JsonIgnore]
        [ForeignKey("DocumentID")]
        public virtual Document Document { get; set; }

        [ForeignKey("ResourceID")]
        public virtual Resource Resource { get; set; }
    }

    public class PassClientError
    {
        public string message { get; set; }
        public string source { get; set; }
        public string lineno { get; set; }
        public string colno { get; set; }
        public string error { get; set; }
        public string url { get; set; }
    }

    public class PassLinkedDocumentSend
    {
        public List<PassLinkedDoc> attachments { get; set; }
        public string recipient { get; set; }
        public string body { get; set; }
        public string subject { get; set; }
    }

    public class PassLinkedDoc
    {
        public string fileName { get; set; }
        public string path { get; set; }
        public string description { get; set; }
    }

    [Table("TradeAccount_InvoiceAddress_LoqateSuggestion", Schema = "portal")]
    public class TradeAccount_InvoiceAddress_LoqateSuggestion
    {
        [Key]
        public long TradeAccountInvoiceAddressLoqateSuggestionID { get; set; }
        public int TradeAccountID { get; set; }
        public long BasketID { get; set; }
        public string InvoiceAddressJSON { get; set; }
        public string SuggestedAddressJSON { get; set; }
        public long NotificationEmailID { get; set; }
        public DateTime? LastCheckedDT { get; set; }

        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
    }

    public class PassTradeAccountOrderingNote
    {
        public int tradeAccountId { get; set; }
        public string orderingNote { get; set; }
    }

    public class CodeDescription
    {
        public string Code { get; set; }
        public string Description { get; set; }
    }

    public class CodeDescriptionCount : CodeDescription
    {
        public List<long> Counts { get; set; }

        public CodeDescriptionCount()
        {
            Counts = new List<long>();
        }
    }

    public class PassAutocomplete
    {
        public string term { get; set; }
    }
}