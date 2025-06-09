using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;
using SharedEFClasses.Models.IncomingEmail;
using SharedEFClasses.Models.OrderBook;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Dapper;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<FullEmail> EmailDigester_GetMessage(string UserID, string EmailMessageID)
        {
            try
            {
                var result = await this.Database.Connection.QuerySingleAsync<FullEmail>("SELECT * FROM clr.fnc_EmailDigester_GetMessage(@UserID, @EmailMessageID)", new
                {
                    UserID,
                    EmailMessageID
                }, null, 30, System.Data.CommandType.Text);

                result.EmailMessageID = EmailMessageID;

                return result;
            }
            catch (Exception e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }
    }
}
