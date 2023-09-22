using Dapper;

using Kendo.Mvc;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Samples;
using SharedEFClasses.Models.StockManagement;
using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
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
                dto.ProductFilterID,
                dto.SearchTerm
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
                Images = reply.Read<StockManagementProductImageRecord>()
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

        public async Task<StockManagementProductSalesHistoryResponse> StockManagementProductSalesHistorySummary(StockManagementProductDetailFetchDto dto)
        {
            var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[SalesHistorySummary_Select]", new
            {
                dto.ProductID,
                EnquiryType = "S"
            }, null, null, CommandType.StoredProcedure);

            return new StockManagementProductSalesHistoryResponse()
            {
                Schema = reply.ReadSingle<string>(),
                Columns = reply.ReadSingle<string>(),
                Data = reply.ReadSingle<string>()
            };
        }

        public async Task<StockManagementProductSalesHistoryResponse> StockManagementProductSalesHistoryDetail(StockManagementProductDetailFetchDto dto)
        {
            var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[SalesHistoryDetail_Select]", new
            {
                dto.ProductID,
                EnquiryType = "S"
            }, null, null, CommandType.StoredProcedure);

            return new StockManagementProductSalesHistoryResponse()
            {
                Schema = reply.ReadSingle<string>(),
                Columns = reply.ReadSingle<string>(),
                Data = reply.ReadSingle<string>()
            };
        }

        public async Task<StockManagementProductSalesHistoryResponse> StockManagementProductOrderBook(StockManagementProductDetailFetchDto dto)
        {
            var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[OrderBook_Select]", new
            {
                dto.ProductID,
                EnquiryType = "S"
            }, null, null, CommandType.StoredProcedure);

            return new StockManagementProductSalesHistoryResponse()
            {
                Schema = reply.ReadSingle<string>(),
                Columns = reply.ReadSingle<string>(),
                Data = reply.ReadSingleOrDefault<string>()
            };
        }

        public async Task<StockManagementProductStatusChangeResponse> StockManagementProductStatusChange(int memberId, StockManagementProductStatusChangeDto dto)
        {
            var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[ProductStatusChange_Request]", new
            {
                MemberID = memberId,
                dto.ProductID,
                dto.Status,
                dto.ClearanceDiscountPercentage,
                ApplicationID = 103
            }, null, null, CommandType.StoredProcedure);

            return reply.ReadSingleOrDefault<StockManagementProductStatusChangeResponse>();

            //return new StockManagementProductStatusChangeResponse()
            //{
            //    ErrorMessage = reply.ReadSingleOrDefault<string>(),
            //    ErrorNumber = reply.ReadSingleOrDefault<int>()
            //};
        }


        public async Task<SupplierInfoResult> FetchSupplierInfo(PassProductID dto)
        {
            var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[Product_Supplier_Select]", new
            {
                dto.ProductID
            }, null, null, CommandType.StoredProcedure);

            return new SupplierInfoResult()
            {
                JSON = reply.ReadSingleOrDefault<string>(),
                PurchasePriceHistory = reply.Read<SupplierPurchasePriceHistoryRecord>()
            };
        }
    }
}
