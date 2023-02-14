using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public List<DefaultDeliveryService> FetchDefaultDeliveryServices(PassDefaultDeliveryServicesFilters objFilters)
        {
            try
            {
                byte? deliveryGroupId = null;

                if (objFilters?.DeliveryGroupListID != null)
                {
                    deliveryGroupId = Convert.ToByte(objFilters.DeliveryGroupListID.Replace("DeliveryGroupID-", ""));
                }

                if (objFilters.DestinationCountryID == null)
                {
                    objFilters = null;
                }

                if (objFilters != null)
                {
                    return this.DefaultDeliveryServices.Where(p => (
                                                                        (objFilters.OriginCountryID == null) ||
                                                                        (p.OriginCountryID == objFilters.OriginCountryID)
                                                                   ) &&
                                                                   (
                                                                        (objFilters.DestinationCountryID == null) ||
                                                                        (p.DestinationCountryID == objFilters.DestinationCountryID)
                                                                   ) &&
                                                                   (
                                                                        (deliveryGroupId == null) ||
                                                                        (p.DeliveryGroupID == deliveryGroupId)
                                                                   )
                                                              )
                        .OrderBy(p => p.HaulierServiceCode)
                        .ThenBy(p => p.ServiceName)
                        .ToList();
                }
                else
                {
                    return new List<DefaultDeliveryService>();
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public DeliveryZone UpsertDeliveryZone(PassDeliveryZone objZone)
        {
            try
            {
                if (this.DeliveryZones.Where(p => p.CountryID == objZone.CountryID && p.Code == objZone.Code).Any())
                {
                    throw new Exception("A Delivery Zone for this country already exists with this code.");
                }

                var now = DateTime.Now;

                var deliveryZone = this.DeliveryZones.Add(new DeliveryZone()
                {
                    CreatedDT = now,
                    ModifiedDT = now,
                    CountryID = objZone.CountryID,
                    Code = objZone.Code,
                    Name = objZone.Name
                });

                this.SaveChanges();

                return deliveryZone;
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public DeliveryGroup UpsertDeliveryGroup(PassDeliveryGroup objDeliveryGroup)
        {
            try
            {
                var now = DateTime.Now;

                var extant = this.DeliveryGroups.Where(p => p.DeliveryGroupID == objDeliveryGroup.DeliveryGroupID).SingleOrDefault();

                if (extant == null)
                {
                    var newDeliveryGroup = this.DeliveryGroups.Add(new DeliveryGroup()
                    {
                        Name = objDeliveryGroup.Name,
                        Code = objDeliveryGroup.Code,
                        CreatedDT = now,
                        ModifiedDT = now,
                        SplitBasketByAvailability = objDeliveryGroup.SplitBasketByAvailability,
                        AvgParcelWeightKG = objDeliveryGroup.AvgParcelWeightKG,
                        AvgParcelWidthCM = objDeliveryGroup.AvgParcelWidthCM,
                        AvgParcelHeightCM = objDeliveryGroup.AvgParcelHeightCM,
                        AvgParcelLengthCM = objDeliveryGroup.AvgParcelLengthCM,
                        Notes = objDeliveryGroup.Notes,
                        SplitByBasketItem = objDeliveryGroup.SplitByBasketItem,
                        AvgPalletWeightKG = objDeliveryGroup.AvgPalletWeightKG,
                        CourierSurchargeEx = objDeliveryGroup.CourierSurchargeEx,
                        AllowDisplayDeliveryGroupConsolidation = objDeliveryGroup.AllowDisplayDeliveryGroupConsolidation,
                        MinimumParcelWeightKG = objDeliveryGroup.MinimumParcelWeightKG,
                        PackagingAllowanceKG = objDeliveryGroup.PackagingAllowanceKG
                    });

                    this.SaveChanges();

                    return newDeliveryGroup;
                }
                else
                {
                    extant.Name = objDeliveryGroup.Name;
                    extant.Code = objDeliveryGroup.Code;
                    extant.ModifiedDT = now;
                    extant.SplitBasketByAvailability = objDeliveryGroup.SplitBasketByAvailability;
                    extant.AvgParcelWeightKG = objDeliveryGroup.AvgParcelWeightKG;
                    extant.AvgParcelWidthCM = objDeliveryGroup.AvgParcelWidthCM;
                    extant.AvgParcelHeightCM = objDeliveryGroup.AvgParcelHeightCM;
                    extant.AvgParcelLengthCM = objDeliveryGroup.AvgParcelLengthCM;
                    extant.Notes = objDeliveryGroup.Notes;
                    extant.SplitByBasketItem = objDeliveryGroup.SplitByBasketItem;
                    extant.AvgPalletWeightKG = objDeliveryGroup.AvgPalletWeightKG;
                    extant.CourierSurchargeEx = objDeliveryGroup.CourierSurchargeEx;
                    extant.AllowDisplayDeliveryGroupConsolidation = objDeliveryGroup.AllowDisplayDeliveryGroupConsolidation;
                    extant.MinimumParcelWeightKG = objDeliveryGroup.MinimumParcelWeightKG;
                    extant.PackagingAllowanceKG = objDeliveryGroup.PackagingAllowanceKG;

                    this.SaveChanges();

                    return extant;
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public int SaveDefaultDeliveryServices(PassDefaultDeliveryServicesSave objSave)
        {
            try
            {
                var result = -1;

                foreach (var s in objSave.Services)
                {
                    var extant = this.DefaultDeliveryServices.Where(p => p.DefaultDeliveryServiceID == s.DefaultDeliveryServiceID).SingleOrDefault();

                    if (extant == null)
                    {
                        this.DefaultDeliveryServices.Add(new DefaultDeliveryService(s));
                    }
                    else
                    {
                        extant.Preference = s.Preference;
                        extant.DeliveryGroupID = s.DeliveryGroupID;
                        extant.OriginCountryID = s.OriginCountryID;
                        extant.DestinationCountryID = s.DestinationCountryID;
                        extant.DestinationDeliveryZoneID = s.DestinationDeliveryZoneID;
                        extant.TransferTypeID = s.TransferTypeID;
                        extant.HAULCODE = s.HAULCODE;
                        extant.HaulierServiceCode = s.HaulierServiceCode;
                        extant.DeliveryChargingLogicID = s.DeliveryChargingLogicID;
                        extant.CurrencyID = s.CurrencyID;
                        extant.Charge = s.Charge;
                        extant.ProportionalCharge = s.ProportionalCharge;
                        extant.DeliveryThresholdTypeID = s.DeliveryThresholdTypeID;
                        extant.ThresholdMinimum = s.ThresholdMinimum;
                        extant.ThresholdMaximum = s.ThresholdMaximum;
                        extant.ServiceName = s.ServiceName;
                        extant.ExpressService = s.ExpressService;
                        extant.DeliveryWeekDay = s.DeliveryWeekDay;
                        extant.Surcharge = s.Surcharge;
                        extant.SurchargeDeliveryChargingLogicID = s.SurchargeDeliveryChargingLogicID;
                        extant.WeightBracket = s.WeightBracket;
                    }
                }

                result = this.SaveChanges();

                return result;
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public int DeleteDefaultDeliveryServices (List<int> defaultDeliveryServiceIds)
        {
            try
            {
                var toDelete = this.DefaultDeliveryServices.Where(p => defaultDeliveryServiceIds.Contains(p.DefaultDeliveryServiceID)).ToList();
                return this.SaveChanges();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public int SaveAlternateDeliveryServices(PassAlternateDeliveryServicesSave objSave)
        {
            try
            {
                var result = -1;

                foreach (var s in objSave.models)
                {
                    var extant = this.AlternateDeliveryServices.Where(p => p.AlternateDeliveryServiceID == s.AlternateDeliveryServiceID).SingleOrDefault();

                    if (extant == null)
                    {
                        this.AlternateDeliveryServices.Add(s);
                    }
                    else
                    {
                        extant.ServiceName = s.ServiceName;
                        extant.Charge = s.Charge;
                        extant.DeliveryChargingLogicID = s.DeliveryChargingLogicID;
                        extant.FulfilmentTypeID = s.FulfilmentTypeID;
                        extant.SalesMarketID = s.SalesMarketID;
                        extant.DeliverToDGPremisesOnly = s.DeliverToDGPremisesOnly;
                        extant.HAULCODE = s.HAULCODE;
                        extant.MertexCurrencyCode = s.MertexCurrencyCode;
                        extant.CARRCODE = s.CARRCODE;
                        extant.DeliveryGroupID = s.DeliveryGroupID;
                        //extant.TradeAccountGroupID = s.TradeAccountGroupID;
                    }
                }

                result = this.SaveChanges();

                return result;
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public int DeleteAlternateDeliveryServices(List<PassAlternateDeliveryService> alternateDeliveryServices)
        {
            try
            {
                var alternateDeliveryServiceIds = alternateDeliveryServices.Select(p => p.AlternateDeliveryServiceID).ToList();

                var toDelete = this.AlternateDeliveryServices.Where(p => alternateDeliveryServiceIds.Contains(p.AlternateDeliveryServiceID)).ToList();

                this.AlternateDeliveryServices.RemoveRange(toDelete);

                return this.SaveChanges();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }


        public int SaveTradeDeliveryContractPrices(PassTradeDeliveryContractPricesSave objSave)
        {
            try
            {
                var result = -1;

                foreach (var s in objSave.models)
                {
                    var extant = this.TradeDeliveryContractPrices.Where(p => p.TradeDeliveryContractPriceID == s.TradeDeliveryContractPriceID).SingleOrDefault();

                    if (extant == null)
                    {
                        this.TradeDeliveryContractPrices.Add(s);
                    }
                    else
                    {
                        extant.TradeAccountID = s.TradeAccountID;
                        extant.HAULCODE = s.HAULCODE;
                        extant.CARRCODE = s.CARRCODE;
                        extant.DestinationCountryID = s.DestinationCountryID;
                        extant.DeliveryGroupID = s.DeliveryGroupID;
                        extant.CurrencyID = s.CurrencyID;
                        extant.ContractPrice = s.ContractPrice;
                        extant.DeliveryChargingLogicID = s.DeliveryChargingLogicID;
                        extant.OnDate = s.OnDate;
                        extant.OffDate = s.OffDate;
                        extant.DataSource = s.DataSource;
                        extant.ThresholdMinimum = s.ThresholdMinimum;
                        extant.ThresholdMaximum = s.ThresholdMaximum;
                        extant.DeliveryThresholdTypeID = s.DeliveryThresholdTypeID;
                        extant.WeightBracket = s.WeightBracket;
                    }
                }

                result = this.SaveChanges();

                return result;
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public int DeleteTradeDeliveryContractPrices(List<PassTradeDeliveryContractPrice> tradeDeliveryContractPrice)
        {
            try
            {
                var tradeDeliveryContractPriceIds = tradeDeliveryContractPrice.Select(p => p.TradeDeliveryContractPriceID).ToList();

                var toDelete = this.TradeDeliveryContractPrices.Where(p => tradeDeliveryContractPriceIds.Contains(p.TradeDeliveryContractPriceID)).ToList();

                var now = DateTime.Now;

                toDelete.ForEach(c =>
                {
                    c.DeletedDT = now;
                });

                return this.SaveChanges();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }
    }
}
