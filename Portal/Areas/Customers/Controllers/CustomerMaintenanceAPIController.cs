using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Portal.Areas.Customers.Controllers
{
    public class CustomerMaintenanceController : ApiController
    {
        private PortalDbContext portalDb { get; set; }
        private ApplicationUserManager userManager { get; set; }

        public CustomerMaintenanceController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.portalDb = portalDbContext;
            this.userManager = userManager;
        }
    }
}
