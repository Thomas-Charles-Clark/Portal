using Kendo.Mvc.Extensions;

using Microsoft.AspNet.Identity;
using Portal.Areas.Orders.ViewModels;
using Portal.Areas.Press.ViewModels;
using Portal.Controllers;
using Portal.Models;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.OrderBook;

using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

using Unity.Interception.Utilities;

namespace Portal.Areas.Orders.Controllers
{
    [DynamicRoleAuthorise(actionNameAgnostic: true)]
    [RouteArea("order-book")]
    [RoutePrefix("detail")]
    [Route("{action=index}")]
    public class OrderBookDetailController : BaseController
    {
        public OrderBookDetailController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        // GET: OrderBook/Summary
        [Route("back-orders")]
        public async Task<ActionResult> BackOrders()
        {
            if (Request.QueryString.HasKeys() && Request.QueryString.AllKeys.Contains("partial"))
            {
                ViewBag.Partial = true;
            }

            ViewBag.HideSidebar = true;

            var objParams = new ExpandoObject();

            var objParamsDict = objParams as IDictionary<string, object>;

            Request.QueryString.AllKeys.ForEach(key =>
            {
                if (key != "partial" && Request.QueryString[key] != "null")
                {
                    objParamsDict.Add(key, Request.QueryString[key]);
                }
            });
            
            var application = PortalDb.Applications.Where(p => p.ControllerName == "OrderBookDetail" && p.AreaName == "order-book" && p.ActionName == "back-orders").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await OrderBookDetailViewModel.CreateAsync(
                "BackOrders",
                objParams,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("OrderBookDetail", model);
        }

        // GET: OrderBook/Summary
        [Route("view-one")]
        public async Task<ActionResult> ViewOne()
        {
            if (Request.QueryString.HasKeys() && Request.QueryString.AllKeys.Contains("partial"))
            {
                ViewBag.Partial = true;
            }

            ViewBag.HideSidebar = true;

            var objParams = new ExpandoObject();

            var objParamsDict = objParams as IDictionary<string, object>;

            Request.QueryString.AllKeys.ForEach(key =>
            {
                if (key != "partial" && Request.QueryString[key] != "null")
                {
                    objParamsDict.Add(key, Request.QueryString[key]);
                }
            });

            var application = PortalDb.Applications.Where(p => p.ControllerName == "OrderBookDetail" && p.AreaName == "order-book" && p.ActionName == "view-one").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await OrderBookDetailViewModel.CreateAsync(
                "ViewOne",
                objParams,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("OrderBookDetail", model);
        }

        // GET: order-book/reallocate-stock
        [Route("reallocate-stock")]
        public async Task<ActionResult> ReallocateStock()
        {
            if (Request.QueryString.HasKeys() && Request.QueryString.AllKeys.Contains("partial"))
            {
                ViewBag.Partial = true;
            }

            ViewBag.HideSidebar = true;

            var objParams = new ExpandoObject();

            var objParamsDict = objParams as IDictionary<string, object>;

            Request.QueryString.AllKeys.ForEach(key =>
            {
                if (key != "partial" && Request.QueryString[key] != "null")
                {
                    objParamsDict.Add(key, Request.QueryString[key]);
                }
            });

            var application = PortalDb.Applications.Where(p => p.ControllerName == "OrderBookDetail" && p.AreaName == "order-book" && p.ActionName == "view-two").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await OrderBookDetailViewModel.CreateAsync(
                "ViewTwo",
                objParams,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("ReallocateStock", model);
        }

        // GET: OrderBook/Summary
        [Route("view-three")]
        public async Task<ActionResult> ViewThree()
        {
            if (Request.QueryString.HasKeys() && Request.QueryString.AllKeys.Contains("partial"))
            {
                ViewBag.Partial = true;
            }

            ViewBag.HideSidebar = true;

            var objParams = new ExpandoObject();

            var objParamsDict = objParams as IDictionary<string, object>;

            Request.QueryString.AllKeys.ForEach(key =>
            {
                if (key != "partial" && Request.QueryString[key] != "null")
                {
                    objParamsDict.Add(key, Request.QueryString[key]);
                }
            });

            var application = PortalDb.Applications.Where(p => p.ControllerName == "OrderBookDetail" && p.AreaName == "order-book" && p.ActionName == "view-three").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await OrderBookDetailViewModel.CreateAsync(
                "ViewThree",
                objParams,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("OrderBookDetail", model);
        }

        // GET: OrderBook/Summary
        [Route("view-four")]
        public async Task<ActionResult> ViewFour()
        {
            if (Request.QueryString.HasKeys() && Request.QueryString.AllKeys.Contains("partial"))
            {
                ViewBag.Partial = true;
            }

            ViewBag.HideSidebar = true;

            var objParams = new ExpandoObject();

            var objParamsDict = objParams as IDictionary<string, object>;

            Request.QueryString.AllKeys.ForEach(key =>
            {
                if (key != "partial" && Request.QueryString[key] != "null")
                {
                    objParamsDict.Add(key, Request.QueryString[key]);
                }
            });

            var application = PortalDb.Applications.Where(p => p.ControllerName == "OrderBookDetail" && p.AreaName == "order-book" && p.ActionName == "view-four").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await OrderBookDetailViewModel.CreateAsync(
                "ViewFour",
                objParams,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("OrderBookDetail", model);
        }

        [Route("back-orders-fulfilled-from-stock")]
        public async Task<ActionResult> BackOrdersFulfilledFromStock()
        {
            if (Request.QueryString.HasKeys() && Request.QueryString.AllKeys.Contains("partial"))
            {
                ViewBag.Partial = true;
            }

            ViewBag.HideSidebar = true;

            var objParams = new ExpandoObject();

            var objParamsDict = objParams as IDictionary<string, object>;

            Request.QueryString.AllKeys.ForEach(key =>
            {
                if (key != "partial" && Request.QueryString[key] != "null")
                {
                    objParamsDict.Add(key, Request.QueryString[key]);
                }
            });

            var application = PortalDb.Applications.Where(p => p.ControllerName == "OrderBookDetail" && p.AreaName == "order-book" && p.ActionName == "back-orders-fulfilled-from-stock").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await OrderBookDetailViewModel.CreateAsync(
                "BackOrdersFulfilledFromStock",
                objParams,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("OrderBookDetail", model);
        }

        [Route("back-orders-fulfilled-from-stock-in-another-stock-location")]
        public async Task<ActionResult> BackOrdersFulfilledFromStockInAnotherStockLocation()
        {
            if (Request.QueryString.HasKeys() && Request.QueryString.AllKeys.Contains("partial"))
            {
                ViewBag.Partial = true;
            }

            ViewBag.HideSidebar = true;

            var objParams = new ExpandoObject();

            var objParamsDict = objParams as IDictionary<string, object>;

            Request.QueryString.AllKeys.ForEach(key =>
            {
                if (key != "partial" && Request.QueryString[key] != "null")
                {
                    objParamsDict.Add(key, Request.QueryString[key]);
                }
            });

            var application = PortalDb.Applications.Where(p => p.ControllerName == "OrderBookDetail" && p.AreaName == "order-book" && p.ActionName == "back-orders-fulfilled-from-stock-in-another-stock-location").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await OrderBookDetailViewModel.CreateAsync(
                "BackOrdersFulfilledFromStockInAnotherStockLocation",
                objParams,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("OrderBookDetail", model);
        }

        [Route("back-orders-fulfilled-from-stock-allocated-to-another-order")]
        public async Task<ActionResult> BackOrdersFulfilledFromStockAllocatedToAnotherOrder()
        {
            if (Request.QueryString.HasKeys() && Request.QueryString.AllKeys.Contains("partial"))
            {
                ViewBag.Partial = true;
            }

            ViewBag.HideSidebar = true;

            var objParams = new ExpandoObject();

            var objParamsDict = objParams as IDictionary<string, object>;

            Request.QueryString.AllKeys.ForEach(key =>
            {
                if (key != "partial" && Request.QueryString[key] != "null")
                {
                    objParamsDict.Add(key, Request.QueryString[key]);
                }
            });

            var application = PortalDb.Applications.Where(p => p.ControllerName == "OrderBookDetail" && p.AreaName == "order-book" && p.ActionName == "back-orders-fulfilled-from-stock-allocated-to-another-order").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await OrderBookDetailViewModel.CreateAsync(
                "BackOrdersFulfilledFromStockAllocatedToAnotherOrder",
                objParams,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("ReallocateStock", model);
        }

        [Route("back-orders-fulfilled-from-purchase-orders")]
        public async Task<ActionResult> BackOrdersFulfilledFromPurchaseOrders()
        {
            if (Request.QueryString.HasKeys() && Request.QueryString.AllKeys.Contains("partial"))
            {
                ViewBag.Partial = true;
            }

            ViewBag.HideSidebar = true;

            var objParams = new ExpandoObject();

            var objParamsDict = objParams as IDictionary<string, object>;

            Request.QueryString.AllKeys.ForEach(key =>
            {
                if (key != "partial" && Request.QueryString[key] != "null")
                {
                    objParamsDict.Add(key, Request.QueryString[key]);
                }
            });

            var application = PortalDb.Applications.Where(p => p.ControllerName == "OrderBookDetail" && p.AreaName == "order-book" && p.ActionName == "back-orders-fulfilled-from-purchase-orders").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await OrderBookDetailViewModel.CreateAsync(
                "BackOrdersFulfilledFromPurchaseOrders",
                objParams,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("OrderBookDetail", model);
        }

        [Route("back-orders-without-purchase-orders")]
        public async Task<ActionResult> BackOrdersWithoutPurchaseOrders()
        {
            if (Request.QueryString.HasKeys() && Request.QueryString.AllKeys.Contains("partial"))
            {
                ViewBag.Partial = true;
            }

            ViewBag.HideSidebar = true;

            var objParams = new ExpandoObject();

            var objParamsDict = objParams as IDictionary<string, object>;

            Request.QueryString.AllKeys.ForEach(key =>
            {
                if (key != "partial" && Request.QueryString[key] != "null")
                {
                    objParamsDict.Add(key, Request.QueryString[key]);
                }
            });

            var application = PortalDb.Applications.Where(p => p.ControllerName == "OrderBookDetail" && p.AreaName == "order-book" && p.ActionName == "back-orders-without-purchase-orders").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await OrderBookDetailViewModel.CreateAsync(
                "BackOrdersWithoutPurchaseOrders",
                objParams,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("BackOrdersWithoutPurchaseOrders", model);
        }
    }
}