using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;
using SharedEFClasses.Models.Translations;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public IEnumerable<Translation_DashboardResult> Translation_Dashboard_Select(PassTranslationDashboardDTO dto)
        {
            var results = this.Database.Connection.QueryMultiple("[portal].[TranslationMaintenance_Dashboard_Select]", dto, null, null, System.Data.CommandType.StoredProcedure);

            return results.Read<Translation_DashboardResult>();
        }
    }
}
