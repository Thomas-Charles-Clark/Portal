using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Portal.Models
{
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

    public class PassMemberSubscribe
    {
        public string Email { get; set; }
        public string FullName { get; set; }
        public short CountryID { get; set; }
        public byte LanguageID { get; set; }
        public byte SourceID { get; set; }
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
    }

    public class PassNameString
    {
        public string name { get; set; }
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
        public virtual ICollection<PriceList> PriceLists { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradePriceList> TradePriceLists { get; set; }
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
    }

    public class ClientSideLanguage
    {
        public byte LanguageID { get; set; }
        public string Name { get; set; }
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
        
        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }

        [JsonIgnore]
        public virtual ICollection<TradeCarriage_Country> TradeCarriageCharges { get; set; }
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

        public virtual ICollection<TradeAccount_CompetitorNote> Notes { get; set; }
    }

    public class TradeAccount_CompetitorNote
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
                    Portal.Utilities.PortalFramework.DateTimeDistanceString(CreatedDT, true, true),
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
        public byte? SalesMarketID { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }

        [JsonIgnore]
        public ICollection<Lead> RepresentativeForLeads { get; internal set; }

        [JsonIgnore]
        public ICollection<Lead> AgentForLeads { get; internal set; }

        [JsonIgnore]
        public virtual SalesMarket SalesMarket { get; set; }
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

        [JsonIgnore]
        public virtual SalesMarket SalesMarket { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead> GrantedToLeads { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead> RequestedByLeads { get; set; }
    }
}