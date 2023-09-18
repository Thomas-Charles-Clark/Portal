using Dapper;

using Kendo.Mvc;

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
        public async Task<StockManagementProductSearchResponse> StockManagementProductSearch(StockManagementProductFetchDto dto)
        {
            //var attributeIds = new DataTable();

            //attributeIds.Columns.Add("AttributeID");

            //if (dto.AttributeIDs != null)
            //{
            //    foreach (var a in dto.AttributeIDs)
            //    {
            //        attributeIds.Rows.Add(a);
            //    }
            //}

            var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[StockManagement_ProductSearch]", new
            {
                dto.StatusGroupID,
                dto.BuyerCode,
                dto.SupplierCode,
                dto.LaunchID,
                dto.BrandID,
                dto.ProductColourID,
                dto.StockStatusID,
                dto.CollectionID,
                //AttributeIDs = attributeIds.AsTableValuedParameter("AttributeIDsTableType"),
                dto.ProductFilterGroupID,
                dto.ProductFilterID
            }, null, null, CommandType.StoredProcedure);

            return new StockManagementProductSearchResponse()
            {
                Results = reply.Read<StockManagementProductSearchRecord>()
            };
        }

        public async Task<StockManagementProductDetailResponse> StockManagementProductDetail(StockManagementProductDetailFetchDto dto)
        {
            var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[StockManagement_ProductDetail]", new
            {
                dto.ProductID
            }, null, null, CommandType.StoredProcedure);

            return new StockManagementProductDetailResponse()
            {
                Results = reply.Read<StockManagementProductDetailRecord>()
            };
        }
        public async Task<bool> StockManagementBranchRangeSave(StockManagementBranchRangeSaveDto dto)
        {
            var products = new DataTable();

            products.Columns.Add("ProductID");
            products.Columns.Add("Quantity");

            foreach (var p in dto.Products)
            {
                products.Rows.Add(p.ProductID, p.Quantity);
            }

            var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[StockManagement_BranchRangeSave]", new
            {
                dto.BranchID,
                RangeProducts = products.AsTableValuedParameter("StockManagement.RangeProductQuantityTableType")
            }, null, null, CommandType.StoredProcedure);

            return true;
        }
    }
}
