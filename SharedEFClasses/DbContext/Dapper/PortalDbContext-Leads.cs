using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Mertexer;

using SimpleImpersonation;

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public TradeAccountCreationResponse OpenTradeAccount(PassLeadID objLeadId)
        {
            var response = new TradeAccountCreationResponse();

            var credentials = new UserCredentials("DESIGNERSGUILD\\SQLAgentFileAccess", "34949C02-4677-4711-999C-8E038E26B10F");

            Impersonation.RunAsUser(credentials, LogonType.Interactive, () =>
            {
                using (var conn = new SqlConnection(ConfigurationManager.ConnectionStrings["VM-SQL-IntegratedConnectionString"].ConnectionString))
                {
                    var result = conn.QueryMultiple("[portal].[Lead_TradeAccount_Open]", new
                    {
                        LeadID = objLeadId.leadId,
                        DevMode = false
                    }, null, 60, CommandType.StoredProcedure);

                    response.TradeAccountCode = result.ReadSingle<string>();
                }
            });

            return response;
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