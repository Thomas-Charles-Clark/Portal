using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
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
        public async Task<IEnumerable<Bank>> FetchBanks()
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[Bank_SelectList]", new
            {
                
            }, null, null, System.Data.CommandType.StoredProcedure);

            return results.Read<Bank>().ToList();
        }
    }
}
