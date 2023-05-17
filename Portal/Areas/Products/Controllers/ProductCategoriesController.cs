using Microsoft.AspNet.Identity;
using Portal.Areas.Products.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Products.Controllers
{
    [DynamicRoleAuthorise]
    [RouteArea("products")]
    [RoutePrefix("categories")]
    [Route("{action=index}")]
    public class CategoriesController : BaseController
    {
        public CategoriesController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        // GET: Products/Delivery
        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "categories" && p.AreaName == "products" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var pgs = PortalDb.ProductGroups.Select(p => new CodeDescriptionCount()
            {
                Code = p.Code,
                Description = p.Name,
                Counts = new List<long>() 
                { 
                    p.Products.Count,
                    p.Products.Where(q => q.Status == "C").Count()
                }
            }).ToList();

            var its = PortalDb.ItemTypes.Select(p => new CodeDescriptionCount()
            {
                Code = p.Code,
                Description = p.Name,
                Counts = new List<long> 
                { 
                    p.Products.Count,
                    p.Products.Where(q => q.Status == "C").Count()
                }
            }).ToList();

            var pts = PortalDb.Mertex_ProductTypes.ToList();

            pts.ForEach(c => 
            {
                c.Counts = new List<CodeDescriptionCount>()
                {
                    new CodeDescriptionCount()
                    {
                        Code = c.ItemTypeCode,
                        Description = c.ItemType.Name,
                        Counts = its.Where(q => q.Code == c.ItemTypeCode).Select(q => q.Counts).Single()
                    },
                    new CodeDescriptionCount()
                    {
                        Code = c.ProductGroupCode,
                        Description = c.ProductGroup.Name,
                        Counts = pgs.Where(q => q.Code == c.ProductGroupCode).Select(q => q.Counts).Single()
                    }
                };
            });

            var model = new ProductCategoriesViewModel(
                pgs,
                its,
                pts,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("ProductCategories", model);
        }
    }
}