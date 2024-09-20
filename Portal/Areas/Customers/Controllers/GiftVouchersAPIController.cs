using Kendo.Mvc.UI;

using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Kendo.Mvc.Extensions;

using System.Data.Entity;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.IO;
using SharedEFClasses.Models.ContractPricing;
using Portal.Utilities.DynamicRoles;
using System.Collections;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using System.Dynamic;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using Portal.Areas.Products.Models;

namespace Portal.Areas.Customers.Controllers
{
    [DynamicRoleAuthorize]
    public class GiftVouchersAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private ApplicationUserManager UserManager { get; set; }

        public GiftVouchersAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.PortalDb = portalDbContext;
            this.UserManager = userManager;
        }

        [HttpGet]
        public DataSourceResult FetchGiftVouchers(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            return PortalDb.GiftVouchers
                .Include(gv => gv.GiftVoucherType)
                .Include(gv => gv.CreatedByMember)
                .Include(gv => gv.PriceList)
                .Include(gv => gv.PriceList.Currency)
                .AsQueryable().ToDataSourceResult(request);
        }
    }
}
