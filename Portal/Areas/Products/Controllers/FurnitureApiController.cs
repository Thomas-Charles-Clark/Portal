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
using SharedEFClasses.Models;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.Samples;
using SharedEFClasses.Models.General;
using System.Web;
using System.IO;
using SharedEFClasses;
using SharedEFClasses.Utilities;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;

namespace Portal.Areas.Products.Controllers
{
    [Authorize]
    public class FurnitureApiController : ApiController
    {
        private PortalDbContext portalDb { get; set; }
        private readonly ApplicationUserManager userManager;

        public FurnitureApiController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.portalDb = portalDbContext;
            this.userManager = userManager;
        }

        [HttpGet]
        public IHttpActionResult GetModels([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request)
        {
            return Ok(portalDb.FurnitureModels.Include("Design").Where(p => p.Deleted == false).OrderBy(p => p.Code).AsQueryable().ToDataSourceResult(request));
        }

        [HttpPost]
        public IHttpActionResult FurnitureModelValueMapper([FromBody]PassFurnitureModelID objModelId)
        {
            var results = portalDb.FurnitureModels.Include("Design").Where(p => p.ModelID == objModelId.modelId).AsQueryable();

            return Ok(results);
        }

        [HttpPost]
        public IHttpActionResult SaveFurnitureMaterialBreakdown([FromBody]PassFurnitureMaterialBreakdown objBreakdown)
        {
            var results = portalDb.FurnitureMaterialBreakdownMerge(objBreakdown);

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult DesignFabricRestrictionSearch([FromBody]PassDesignFabricSearch objSearch)
        {
            var results = portalDb.DesignFabricRestrictionSearch(objSearch);

            return Ok(results.Results);
        }

        [HttpPost]
        public IHttpActionResult DesignStitchColourRestrictionSearch([FromBody]PassDesignFabricSearch objSearch)
        {
            if (!String.IsNullOrEmpty(objSearch.searchTerm))
            {
                return Ok(portalDb.FurnitureStitchColours.Where(p => p.StitchColourID.ToString() == objSearch.searchTerm ||
                    p.Name.Contains(objSearch.searchTerm)).OrderBy(p => p.StitchColourID).ToList());
            }
            else
            {
                return Ok(portalDb.FurnitureStitchColours.OrderBy(p => p.StitchColourID).ToList());
            }
        }

        [HttpPost]
        public IHttpActionResult SaveRecommendedStitchColour([FromBody]PassFabricRestrictionRecommendedStitchColour objRecommendation)
        {
            var fr = portalDb.FurnitureFabricRestrictions.Where(p => p.DesignID == objRecommendation.designId &&
            p.ProductID == objRecommendation.productId).SingleOrDefault();

            if (fr != null)
            {
                fr.StitchColourID = objRecommendation.stitchColourId;
            }
            else
            {
                portalDb.FurnitureFabricRestrictions.Add(new FurnitureFabricRestriction()
                {
                    DesignID = objRecommendation.designId,
                    ProductID = objRecommendation.productId,
                    StitchColourID = objRecommendation.stitchColourId
                });
            }

            portalDb.SaveChanges();

            return Ok(new { });
        }
    }
}
