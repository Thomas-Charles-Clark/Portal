using Newtonsoft.Json;
using Portal.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Portal.Models
{
    public class Attribute
    {
        [Key]
        public short AttributeID { get; set; }
        public byte AttributeGroupID { get; set; }
        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public virtual AttributeGroup AttributeGroup { get; set; }
    }

    public class AttributeGroup
    {
        [Key]
        public byte AttributeGroupID { get; set; }
        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<Attribute> Attributes { get; set; }
    }

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
        public override string ToString()
        {
            return String.Format(@"
                    {0},
                    {1},
                    {2},
                    {3},
                    {4},
                    {5},
                    {6}",
            Name, 
            AddressLine1, 
            AddressLine2, 
            AddressLine3, 
            AddressLine4, 
            Postcode, 
            Country.Name);
        }

    }

    public class SampleOrder
    {
        public string TradeAccountCode { get; set; }

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

    public class PassPCAPredictFind
    {
        public string id { get; set; }
        public string text { get; set; }
        public string container { get; set; }
        public string origin { get; set; }
        public string countries { get; set; }
        public string limit { get; set; }
        public string language { get; set; }
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
    
    public class TradeHaulier
    {
        public string HAULCODE { get; set; }
        public string Name { get; set; }
        public string UPS_World_Ver { get; set; }

        public ICollection<TradeCarriage> CarriageServices { get; set; }
    }

    public class TradeCarriage
    {
        public string HAULCODE { get; set; }
        public string CARRCODE { get; set; }
        public string Description { get; set; }
        public string Express { get; set; }

        [JsonIgnore]
        public virtual TradeHaulier Haulier { get; set; }

        public virtual ICollection<TradeCarriage_Country> CountryRestrictions { get; set; }
        public virtual ICollection<TradeCarriage_Price> Prices { get; set; }
    }

    public class TradeCarriage_Country
    {
        [Key]
        public short TradeCarriageCountryID { get; set; }
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

    #region Product Stock Info
    public class PassProductCode
    {
        public string code { get; set; }
    }

    public class ProductStockInfoReturn
    {
        public string Code { get; set; }
        public string TotalStock { get; set; }
        public List<Batch> Batches { get; set; }
        public List<PurchaseOrder> PurchaseOrders { get; set; }
        public string TotalPurchaseOrderLength { get; set; }
    }

    public class BatchPiece
    {
        public string Quantity { get; set; }
        public string Length { get; set; }
    }
    
    public class Batch
    {
        public string BatchNumber { get; set; }
        public string ItemCount { get; set; }
        public string Length { get; set; }

        public List<BatchPiece> Pieces { get; set; }
    }

    public class PurchaseOrder
    {
        public string PurchaseOrderNumber { get; set; }
        public string DueDate { get; set; }
        public string Length { get; set; }
    }
    #endregion
}