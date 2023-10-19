using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models.RangeManagement;

using System.Data;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<RangeManagementProductSearchResponse> RangeManagementProductSearch(RangeManagementProductFetchDto dto)
        {
            var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[RangeManagement_Product_Select]", new
            {
                dto.BranchID,
                dto.ProductFilterGroupID,
                dto.ProductFilterID,
                dto.LaunchID,
                dto.BrandID,
                dto.StatusGroupID,
                dto.SearchTerm
            }, null, null, CommandType.StoredProcedure);

            return new RangeManagementProductSearchResponse()
            {
                Results = reply.Read<RangeManagementProductSearchRecord>()
            };
        }
    }
}
