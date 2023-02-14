using Newtonsoft.Json;
using Portal.UPSTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Services.Protocols;
using TrackNS = Portal.Track;

namespace Portal.UPS
{
    public static partial class UPSFunctions
    {
        /// <summary>
        /// Fetches tracking updates for a shipment identification number
        /// </summary>
        /// <param name="shipmentIdentificationNumber">
        ///     UPS try to ensure this is unique in any 120 day period.
        ///     It is possible that this does not uniquely identify a shipment. 
        ///     If the shipment referenced contains multiple packages, all information for all packages will be returned (where the pickup occurred inside the given date range).
        /// </param>
        /// <param name="pickupDateRangeFromDate">Pickup date range: From. Returns tracking information for shipment identifier where pickup occurred within given date range.</param>
        /// <param name="pickupDateRangeToDate">Pickup date range: To. Returns tracking information for shipment identifier where pickup occurred within given date range.</param>
        /// <returns></returns>
        public static TrackingReply FetchTrackingUpdates(
            string shipmentIdentificationNumber,
            string fromPostcode,
            string fromCountryCode,
            DateTime pickupDateRangeFromDate,
            DateTime pickupDateRangeToDate,
            string accountNumber = "5WR515")
        {
            var result = new TrackingReply();

            var tracker = new TrackNS.TrackService();

            var sec = new TrackNS.UPSSecurity();

            var accessToken = new TrackNS.UPSSecurityServiceAccessToken
            {
                AccessLicenseNumber = "4D61FFBADC79A42A"
            };

            sec.ServiceAccessToken = accessToken;

            var userToken = new TrackNS.UPSSecurityUsernameToken
            {
                Username = UPSShipping.Credentials.userId,
                Password = UPSShipping.Credentials.password
            };

            sec.UsernameToken = userToken;

            tracker.UPSSecurityValue = sec;

            var request = new TrackNS.TrackRequest()
            {
                CandidateBookmark = null,
                IncludeMailInnovationIndicator = null,
                InquiryNumber = shipmentIdentificationNumber,
                Locale = "en_GB",
                PickupDateRange = new TrackNS.PickupDateRangeType()
                {
                    BeginDate = pickupDateRangeFromDate.ToString("yyyyMMdd"),
                    EndDate = pickupDateRangeToDate.ToString("yyyyMMdd")

                },
                PreauthorizedReturnIndicator = null,
                ReferenceNumber = null,
                Request = new TrackNS.RequestType()
                {
                    RequestOption = new string[] { "1" },
                    SubVersion = "1807",
                    TransactionReference = null
                },
                ShipFrom = new TrackNS.ShipFromRequestType()
                {
                    Address = new TrackNS.AddressRequestType()
                    {
                        CountryCode = fromCountryCode,
                        PostalCode = fromPostcode
                    }
                },
                ShipmentType = null,
                ShipperAccountInfo = new TrackNS.ShipperAccountInfoType()
                {
                    CountryCode = "GB",
                    PostalCode = "NW107PH"
                },
                ShipperNumber = accountNumber,
                ShipTo = new TrackNS.ShipToRequestType()
                {
                    Address = new TrackNS.AddressRequestType()
                    {
                        PostalCode = "NW107PH",
                        CountryCode = "GB"
                    }
                },
                TrackingOption = "01"
            };

            try
            {
                result.Response = tracker.ProcessTrack(request);
            }
            catch (SoapException se)
            {
                result.ErrorDetails = JsonConvert.SerializeObject(se.Detail, Formatting.Indented);
                result.Response = null;
            }

            return result;
        }
    }
}
