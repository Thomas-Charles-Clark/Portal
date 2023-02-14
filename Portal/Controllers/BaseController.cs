//using Portal.Models;
//using Microsoft.AspNet.Identity.Owin;
//using NLog;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;
//using System.Web.Mvc;
//using Portal.ViewModels.ComponentModels;
//using Microsoft.AspNet.OData;
//using Microsoft.AspNet.OData.Query;
//using SharedEFClasses.Models;
//using SharedEFClasses;

//namespace Portal.Controllers
//{
//    public class BaseController : Controller
//    {
//        protected static Logger logger = LogManager.GetCurrentClassLogger();

//        protected ApplicationUserManager userManager;

//        protected PortalDbContext portalDb;

//        public BaseController(ApplicationUserManager userManager, PortalDbContext portalDbContext)
//        {
//            this.userManager = userManager;
//            this.portalDb = portalDbContext;
//        }
//    }

//    public class BaseODataController : ODataController
//    {
//        protected static Logger logger = LogManager.GetCurrentClassLogger();
        
//        protected PortalDbContext portalDb;

//        public BaseODataController(PortalDbContext portalDbContext)
//        {
//            this.portalDb = portalDbContext;
//        }
//    }
//}