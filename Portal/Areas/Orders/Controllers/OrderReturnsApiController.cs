using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Newtonsoft.Json;
using Portal.MertexDAL;
using Portal.Utilities;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.MertexLive;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.ReturnModels;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Portal.UPSCollection;
using Portal.UPSShipping;
using Portal.UPS;
using Portal.Pickup;
using Portal.UPSTracking;

namespace Portal.Areas.Orders.Controllers
{
    public class PassClaimID
    {
        public string ClaimID { get; set; }
    }

    [Authorize]
    public class OrderReturnsController : ApiController
    {
        private PortalDbContext portalDb { get; set; }
        private readonly ApplicationUserManager userManager;

        public OrderReturnsController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.portalDb = portalDbContext;
            this.userManager = userManager;
        }

        [HttpPost]
        public IHttpActionResult FetchCCRDetails([FromBody]PassClaimID objCCR)
        {
            var result = portalDb.ClaimHeads.Where(p => p.ClaimID == objCCR.ClaimID).Single();

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult ExtantReturnCheck([FromBody]PassClaimID objCheck)
        {
            var extantReturns = portalDb.Returns.Where(p => p.ClaimID == objCheck.ClaimID).ToList();

            return Ok(new 
            {
                extantReturns,
                objCheck.ClaimID
            });
        } 

        [HttpPost]
        public IHttpActionResult FetchReturnPricing([FromBody]PassReturn objReturn)
        {
            var uniqueId = Guid.NewGuid().ToString().Substring(0, 30);

            var results = UPSFunctions.SendShipConfirmRequest(
                uniqueId,
                objReturn.UPSAccountNumber,
                "Declaration Statement",
                objReturn);

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult AcceptShip([FromBody]PassShipDigest objDigest)
        {
            return Ok(new { });

            //var results = UPSFunctions.SendShipAcceptRequest(objDigest.digest);

            //var labelFetch = UPSFunctions.RecoverLabel(results.Response.ShipmentResults.ShipmentIdentificationNumber);

            //var chargesJson = JsonConvert.SerializeObject(new
            //{
            //    negotiatedCharges = results.Response.ShipmentResults.NegotiatedRateCharges,
            //    shipmentCharges = results.Response.ShipmentResults.ShipmentCharges,
            //    packageCharges = results.Response.ShipmentResults.PackageResults
            //});

            //var @return = portalDb.Returns.Add(new SharedEFClasses.ReturnModels.Return()
            //{
            //    TradeAccountID = 
            //    ClaimID = objDigest.ClaimID.TrimReduceTruncate(50),
            //    CollectionCompanyName = (objDigest.Header.FromAddress.CompanyName ?? objDigest.Header.FromAddress.Name).TrimReduceTruncate(35),
            //    CollectionContactName = (objDigest.Header.FromAddress.Name ?? objDigest.Header.FromAddress.CompanyName).TrimReduceTruncate(35),
            //    CollectionAddressLine1 = objDigest.Header.FromAddress.AddressLine1.TrimReduceTruncate(60),
            //    CollectionAddressLine2 = objDigest.Header.FromAddress.AddressLine2.TrimReduceTruncate(60),
            //    CollectionTown = objDigest.Header.FromAddress.Town.TrimReduceTruncate(50),
            //    CollectionStateProvinceCode = null,
            //    CollectionPostcode = objDigest.Header.FromAddress.Postcode.TrimReduceTruncate(20),
            //    CollectionCountryID = objDigest.Header.FromAddress.CountryID.Value,
            //    CollectionResidentialIndicator = objDigest.Header.FromAddress.Residential,
            //    CollectionEmail = objDigest.Header.FromAddress.Email.TrimReduceTruncate(254),
            //    CollectionPhoneNumber = objDigest.Header.FromAddress.Phone.TrimReduceTruncate(20),
            //    CollectTaxID = objDigest.Header.FromAddress.TaxID.TrimReduceTruncate(50),
            //    ShipmentIdentificationNumber = results.Response.ShipmentResults.ShipmentIdentificationNumber.TrimReduceTruncate(50),
            //    ShipmentReference1 = objDigest.ShipmentReference1.TrimReduceTruncate(35),
            //    ShipmentReference2 = objDigest.ShipmentReference2.TrimReduceTruncate(35),
            //    TotalChargeEx = Convert.ToDecimal(results.Response.ShipmentResults.NegotiatedRateCharges?.TotalCharge.MonetaryValue ?? results.Response.ShipmentResults.ShipmentCharges.TotalCharges.MonetaryValue),
            //    TradeAccountID = objDigest.tradeAccountId,
            //    UPSAccountID = objDigest.upsAccountId,
            //    PDFBase64 = labelFetch.Results[0].LabelImage.GraphicImage,
            //    CreatedDT = DateTime.Now,
            //    ReturnParcels = new List<SharedEFClasses.ReturnModels.ReturnParcel>()
            //});

            //for (var i = 0; i < results.Response.ShipmentResults.PackageResults.Length; i++)
            //{
            //    var responsePackage = results.Response.ShipmentResults.PackageResults[i];

            //    var rp = objDigest.Parcels[i];

            //    var parcel = new SharedEFClasses.ReturnModels.ReturnParcel()
            //    {
            //        ReturnParcelProducts = new List<ReturnParcelProduct>(),
            //        TrackingNumber = responsePackage.TrackingNumber
            //    };

            //    foreach(var p in rp.Products)
            //    {
            //        parcel.ReturnParcelProducts.Add(new ReturnParcelProduct()
            //        {
            //            Code = p.Code.TrimReduceTruncate(35),
            //            CommodityCode = p.CommodityCode.TrimReduceTruncate(15),
            //            Description = p.Description.TrimReduceTruncate(35),
            //            OriginCountryCode = p.OriginCountryCode.TrimReduceTruncate(2),
            //            Quantity = p.Quantity.Value,
            //            ToelineID = p.ToelineID.TrimReduceTruncate(20),
            //            Value = p.Value ?? 0,
            //            Unit = p.Unit.TrimReduceTruncate(7),
            //            OriginalTrackingNumber = p.OriginalTrackingNumber.TrimReduceTruncate(20)
            //        });
            //    }

            //    @return.ReturnParcels.Add(parcel);
            //}

            //portalDb.SaveChanges();

            //return Ok(@return);
        }

        [HttpPost]
        public IHttpActionResult RecoverLabel([FromBody]PassTrackingNumber objTrackingNumber)
        {
            var results = UPSFunctions.RecoverLabel(objTrackingNumber.trackingNumber);

            if (results.ErrorDetails != null)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, results.ErrorDetails));
            }

            var data = Convert.FromBase64String(results.Results[0].LabelImage.GraphicImage);

            HttpContext.Current.Response.ContentType = "application/pdf";
            HttpContext.Current.Response.Buffer = false;
            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            HttpContext.Current.Response.OutputStream.Write(data, 0, data.Length);
            HttpContext.Current.Response.OutputStream.Flush();
            HttpContext.Current.Response.End();

            return null;
        }

        [HttpPost]
        public IHttpActionResult VoidLabel([FromBody]PassTrackingNumber objConsignment)
        {
            var results = UPSFunctions.VoidLabel(objConsignment.trackingNumber);

            if (results.ErrorDetails == null)
            {
                var lbl = portalDb.UPSConsignments.Where(p => p.ConsignmentID == objConsignment.upsConsignmentId).Single();

                lbl.VoidedDT = DateTime.Now;

                portalDb.SaveChanges();
            }

            return Ok(results);
        }

        [HttpGet]
        public IHttpActionResult ReturnsGrid([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]
        DataSourceRequest request)
        {
            return Ok(portalDb.Returns.AsQueryable().ToDataSourceResult(request));
        }

        [HttpPost]
        public IHttpActionResult FetchCollectionRate([FromBody]PassCollectionRequest objRate)
        {
            var upsReturn = portalDb.Returns.Where(p => p.ReturnID == objRate.returnId).Single();

            var collectAddressLines = new List<string>();

            collectAddressLines.Add(upsReturn.CollectionAddressLine1); // this array only supports a single entry... clever...

            return Ok(UPSFunctions.GetCollectionRate(
                objRate.serviceDateOption,
                objRate.pickupDate,
                objRate.readyTime,
                objRate.closeTime,
                new AddressType()
                {
                    AddressLine = collectAddressLines.ToArray(),
                    City = upsReturn.CollectionTown,
                    CountryCode = upsReturn.CollectionCountry.Code,
                    PostalCode = upsReturn.CollectionPostcode,
                    ResidentialIndicator = upsReturn.CollectionResidentialIndicator ? "Y" : "N",
                    StateProvince = upsReturn.CollectionStateProvinceCode
                }
            ));
        }

        [HttpPost]
        public IHttpActionResult CreateCollection([FromBody]PassCollectionRequest objCollect)
        {
            var upsReturn = portalDb.Returns.Where(p => p.ReturnID == objCollect.returnId).Single();

            var collectionResult = UPSFunctions.CreateCollection(
                objCollect.returnId,
                objCollect.pickupDate,
                objCollect.readyTime,
                objCollect.closeTime,
                new PickupAddressType()
                {
                    AddressLine = new string[] // this array only supports a single entry... clever...
                    {
                        upsReturn.CollectionAddressLine1
                    },
                    City = upsReturn.CollectionTown,
                    CountryCode = upsReturn.CollectionCountry.Code,
                    PostalCode = upsReturn.CollectionPostcode,
                    ResidentialIndicator = upsReturn.CollectionResidentialIndicator ? "Y" : "N",
                    StateProvince = upsReturn.CollectionStateProvinceCode,
                    CompanyName = upsReturn.CollectionCompanyName ?? upsReturn.CollectionContactName,
                    ContactName = upsReturn.CollectionContactName ?? upsReturn.CollectionCompanyName,
                    Phone = new Pickup.PhoneType()
                    {
                        Number = upsReturn.CollectionPhoneNumber
                    }
                },
                upsReturn.ReturnParcels.Select(p => p.TrackingNumber).ToList()
            );

            if (collectionResult.ErrorDetails == null)
            {
                var c = portalDb.ReturnCollections.Add(new ReturnCollection()
                {
                    ReturnID = objCollect.returnId,
                    CollectionDT = objCollect.pickupDate,
                    CollectionReadyFrom = objCollect.readyTime,
                    CollectionClosedAt = objCollect.closeTime,
                    PickupRequestNumber = collectionResult.Response.PRN,
                    TotalChargeInc = objCollect.totalChargeInc,
                    ChargesJSON = collectionResult.Response.RateStatus.Code == "01" ? JsonConvert.SerializeObject(collectionResult.Response.RateResult) : JsonConvert.SerializeObject(collectionResult.Response.RateStatus),
                    CreatedDT = DateTime.Now
                });

                portalDb.SaveChanges();

                return Ok(c);
            }
            else
            {
                return Ok(collectionResult);
            }
        }

        [HttpPost]
        public IHttpActionResult CancelCollection([FromBody]PassCollectionCancel objCollect)
        {
            var cancelResult = UPSFunctions.CancelCollection(objCollect.PRN);

            if (cancelResult.ErrorDetails == null)
            {
                var c = portalDb.ReturnCollections.Where(p => p.ReturnCollectionID == objCollect.ReturnCollectionID).SingleOrDefault();

                if (c != null)
                {
                    c.CancelledDT = DateTime.Now;

                    portalDb.SaveChanges();
                }
            }

            return Ok(cancelResult);
        }

        [HttpPost]
        public IHttpActionResult RefreshReturnTracking([FromBody]PassReturnID objReturnId)
        {
            var r = portalDb.Returns.Where(p => p.ReturnID == objReturnId.returnId).Single();

            var UPSTrackingReplies = new List<TrackingReply>();

            r.ReturnParcels.SelectMany(p => p.Collections.SelectMany(q => q.ReturnCollection.UPSConsignments)).ToList().ForEach((ups) => 
            {
                UPSTrackingReplies.Add(UPSFunctions.FetchTrackingUpdates(ups.ShipmentIdentificationNumber, r.CollectionPostcode, r.CollectionCountry.Code, DateTime.Now.AddYears(-1), DateTime.Now));
            });

            //return Ok(new ReturnTracking() 
            //{ 
            //    ShipmentIdentificationNumber = r.ShipmentIdentificationNumber,
            //    CollectCountryCode = r.CollectionCountry?.Code,
            //    CollectPostcode = r.CollectionPostcode
            //    //UPSFunctions.FetchTrackingUpdates(ShipmentIdentificationNumber, CollectPostcode, CollectCountryCode, DateTime.Now.AddMonths(-4), DateTime.Now);
            //});

            return Ok(new 
            { 
                Return = r,
                UPSTrackingReplies
            });
        }
    }

    public class PassShipDigest : PassReturn
    {
        public int tradeAccountId { get; set; }
        public string digest { get; set; }
        public byte upsAccountId { get; set; }
        public int? orderNumber { get; set; }
    }

    public class PassTrackingNumber
    {
        public int returnId { get; set; }
        public int? upsConsignmentId { get; set; }
        public int? tuffnellsConsignmentId { get; set; }
        public string trackingNumber { get; set; }
    }

    public class PassReturn : Return
    {
        public string UPSAccountNumber { get; set; }
    }

    public class PassReturnHead
    {
        public string OrderID { get; set; }
        public string ClaimID { get; set; }
        public CollectionAddress FromAddress { get; set; }

        public PassReturnHead()
        {
            OrderID = null;
            ClaimID = null;
            FromAddress = new CollectionAddress();
        }

        public PassReturnHead(string ccrNumber)
        {
            ClaimID = ccrNumber;
        }
    }

    public class PassReturnParcel
    {
        /// <summary>
        /// Max: 100
        /// </summary>
        public List<ProductLive> Products { get; set; }

        /// <summary>
        /// Max: 5
        /// </summary>
        public List<string> References { get; set; }

        public PassReturnParcel()
        {
            Products = new List<ProductLive>();

            References = new List<string>();
        }
    }

    public class PassCollectionRequest
    {
        /// <summary>
        /// "01" = "Same-day Pickup"
        /// "02" = "Future-Day Pickup"
        /// "03" = "Specific Day Pickup"
        /// </summary>
        public string serviceDateOption { get; set; }
        public DateTime pickupDate { get; set; }
        public string readyTime { get; set; }
        public string closeTime { get; set; }
        public int returnId { get; set; }
        public decimal? totalChargeInc { get; set; }
    }

    public class PassCollectionCancel
    {
        public int ReturnCollectionID { get; set; }
        public string PRN { get; set; }
    }
}
