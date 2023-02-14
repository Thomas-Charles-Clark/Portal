using Newtonsoft.Json;
using Portal.UPSCollection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services.Protocols;
using PickupNS = Portal.Pickup;

namespace Portal.UPS
{
    public static partial class UPSFunctions
    {
        /// <summary>
        /// Get a Quote for a Pickup
        /// </summary>
        /// <param name="serviceDateOption">
        /// "01" = "Same-day Pickup"
        /// "02" = "Future-Day Pickup"
        /// "03" = "Specific Day Pickup"
        /// </param>
        /// <param name="fromAddress"></param>
        /// <returns></returns>
        public static PickupRateReply GetCollectionRate(
            string serviceDateOption,
            DateTime pickupDate,
            string readyTime,
            string closeTime,
            PickupNS.AddressType fromAddress)
        {
            var result = new PickupRateReply();

            var picker = new PickupNS.PickupService();

            var sec = new PickupNS.UPSSecurity();

            var accessToken = new PickupNS.UPSSecurityServiceAccessToken
            {
                AccessLicenseNumber = "4D61FFBADC79A42A"
            };

            sec.ServiceAccessToken = accessToken;

            var userToken = new PickupNS.UPSSecurityUsernameToken
            {
                Username = UPSShipping.Credentials.userId,
                Password = UPSShipping.Credentials.password
            };

            sec.UsernameToken = userToken;

            picker.UPSSecurityValue = sec;

            var request = new PickupNS.PickupRateRequest()
            {
                AlternateAddressIndicator = "Y",
                PickupAddress = fromAddress,
                PickupDateInfo = new PickupNS.PickupDateInfoType()
                {
                    PickupDate = pickupDate.ToString("yyyyMMdd"),
                    ReadyTime = readyTime,
                    CloseTime = closeTime
                },
                Request = new PickupNS.RequestType()
                {
                    RequestOption = null,
                    SubVersion = "1807",
                    TransactionReference = null
                },
                ServiceDateOption = serviceDateOption,
                ShipperAccount = new PickupNS.ShipperAccountType()
                {
                    AccountCountryCode = "GB",
                    AccountNumber = "5WR515"
                },
                TaxInformationIndicator = "",
                UserLevelDiscountIndicator = null
            };

            try
            {
                result.Response = picker.ProcessPickupRate(request);
            }
            catch (SoapException se)
            {
                result.ErrorDetails = JsonConvert.SerializeObject(se.Detail, Formatting.Indented);
                result.Response = null;
            }

            return result;
        }

        /// <summary>
        /// Create a Collection
        /// </summary>
        /// <param name="returnId">[ups].[Return].[ReturnID]</param>
        /// <param name="pickupDate">Pickup Date</param>
        /// <param name="readyTime">Ready By</param>
        /// <param name="closeTime">Close By</param>
        /// <param name="fromAddress">From Address</param>
        /// <param name="trackingNumbers">Tracking Numbers</param>
        /// <returns></returns>
        public static PickupCreationReply CreateCollection(
            int returnId,
            DateTime pickupDate,
            string readyTime,
            string closeTime,
            PickupNS.PickupAddressType fromAddress,
            ICollection<string> trackingNumbers)
        {
            var result = new PickupCreationReply();

            var picker = new PickupNS.PickupService();

            var sec = new PickupNS.UPSSecurity();

            var accessToken = new PickupNS.UPSSecurityServiceAccessToken
            {
                AccessLicenseNumber = "4D61FFBADC79A42A"
            };

            sec.ServiceAccessToken = accessToken;

            var userToken = new PickupNS.UPSSecurityUsernameToken
            {
                Username = UPSShipping.Credentials.userId,
                Password = UPSShipping.Credentials.password
            };

            sec.UsernameToken = userToken;

            picker.UPSSecurityValue = sec;

            var request = new PickupNS.PickupCreationRequest()
            {
                AlternateAddressIndicator = "Y",
                CashType = null,
                FreightOptions = null,
                OverweightIndicator = null,
                PaymentMethod = "01",
                PickupPiece = new PickupNS.PickupPieceType[]
                {
                    new PickupNS.PickupPieceType()
                    {
                        ContainerCode = "01",
                        DestinationCountryCode = "GB",
                        ServiceCode = "011",
                        Quantity = $"{trackingNumbers.Count()}"
                    }
                },
                ReferenceNumber = $"[ReturnID] = {returnId}",
                ServiceCategory = fromAddress.CountryCode == "GB" ? "01" : "02",
                ShippingLabelsAvailable = "Y",
                SpecialInstruction = null,
                TotalWeight = null,
                TrackingData = GenerateTrackingData(trackingNumbers),
                TrackingDataWithReferenceNumber = null,
                PickupAddress = fromAddress,
                PickupDateInfo = new PickupNS.PickupDateInfoType()
                {
                    PickupDate = pickupDate.ToString("yyyyMMdd"),
                    ReadyTime = readyTime,
                    CloseTime = closeTime
                },
                Request = new PickupNS.RequestType()
                {
                    RequestOption = null,
                    SubVersion = "1807",
                    TransactionReference = null
                },
                RatePickupIndicator = "Y",
                Shipper = new PickupNS.ShipperType()
                {
                    Account = new PickupNS.AccountType()
                    {
                        AccountCountryCode = "GB",
                        AccountNumber = "5WR515"
                    },
                    ChargeCard = null,
                    TaxInformation = null
                },
                TaxInformationIndicator = "",
                UserLevelDiscountIndicator = null
            };

            try
            {
                result.Response = picker.ProcessPickupCreation(request);
            }
            catch (SoapException se)
            {
                result.ErrorDetails = JsonConvert.SerializeObject(se.Detail, Formatting.Indented);
                result.Response = null;
            }

            return result;
        }

        public static PickupCancelReply CancelCollection(string collectionReference)
        {
            var result = new PickupCancelReply();

            var picker = new PickupNS.PickupService();

            var sec = new PickupNS.UPSSecurity();

            var accessToken = new PickupNS.UPSSecurityServiceAccessToken
            {
                AccessLicenseNumber = "4D61FFBADC79A42A"
            };

            sec.ServiceAccessToken = accessToken;

            var userToken = new PickupNS.UPSSecurityUsernameToken
            {
                Username = UPSShipping.Credentials.userId,
                Password = UPSShipping.Credentials.password
            };

            sec.UsernameToken = userToken;

            picker.UPSSecurityValue = sec;

            var request = new PickupNS.PickupCancelRequest()
            {
                CancelBy = "02",
                PRN = collectionReference,
                Request = new PickupNS.RequestType()
                {
                    RequestOption = null,
                    SubVersion = "1807",
                    TransactionReference = null
                }
            };

            try
            {
                result.Response = picker.ProcessPickupCancel(request);
            }
            catch (SoapException se)
            {
                result.ErrorDetails = JsonConvert.SerializeObject(se.Detail, Formatting.Indented);
                result.Response = null;
            }

            return result;
        }

        public static PickupNS.TrackingDataType[] GenerateTrackingData(ICollection<string> trackingNumbers)
        {
            var result = new List<PickupNS.TrackingDataType>();

            foreach (var i in trackingNumbers)
            {
                result.Add(new PickupNS.TrackingDataType()
                {
                    TrackingNumber = i
                });
            }

            return result.ToArray();
        }
    }
}