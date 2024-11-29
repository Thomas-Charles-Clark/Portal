using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Newtonsoft.Json;
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
using System.Threading.Tasks;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses.Models.NeimanMarcus;

namespace Portal.Areas.Orders.Controllers
{
    [DynamicRoleAuthorize]
    public class NeimanMarcusOrderStatusApiController : ApiController
    {
        private PortalDbContext portalDb { get; set; }
        private readonly ApplicationUserManager userManager;

        public NeimanMarcusOrderStatusApiController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.portalDb = portalDbContext;
            this.userManager = userManager;
        }

        [HttpGet]
        public async Task<IHttpActionResult> RefreshGrid(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri]NeimanMarcusOrderStatusGridDto dto
            )
        {
            var results = await portalDb.NeimanMarcus_OrderInspect(dto);

            return Ok(new
            {
                kendoResult = results.Orders.ToDataSourceResult(request),
                titleExplanations = results.TitleExplanations
            });
        }
    }
}