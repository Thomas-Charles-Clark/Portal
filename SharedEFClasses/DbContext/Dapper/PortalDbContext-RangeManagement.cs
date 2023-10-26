using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models.RangeManagement;

using System;
using System.Data;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<string> RangeManagementCheckBranch(RangeManagementBranchCheckDto dto)
        {
            var reply = await this.Database.Connection.QuerySingleAsync<string>("[portal].[RangeManagement_Branch_Check]", new
            {
                dto.BranchID
            }, null, null, CommandType.StoredProcedure);

            return reply;
        }

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
                StockStatus = dto.StockStatusCode,
                dto.SearchTerm
            }, null, null, CommandType.StoredProcedure);

            return new RangeManagementProductSearchResponse()
            {
                Results = reply.Read<RangeManagementProductSearchRecord>()
            };
        }

        public async Task<RangeManagementProductSearchResponse> RangeManagementProductSearchAddToRange(RangeManagementProductFetchDto dto)
        {
            var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[RangeManagement_Product_SelectForAdd]", new
            {
                dto.BranchID,
                dto.ProductFilterGroupID,
                dto.ProductFilterID,
                dto.LaunchID,
                dto.BrandID,
                dto.StatusGroupID,
                StockStatus = dto.StockStatusCode,
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

        public async Task<int> RangeManagementUpsert(RangeManagementUpsertDto dto)
        {
            var table = new DataTable();
            table.Columns.Add("ProductID", typeof(int));
            table.Columns.Add("Quantity", typeof(decimal));
            table.Columns.Add("StartDate", typeof(DateTime));
            table.Columns.Add("EndDate", typeof(DateTime));

            foreach (var p in dto.Range)
            {
                table.Rows.Add(p.ProductID, p.Quantity, p.StartDate, p.EndDate);
            }

            var _ = await this.Database.Connection.QueryAsync("[portal].[RangeManagement_Range_Upsert]", new
            {
                BranchID = dto.BranchID,
                Range = table
            }, null, null, CommandType.StoredProcedure);

            return 0;
        }

        public async Task<RangeManagementTransferResponse> RangeManagementTransfer(RangeManagementTransferDto dto)
        {
            var reply = await this.Database.Connection.QuerySingleAsync<RangeManagementTransferResponse>("[portal].[RangeManagement_TransferBasket_Add]", new
            {
                dto.BranchID,
                dto.ProductID,
                dto.TransferQuantity,
                dto.TransferDirection
            }, null, null, CommandType.StoredProcedure);

            return reply;
        }

        public async Task<int> RangeManagementRemoveBasketItem(RangeManagementBasketItemRemovalDto dto)
        {
            var _ = await this.Database.Connection.QueryAsync("[portal].[BasketItem_Delete]", new
            {
                dto.BasketItemID,
                dto.MemberID,
                ReportErrors = false
            }, null, null, CommandType.StoredProcedure);

            return 0;
        }
    }
}
