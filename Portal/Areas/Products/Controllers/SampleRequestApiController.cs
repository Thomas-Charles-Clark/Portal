using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Portal.Models;
using Portal.MertexDAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using NLog;
using Microsoft.AspNet.Identity;
using SharedEFClasses.Models;
using SharedEFClasses;
using SharedEFClasses.Models.Samples;
using SharedEFClasses.Models.Products;
using System.Web;

namespace Portal.Areas.Products.Controllers
{
    [Authorize]
    public class SampleRequestApiController : ApiController
    {
        private static Logger Logger = LogManager.GetCurrentClassLogger();
        private PortalDbContext portalDb { get; set; }

        private ApplicationSignInManager signInManager;

        public SampleRequestApiController(PortalDbContext portalDbContext, ApplicationSignInManager signInManager)
        {
            this.portalDb = portalDbContext;
            this.signInManager = signInManager;
        }

        [HttpPost]
        public IHttpActionResult ProductGroupSlicerEndpoint([FromBody]PassSampleRequestSlicerFilters objFilters)
        {
            var stockStatusIds = new List<byte>();

            if (objFilters.StockStatusID == 1)
            {
                stockStatusIds.Add(1);
            }
            else if (objFilters.StockStatusID == 254)
            {
                stockStatusIds.AddRange(new byte[] { 2, 3, 4, 5, 6, 7, 8 });
            }
            else if (objFilters.StockStatusID == 255)
            {
                stockStatusIds.Add(255);
            }

            var data = portalDb.SampleRequestSlicerData.ToList();

            var productGroupIds = data.Where(p =>
                (objFilters.StockStatusID == null || stockStatusIds.Contains(p.StockStatusID)) &&
                (objFilters.ItemTypeID == null || objFilters.ItemTypeID == p.ItemTypeID) &&
                (objFilters.BrandID == null || objFilters.BrandID == p.BrandID) &&
                (objFilters.ColourID == null || objFilters.ColourID == p.ColourID) &&
                (objFilters.PatternID == null || objFilters.PatternID == p.PatternID) &&
                (objFilters.LaunchID == null || objFilters.LaunchID == p.LaunchID)

            )
            .Select(p => p.ProductGroupID)
            .Distinct()
            .ToList();

            var results = portalDb.ProductGroups.Where(p => productGroupIds.Contains(p.ProductGroupID)).OrderBy(p => p.ProductGroupID).ToList();

            return Json(results);
        }

        [HttpPost]
        public IHttpActionResult ItemTypeSlicerEndpoint([FromBody]PassSampleRequestSlicerFilters objFilters)
        {
            var stockStatusIds = new List<byte>();

            if (objFilters.StockStatusID == 1)
            {
                stockStatusIds.Add(1);
            }
            else if (objFilters.StockStatusID == 254)
            {
                stockStatusIds.AddRange(new byte[] { 2, 3, 4, 5, 6, 7, 8 });
            }
            else if (objFilters.StockStatusID == 255)
            {
                stockStatusIds.Add(255);
            }

            var data = portalDb.SampleRequestSlicerData.ToList();
            var itemTypeIds = data.Where(p =>
                (objFilters.StockStatusID == null || stockStatusIds.Contains(p.StockStatusID)) &&
                (objFilters.ProductGroupID == null || objFilters.ProductGroupID == p.ProductGroupID) &&
                (objFilters.BrandID == null || objFilters.BrandID == p.BrandID) &&
                (objFilters.ColourID == null || objFilters.ColourID == p.ColourID) &&
                (objFilters.PatternID == null || objFilters.PatternID == p.PatternID) &&
                (objFilters.LaunchID == null || objFilters.LaunchID == p.LaunchID)
            )
            .Select(p => p.ItemTypeID)
            .Distinct()
            .ToList();

            var results = portalDb.ItemTypes.Where(p => itemTypeIds.Contains(p.ItemTypeID)).OrderBy(p => p.Name).ToList();

            return Json(results);
        }

        [HttpPost]
        public IHttpActionResult LaunchSlicerEndpoint([FromBody]PassSampleRequestSlicerFilters objFilters)
        {
            var stockStatusIds = new List<byte>();

            if (objFilters.StockStatusID == 1)
            {
                stockStatusIds.Add(1);
            }
            else if (objFilters.StockStatusID == 254)
            {
                stockStatusIds.AddRange(new byte[] { 2, 3, 4, 5, 6, 7, 8 });
            }
            else if (objFilters.StockStatusID == 255)
            {
                stockStatusIds.Add(255);
            }

            var data = portalDb.SampleRequestSlicerData.ToList();

            var launchIds = data.Where(p =>
                (objFilters.StockStatusID == null || stockStatusIds.Contains(p.StockStatusID)) &&
                (objFilters.ItemTypeID == null || objFilters.ItemTypeID == p.ItemTypeID) &&
                (objFilters.ProductGroupID == null || objFilters.ProductGroupID == p.ProductGroupID) &&
                (objFilters.BrandID == null || objFilters.BrandID == p.BrandID) &&
                (objFilters.ColourID == null || objFilters.ColourID == p.ColourID) &&
                (objFilters.PatternID == null || objFilters.PatternID == p.PatternID)
            )
            .Select(p => p.LaunchID)
            .Distinct()
            .ToList();

            //var results = portalDb.Launches.Where(p => launchIds.Contains(p.LaunchID)).OrderByDescending(p => p.LaunchID).ToList();

            var results = portalDb.Launches
                .Where(p => p.TradeLaunchDate != null && p.TradeLaunchDate.Value.Year <= DateTime.Now.Year)
                .OrderByDescending(l => l.LaunchID).ToList();

            return Json(results);
        }


        [HttpPost]
        public IHttpActionResult BrandSlicerEndpoint([FromBody]PassSampleRequestSlicerFilters objFilters)
        {
            var stockStatusIds = new List<byte>();

            if (objFilters.StockStatusID == 1)
            {
                stockStatusIds.Add(1);
            }
            else if (objFilters.StockStatusID == 254)
            {
                stockStatusIds.AddRange(new byte[] { 2, 3, 4, 5, 6, 7, 8 });
            }
            else if (objFilters.StockStatusID == 255)
            {
                stockStatusIds.Add(255);
            }

            var data = portalDb.SampleRequestSlicerData.ToList();

            var brandIds = data.Where(p =>
                (objFilters.StockStatusID == null || stockStatusIds.Contains(p.StockStatusID)) &&
                (objFilters.ItemTypeID == null || objFilters.ItemTypeID == p.ItemTypeID) &&
                (objFilters.ProductGroupID == null || objFilters.ProductGroupID == p.ProductGroupID) &&
                (objFilters.ColourID == null || objFilters.ColourID == p.ColourID) &&
                (objFilters.PatternID == null || objFilters.PatternID == p.PatternID) &&
                (objFilters.LaunchID == null || objFilters.LaunchID == p.LaunchID)
            )
            .Select(p => p.BrandID)
            .Distinct()
            .ToList();

            var results = portalDb.Brands.Where(p => brandIds.Contains(p.BrandID)).OrderBy(p => p.SortOrder).ToList();

            return Json(results);
        }

        [HttpPost]
        public IHttpActionResult ColourSlicerEndpoint([FromBody]PassSampleRequestSlicerFilters objFilters)
        {
            var stockStatusIds = new List<byte>();

            if (objFilters.StockStatusID == 1)
            {
                stockStatusIds.Add(1);
            }
            else if (objFilters.StockStatusID == 254)
            {
                stockStatusIds.AddRange(new byte[] { 2, 3, 4, 5, 6, 7, 8 });
            }
            else if (objFilters.StockStatusID == 255)
            {
                stockStatusIds.Add(255);
            }

            var data = portalDb.SampleRequestSlicerData.ToList();

            var colourIds = data.Where(p =>
                (objFilters.StockStatusID == null || stockStatusIds.Contains(p.StockStatusID)) &&
                (objFilters.ItemTypeID == null || objFilters.ItemTypeID == p.ItemTypeID) &&
                (objFilters.ProductGroupID == null || objFilters.ProductGroupID == p.ProductGroupID) &&
                (objFilters.BrandID == null || objFilters.BrandID == p.BrandID) &&
                (objFilters.PatternID == null || objFilters.PatternID == p.PatternID) &&
                (objFilters.LaunchID == null || objFilters.LaunchID == p.LaunchID)
            )
            .Select(p => p.ColourID)
            .Distinct()
            .ToList();
            
            var results = portalDb.Colours.Where(p => 
                colourIds.Contains(p.ColourID))
                .Select(p => new {
                    ColourID = p.ColourID,
                    Name = p.Name
                }).OrderBy(p => p.Name).ToList();

            return Json(results);
        }

        [HttpPost]
        public IHttpActionResult PatternSlicerEndpoint([FromBody]PassSampleRequestSlicerFilters objFilters)
        {
            var stockStatusIds = new List<byte>();

            if (objFilters.StockStatusID == 1)
            {
                stockStatusIds.Add(1);
            }
            else if (objFilters.StockStatusID == 254)
            {
                stockStatusIds.AddRange(new byte[] { 2, 3, 4, 5, 6, 7, 8 });
            }
            else if (objFilters.StockStatusID == 255)
            {
                stockStatusIds.Add(255);
            }

            var data = portalDb.SampleRequestSlicerData.ToList();
            
            var patternIds = data.Where(p =>
                (objFilters.StockStatusID == null || stockStatusIds.Contains(p.StockStatusID)) &&
                (objFilters.ItemTypeID == null || objFilters.ItemTypeID == p.ItemTypeID) &&
                (objFilters.ProductGroupID == null || objFilters.ProductGroupID == p.ProductGroupID) &&
                (objFilters.BrandID == null || objFilters.BrandID == p.BrandID) &&
                (objFilters.ColourID == null || objFilters.ColourID == p.ColourID) &&
                (objFilters.LaunchID == null || objFilters.LaunchID == p.LaunchID)
            )
            .Select(p => p.PatternID)
            .Distinct()
            .ToList();
            
            var results = portalDb.Patterns.Where(p =>
                patternIds.Contains(p.PatternID))
                .Select(p => new {
                    PatternID = p.PatternID,
                    Name = p.Name
                }).OrderBy(p => p.Name).ToList();
            
            return Json(results);
        }
        
        [HttpPost]
        public IHttpActionResult StockStatusSlicerEndpoint([FromBody]PassSampleRequestSlicerFilters objFilters)
        {
            var data = portalDb.SampleRequestSlicerData.ToList();

            var stockStatusIds = data.Where(p =>
                (objFilters.ItemTypeID == null || objFilters.ItemTypeID == p.ItemTypeID) &&
                (objFilters.ProductGroupID == null || objFilters.ProductGroupID == p.ProductGroupID) &&
                (objFilters.BrandID == null || objFilters.BrandID == p.BrandID) &&
                (objFilters.ColourID == null || objFilters.ColourID == p.ColourID) &&
                (objFilters.PatternID == null || objFilters.PatternID == p.PatternID) &&
                (objFilters.LaunchID == null || objFilters.LaunchID == p.LaunchID)
            )
            .Select(p => p.StockStatusID)
            .Distinct()
            .ToList();

            var results = portalDb.StockStatuses.Where(p => stockStatusIds.Contains(p.StockStatusID)).OrderBy(p => p.StockStatusID).ToList();

            var dueIns = results.Where(p => p.StockStatusID >= 2 && p.StockStatusID <= 8).ToList();

            results = results.Where(p => p.StockStatusID == 1 || p.StockStatusID == 255).ToList();

            if (dueIns.Count > 0)
            {
                if (results.Count > 0)
                {
                    results.Insert(1, new StockStatus()
                    {
                        StockStatusID = 254,
                        Name = "Due in"
                    });
                }
                else
                {
                    results.Add(new StockStatus()
                    {
                        StockStatusID = 254,
                        Name = "Due in"
                    });
                }
            }

            return Json(results);
        }

        [HttpPost]
        public IHttpActionResult FetchProductIds([FromBody]PassSampleRequestProductFilters objFilters)
        {
            if (objFilters == null)
            {
                return Json(new { });
            }

            var results = portalDb.ProductID_Search_Samples(objFilters);

            return Json(results);
        }

        [HttpPost]
        public IHttpActionResult PlaceTradeAccountSampleOrder([FromBody]SampleOrder objOrder)
        {
            var result = new SampleOrderReturn()
            {
                state = "failure",
                message = ""
            };
            
            try
            {
                var user = signInManager.UserManager.FindById(User.Identity.GetUserId<int>());

                var orderHeadId = portalDb.SampleOrder_Submit(user.Id, objOrder);

                if (orderHeadId == null)
                {
                    var response = new HttpResponseMessage(HttpStatusCode.InternalServerError);

                    response.Content = new StringContent("Failed to create transaction.\r\nPlease try again or contact a system administrator.");

                    return ResponseMessage(response);
                }
                else
                {
                    result.state = "success";
                    result.message = orderHeadId.Value.ToString();
                }
            }
            catch (Exception e)
            {
                var response = new HttpResponseMessage(HttpStatusCode.InternalServerError);

                Logger.Error(e);

                response.Content = new StringContent("Failed to create transaction.\r\nPlease try again or contact a system administrator.");

                return ResponseMessage(response);
            }

            return Json(result);
        }
    }
}

namespace Portal.Models
{
    public class RRPPricePoint
    {
        public byte PricePointID { get; set; }
        public string Name { get; set; }
    }
}

namespace Portal.Utilities
{
    public static partial class Framework
    {
        public static List<RRPPricePoint> GetRRPPricePointOptions ()
        {
            return new List<RRPPricePoint>()
            {
                new RRPPricePoint() {
                    PricePointID = 1,
                    Name = "£0.00 - £50.00"
                },
                new RRPPricePoint() {
                    PricePointID = 2,
                    Name = "£50.00 - £100.00"
                },
                new RRPPricePoint() {
                    PricePointID = 3,
                    Name = "£100.00 - £150.00"
                },
                new RRPPricePoint() {
                    PricePointID = 4,
                    Name = "£150.00 - £200.00"
                },
                new RRPPricePoint() {
                    PricePointID = 5,
                    Name = "£200+"
                }
            };
        }

        public static string GetUserAgent()
        {
            var ua = "Unavaialble";

            if (HttpContext.Current.Request != null)
            {
                if (HttpContext.Current.Request.UserAgent != null) 
                {
                    ua = HttpContext.Current.Request.UserAgent;
                }
            }

            return ua;
        }

        public static string GetIPAddress()
        {
            return HttpContext.Current.Request.Headers["CF-Connecting-IP"] ?? HttpContext.Current.Request.UserHostAddress;
        }
    }
}
