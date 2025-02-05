using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;
using SharedEFClasses.Models.OrderBook;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<IEnumerable<OrderLineDetailedStatusGroup_SelectResult>> OrderLineDetailedStatusGroup_Select()
        {
            try
            {
                return await this.Database.SqlQuery<OrderLineDetailedStatusGroup_SelectResult>("portal.OrderBook_OrderLineDetailedStatusGroup_Select").ToListAsync();
            }
            catch (Exception e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public async Task<IEnumerable<OrderBookPreDefineFilterGroup>> OrderBookPreDefinedFiltersGroups_Select()
        {
            try
            {
                return await this.Database.SqlQuery<OrderBookPreDefineFilterGroup>("portal.OrderBook_ProblemSummaryGroup_Select").ToListAsync();
            }
            catch (Exception e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }
    }
}
