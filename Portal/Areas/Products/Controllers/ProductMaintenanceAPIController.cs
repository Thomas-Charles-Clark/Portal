using MertexerV2SQL.Models.Misc;

using Microsoft.AspNet.Identity;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Products;

using System;
using System.Collections;
using System.Linq;

using System.Threading.Tasks;
using System.Web.Http;

namespace Portal.Areas.Products.Controllers
{
    [System.Web.Http.Authorize]
    public partial class ProductMaintenanceAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public ProductMaintenanceAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpPost]
        public IHttpActionResult ProductAutocomplete([FromBody]PassAutocompleteTerm objAutocomplete)
        {
            return Ok();
        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveGenericForm([FromBody]PassGenericFormSave objSave)
        {
            var userId = User.Identity.GetUserId<int>();

            var result = await PortalDb.SaveGenericProductFormAsync(userId, objSave);

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult SaveProductTypeCore([FromBody]PassProductTypeCore objProductTypeCore)
        {
            var pt = PortalDb.MaintenanceProductTypes.Single(p => p.ProductTypeID == objProductTypeCore.productTypeId);

            pt.Name = objProductTypeCore.name;

            PortalDb.SaveChanges();

            return Ok(new { productTypes = PortalDb.MaintenanceProductTypes.OrderBy(mpt => mpt.ProductTypeID) });
        }

        [HttpPost]
        public IHttpActionResult SaveProductTypeJson([FromBody]PassProductTypeJson objProductTypeJson)
        {
            var pt = PortalDb.MaintenanceProductTypes.Single(p => p.ProductTypeID == objProductTypeJson.productTypeId);

            pt.EditFormJSON = objProductTypeJson.json;

            PortalDb.SaveChanges();

            return Ok(new { productTypes = PortalDb.MaintenanceProductTypes.OrderBy(mpt => mpt.ProductTypeID) });
        }
    }
}
