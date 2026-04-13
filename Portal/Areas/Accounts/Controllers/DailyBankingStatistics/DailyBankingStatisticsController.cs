using Microsoft.AspNet.Identity;
using Newtonsoft.Json;

using Portal.Areas.Accounting.ViewModels;
using Portal.Areas.ApplicationGroups.ViewModels;
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
using System.Web.Mvc;

namespace Portal.Areas.Accounting.Controllers
{
    [DynamicRoleAuthorize]
    public partial class BankAccountsController : BaseController
    {
		[Route("daily-statistics")]
		public ActionResult DailyBankingStatistics()
        {
            var application = PortalDb.Applications.Where(p => p.AreaName == "accounts" && p.ControllerName == "banks" && p.ActionName == "daily-statistics").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new DailyBankingStatisticsViewModel(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("DailyBankingStatistics", model);
        }
    }
}