using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Portal.Models
{
    public class ContractAgreementCheckResult
    {
        public List<ContractAgreementTradeContractPrices> TradeContractPrices { get; set; }
        public List<ContractAgreementTradeContractDiscounts> TradeContractDiscounts { get; set; }
    }

    public class ContractAgreementTradeContractPrices
    {
        public decimal Price { get; set; }
        public DateTime? OnDate { get; set; }
        public DateTime? OffDate { get; set; }
        public short QuantityBreak { get; set; }
        public long TradeContractPriceID { get; set; }
    }

    public class ContractAgreementTradeContractDiscounts
    {
        public decimal Discount { get; set; }
        public DateTime? OnDate { get; set; }
        public DateTime? OffDate { get; set; }
        public short QuantityBreak { get; set; }
        public long TradeContractDiscountID { get; set; }
    }

    public class ProductType
    {
        [Key]
        public byte ProductTypeID { get; set; }
        public byte ProductTypeGroupID { get; set; }
        public string Name { get; set; }
        
        public virtual ProductTypeGroup ProductTypeGroup { get; set; }

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }
    }

    public class Product
    {
        [Key]
        public int ProductID { get; set; }
        public byte ProductTypeID { get; set; }
        public byte? ProductGroupID { get; set; }
        public short? ItemTypeID { get; set; }
        public short LaunchID { get; set; }
        public byte BrandID { get; set; }
        public int? DesignID { get; set; }
        public short? QualityID { get; set; }
        public byte? ColourID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public bool Enabled { get; set; }
        public bool Deleted { get; set; }

        public virtual ProductType ProductType { get; set; }
        public virtual ItemType ItemType { get; set; }
        public virtual ProductGroup ProductGroup { get; set; }
        public virtual Stock Stock { get; set; }
        public virtual Launch Launch { get; set; }
        public virtual Design Design { get; set; }
        public virtual Quality Quality { get; set; }
        public virtual Colour Colour { get; set; }
        public virtual Brand Brand { get; set; }

        public virtual ICollection<Product_Collection> Collections { get; set; }
    }

    public class Product_Collection
    {
        public int ProductID { get; set; }
        public short CollectionID { get; set; }

        public virtual Product Product { get; set; }
        public virtual Collection Collection { get; set; }
    }

    public class Stock
    {
        [Key]
        public int ProductID { get; set; }
        public short FreeStock { get; set; }
        public byte StockStatusID { get; set; }

        [JsonIgnore]
        public virtual StockStatus StockStatus { get; set; }

        [JsonIgnore]
        public virtual Product Product { get; set; }
    }

    public class StockStatus
    {
        [Key]
        public byte StockStatusID { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Stock> Stocks { get; set; }
    }

    public class Launch
    {
        public short LaunchID { get; set; }
        public string Name { get; set; }
        public byte SeasonID { get; set; }

        public virtual Season Season { get; set; }

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }
    }

    public class Season
    {
        public byte SeasonID { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Launch> Launches { get; set; }
    }

    public class Collection
    {
        [Key]
        public short CollectionID { get; set; }
        public string Name { get; set; }
        public string Heading { get; set; }

        [JsonIgnore]
        public virtual ICollection<Product_Collection> Products { get; set; }
    }

    public class Design
    {
        [Key]
        public int DesignID { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }
    }

    public class ItemType
    {
        [Key]
        public short ItemTypeID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }
    }
    
    public class ProductGroup
    {
        [Key]
        public byte ProductGroupID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }
    }


    public class Quality
    {
        [Key]
        public short QualityID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Product> Products { get; set; }
    }
}