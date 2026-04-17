using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using Portal.Models;
using Portal.Utilities.Document;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Banking;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Documents;
using SharedEFClasses.Models.Reporting.CloseBrothers;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Portal.Areas.Accounting.Banks.Controllers
{
    public class DailyBankingStatisticsAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public DailyBankingStatisticsAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

		[HttpGet]
		public async Task<IHttpActionResult> BankingStatistics_Select(
			[ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
			[FromUri] BankAccountStat_SelectDTO dto)
		{
			try
			{
				var userId = User.Identity.GetUserId<int>();

				dto.MemberID = userId;

				var model = await PortalDb.BankAccountStat_Select(dto);

				//request.Page = 1;  // super weird but 100% necessary because we're doing the paging inside the procedure.

				return Ok(new
				{
					gridData = model.Rows.ToDataSourceResult(request),
					rows = model.Rows,
					rowLabel = model.RowLabel,
					columns = model.Columns,
					values = model.Values
				});
			}
			catch (SqlException e)
			{
				return Ok(new
				{
					errorMessage = "Sorry, a database timeout error occurred.<br/>Please click to close this dialog box to retry, or reload your browser tab.",
					exception = JsonConvert.SerializeObject(e, Formatting.Indented)
				});
			}
		}

		[HttpPost]
		public async Task<IHttpActionResult> SaveChanges([FromBody] BankAccountStat_SaveDTO dto)
		{
			var userId = User.Identity.GetUserId<int>();

			dto.MemberID = userId;

			var result = await PortalDb.BankAccountStat_Save(dto);

			return Ok(result);
		}
	}
}
