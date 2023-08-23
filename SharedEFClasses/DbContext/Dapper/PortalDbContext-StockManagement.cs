using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;
using SharedEFClasses.Models.StockManagement;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<StockManagementProductSearchResponse> StockManagementProductSearch(StockManagementProductFetchDto objDto)
        {
            var attributeIds = new DataTable();

            attributeIds.Columns.Add("AttributeID");

            foreach (var a in objDto.AttributeIDs) 
            {
                attributeIds.Rows.Add(a);
            }

            var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[StockManagement_ProductSearch]", new
            {
                objDto.BranchGroupID,
                objDto.BranchID,
                objDto.ProductTypeID,
                objDto.ProductGroupCode,
                objDto.ItemTypeCode,
                objDto.LaunchID,
                objDto.BrandID,
                objDto.ProductColourID,
                objDto.StockLevelID,
                objDto.CollectionCode,
                AttributeIDs = attributeIds.AsTableValuedParameter("AttributeIDsTableType")
            }, null, null, CommandType.StoredProcedure);

            return new StockManagementProductSearchResponse()
            {
                Results = reply.Read<StockManagementProductSearchRecord>(),
                BranchGroupTotals = reply.Read<StockManagementBranchGroupTotalRecord>(),
                RangeRecords = reply.Read<StockManagementRangeRecord>(),
                ContrastRecords = reply.Read<StockManagementContrastRecord>()
            };
        }
    }
}
