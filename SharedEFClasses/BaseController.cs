using NLog;
using System.Web.Mvc;
using SharedEFClasses.Models;
using Microsoft.AspNet.OData;

namespace SharedEFClasses
{
    public class BaseController : Controller
    {
        protected static Logger logger = LogManager.GetCurrentClassLogger();

        protected ApplicationUserManager UserManager;

        protected PortalDbContext PortalDb;

        public BaseController(ApplicationUserManager userManager, PortalDbContext portalDbContext)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }
    }

    public class BaseODataController : ODataController
    {
        protected static Logger logger = LogManager.GetCurrentClassLogger();

        protected ApplicationUserManager UserManager;

        protected PortalDbContext PortalDb;

        public BaseODataController(ApplicationUserManager userManager, PortalDbContext portalDbContext)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        public BaseODataController(PortalDbContext portalDbContext)
        {
            this.PortalDb = portalDbContext;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                PortalDb.Dispose();
            }

            base.Dispose(disposing);
        }
    }
}