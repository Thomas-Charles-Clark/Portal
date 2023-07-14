using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Mertexer;

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<TradeAccountCreationResponse> OpenTradeAccount(PassLeadID objLeadId)
        {
            var result = await this.Database.Connection.QueryMultipleAsync("[portal].[Lead_TradeAccount_Open]", new
            {
                LeadID = objLeadId.leadId,
                DevMode = true
            }, null, 60, CommandType.StoredProcedure);

            return new TradeAccountCreationResponse()
            {
                TradeAccountCode = result.ReadSingle<string>()
            };
        }

        public async Task<object> ResetLeadToCreditControl(PassLeadID objLeadId)
        {
            var result = await this.Database.Connection.QueryMultipleAsync("[portal].[Lead_ResetToCreditControl]", new
            {
                LeadID = objLeadId.leadId
            }, null, 60, CommandType.StoredProcedure);

            return new { };
        }
    }
}