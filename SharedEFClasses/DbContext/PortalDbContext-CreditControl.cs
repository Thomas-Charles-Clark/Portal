using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using SharedEFClasses.Utilities;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Orders;
using System.Text;
using System.IO;
using SharedEFClasses.Models.CreditControl;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<SendStatementsResult> SendStatements(CreditControl_Statement_SendDTO dto)
        {
            var tradeAccountCodes = new DataTable();

            tradeAccountCodes.Columns.Add("Code", typeof (string));

            foreach(var t in dto.TradeAccountCodes)
            {
                tradeAccountCodes.Rows.Add(t);
			}

            var result = await this.Database.Connection.QuerySingleAsync<SendStatementsResult>("portal.CreditControl_Statement_AddToDocumentEmailQueue",
                new {
                    tradeAccountCodes,
                    dto.Date
				},
                null, null, CommandType.StoredProcedure);

            return result;
        }
    }
}