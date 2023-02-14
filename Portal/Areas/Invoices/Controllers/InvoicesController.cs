using Microsoft.AspNet.Identity;
using Portal.Areas.Invoices.ViewModels;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using System.Linq;
using System.Web.Mvc;

namespace Portal.Areas.Invoices.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("invoices")]
    [RoutePrefix("approval")]
    [Route("{action=index}")]
    public class InvoicesController : BaseController
    {
        public InvoicesController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        // GET: invoices/approval/treatments
        public ActionResult Treatments()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "approval" && p.AreaName == "invoices" && p.ActionName == "treatments").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (Session["selectedTradeAccountId"] == null)
            {
                Session["selectedTradeAccountId"] = user.TradeAccountID;
            }
            else
            {

            }

            var model = new TreatmentInvoiceApprovalViewModel(
                PortalDb.TreatmentProviders.OrderBy(p => p.SortOrder).ToList(),
                PortalDb.OrderStatuses.Where(p => p.OrderStatusID > 0 && p.Deleted == false).OrderBy(p => p.OrderStatusID).ToList(),
                user.GetActiveRoleProperties(), 
                application.Heading, 
                application.SubHeading);

            return View("TreatmentInvoiceApproval", model);
        }

        // GET: invoices/approval/treatments
        public ActionResult Paint()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "approval" && p.AreaName == "invoices" && p.ActionName == "paint").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (Session["selectedTradeAccountId"] == null)
            {
                Session["selectedTradeAccountId"] = user.TradeAccountID;
            }
            else
            {

            }

            var model = new PaintInvoiceApprovalViewModel(
                PortalDb.TreatmentProviders.OrderBy(p => p.SortOrder).ToList(),
                PortalDb.OrderStatuses.Where(p => p.OrderStatusID > 0 && p.Deleted == false).OrderBy(p => p.OrderStatusID).ToList(),
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("PaintInvoiceApproval", model);
        }

        // GET: invoices/approval/furniture
        public ActionResult Furniture()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "approval" && p.AreaName == "invoices" && p.ActionName == "furniture").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (Session["selectedTradeAccountId"] == null)
            {
                Session["selectedTradeAccountId"] = user.TradeAccountID;
            }
            else
            {

            }

            var model = new FurnitureInvoiceApprovalViewModel(
                PortalDb.TreatmentProviders.OrderBy(p => p.SortOrder).ToList(),
                PortalDb.OrderStatuses.Where(p => p.OrderStatusID > 0 && p.Deleted == false).OrderBy(p => p.OrderStatusID).ToList(),
                PortalDb.FurnitureSuppliers.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList(),
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("FurnitureInvoiceApproval", model);
        }
    }
}