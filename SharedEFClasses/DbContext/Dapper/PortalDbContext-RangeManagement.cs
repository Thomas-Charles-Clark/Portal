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

        public async Task<RangeManagementDataFetchResponse> RangeManagementDataFetch(RangeManagementDataFetchDto dto)
        {
            var table = new DataTable();
            table.Columns.Add("ProductID", typeof(int));

            foreach (var pid in dto.ProductIDs)
            {
                table.Rows.Add(pid);
            }

            var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[RangeManagement_Range_Select]", new
            {
                BranchID = dto.BranchID,
                ProductIDs = table
            }, null, null, CommandType.StoredProcedure);

            return new RangeManagementDataFetchResponse()
            {
                Results = reply.Read<RangeManagementDataRecord>()
            };
        }
    }
}
