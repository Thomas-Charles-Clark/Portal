using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Portal.Models;
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
using System.Collections;
using System.ComponentModel;
using System.Dynamic;

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
        public static byte[] StringToByteArray(String hex)
        {
            int NumberChars = hex.Length;
            byte[] bytes = new byte[NumberChars / 2];
            for (int i = 0; i < NumberChars; i += 2)
                bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
            return bytes;
        }

        public static readonly string XlsxTemplateHex = "504b03041400060008000000210005917af6600100007c040000130008025b436f6e74656e745f54797065735d2e786d6c20a2040228a000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ac94cb6ec2301045f795fa0f91b75562e8a2aa2a028b3e962d52e9079878422c1cdbf20c14febe13f358543c84609328b1e79e7bedb107a3556bb3254434de95a25ff44406aef2dab859297e261ff9b3c89094d3ca7a07a558038ad1f0fe6e305907c08cab1d96a2210a2f5262d540abb0f0011c8fd43eb68af833ce6450d55ccd403ef67a4fb2f28ec0514e9d86180edea0560b4bd9fb8a7f6f9c4c8d13d9eb665e872a850ac19a4a111b954ba7ff41725fd7a602edab45cbd20586084a630340ad2d42344c8cdf40c4c150c883cc08162f836e53155c998c6163023e70f423846ee478aa6ddd176f47341ab2b18af4a95ace2e5756fefa389f7a3f2f4e8b5cba3469898a5619b7f37d829f26a34caffe8d8d74f992f0191fc43d06323dafb79064ce0091d616f0d6cb9e444f91b995c7d107e4d312e172faae35bbea3cb0104432b06fce439bbc27f251bb3a2e746759833ec096e9ee18fe010000ffff0300504b030414000600080000002100b5553023f40000004c0200000b0008025f72656c732f2e72656c7320a2040228a000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ac924d4fc3300c86ef48fc87c8f7d5dd9010424b774148bb21547e8049dc0fb58da3241bddbf271c10541a8303477fbd7efccadbdd3c8deac821f6e234ac8b12143b23b677ad8697fa7175072a2672964671ace1c41176d5f5d5f699474a792876bd8f2aabb8a8a14bc9df2346d3f144b110cf2e571a0913a51c86163d99815ac64d59de62f8ae01d54253edad86b0b737a0ea93cf9b7fd796a6e90d3f88394cecd29915c8736267d9ae7cc86c21f5f91a5553683969b0629e723a22795f646cc0f3449bbf13fd7c2d4e9cc852223412f832cf47c725a0f57f5ab434f1cb9d79c43709c3abc8f0c9828b1fa8de010000ffff0300504b03041400060008000000210019c31dd578030000780800000f000000786c2f776f726b626f6f6b2e786d6cac555d6fab38107d5f69ff03f23b0513200135bd2a5fda4aed55d5e6b62f912a174cb10a98b54d93aabafffd8e21a45fab55b677236263cf70383373c61c7fdb36b5f1448564bc5d227c642383b6392f58fbb0443f5699b9408654a42d48cd5bba44cf54a26f277ffe71bce1e2f19ef34703005ab94495525d685932af6843e411ef680b96928b8628588a074b768292425694aaa6b61cdbf6ad86b0168d08a13804839725cb69c2f3bea1ad1a4104ad8902fab2629d9cd09afc10b88688c7be3373de740071cf6aa69e075064347978f6d07241ee6b087b8b3d632be0f2e18f6d189ce94d60faf4aa86e5824b5eaa2380b646d29fe2c7b685f1bb146c3fe7e03024d712f489e91aee5909ff8bacfc3d96ff0a86eddf46c320ad412b2124ef8b68de9e9b834e8e4b56d39b51ba06e9baefa4d195aa915113a9d282295a2cd11c967c43df6d88be8b7a5683d5992d6c8cac93bd9c2f8551d092f4b55a81902778e80cdf0f1c4f7b82304e6b45454b148d79ab4087bbb87e577303765c7150b87145ffee99a0d058a02f8815469287e45e5e125519bda897280ed73f2484bf56790d3a5e4bde8b9cae05edb85c67909b5b012910eb15040fd31bbd92cfcdf11f144b729d060bf230721def3fe604288b7052e5a51206dc9f25e750996bf20475023514bb363e8342e0d95d9b8b10dfbd64f3348a4ee3c40c922436dd2488cc45e63ba697b9d16994a69e9ba53f2118e1873927bdaa7612d0d04be46ad17e345d90ed64c176d8b3e295c68bbdfb997afe304cb69f3a607dd8dd30ba91af62d14b637bcbda826fb4446c07a27a9ed6ee2cf090b119acb7ac5095969bafdb60dcfb8bb2870a2863cf5980237485a6b6442f4eea05813d0bcc240b5cd3f512c8c522704cc7c7fecc8bfd208db38192f586d370ae02b76136daa117aef5598be100d7f39065648850bf439c1583ecade9b19cd439685f4f8363806d27d061d3ad3a976a9841760ce861d73e9ddbc0cc4e679ee96a660b77e698b19b00f3799aa491a70ba4bf0be1ff713a0eea0fa70f8e665911a15682e48ff099baa2654424286a0c08f8be251b798b0852e9986e8633d3c5816d4691ef9a5e92cdbc394ee2d4835c4e6475f8e517cfa685353c4d89eaa16f75cb0eeb508fd96e77bf598e1bbb3abd6bbef02ad179df3dfd6f8ed7107d4d0f74ce6e0e748cbf5fac2e0ef43d4f5777b7d9701cfc63b4d6500d3d0e1ab2a61a9efc020000ffff0300504b0304140006000800000021008d87da70e00000002d0200001a000801786c2f5f72656c732f776f726b626f6f6b2e786d6c2e72656c7320a2040128a0000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ac91cb6ac3301045f785fe83987d3d760aa594c8d99442b6c5fd00218f1fc496846692d67f5fe182dd404836d908ae06dd73246d773fe3a04e14b9f74e4391e5a0c8595ff7aed5f0557d3cbd826231ae368377a46122865df9f8b0fda4c1483ac45d1f58a516c71a3a91f086c8b6a3d170e603b934697c1c8da4185b0cc61e4c4bb8c9f3178cff3ba03ceb54fb5a43dcd7cfa0aa2924f2ed6edf34bda5776f8f2339b98040966948175095892d8986bf9c2547c0cbf8cd3df1929e8556fa1c715e8b6b0ec53d1dbe7d3c704724abc7b2c5384f16193cfbe4f2170000ffff0300504b0304140006000800000021005be11ea7e60300001a10000018000000786c2f776f726b7368656574732f7368656574312e786d6cac975f6fda3014c5df27ed3b447e879004424184a92d43ebc3a469ddf66e8201ab499c39a67f36edbbefd8064a31eae26d525142eafc7c7def39d778f2eeb12c827b261b2eaa8c44dd1e0958958b25afd619f9fa65deb92041a368b5a485a858469e5843de4ddfbe993c0879d76c185301085593918d52f5380c9b7cc34ada7445cd2afc6725644915beca75d8d492d1a579a92cc2b8d74bc392f28a58c258b66188d58ae76c26f26dc92a652192155421fe66c3eb664f2bf336b892cabb6dddc9455903b1e005574f064a82321fdfac2b21e9a2c0ba1fa33ecd834789bf189f643f8d79eecc54f25c8a46ac5417e4d0c6ec2e7f148e429a1f48eefa5b61a27e28d93dd7057c46c57f17523438b0e26758f297b0f400d3e992e32d5f66e4e768304adfa783abce6c96f63afd8b61dab9b88e869d64980ea2f9f5bcdf8faf7e91e964c95161bdaa40b255462ea3f1653222e1746204f48db387e6e83e507471cb0a962b86492212687d2e84b8d3036ff0a8076463066824cd15bf67d7ac283232d712ff6e26c12d26080f331cdfef679b1b457f92c192ade8b6509fc5c307c6d71b85690758a716ca78f934634d0e8562e26e3c38843da38a4e27523c04a836a26c6aaabd138d717ffecde924d7632ff560fd8a8e0fef1f20a8537b881e0c48ea5050a0f6143d3823b103e9fb40f46084327428c8e1712836afdd211eab0dcfefae844ef4d96c2528b14d96666094ade671b6d233f0b4bb677f11b561b79f48f3f08ad1e58bb20c5f5fc57ea6d76bae214874cfc991566c6be5e8c1a0b8d219fd874c6b06e0ae1822ec24afd5b15d060c05fcc44941e4e71e6b9fb8ef72bc0c1459075947bf2878746221addbd878ffcfba1d1c846b2819710d1a9d98cbd8e2e2d916ada57b3497b5a0eb40ddc69cd2fd8b4b0c3023ae1dd1897c5aa0759b6b36741127e038d17df75c534d8e52601d06959db655f48e7f6f430682f6e05a0f1de37fb863e73e572ee8193edb821e0db9ba5240d7f0e1ec5ce6161a0dc287635d66b6cd979b9dd73e85ae61bab3db9cd0077cc2d9ed556e13d20af3d87d77dbd2198e970fe2ddaee3363354d0279e9dfacfe4d96b8389773b8c6bccf844e6af6f7766744612d78d78e4f3fbc4ca39716d87473e1c2be7c4d50f1ef970ac9c13b7ee78e4c3b17a3e83f1927362e58ccb69d34367f409c7ca192f391c2f392756ceb8381c2f392756ceb8381c2f392756ceb8381c2f39e3b4a2dbcf519aedc1c29e016aba661fa95cf3aa090ab63207052c40da9344af8b7ba57f8ee20e795e08a544b9ffb6c1319ae150d0eb42112b21d4fe0b02d6dc5ba6b67550d39ac95bfe03a757442224c771c49c9333520ba924e50af38df5a14cde2cad590ea7fae96f000000ffff0300504b030414000600080000002100c11710be4e070000c620000013000000786c2f7468656d652f7468656d65312e786d6cec59cd8b1b3714bf17fa3f0c7377fc35e38f25dee0cf6c93dd24649d941cb5b6ec5156333292bc1b13022539f55228a4a597426f3d94d240030dbdf48f0924b4e91fd127cdd823ade5249b6c4a5a760d8b47febda7a7f79e7e7af374f1d2bd987a47980bc292965fbe50f23d9c8cd89824d3967f6b3828347c4f48948c1165096ef90b2cfc4bdb9f7e72116dc908c7d803f9446ca1961f4939db2a16c5088691b8c0663881df268cc748c2239f16c71c1d83de98162ba552ad182392f85e8262507b7d322123ec0d954a7f7ba9bc4fe13191420d8c28df57aab125a1b1e3c3b2428885e852ee1d21daf2619e313b1ee27bd2f72812127e68f925fde717b72f16d1562644e50659436ea0ff32b94c607c58d173f2e9c16ad22008835a7ba55f03a85cc7f5ebfd5abfb6d2a70168348295a6b6d83aeb956e90610d50fad5a1bb57ef55cb16ded05f5db3b91daa8f85d7a0547fb0861f0cbae0450baf41293e5cc3879d66a767ebd7a0145f5bc3d74bed5e50b7f46b50444972b8862e85b56a77b9da1564c2e88e13de0c8341bd9229cf51900dabec52534c582237e55a8cee323e008002522449e2c9c50c4fd008b2b88b2839e0c4db25d308126f86122660b854290d4a55f8af3e81fea6238ab63032a4955d6089581b52f67862c4c94cb6fc2ba0d537202f9e3d7bfef0e9f387bf3d7ff4e8f9c35fb2b9b52a4b6e07255353eed58f5ffffdfd17de5fbffef0eaf137e9d427f1c2c4bffcf9cb97bffff13af5b0e2dc152fbe7df2f2e99317df7df5e74f8f1ddadb1c1d98f02189b1f0aee163ef268b61810efbf1013f9dc43042c4924011e876a8eecbc8025e5b20eac275b0edc2db1c58c605bc3cbf6bd9ba1ff1b9248e99af46b105dc638c7618773ae0aa9acbf0f0709e4cdd93f3b989bb89d0916bee2e4aac00f7e733a057e252d98db065e60d8a1289a638c1d253bfb1438c1dabbb4388e5d73d32e24cb089f4ee10af8388d32543726025522eb4436288cbc2652084daf2cdde6dafc3a86bd53d7c6423615b20ea307e88a9e5c6cb682e51ec52394431351dbe8b64e432727fc14726ae2f24447a8a29f3fa632c844be63a87f51a41bf0a0ce30efb1e5dc436924b72e8d2b98b1833913d76d88d503c73da4c92c8c47e260e214591778349177c8fd93b443d431c50b231dcb709b6c2fd6622b805e46a9a942788fa65ce1db1bc8c99bd1f177482b08b65da3cb6d8b5cd89333b3af3a995dabb1853748cc6187bb73e7358d06133cbe7b9d1572260951dec4aac2bc8ce55f59c60016592aa6bd6297297082b65f7f1946db0676f71827816288911dfa4f91a44dd4a5d38e59c547a9d8e0e4de03502e51fe48bd329d705e83092bbbf49eb8d085967977a16ee7c5d702b7e6fb3c7605fde3dedbe04197c6a1920f6b7f6cd10516b823c6186080a0c17dd828815fe5c449dab5a6cee949bd89b360f03144656bd1393e48dc5cf89b227fc77ca1e77017306058f5bf1fb943a9b2865e74481b309f71f2c6b7a689edcc07092ac73d67955735ed5f8fffbaa66d35e3eaf65ce6b99f35ac6f5f6f5416a99bc7c81ca26eff2e89e4fbcb1e5332194eecb05c5bb42777d04bcd18c0730a8db51ba27b96a01ce22f89a35982cdc94232de371263f2732da8fd00c5a4365ddc09c8a4cf554783326a063a487752b159fd0adfb4ef3788f8dd34e67b9acba9aa90b0592f978295c8d43974aa6e85a3defdeadd4eb7ee8547759970628d9d318614c661b517518515f0e42145e67845ed99958d17458d150ea97a15a4671e50a306d151578e5f6e045bde58741da4186661c94e76315a7b499bc8cae0ace99467a9333a9990150622f33208f7453d9ba71796a7569aabd45a42d238c74b38d30d2308217e12c3bcd96fb59c6ba9987d4324fb962b91b7233ea8d0f116b452227b881262653d0c43b6ef9b56a08b72a23346bf913e818c3d77806b923d45b17a253b87619499e6ef87761961917b28744943a5c934eca063191987b94c42d5f2d7f950d34d11ca26d2b5780103e5ae39a402b1f9b7110743bc87832c1236986dd18519e4e1f81e153ae70feaac5df1dac24d91cc2bd1f8d8fbd033ae73711a458582f2b078e89808b8372eacd31819bb01591e5f977e260ca68d7bc8ad239948e233a8b5076a298649ec23589aeccd14f2b1f184fd99ac1a1eb2e3c98aa03f6bd4fdd371fd5ca730669e667a6c52aead47493e9873be40dabf243d4b22aa56efd4e2d72ae6b2eb90e12d5794abce1d47d8b03c1302d9fcc324d59bc4ec38ab3b351dbb4332c080c4fd436f86d7546383df1ae273fc89dcc5a75402ceb4a9df8facadcbcd5660777813c7a707f38a752e850426f972328fad21bc89436608bdc93598d08dfbc39272dff7e296c07dd4ad82d941a61bf10548352a111b6ab85761856cbfdb05cea752a0fe06091515c0ed3ebfa015c61d0457669afc7d72eeee3e52dcd85118b8b4c5fcc17b5e1fae2be5cd97c71ef11209dfbb5caa0596d766a8566b53d2804bd4ea3d0ecd63a855ead5bef0d7addb0d11c3cf0bd230d0edad56e50eb370ab572b75b086a25657ea359a807954a3ba8b71bfda0fd202b6360e5297d64be00f76abbb6ff010000ffff0300504b030414000600080000002100611cfd15640900003b4300000d000000786c2f7374796c65732e786d6cc45cdb6edb48127d5f60ff8120b08f0aef9268480a2cd99c0d90cd048807bbaf1445c91cf3225054469ec1fcfb565f487653ad16e350ee1849249aa7abbaea547575f132fb78ca52ed7b5c1e92229febd60753d7e23c2a3649be9bebbf3d05a3a9ae1daa30df846991c773fd353ee81f17fffcc7ec50bda6f1b7e738ae3418223fccf5e7aadadf19c6217a8eb3f0f0a1d8c739fc665b945958c1d772671cf6651c6e0e0894a5866d9a63230b935c2723dc65519f41b2b07c39ee475191edc32a59276952bde2b1742d8bee3eedf2a20cd729a87ab2dc30d24ed6b8b4b553590bc147cfe46449541687625b7d80718d62bb4da2f85c5ddff08d306a478291df3692e519a6cdcdfd54be7124d728e3ef09729fbe986d8bbc3a685171cc2b7026b80ecff6ee252ffec803f43b384a4f5bcc0e7f6adfc3148e58bab19845455a945a05be03d3e1237998c5e48c559826eb3241a76dc32c495fc9611b1dc0eea6e76509181f1d349022449dc56c8dce7a27592ae594bbf55c0f0260b5659ac80a4319b099d4f4cc518e508ef639d93d57d7dd15fe7ecd5d5e4f89435003cf85a3a17876b7a1e1a0b24434a4f4f0572630e426f460e2b811e64d6ec4c573614ee004934167762973d0d921814e30a429af080cee270fef66cee1855d49c4b7c959e73c412972582b26175618ca9349807e6e1d7274e91cc88a78053dc0129aa469b3a2db3e5abce1c86206b54f159779005f34faf9e9750f4b770e651a5982f17957cede95e1ab65e32c6f9053af000e459a6c9016bb152e18a88957e3c760f588e5329aa142a08f16dd41a929a17ea91254c9981f3c1ffe38537f6cfb53cb74a758e335d521c937f129deccf53199c8001ad06905c16a32dcb49a411f97fe6a285bb59aae7c7fe841ed007e061ef4de433f834f1f5c35984d29ffdc81f9ecb67c9e009da7d6783a9dfaae63b92e36f20df9dccc4859449d6be0800d269e37f52cdf76e12f5e296e6f83c1a84767e429f72aa3c17be7c9731b28f22aae3b8de1d69eb172af321a28f22aa38122afe20def805e652a0a451998d140914d072b1268ecfbca2385d14051a4301afcb45771c90c95ffba2837d0976dba792654dde4d86296c6db0af63c256af3c0ff55b1877fd7455541f37231db24e1aec8c31435e26a440f24f479a1a53bd7abe7247a01615c2b86d44244c4ad2434b5898baa2377e29a13d7b3c7a4001d4874166f9263763ebb46b6d07f604664dbeb13676c88fab1c48467db5003f98fbaaf2702bb1a7bba2700385153a227628839b62d99be736410fde6c8007ace91410cc4a24d71844b0c5d0707c1d4347115fbc37c110f28b7e655ccb93daf420416bd8a1982374b1bfde0fd56cfd86010fd78c3007af28641bc8d37c2c0e33697d7edcd9d2e5383a67a5839a2384dbfa15cfebf6db37c385360eb69abe5c72cc8aa4fd02c812b7de82a4dfd11fa34f423592ac81758422e811cc05390ad6b2c480bf7fbf4f5cb315bc765802fff6169f8e812af6aedf7fb34d9e5598cbb3c3a017e2d8b2a8e2a7c411277d32e6900626b0d4019151ac08ebed600ccd95703d4b4bb8d45602728d4c7a2a615fb84d7e7673c023b06a17cf0948413c3c99f5c900ff4502a1fc8d15bfe901102bb8dda1f40551511029571ad0190538506164a743451013f5b15c02212a7fc4c18c015f5462450b2150926b89548261972226f384b6605e0b21f58f95da2cd62d22f30bd353318e05666be9461554538e37608b5d604600f990f60e11f660db62ea57c550661428f232558e77d48c9ac4128f5282e8c502a52ad82faf2d052541f5a2c1914adc04c86b0142dc1ac0adc122c4f1237da2b20a7282944583270eb951a3370eb8512156cf5f911ae3a2a2783ad3e41da8a122493196c45f991cdd170278cead5d2569f206d45099225c38df3a3c1f6c848c78c6d96a1fbac7ebc59a69db657bb6697ca53c884359ad4a9e8766d7a23f61b3a70642cdc8b7e43f78ca0713bf6125a1a3504efe06b467d0638ab93a9faf852e5a50124bd2e02978a9774aa081adf267249b6a4cf44d0f876841f45371c98a046f825b4a4e748ed2e434bb647d4e8f89a7b0fd29c1593943552b3cb2a418a971a9ec577b314c54b4d2f2dc8e900f84ef04b069074d4085c6a3e49378ca0a58cb7243d1eea3c79cc4afa25142f0f59c95e9fe2a5cc9575e2285edaef47bb38617b19f4a278a9ef984660b75742e175e7aa47f295f5f8e868d2f48bc2e7d2b5038aef1d09dd1a9612b9efc513c42b6e4344f17d978fb3dd35c54bc9c84672772742f17d33d1d93682e2a5c1c4161b62fb397232ca767354016934b00a74ab6f8277fa1af0ac74a6786934702bb898014e5f069c15ad5481be0c3eab38295e9acb65e522c56307e05a0faa3be6c2287f59b4a90535f4c4d65cb7cd7f6923ed3e8ae0b22450a389266d7d4c52b8231d1579841c3224a847916863c320718e9521810d4d047048f2fc577d7557a02de494863a2cd2c58694c96c52a883b640adb61e0e822ed2155a088511334ff2e447475b16d95a8897092aa0071225c8d6422875303271c8cb908d8510e35ba08b992203b606421b34c640c2698e8506e26592f0eeca6491ad8178998ed09d2cb23110f0949ba7d09d2cb2a5104a4a8c8584e46391ad855065c65808a7b1ee3c3be165f18e84275d04142098d62abc860e7980b0431b826909c3ebe608fd4e30ad257862bb427a124c6b033ee85de17c96e1a60e58b4df6d4d06f950307d780c373aa6f0d0333ceb5b173c3ca5a09324c23dc7d18bb602c334305e3be8fe08608fa77d1ae6615594afda537caa1a70c7bd42f02f45d1cc8d371fac150261ff8607c3e19973adc9b7bc86709949026a18c1e71158e124a086127c6cc153d312106845122c6f0360af00f429df1f5babf18108358b00f139c95fe20def2a9ee4b0d40b705fe26355868d7b3bb1249cd11774634e83e09513eaf605eeca6928d0b19910f0ebb162e7df6181306d3e2515dc5657af615c4840bd2c98f85351b593400fbcb3412444fc372c7344348ed11dde907bf89a8c0595c3e6d4de4a85275ba1770ce09bac9a5a026cb889b7e131ad9e9a5fcef5f6f37ff0ada7c0557ad6d7e47b51e121e67afb193fba4de80e31f7f900f789c2ffdab14ce6fa5f8fcb89fff018d8a3a9b99c8e5c27f646beb77c1879ee6af9f010f8a66daefe66de74f013ef39c02f66802e84e5de1d52781b4249274b95ffd61e9bebcc17a23ebe910fd46675f7edb179ef59e628704c6be48ec3e9683a76bc51e059f6c3d85d3e7a81c7e8eebdf17d08a66159e4cd0a4879efae4ab2384df2da57b587d8a3e024f82a9984517bc268df7ab1f83f000000ffff0300504b0304140006000800000021003b6d324bc10000004201000023000000786c2f776f726b7368656574732f5f72656c732f7368656574312e786d6c2e72656c73848fc18ac2301445f703fe43787b93d6850c43533722b855e70362fada06db9790f714fd7bb31c65c0e5e570cfe5369bfb3ca91b660e912cd4ba0285e4631768b0f07bda2dbf41b138eadc14092d3c9061d32ebe9a034e4e4a89c79058150bb1855124fd18c37ec4d9b18e09a9903ee6d949897930c9f98b1bd0acaa6a6df25f07b42f4eb5ef2ce47d57833a3d5259feec8e7d1f3c6ea3bfce48f2cf84493990603ea24839c845edf2806241eb77f69e6b7d0e04a66dcccbf3f6090000ffff0300504b030414000600080000002100ae0bfd89bb0100002c15000027000000786c2f7072696e74657253657474696e67732f7072696e74657253657474696e6773312e62696eec94cd4ae35014c7ff69fca8ce622c086e6631145762194be3c74e4bd33a95c684a61537b3283642a026254d91191941e62dc40799e52c5dfa00b376253e801bfddfd822ce1429e24638379c7b3eeeb9e7e6feb81c0b3e0e1021448f7288189fe1d0f7112476cca88a98a860d4d026f4a9bf70e6f52f1a34cce0fc83916ed3fa88fd548a7a3fa5732ec218b9fb75416db04de91445e97b8eedaafbec18b3badbcce2128bfa7266f3dbc9e94ba74d268b9349ad37fc5529f58e080cdfd538bf7cc924d76aeca8dc39fcc60956b0c1575ea1ce732e228732d650602c4731b1ce2fc79c02e3655a2bf40dfa79ea12bd025613ef272bd6cbae59aba119f891d75396d3ea7a91ebfff050346047be17c4add80f033876bd512f561ba87bbdb0d34f6234edaeb2f228859d30b2c2b6f768fd7fb3e50cb06798d6f0ee17b3ddec27a6dd5074ca9d66a78deb63ebd7edf4d7853fab67578cd5066b483fd553b9ca5f1a68e56f51f6943f07de3f649fe9e3085ed2599aec371efb8c8316ad1e8eb91ea1cde47f336dae0563e69658e33bbaec5c2e77a8f354278b19932104848010100242400808012120048480101002424008088171083c000000ffff0300504b0304140006000800000021002597853f450100006302000011000801646f6350726f70732f636f72652e786d6c20a2040128a00001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c92514bc3301485df05ff43c97b9ba69db285b603277b722058517c0bc9dd56d6a4218976fbf7a6ed562bf341c84bee39f7cbb99764cba3ac832f30b66a548e4814a300146f44a576397a2dd7e11c05d6312558dd28c8d1092c5a16b73719d79437069e4da3c1b80a6ce049ca52ae73b4774e538c2ddf836436f20ee5c56d632473fe6a7658337e603bc0491cdf63098e09e618ee80a11e89e88c147c44ea4f53f700c131d42041398b4944f08fd78191f6cf865e993865e54edacf748e3b650b3e88a3fb68abd1d8b66dd4a67d0c9f9fe0f7cdd34b3f6a58a96e571c5091094eb901e61a53948d0c563533870c4faadd066b66ddc62f7b5b8178384d8dd7a227f6030c5810818f4487012eca5bba7a2cd7a848e28484c49f79192fe85d4a678b8feeed5ffd5dc4a120cf09fe4724294d66342113e2055064f8ea5b14df000000ffff0300504b03041400060008000000210061490910890100001103000010000801646f6350726f70732f6170702e786d6c20a2040128a00001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009c92416fdb300c85ef03fa1f0cdd1b39dd500c81ac624857f4b0610192b6674da663a1b22488ac91ecd78fb6d1d4d97aea8de47b78fa4449dd1c3a5ff490d1c55089e5a21405041b6b17f69578d8dd5d7e15059209b5f13140258e80e2465f7c529b1c13647280054704ac444b945652a26da133b86039b0d2c4dc19e236ef656c1a67e136da970e02c9abb2bc9670200835d497e91428a6c4554f1f0dada31df8f071774c0cacd5b794bcb386f896faa7b339626ca8f87eb0e0959c8b8ae9b6605fb2a3a32e959cb76a6b8d873507ebc6780425df06ea1eccb0b48d7119b5ea69d583a5980b747f786d57a2f86d10069c4af4263b1388b106dbd48cb54f48593fc5fc8c2d00a1926c98866339f7ce6bf7452f470317e7c621600261e11c71e7c803fe6a3626d33bc4cb39f1c830f14e38db816f3a73ce375e994ffa277b1dbb64c2918553f5c385677c48bb786b085ed7793e54dbd664a8f9054eeb3e0dd43d6f32fb2164dd9ab087fad5f3bf303cfee3f4c3f5f27a517e2ef95d673325dffeb2fe0b0000ffff0300504b01022d001400060008000000210005917af6600100007c0400001300000000000000000000000000000000005b436f6e74656e745f54797065735d2e786d6c504b01022d0014000600080000002100b5553023f40000004c0200000b00000000000000000000000000990300005f72656c732f2e72656c73504b01022d001400060008000000210019c31dd578030000780800000f00000000000000000000000000be060000786c2f776f726b626f6f6b2e786d6c504b01022d00140006000800000021008d87da70e00000002d0200001a00000000000000000000000000630a0000786c2f5f72656c732f776f726b626f6f6b2e786d6c2e72656c73504b01022d00140006000800000021005be11ea7e60300001a1000001800000000000000000000000000830c0000786c2f776f726b7368656574732f7368656574312e786d6c504b01022d0014000600080000002100c11710be4e070000c620000013000000000000000000000000009f100000786c2f7468656d652f7468656d65312e786d6c504b01022d0014000600080000002100611cfd15640900003b4300000d000000000000000000000000001e180000786c2f7374796c65732e786d6c504b01022d00140006000800000021003b6d324bc1000000420100002300000000000000000000000000ad210000786c2f776f726b7368656574732f5f72656c732f7368656574312e786d6c2e72656c73504b01022d0014000600080000002100ae0bfd89bb0100002c1500002700000000000000000000000000af220000786c2f7072696e74657253657474696e67732f7072696e74657253657474696e6773312e62696e504b01022d00140006000800000021002597853f45010000630200001100000000000000000000000000af240000646f6350726f70732f636f72652e786d6c504b01022d001400060008000000210061490910890100001103000010000000000000000000000000002b270000646f6350726f70732f6170702e786d6c504b0506000000000b000b00e4020000ea2900000000";

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

        // Cheers, tweaked from https://sebnilsson.com/blog/convert-c-anonymous-or-any-types-into-dynamic-expandoobject/
        public static ExpandoObject ToExpandoObject(this object obj)
        {
            IDictionary<string, object> expando = new ExpandoObject();

            foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(obj.GetType()))
            {
                if (!property.PropertyType.FullName.Contains("Newtonsoft"))
                {
                    expando.Add(property.Name, property.GetValue(obj));
                }
            }

            return (ExpandoObject)expando;
        }
    }
}
