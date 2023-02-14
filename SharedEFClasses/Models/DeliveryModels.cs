using Microsoft.AspNet.OData.Builder;
using Microsoft.OData.Edm;
using Newtonsoft.Json;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("DeliveryGroup", Schema = "portal")]
    public class DeliveryGroup
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
        public byte DeliveryGroupID { get; set; }

        public string Name { get; set; }

        public string Code { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public bool SplitBasketByAvailability { get; set; }

        public decimal? AvgParcelWeightKG { get; set; }

        public decimal? AvgParcelWidthCM { get; set; }

        public decimal? AvgParcelHeightCM { get; set; }

        public decimal? AvgParcelLengthCM { get; set; }

        public string Notes { get; set; }

        public bool SplitByBasketItem { get; set; }

        public decimal AvgPalletWeightKG { get; set; }

        public decimal? CourierSurchargeEx { get; set; }

        public bool AllowDisplayDeliveryGroupConsolidation { get; set; }

        public decimal MinimumParcelWeightKG { get; set; }

        public decimal PackagingAllowanceKG { get; set; }

        [JsonIgnore]
        [InverseProperty("DeliveryGroup")]
        public virtual ICollection<DefaultDeliveryService> DefaultDeliveryServices { get; set; }

        [JsonIgnore]
        [InverseProperty("DeliveryGroup")]
        public virtual ICollection<AlternateDeliveryService> AlternateDeliveryServices { get; set; }

        [JsonIgnore]
        [InverseProperty("DeliveryGroup")]
        public virtual ICollection<TradeDeliveryContractPrice> TradeDeliveryContractPrices { get; set; }

        [NotMapped]
        public string DeliveryGroupListID
        {
            get
            {
                return $"DeliveryGroupID-{DeliveryGroupID}";
            }
        }
    }

    [Table("DefaultDeliveryService", Schema = "portal")]
    public class DefaultDeliveryService
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
        public int DefaultDeliveryServiceID { get; set; }
        public byte Preference { get; set; }
        public byte DeliveryGroupID { get; set; }
        public short OriginCountryID { get; set; }
        public short DestinationCountryID { get; set; }
        public short? DestinationDeliveryZoneID { get; set; }
        public byte? TransferTypeID { get; set; }
        public string HAULCODE { get; set; }
        public string HaulierServiceCode { get; set; }
        public byte? DeliveryChargingLogicID { get; set; }
        public byte CurrencyID { get; set; }
        public decimal? Charge { get; set; }
        public decimal? ProportionalCharge { get; set; }
        public byte? DeliveryThresholdTypeID { get; set; }
        public decimal? ThresholdMinimum { get; set; }
        public decimal? ThresholdMaximum { get; set; }
        public string ServiceName { get; set; }
        public bool ExpressService { get; set; }
        public string DeliveryWeekDay { get; set; }
        public decimal? Surcharge { get; set; }
        public byte? SurchargeDeliveryChargingLogicID { get; set; }
        public decimal? WeightBracket { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string DefaultDeliveryServiceHash { get; set; }

        [ForeignKey("DeliveryGroupID")]
        public virtual DeliveryGroup DeliveryGroup { get; set; }

        [ForeignKey("OriginCountryID")]
        public virtual Country OriginCountry { get; set; }

        [ForeignKey("DestinationCountryID")]
        public virtual Country DestinationCountry { get; set; }

        [ForeignKey("DestinationDeliveryZoneID")]
        public virtual DeliveryZone DestinationDeliveryZone { get; set; }

        [ForeignKey("TransferTypeID")]
        public virtual TransferType TransferType { get; set; }

        [ForeignKey("DeliveryChargingLogicID")]
        public virtual DeliveryChargingLogic DeliveryChargingLogic { get; set; }

        [ForeignKey("CurrencyID")]
        public virtual Currency Currency { get; set; }

        [ForeignKey("DeliveryThresholdTypeID")]
        public virtual DeliveryThresholdType DeliveryThresholdType { get; set; }

        [ForeignKey("SurchargeDeliveryChargingLogicID")]
        public virtual DeliveryChargingLogic SurchargeChargingLogic { get; set; }

        [NotMapped]
        public string DeliveryGroupListID
        {
            get
            {
                return $"DeliveryGroupID-{DeliveryGroupID}";
            }
        }
        public DefaultDeliveryService()
        {

        }

        public DefaultDeliveryService(PassDefaultDeliveryGroupServicePricePoint s)
        {
            Preference = s.Preference;
            DeliveryGroupID = s.DeliveryGroupID;
            OriginCountryID = s.OriginCountryID;
            DestinationCountryID = s.DestinationCountryID;
            DestinationDeliveryZoneID = s.DestinationDeliveryZoneID;
            TransferTypeID = s.TransferTypeID;
            HAULCODE = s.HAULCODE;
            HaulierServiceCode = s.HaulierServiceCode;
            DeliveryChargingLogicID = s.DeliveryChargingLogicID;
            CurrencyID = s.CurrencyID;
            Charge = s.Charge;
            ProportionalCharge = s.ProportionalCharge;
            DeliveryThresholdTypeID = s.DeliveryThresholdTypeID;
            ThresholdMinimum = s.ThresholdMinimum;
            ThresholdMaximum = s.ThresholdMaximum;
            ServiceName = s.ServiceName;
            ExpressService = s.ExpressService;
            DeliveryWeekDay = s.DeliveryWeekDay;
            Surcharge = s.Surcharge;
            SurchargeDeliveryChargingLogicID = s.SurchargeDeliveryChargingLogicID;
            WeightBracket = s.WeightBracket;
        }
    }

    [Table("DeliveryThresholdType", Schema = "portal")]
    public class DeliveryThresholdType
    {
        [Key]
        public byte DeliveryThresholdTypeID { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("DeliveryThresholdType")]
        public virtual ICollection<DefaultDeliveryService> DefaultDeliveryServices { get; set; }

        [JsonIgnore]
        [InverseProperty("DeliveryThresholdType")]
        public virtual ICollection<TradeDeliveryContractPrice> TradeDeliveryContractPrices { get; set; }
    }

    [Table("TransferType", Schema = "portal")]
    public class TransferType
    {
        [Key]
        public byte TransferTypeID { get; set; }

        public string Name { get; set; }

        [NotMapped]
        public string TransferTypeListID
        {
            get
            {
                return $"TransferTypeID-{TransferTypeID}";
            }
        }

        [JsonIgnore]
        [InverseProperty("TransferType")]
        public virtual ICollection<DefaultDeliveryService> DefaultDeliveryServices { get; set; }
    }

    [Table("DeliveryZone", Schema = "portal")]
    public class DeliveryZone
    {
        [Key]
        public short DeliveryZoneID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public short CountryID { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime ModifiedDT { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [InverseProperty("DestinationDeliveryZone")]
        public virtual ICollection<DefaultDeliveryService> DefaultDeliveryServices { get; set; }
    }

    [Table("DeliveryChargingLogic", Schema = "portal")]
    public class DeliveryChargingLogic
    {
        [Key]
        public byte DeliveryChargingLogicID { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime ModifiedDT { get; set; }
        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
        public string Code { get; set; }
        public string MertexCode { get; set; }
        public short? ResourceID { get; set; }

        [JsonIgnore]
        [InverseProperty("DeliveryChargingLogic")]
        public virtual ICollection<DefaultDeliveryService> DefaultDeliveryServices { get; set; }

        [JsonIgnore]
        [InverseProperty("SurchargeChargingLogic")]
        public virtual ICollection<DefaultDeliveryService> DefaultDeliveryServicesSurcharges { get; set; }

        [JsonIgnore]
        [InverseProperty("DeliveryChargingLogic")]
        public virtual ICollection<AlternateDeliveryService> AlternateDeliveryServices { get; set; }

        [JsonIgnore]
        [InverseProperty("DeliveryChargingLogic")]
        public virtual ICollection<TradeDeliveryContractPrice> TradeDeliveryContractPrices { get; set; }
    }

    public class PassDefaultDeliveryServicesFilters
    {
        public short? OriginCountryID { get; set; }
        public short? DestinationCountryID { get; set; }
        public string DeliveryGroupListID { get; set; }
    }

    public class PassCarriageCodeMapFetch
    {
        public string HAULCODE { get; set; }
        public string HaulierServiceCode { get; set; }
        public bool ExpressService { get; set; }
    }

    public class PassDeliveryZone
    {
        public short? DeliveryZoneID { get; set; }
        public short CountryID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class PassDeliveryGroup
    {
        public byte? DeliveryGroupID { get; set; }

        public string Name { get; set; }

        public string Code { get; set; }

        public bool SplitBasketByAvailability { get; set; }

        public decimal? AvgParcelWeightKG { get; set; }

        public decimal? AvgParcelWidthCM { get; set; }

        public decimal? AvgParcelHeightCM { get; set; }

        public decimal? AvgParcelLengthCM { get; set; }

        public string Notes { get; set; }

        public bool SplitByBasketItem { get; set; }

        public decimal AvgPalletWeightKG { get; set; }

        public decimal? CourierSurchargeEx { get; set; }

        public bool AllowDisplayDeliveryGroupConsolidation { get; set; }

        public decimal MinimumParcelWeightKG { get; set; }

        public decimal PackagingAllowanceKG { get; set; }
    }

    public class PassDefaultDeliveryServicesSave
    {
        public List<PassDefaultDeliveryGroupServicePricePoint> Services { get; set; }
        public List<int> Removals { get; set; }

        public PassDefaultDeliveryServicesSave()
        {
            Services = new List<PassDefaultDeliveryGroupServicePricePoint>();
            Removals = new List<int>();
        }
    }

    public class PassDefaultDeliveryGroupServicePricePoint
    {
        public int? DefaultDeliveryServiceID { get; set; }
        public byte Preference { get; set; }
        public byte DeliveryGroupID { get; set; }
        public short OriginCountryID { get; set; }
        public short DestinationCountryID { get; set; }
        public short? DestinationDeliveryZoneID { get; set; }
        public byte? TransferTypeID { get; set; }
        public string HAULCODE { get; set; }
        public string HaulierServiceCode { get; set; }
        public byte? DeliveryChargingLogicID { get; set; }
        public byte CurrencyID { get; set; }
        public decimal? Charge { get; set; }
        public decimal? ProportionalCharge { get; set; }
        public byte? DeliveryThresholdTypeID { get; set; }
        public decimal? ThresholdMinimum { get; set; }
        public decimal? ThresholdMaximum { get; set; }
        public string ServiceName { get; set; }
        public bool ExpressService { get; set; }
        public string DeliveryWeekDay { get; set; }
        public decimal? Surcharge { get; set; }
        public byte? SurchargeDeliveryChargingLogicID { get; set; }
        public decimal? WeightBracket { get; set; }
    }

    [Table("FulfilmentType", Schema = "portal")]
    public class FulfilmentType
    {
        [Key]
        public byte FulfilmentTypeID { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("FulfilmentType")]
        public virtual ICollection<AlternateDeliveryService> AlternateDeliveryServices { get; set; }
    }

    [Table("AlternateDeliveryService", Schema = "portal")]
    public class AlternateDeliveryService
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
        public short AlternateDeliveryServiceID { get; set; }
        public string ServiceName { get; set; }
        public decimal? Charge { get; set; }
        public byte? DeliveryChargingLogicID { get; set; }
        public byte FulfilmentTypeID { get; set; }
        public byte? SalesMarketID { get; set; }
        public bool DeliverToDGPremisesOnly { get; set; }
        public string HAULCODE { get; set; }
        public string MertexCurrencyCode { get; set; }
        public string CARRCODE { get; set; }
        public byte? DeliveryGroupID { get; set; }
        public int? TradeAccountGroupID { get; set; }
        
        [NotMapped]
        public string Description
        {
            get
            {
                return ServiceName;
            }
            set
            {

            }
        }

        public DateTime? DeletedDT { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("DeliveryChargingLogicID")]
        public virtual DeliveryChargingLogic DeliveryChargingLogic { get; set; }

        [ForeignKey("FulfilmentTypeID")]
        public virtual FulfilmentType FulfilmentType { get; set; }

        [ForeignKey("SalesMarketID")]
        public SalesMarket SalesMarket { get; set; }

        [ForeignKey("DeliveryGroupID")]
        public DeliveryGroup DeliveryGroup { get; set; }

        [ForeignKey("TradeAccountGroupID")]
        public TradeAccountGroup TradeAccountGroup { get; set; }
    }

    public class PassAlternateDeliveryServicesSave
    {
        public List<PassAlternateDeliveryService> models { get; set; }
    }

    [NotMapped]
    public class PassAlternateDeliveryService : AlternateDeliveryService
    {
        public new short? AlternateDeliveryServiceID { get; set; }
    }

    [Table("TradeDeliveryContractPrice", Schema = "portal")]
    public class TradeDeliveryContractPrice
    {
        //private DateTimeWrapper createdDtw;
        //private DateTimeWrapper onDtw;
        //private DateTimeWrapper offDtw;
        //private DateTimeWrapper deletedDtw;

        [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key]
        public long TradeDeliveryContractPriceID { get; set; }
        [Required]
        public int TradeAccountID { get; set; }
        [Required]
        public string HAULCODE { get; set; }
        [Required]
        public string CARRCODE { get; set; }
        [Required]
        public short DestinationCountryID { get; set; }
        [Required]
        public byte DeliveryGroupID { get; set; }
        [Required]
        public byte CurrencyID { get; set; }
        public decimal ContractPrice { get; set; }
        [Required]
        public byte DeliveryChargingLogicID { get; set; }

        public DateTime? OnDate { get; set; }

        //[NotMapped]
        //public DateTimeOffset? OnDateOffset
        //{
        //    get { return onDtw; }
        //    set { onDtw = value; }
        //}

        public DateTime? OffDate { get; set; }

        //[NotMapped]
        //public DateTimeOffset? OffDateOffset
        //{
        //    get { return offDtw; }
        //    set { offDtw = value; }
        //}

        public DateTime CreatedDT { get; set; }

        //[NotMapped]
        //public DateTimeOffset CreatedDTOffset
        //{
        //    get { return createdDtw; }
        //    set { createdDtw = value; }
        //}

        public DateTime? DeletedDT { get; set; }

        //[NotMapped]
        //public DateTimeOffset? DeletedDTOffset
        //{
        //    get { return deletedDtw; }
        //    set { deletedDtw = value; }
        //}

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
        public string DataSource { get; set; }
        public decimal? ThresholdMinimum { get; set; }
        public decimal? ThresholdMaximum { get; set; }
        public  byte? DeliveryThresholdTypeID { get; set; }
        public decimal? WeightBracket { get; set; }

        [AutoExpand]
        [ForeignKey("TradeAccountID")]
        public virtual TradeAccount TradeAccount { get; set; }

        [AutoExpand]
        [ForeignKey("DestinationCountryID")]
        public virtual Country DestinationCountry { get; set; }

        [AutoExpand]
        [ForeignKey("DeliveryGroupID")]
        public virtual DeliveryGroup DeliveryGroup { get; set; }

        [AutoExpand]
        [ForeignKey("CurrencyID")]
        public virtual Currency Currency { get; set; }

        [AutoExpand]
        [ForeignKey("DeliveryChargingLogicID")]
        public virtual DeliveryChargingLogic DeliveryChargingLogic { get; set; }

        [AutoExpand]
        [ForeignKey("DeliveryThresholdTypeID")]
        public virtual DeliveryThresholdType DeliveryThresholdType { get; set; }
    }

    public class PassTradeDeliveryContractPricesSave
    {
        public List<PassTradeDeliveryContractPrice> models { get; set; }
    }

    [NotMapped]
    public class PassTradeDeliveryContractPrice : TradeDeliveryContractPrice
    {
        public new long? TradeDeliveryContractPriceID { get; set; }
    }

    //public class DateTimeWrapper
    //{
    //    public static implicit operator DateTimeOffset(DateTimeWrapper p)
    //    {
    //        if (p._dt.HasValue)
    //            return DateTime.SpecifyKind(p._dt.Value, DateTimeKind.Utc);
    //        else
    //            return DateTimeOffset.MinValue;
    //    }

    //    public static implicit operator DateTimeOffset?(DateTimeWrapper p)
    //    {
    //        if (p._dt.HasValue)
    //            return DateTime.SpecifyKind(p._dt.Value, DateTimeKind.Utc);
    //        else
    //            return null;
    //    }

    //    public static implicit operator DateTimeWrapper(DateTimeOffset dto)
    //    {
    //        return new DateTimeWrapper(dto.DateTime);
    //    }

    //    public static implicit operator DateTime(DateTimeWrapper dtr)
    //    {
    //        if (dtr._dt.HasValue)
    //            return dtr._dt.Value;
    //        else
    //            return DateTime.MinValue;
    //    }

    //    public static implicit operator DateTime?(DateTimeWrapper dtr)
    //    {
    //        return dtr._dt;
    //    }

    //    public static implicit operator DateTimeWrapper(DateTime? dt)
    //    {
    //        return new DateTimeWrapper(dt);
    //    }

    //    protected DateTimeWrapper(DateTime? dt)
    //    {
    //        _dt = dt;
    //    }

    //    private readonly DateTime? _dt;
    //}
}