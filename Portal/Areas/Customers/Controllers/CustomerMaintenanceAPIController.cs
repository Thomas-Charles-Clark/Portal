using Kendo.Mvc.UI;

using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

using System.Data.Entity;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Portal.Areas.Customers.Controllers
{
    public class CustomerMaintenanceController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private ApplicationUserManager UserManager { get; set; }

        public CustomerMaintenanceController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.PortalDb = portalDbContext;
            this.UserManager = userManager;
        }

        [System.Web.Http.HttpGet]
        public DataSourceResult CreationEmailsGridView(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            var results = PortalDb.TradeAccountCreationEmails
                .Where(p => p.Deleted == false)
                .AsQueryable();

            return results
                .ToDataSourceResult(request);
        }
    }
}
