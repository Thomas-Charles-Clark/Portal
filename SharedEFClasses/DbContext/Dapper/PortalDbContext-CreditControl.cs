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

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
		public async Task<CreditControl_TradeAccount_Search_Result> CreditControl_TradeAccount_Search(CreditControl_TradeAccount_SearchDTO dto)
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
				Page = dto.Page - 1
			};

			var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[CreditControl_TradeAccount_Search]", dat, null, 300, CommandType.StoredProcedure);

			return new CreditControl_TradeAccount_Search_Result()
			{
				DashboardPods = await reply.ReadAsync<CreditControl_TradeAccount_Search_DashboardPod>(),
                Results = await reply.ReadAsync<CreditControl_TradeAccount_Search_Record>(),
                ResultsCount = await reply.ReadSingleAsync<int>()
			};
		}
	}
}
