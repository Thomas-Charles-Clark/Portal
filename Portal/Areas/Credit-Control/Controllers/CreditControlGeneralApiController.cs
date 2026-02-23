using DocumentFormat.OpenXml.EMMA;

using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security.Twitter.Messages;

using Newtonsoft.Json;
using Portal.Models;
using Portal.Utilities.Document;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.CreditControl;
using SharedEFClasses.Models.Documents;
using SharedEFClasses.Models.IncomingEmail;
using SharedEFClasses.Utilities;
using SimpleImpersonation;

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Management.Automation.Language;
using System.Net;
using System.Net.Http;
using System.Runtime.CompilerServices;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Portal.Areas.CreditControl.Controllers
{
    public class CreditControlAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public CreditControlAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

		[HttpGet]
		public async Task<IHttpActionResult> TradeAccountSearch(
			[ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
			[FromUri] CreditControl_TradeAccount_SearchDTO dto)
        {
			try
			{
				if (request.Sorts.Any())
				{
					var sort = request.Sorts.First();

					dto.SortOrder = $"{sort.Member}_{(sort.SortDirection == ListSortDirection.Ascending ? "Asc" : "Desc")}";
				}

				var model = await PortalDb.CreditControl_TradeAccount_Search(dto);

				request.Page = 1; // This is a super weird and stupid hack but...

				var gridData = model.Results.ToDataSourceResult(request);

				gridData.Total = model.TotalsRecord.TotalRowCount;

				return Ok(new
				{
					gridData = gridData,
					dashboardPods = model.DashboardPods,
					totalsRecord = model.TotalsRecord
				});
			}
			catch(SqlException)
			{
				return Ok(new
				{
					errorMessage = "Sorry, a database timeout error occurred.<br/>Please click to close this dialog box to retry, or reload your browser tab."
				});
			}
		}

		[HttpPost]
		public async Task<IHttpActionResult> FetchDebtBreakdown(
			[FromBody] CreditControl_TradeAccount_DebtBreakdownDTO dto)
		{
			var result = await PortalDb.CreditControl_TradeAccount_DebtBreakdown_Select(dto);

			return Ok(result);
		}

		[HttpPost]
		public async Task<IHttpActionResult> FetchOrdersBreakdown(
			[FromBody] CreditControl_TradeAccount_OrderBreakdownDTO dto)
		{
			var result = await PortalDb.CreditControl_TradeAccount_OrderBreakdown_Select(dto);

			return Ok(result);
		}

		[HttpPost]
		public async Task<IHttpActionResult> FetchClaimsBreakdown(
			[FromBody] CreditControl_TradeAccount_ClaimBreakdownDTO dto)
		{
			var result = await PortalDb.CreditControl_TradeAccount_ClaimBreakdown_Select(dto);

			return Ok(result);
		}

		[HttpPost]
		public async Task<IHttpActionResult> FetchOtherBreakdown(
			[FromBody] CreditControl_TradeAccount_OtherBreakdownDTO dto)
		{
			var result = await PortalDb.CreditControl_TradeAccount_OtherBreakdown_Select(dto);

			return Ok(result);
		}

		[HttpPost]
		public async Task<IHttpActionResult> FetchSalesBreakdown(
			[FromBody] CreditControl_TradeAccount_SalesBreakdownDTO dto)
		{
			var result = await PortalDb.CreditControl_TradeAccount_SalesBreakdown_Select(dto);

			return Ok(result);
		}

		[HttpGet]
		public IHttpActionResult FetchSalesAnalysisGroups(
			[ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
		{
			var results = PortalDb.SalesHistoryAnalysisPeriods.AsQueryable();

			return Ok(results.ToDataSourceResult(request));
		}

		[HttpPost]
		public async Task<IHttpActionResult> FetchAgedSalesLedger(
			[FromBody]CreditControl_TradeAccount_PerformanceDTO dto)
		{
			var results = await PortalDb.CreditControl_AgedSalesLedger_Select(dto);

			return Ok(results);
		}
	}
}
