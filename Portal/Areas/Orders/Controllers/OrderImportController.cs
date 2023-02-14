using Microsoft.AspNet.Identity;
using Portal.Areas.Orders.ViewModels;
using Portal.Controllers;
using Portal.Models;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Orders.Controllers
{
    [RouteArea("orders")]
    [RoutePrefix("import")]
    [Route("{action=index}")]
    public class ImportController : BaseController
    {

        public ImportController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        // GET: Orders/Trade
        [DynamicRoleAuthorize]
        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "import" && p.AreaName == "orders" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (Session["selectedTradeAccountId"] == null)
            {
                Session["selectedTradeAccountId"] = user.TradeAccountID;
            }
            else
            {

            }

            TradeAccountNumber_AutocompleteResult preselected = null;

            if (user.Id == 8)
            {
                preselected = PortalDb.TradeAccountNumber_Autocomplete("", user.Id, 33992).FirstOrDefault();
            }

            var model = new OrderImportViewModel(
                preselected,
                user.GetActiveRoleProperties(), 
                application.Heading, 
                application.SubHeading);

            return View("OrderImport", model);
        }

        public ActionResult DownloadExampleCSV()
        {
            var f = System.IO.File.OpenRead(Server.MapPath("~/FileDownloads/import-example.csv"));

            var n = $"import-example.csv";

            return new FileStreamResult(f, MimeMapping.GetMimeMapping(n)) { FileDownloadName = n };
        }

        public ActionResult DownloadCSVSpecification()
        {
            var f = System.IO.File.OpenRead(Server.MapPath("~/FileDownloads/import-specification.pdf"));

            var n = $"import-specification.pdf";

            return new FileStreamResult(f, MimeMapping.GetMimeMapping(n)) { FileDownloadName = n };
        }
    }
}