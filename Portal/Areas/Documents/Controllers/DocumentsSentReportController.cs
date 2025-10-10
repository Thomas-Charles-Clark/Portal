using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using Portal.Areas.Documents.ViewModels;
using Portal.Areas.Orders.ViewModels;
using Portal.Controllers;
using Portal.Models;
using Portal.Utilities.Document;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Documents;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Portal.Areas.Orders.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("documents")]
    [RoutePrefix("sent-report")]
    [Route("{action=index}")]
    public class SentReportController : BaseController
    {
        public SentReportController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        public async Task<ActionResult> Index(
            short? documentId = null,
            int? tradeAccountId = null, 
            int? dateRangeId = null, 
            string fromDate = null, 
            string toDate = null, 
            string searchTerm = null,
            int page = 1,
            int pageSize = 50)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "sent-report" && p.AreaName == "documents" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            DateTime? toDt = DateTime.Now;

            DateTime? fromDt = DateTime.Now.AddDays(-30);

            switch (dateRangeId)
            {
                case 12: /* Last 12 Months */
                    fromDt = DateTime.Now.AddYears(-1);
                    break;
                case 6: /* Last 6 Months */
                    fromDt = DateTime.Now.AddMonths(-6);
                    break;
                case 3: /* This Month */
                    fromDt = DateTime.Now.AddMonths(-3);
                    break;
                case 1: /* This Month */
                    fromDt = DateTime.Now.AddDays(-DateTime.Now.Day).AddDays(1);
                    break;
                case 30: /* Last 30 Days */
                    fromDt = DateTime.Now.AddDays(-30);
                    break;
                case -1: /* "Custom" */
                    toDt = DateTime.ParseExact(toDate, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
                    fromDt = DateTime.ParseExact(fromDate, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
                    break;
                case -2: /* "All Time" noop */
                    break;
                case -3:
                    switch (DateTime.Now.DayOfWeek)
                    {
                        case DayOfWeek.Monday:
                            toDt = DateTime.Now.Date.AddDays(-4);
                            break;
                        case DayOfWeek.Tuesday:
                            toDt = DateTime.Now.Date.AddDays(-4);
                            break;
                        case DayOfWeek.Wednesday:
                            toDt = DateTime.Now.Date.AddDays(-4);
                            break;
                        case DayOfWeek.Thursday:
                            toDt = DateTime.Now.Date.AddDays(-2);
                            break;
                        case DayOfWeek.Friday:
                            toDt = DateTime.Now.Date.AddDays(-2);
                            break;
                        case DayOfWeek.Saturday:
                            toDt = DateTime.Now.Date.AddDays(-2);
                            break;
                        case DayOfWeek.Sunday:
                            toDt = DateTime.Now.Date.AddDays(-3);
                            break;
                    }
                    break;
            }

            var dto = new PassDocumentSentReportDto()
            {
                DateRangeID = dateRangeId,
                FromDate = fromDt,
                ToDate = toDt,
                DocumentID = documentId,
                TradeAccountID = tradeAccountId,
                SearchString = searchTerm,
                SentDTSortDirection = "DESC",
                Page = page,
                PageSize = pageSize
            };

            var model = await DocumentsSentReportViewModel.CreateAsync(
                dto,
                user.GetActiveRoleProperties(),
                application.Heading, 
                application.SubHeading);

            return View("DocumentsSentReport", model);
        }
    }
}