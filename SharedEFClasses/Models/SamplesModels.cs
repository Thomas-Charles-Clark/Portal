using Newtonsoft.Json;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SharedEFClasses.Models.Samples
{
    public class PassSampleRequestSlicerFilters
    {
        public byte? StockStatusID { get; set; }
        public short? ItemTypeID { get; set; }
        public byte? ProductGroupID { get; set; }
        public byte? BrandID { get; set; }
        public byte? ColourID { get; set; }
        public byte? PatternID { get; set; }
        public short? LaunchID { get; set; }
    }

    public class PassSampleRequestProductFilters : PassSampleRequestSlicerFilters
    {
        public short? tradePriceListId { get; set; }
        public string term { get; set; }
        public byte rrpOperatorId { get; set; }
        public decimal? rrpA { get; set; }
        public decimal? rrpB { get; set; }
    }

    public class SampleRequestSlicerData
    {
        [Key]
        public int RecordID { get; set; }
        public byte? ColourID { get; set; }
        public byte? PatternID { get; set; }
	    public int ProductID { get; set; }
        public byte BrandID { get; set; }
        public byte ProductGroupID { get; set; }
        public short ItemTypeID { get; set; }
        public byte StockStatusID { get; set; }
        public short LaunchID { get; set; }
    }

    public class SampleLine
    {
        public string Code { get; set; } //Needs trimming of /R , /C
        public short QuantityTotal { get; set; }
        public string LineRef { get; set; }
        public string Status { get; set; }
        public decimal Price { get; set; }
        public decimal UnitPrice { get; set; }
        public override string ToString()
        {
            return String.Format(@"
                    Code: {0},
                    Quantity: {1},
                    LineRef: {2},
                    Status: {3},
                    Price: {4},
                    UnitPrice: {5}",
                Code,
                QuantityTotal,
                LineRef,
                Status,
                Price,
                UnitPrice);
        }
    }

    public class SampleDeliveryAddress
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string AddressLine4 { get; set; }
        [Required]
        public string Postcode { get; set; }
        [Required]
        public Country Country { get; set; }
        public string DeliveryReference { get; set; }
        public override string ToString()
        {
            return String.Format(@"
                    {0},
                    {1},
                    {2},
                    {3},
                    {4},
                    {5},
                    {6},
                    {7}",
            Name, 
            AddressLine1, 
            AddressLine2, 
            AddressLine3, 
            AddressLine4, 
            Postcode, 
            Country.Name,
            DeliveryReference);
        }

    }

    public class SampleOrder
    {
        public string TradeAccountCode { get; set; }

        public string TradeAccountVATNumber { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }
        
        public byte? ContactPreference { get; set; }

        public decimal? DespatchPrice { get; set; }

        public bool CustomerPayingForDespatch { get; set; }

        public string FreeDespatchReason { get; set; }

        public bool SendConfirmationEmail { get; set; }
        
        public SampleDeliveryAddress Address { get; set; }

        public SampleDespatchMethod SelectedDespatchMethod { get; set; }

        public string CustomerOrderReference { get; set; }
        
        public byte SelectedOrderConfirmationLanguage { get; set; }
        
        public List<SampleLine> Basket { get; set; }
        
        public MertexOperator OrderTaker { get; set; }

        public string ExtraConfirmationText { get; set; }

        public decimal? OrderValue { get; set; }

        public string UPSAccountNumber { get; set; }

        public string DHLAccountNumber { get; set; }

        public string DeliveryType { get; set; }

        public bool ChargeTaxesToCustomerHaulier { get; set; }

        public override string ToString()
        {
            return String.Format($@"Sample Order
                Trade Account: {TradeAccountCode}
                Email: {Email}
                Phone: {Phone}
                Contact Preference: {ContactPreference}
                Send Confirmation Email: {SendConfirmationEmail}
                Address: {Address},
                Despatch Method: {SelectedDespatchMethod},
                Customer Paying for Despatch: {CustomerPayingForDespatch},
                Language: {SelectedOrderConfirmationLanguage},
                Basket: {String.Join("\r\n", Basket.Select(p => p.ToString()))},
                Order Taker: {OrderTaker}");
        }
    }
    
    public class SampleDespatchMethod
    {
        [Required]
        public string HAULCODE { get; set; }
        [Required]
        public string CARRCODE { get; set; }
        public override string ToString()
        {
            return String.Format("HAULCODE: {0}, CARRCODE: {1}", HAULCODE, CARRCODE);
        }
    }

    public class SampleOrderReturn
    {
        public string state { get; set; }
        public string message { get; set; }
    }
    
    public class PassPCAPredictRetrieve
    {
        public string id { get; set; }
    }

    public class PassAddressLookupSearchResult
    {
        public String text { get; set; }
        public String moniker { get; set; }
        public bool isMultipleAddresses { get; set; }
    }
    
    public class PassAddressLookupDetail
    {
        public String moniker { get; set; }
    }
    
    public class PassAddressLookupLine
    {
        public String label { get; set; }
        public String data { get; set; }
    }

    public class PassDesignID
    {
        public int designId { get; set; }
    }

    [Table("TradeDeliveryType", Schema = "dbo")]
    public class TradeDeliveryType
    {
        [Key]
        public string Code { get; set; }
        public string Description { get; set; }
    }
    
    public class TradeHaulier
    {
        [Key]
        public string HAULCODE { get; set; }
        public string Name { get; set; }
        public string UPS_World_Ver { get; set; }
        public bool DemandMobilePhoneNumber { get; set; }
        public ICollection<TradeCarriage> CarriageServices { get; set; }
    }

    public class TradeCarriage
    {
        [Key]
        [Column(Order = 1)]
        public string HAULCODE { get; set; }
        [Key]
        [Column(Order = 2)]
        public string CARRCODE { get; set; }
        public string Description { get; set; }
        public string Express { get; set; }
        public byte? CurrencyID { get; set; }
        public bool Visible { get; set; }

        [JsonIgnore]
        public virtual TradeHaulier Haulier { get; set; }

        public virtual ICollection<TradeCarriage_Country> CountryRestrictions { get; set; }
        public virtual ICollection<TradeCarriage_Price> Prices { get; set; }
    }

    public class TradeCarriage_Country
    {
        [Key]
        public long TradeCarriageCountryID { get; set; }
        public string HAULCODE { get; set; }
        public string CARRCODE { get; set; }
        public short? CountryID { get; set; }

        [JsonIgnore]
        public virtual TradeCarriage CarriageService { get; set; }

        [JsonIgnore]
        public virtual Country Country { get; set; }
    }

    public class TradeCarriage_Price
    {
        [Key]
        public int TradeCarriagePriceID { get; set; }
        public string HAULCODE { get; set; }
        public string CARRCODE { get; set; }
        public decimal MinValue { get; set; }
        public decimal MaxValue { get; set; }
        public decimal Price { get; set; }

        [JsonIgnore]
        public virtual TradeCarriage CarriageService { get; set; }
    }

    public class PassProductID
    {
        public int ProductID { get; set; }
    }

    public class PassProductIDs
    {
        public List<int> ProductIDs { get; set; }
    }

    #region ProductPage Info
    public class PassProductPageID
    {
        public int productPageId { get; set; }
    }

    public class ProductPageInfoReturn
    {
        public string Description { get; set; }
        public List<ProductPageCollection> Collections { get; set; }
        public ProductPageTechInfoCore TechInfoCore { get; set; }
        public List<ProductPageTechInfoTest> TechInfoTests { get; set; }
        public List<ProductPageTechInfoAftercare> TechInfoAftercares { get; set; }
        public List<ProductPageTechInfoUsage> TechInfoUsages { get; set; }
    }

    public class ProductPageCollection
    {
        public short CollectionID { get; set; }
        public string Heading { get; set; }
        public string URLKeywords { get; set; }
    }

    public class ProductPageTechInfoCore
    {
        public double? Width { get; set; }
        public double? Weight { get; set; }
        public double? HorizontalPatternRepeat { get; set; }
        public double? VerticalPatternRepeat { get; set; }
        public double? Martindale { get; set; }
        public short? CompositionID { get; set; }
        public string CompositionName { get; set; }
        public short? PatternMatchID { get; set; }
        public string PatternMatchName { get; set; }
        public short? FlamcodeID { get; set; }
        public string FlamcodeName { get; set; }
        public short? ContractFRID { get; set; }
        public string ContractFRName { get; set; }
        public short? DomesticFRID { get; set; }
        public string DomesticFRName { get; set; }
        public short? TypeID { get; set; }
        public string TypeName { get; set; }
        public string AdditionalInfo { get; set; }
        public string Status { get; set; }
    }

    public class ProductPageTechInfoTest
    {
        public short TestID { get; set; }
        public string TestName { get; set; }
    }

    public class ProductPageTechInfoAftercare
    {
        public short AftercareID { get; set; }
        public string AftercareName { get; set; }
    }

    public class ProductPageTechInfoUsage
    {
        public short UsageID { get; set; }
        public string UsageName { get; set; }
    }
    #endregion

}