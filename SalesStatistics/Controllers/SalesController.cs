using SalesStatistics.Models;
using SalesStatistics.ViewModels;
using Microsoft.AspNet.Identity;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SalesStatistics.Controllers
{
    [DynamicRoleAuthorise]
    public class SalesController : BaseController
    {
        private SalesStatsDbContext dbContext { get; set; }

        public SalesController(ApplicationUserManager UserManager, PortalDbContext PortalDb, SalesStatsDbContext salesStatsDbContext) : base(UserManager, PortalDb)
        {
            dbContext = salesStatsDbContext;
        }
        
        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "sales" && p.AreaName == "salesstatistics" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());
            
            var preselectedSalesRep = PortalDb.SalesRepresentatives
                                            .Where(p => p.DeletedDT == null && p.Visible == true && p.MemberID == user.Id)
                                            .SingleOrDefault();

            //(1,26,29,31,32,30)

            //if you're not in one of the above roles, you should be locked to rep being read only.

            var powerRoles = new List<int> { 1, 12, 26, 29, 31, 32, 30, 34 };

            var lockedToRep = !user.Roles.Where(p => powerRoles.Contains(p.RoleId)).Any();

            //if (preselectedSalesRep == null)
            //{
            //    switch (user.Id)
            //    {
            //        //case 2:
            //        //    preselectedSalesRep = PortalDb.SalesRepresentatives.Where(p => p.SalesRepresentativeID == 59).Single();
            //        //    break;

            //        //case 8:
            //        //    preselectedSalesRep = PortalDb.SalesRepresentatives.Where(p => p.SalesRepresentativeID == 55).Single();
            //        //    break;

            //        //case 18:
            //        //    preselectedSalesRep = PortalDb.SalesRepresentatives.Where(p => p.SalesRepresentativeID == 59).Single();
            //        //    break;
            //    }
            //}

            if (preselectedSalesRep != null)
            {
                preselectedSalesRep.SalesMarketID = preselectedSalesRep.SalesRepresentative_SalesMarkets.FirstOrDefault()?.SalesMarketID;
            }

            var model = new SalesStatsViewModel(
                application.Heading,
                application.SubHeading,
                PortalDb.Tags.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList(),
                PortalDb.SalesMarkets.OrderBy(p => p.Name).ToList(),
                preselectedSalesRep,
                lockedToRep,
                user.GetActiveRoleProperties());
            
            return View("SalesStatistics", model);
        }

        [ActionName("test-bed")]
        public ActionResult TestBed()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "sales" && p.AreaName == "salesstatistics" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());
            
            var preselectedSalesRep = PortalDb.SalesRepresentatives
                                            .Where(p => p.DeletedDT == null && p.Visible == true && p.MemberID == user.Id)
                                            .SingleOrDefault();

            //if (preselectedSalesRep == null)
            //{
            //    switch (user.Id)
            //    {
            //        //case 2:
            //        //    preselectedSalesRep = PortalDb.SalesRepresentatives.Where(p => p.SalesRepresentativeID == 59).Single();
            //        //    break;

            //        //case 8:
            //        //    preselectedSalesRep = PortalDb.SalesRepresentatives.Where(p => p.SalesRepresentativeID == 55).Single();
            //        //    break;

            //        //case 18:
            //        //    preselectedSalesRep = PortalDb.SalesRepresentatives.Where(p => p.SalesRepresentativeID == 59).Single();
            //        //    break;
            //    }
            //}

            if (preselectedSalesRep != null)
            {
                preselectedSalesRep.SalesMarketID = preselectedSalesRep.SalesRepresentative_SalesMarkets.FirstOrDefault()?.SalesMarketID;
            }

            var model = new SalesStatsViewModel(
                application.Heading,
                application.SubHeading,
                PortalDb.Tags.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList(),
                PortalDb.SalesMarkets.OrderBy(p => p.Name).ToList(),
                preselectedSalesRep,
                false,
                user.GetActiveRoleProperties());
            
            return View("TestBed/TestBed", model);
        }

        [HttpPost]
        public ActionResult Excel_Export_Save(string contentType, string base64, string fileName)
        {
            var fileContents = Convert.FromBase64String(base64);

            return File(fileContents, contentType, fileName);
        }
    }
}