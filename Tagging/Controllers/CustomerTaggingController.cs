using Tagging.Models;
using Tagging.ViewModels;
using Microsoft.AspNet.Identity;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Tagging.Controllers
{
    [DynamicRoleAuthorise]
    public class CustomersController : BaseController
    {
        private TaggingDbContext dbContext { get; set; }

        public CustomersController(ApplicationUserManager UserManager, PortalDbContext PortalDb, TaggingDbContext salesStatsDbContext) : base(UserManager, PortalDb)
        {
            dbContext = salesStatsDbContext;
        }

        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "customers" && p.AreaName == "tagging" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());
            
            var preselectedSalesRep = PortalDb.SalesRepresentatives
                                            .Where(p => p.DeletedDT == null &&  p.Visible == true && p.MemberID == user.Id)
                                            .SingleOrDefault();

            //if (preselectedSalesRep == null)
            //{
            //    switch (user.Id)
            //    {
            //        case 2:
            //            preselectedSalesRep = PortalDb.SalesRepresentatives.Where(p => p.SalesRepresentativeID == 59).Single();
            //            break;

            //        case 8:
            //            preselectedSalesRep = PortalDb.SalesRepresentatives.Where(p => p.SalesRepresentativeID == 55).Single();
            //            break;

            //        case 18:
            //            preselectedSalesRep = PortalDb.SalesRepresentatives.Where(p => p.SalesRepresentativeID == 59).Single();
            //            break;
            //    }
            //}

            if (preselectedSalesRep != null)
            {
                preselectedSalesRep.SalesMarketID = preselectedSalesRep.SalesRepresentative_SalesMarkets.FirstOrDefault()?.SalesMarketID;
            }

            var model = new TaggingViewModel(
                application.Heading,
                application.SubHeading,
                PortalDb.Tags.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList(),
                preselectedSalesRep,
                user.GetActiveRoleProperties());
            
            return View("CustomerTagging", model);
        }
    }
}