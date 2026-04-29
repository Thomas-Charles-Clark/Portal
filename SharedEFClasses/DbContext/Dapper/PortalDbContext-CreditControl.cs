using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

using SimpleImpersonation;
using SharedEFClasses.Models.NeimanMarcus;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Models.CreditControl;
using NLog.LayoutRenderers;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
		public async Task<CreditControl_Dashboard_Select_Result> CreditControl_Dashboard_Select(CreditControl_Dashboard_SelectDTO dto)
		{
			var SalesMarketIDs = new DataTable();

			SalesMarketIDs.Columns.Add("ID", typeof(byte));

            if (dto.SalesMarketIDs != null)
			{
				foreach (var sm in dto.SalesMarketIDs)
				{
					SalesMarketIDs.Rows.Add(sm);
				}
			}

			var dat = new
			{
				SalesMarketIDs,
				dto.SalesRepresentativeID,
				dto.SalesAgentID,
				dto.SalesAreaID,
				dto.CountryID,
				dto.TradeAccountCode,
				dto.TradeAccountGroupID,
				dto.TradeAccountTypeID,
				dto.TradeAccountTypeGroupID,
				dto.PaymentTermsID,
				dto.PaymentTermsTypeID,
				dto.CreditStopped,
				dto.CreditControllerCode,
				dto.Open,
				dto.SearchTerm,
				dto.SalesHistoryAnalysisPeriod,
				dto.LanguageID,
				dto.DebtFunderCode,
				dto.CurrencyID,
				dto.SelectedPOD,
				dto.PageSize,
				Page = dto.Page - 1,
				dto.TradeAccountCompanyCode,
				dto.InvoiceCompanyCode,
				dto.SortOrder
			};

			var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[CreditControl_Dashboard_Select]", dat, null, 30, CommandType.StoredProcedure);

			return new CreditControl_Dashboard_Select_Result()
			{
				DashboardPods = await reply.ReadAsync<CreditControl_Dashboard_Select_Pod>(),
                Results = await reply.ReadAsync<CreditControl_Dashboard_Select_Record>(),
				TotalsRecord = await reply.ReadSingleAsync<CreditControl_TradeAccount_Totals_Record>()
			};
		}

		public async Task<CreditControl_SalesLedger_Select_Result> CreditControl_SalesLedger_Select(CreditControl_SalesLedger_SelectDTO dto)
		{
			var SalesMarketIDs = new DataTable();

			SalesMarketIDs.Columns.Add("ID", typeof(byte));

			if (dto.SalesMarketIDs != null)
			{
				foreach (var sm in dto.SalesMarketIDs)
				{
					SalesMarketIDs.Rows.Add(sm);
				}
			}

			var dat = new
			{
				SalesMarketIDs,
				dto.SalesRepresentativeID,
				dto.SalesAgentID,
				dto.SalesAreaID,
				dto.CountryID,
				dto.TradeAccountCode,
				dto.TradeAccountGroupID,
				dto.TradeAccountTypeID,
				dto.TradeAccountTypeGroupID,
				dto.PaymentTermsID,
				dto.PaymentTermsTypeID,
				dto.CreditStopped,
				dto.CreditControllerCode,
				dto.Open,
				dto.SearchTerm,
				dto.SalesHistoryAnalysisPeriod,
				dto.LanguageID,
				dto.DebtFunderCode,
				dto.CurrencyID,
				dto.SelectedPOD,
				dto.PageSize,
				dto.Page,
				dto.TradeAccountCompanyCode,
				dto.InvoiceCompanyCode,
				dto.SortOrder,
				dto.TradeAccountID
			};

			var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[CreditControl_SalesLedger_Select]", dat, null, 300, CommandType.StoredProcedure);

			return new CreditControl_SalesLedger_Select_Result()
			{
				Heading = await reply.ReadSingleOrDefaultAsync<CreditControl_SalesLedger_Select_HeadingResult>(),
				Pods = await reply.ReadAsync<CreditControl_SalesLedger_Select_Pod>(),
				Records = await reply.ReadAsync<CreditControl_SalesLedger_Select_Record>()
			};
		}

		public async Task<CreditControl_Statement_Select_Result> CreditControl_Statements_Select(CreditControl_Statement_SelectDTO dto)
		{
			var SalesMarketIDs = new DataTable();

			SalesMarketIDs.Columns.Add("ID", typeof(byte));

			if (dto.SalesMarketIDs != null)
			{
				foreach (var sm in dto.SalesMarketIDs)
				{
					SalesMarketIDs.Rows.Add(sm);
				}
			}

			var dat = new
			{
				SalesMarketIDs,
				dto.SalesRepresentativeID,
				dto.SalesAgentID,
				dto.SalesAreaID,
				dto.CountryID,
				dto.TradeAccountCode,
				dto.TradeAccountGroupID,
				dto.TradeAccountTypeID,
				dto.TradeAccountTypeGroupID,
				dto.PaymentTermsID,
				dto.PaymentTermsTypeID,
				dto.CreditStopped,
				dto.CreditControllerCode,
				dto.Open,
				dto.SearchTerm,
				dto.SalesHistoryAnalysisPeriod,
				dto.LanguageID,
				dto.DebtFunderCode,
				dto.CurrencyID,
				dto.SelectedPOD,
				dto.PageSize,
				dto.Page,
				dto.TradeAccountCompanyCode,
				dto.InvoiceCompanyCode,
				dto.SortOrder,
				dto.TradeAccountID
			};

			var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[CreditControl_Statement_Select]", dat, null, 300, CommandType.StoredProcedure);

			return new CreditControl_Statement_Select_Result()
			{
				Heading = await reply.ReadSingleOrDefaultAsync<CreditControl_Statement_Select_HeadingResult>(),
				Pods = await reply.ReadAsync<CreditControl_Statement_Select_Pod>(),
				Results = await reply.ReadAsync<CreditControl_Statement_Select_Record>(),
				TotalsRecord = await reply.ReadSingleAsync<CreditControl_TradeAccount_Totals_Record>(),
				InformationPopup = await reply.ReadSingleAsync<CreditControl_Statement_Info_Record>()
			};
		}

		public async Task<CreditControl_TradeAccount_OrderBreakdown_Result> CreditControl_TradeAccount_OrderBreakdown_Select(CreditControl_TradeAccount_OrderBreakdownDTO dto)
		{
			var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[CreditControl_TradeAccount_OrderBreakdown_Select]", dto, null, 30, CommandType.StoredProcedure);

			return new CreditControl_TradeAccount_OrderBreakdown_Result()
			{
				Heading = await reply.ReadSingleAsync<CreditControl_TradeAccount_OrderBreakdown_HeadingResult>(),
				Pods = await reply.ReadAsync<CreditControl_TradeAccount_OrderBreakdown_Pod>(),
				Records = await reply.ReadAsync<CreditControl_TradeAccount_OrderBreakdown_Record>()
			};
		}

		public async Task<CreditControl_TradeAccount_ClaimBreakdown_Result> CreditControl_TradeAccount_ClaimBreakdown_Select(CreditControl_TradeAccount_ClaimBreakdownDTO dto)
		{
			var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[CreditControl_TradeAccount_ClaimBreakdown_Select]", dto, null, 30, CommandType.StoredProcedure);

			return new CreditControl_TradeAccount_ClaimBreakdown_Result()
			{
				Heading = await reply.ReadSingleAsync<CreditControl_TradeAccount_ClaimBreakdown_HeadingResult>(),
				Pods = await reply.ReadAsync<CreditControl_TradeAccount_ClaimBreakdown_Pod>(),
				Records = await reply.ReadAsync<CreditControl_TradeAccount_ClaimBreakdown_Record>()
			};
		}

		public async Task<CreditControl_TradeAccount_OtherBreakdown_Result> CreditControl_TradeAccount_OtherBreakdown_Select(CreditControl_TradeAccount_OtherBreakdownDTO dto)
		{
			var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[CreditControl_TradeAccount_OtherBreakdown_Select]", dto, null, 30, CommandType.StoredProcedure);

			return new CreditControl_TradeAccount_OtherBreakdown_Result()
			{
				Heading = await reply.ReadSingleAsync<CreditControl_TradeAccount_OtherBreakdown_HeadingResult>(),
				Pods = await reply.ReadAsync<CreditControl_TradeAccount_OtherBreakdown_Pod>(),
				Records = await reply.ReadAsync<CreditControl_TradeAccount_OtherBreakdown_Record>()
			};
		}

		public async Task<CreditControl_TradeAccount_SalesBreakdown_Result> CreditControl_TradeAccount_SalesBreakdown_Select(CreditControl_TradeAccount_SalesBreakdownDTO dto)
		{
			var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[CreditControl_TradeAccount_SalesBreakdown_Select]", dto, null, 30, CommandType.StoredProcedure);

			return new CreditControl_TradeAccount_SalesBreakdown_Result()
			{
				Heading = await reply.ReadSingleAsync<CreditControl_TradeAccount_SalesBreakdown_HeadingResult>(),
				Pods = await reply.ReadAsync<CreditControl_TradeAccount_SalesBreakdown_Pod>(),
				Records = await reply.ReadAsync<CreditControl_TradeAccount_SalesBreakdown_Record>()
			};
		}

		public async Task<CreditControl_AgedSalesLedger_Result> CreditControl_AgedSalesLedger_Select(CreditControl_TradeAccount_PerformanceDTO dto)
		{
			var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[CreditControl_AgedSalesLedger_Select]", new {
				dto.ReportGrouping,
				dto.CurrencyOrSterling,
				TradeAccountCodeList = String.Join(",", dto.TradeAccountCodeList)
			}, null, 60, CommandType.StoredProcedure);

			return new CreditControl_AgedSalesLedger_Result()
			{
				Records = await reply.ReadAsync<CreditControl_AgedSalesLedger_Record>()
			};
		}

		public async Task<CreditControl_Toggle_CreditStop_Result> CreditControl_Toggle_CreditStop (CreditControl_TradeAccount_StopToggleDTO dto)
		{
			var reply = await this.Database.Connection.QueryMultipleAsync("[Mertex].[TradeAccount_CreditStop_Upsert]", dto, null, 60, CommandType.StoredProcedure);

			return new CreditControl_Toggle_CreditStop_Result()
			{
				Records = await reply.ReadAsync<CreditControl_Toggle_CreditStop_Record>()
			};
		}

		public async Task<CreditControl_Payments_SelectResult> CreditControl_Payments_Select(CreditControl_Payments_SelectDTO dto)
		{
			var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[CreditControl_Payments_Select]", new { 
				From = dto.From?.Date,
				To = dto.To?.Date,
				dto.TradeAccountCode,
				dto.SearchTerm,
				dto.CurrencyCode,
				dto.AccountID,
				dto.PaymentStatus,
				dto.CreditControllerCode
			}, null, 60, CommandType.StoredProcedure);

			return new CreditControl_Payments_SelectResult()
			{
				Records = await reply.ReadAsync<CreditControl_Payments_SelectRecord>()
			};
		}

		public async Task<CreditControl_OutstandingInvoicesWithUnallocatedDeposits_SelectResult> CreditControl_OutstandingInvoicesWithUnallocatedDeposits_Select(CreditControl_OutstandingInvoicesWithUnallocatedDeposits_SelectDTO dto)
		{
			var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[CreditControl_OutstandingInvoicesWithUnallocatedDeposits_Select]", new
			{
				From = dto.From?.Date,
				To = dto.To?.Date,
				dto.TradeAccountCode,
				dto.SearchTerm,
				dto.CurrencyCode
			}, null, 60, CommandType.StoredProcedure);

			return new CreditControl_OutstandingInvoicesWithUnallocatedDeposits_SelectResult()
			{
				Records = await reply.ReadAsync<CreditControl_OutstandingInvoicesWithUnallocatedDeposits_SelectRecord>()
			};
		}
	}
}
