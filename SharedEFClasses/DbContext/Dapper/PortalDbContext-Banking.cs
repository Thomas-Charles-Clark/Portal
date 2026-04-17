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
using SharedEFClasses.Models.Banking;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
		public async Task<BankAccountStat_Select_Result> BankAccountStat_Select(BankAccountStat_SelectDTO dto)
		{
			var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[BankAccountStat_Select]", dto, null, 300, CommandType.StoredProcedure);

			return new BankAccountStat_Select_Result()
			{
				Rows = await reply.ReadAsync<BankAccountStat_Select_Row>(),
				Columns = await reply.ReadAsync<BankAccountStat_Select_Column>(),
				Values = await reply.ReadAsync<BankAccountStat_Select_Value>(),
				RowLabel = await reply.ReadSingleOrDefaultAsync<BankAccountStat_Select_RowLabel>()
			};
		}

		public async Task<BankAccountStat_Save_Result> BankAccountStat_Save(BankAccountStat_SaveDTO dto)
		{
			var records = new DataTable();

			records.Columns.Add("RowID", typeof(int));
			records.Columns.Add("ColumnID", typeof(int));
			records.Columns.Add("Value", typeof(string));

			foreach (var r in dto.Records)
			{
				records.Rows.Add(r.RowID, r.ColumnID, r.Value);
			}

			var reply = await this.Database.Connection.QueryAsync("[portal].[BankAccountStat_Save]", new
			{
				dto.Date,
				dto.MemberID,
				BankAccountStats = records,
			}, null, 300, CommandType.StoredProcedure);

			return new BankAccountStat_Save_Result()
			{

			};
		}
	}
}
