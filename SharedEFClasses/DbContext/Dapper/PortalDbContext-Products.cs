using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using Newtonsoft.Json;

using SharedEFClasses.Models.Mertexer;
using SharedEFClasses.Models.MertexLive;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeAccounts;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<string> GetProductMaintenanceFormJsonAsync(int memberId)
        {
            var reader = await this.Database.Connection.ExecuteReaderAsync("[portal].[ProductMaintenance_Form_Select]", new {
                MemberID = memberId,
                ProductTypeID = 1
            }, null, null, System.Data.CommandType.StoredProcedure);

            var sb = new StringBuilder();

            while (reader.Read())
            {
                sb.Append(reader.GetString(0));
            }

            reader.Close();

            return sb.ToString();
        }

        public async Task<string> GetProductMaintenanceFormDataJsonAsync()
        {
            var reader = await this.Database.Connection.ExecuteReaderAsync("[portal].[ProductMaintenance_Data_Select]", new { 
                ProductTypeID = 1,
                DesignID = 1
            }, null, null, System.Data.CommandType.StoredProcedure);

            var sb = new StringBuilder();

            while (reader.Read())
            {
                sb.Append(reader.GetString(0));
            }

            reader.Close();

            return sb.ToString();

//            return @"[
//    {
//        ""schema"": ""Maintenance"",
//        ""name"": ""Design"",
//        ""row"": [
//            {
//                ""designId"": 1,
//                ""code"": ""F1190"",
//                ""name"": ""Mezolla""
//            }
//        ]
//    },
//    {
//        ""schema"": ""Maintenance"",
//        ""name"": ""ProductPage"",
//        ""row"": [
//            {
//                ""productPageId"": 1,
//                ""description"": ""PP Description"",
//                ""heading"": ""PP Heading"",
//                ""subHeading"": ""PP SubHeading""
//            }
//        ]
//    },
//    {
//        ""schema"": ""Maintenance"",
//        ""name"": ""Product"",
//        ""row"": [
//            {
//                ""productId"": 1,
//                ""code"": ""A/BF025/01K"",
//                ""description"": ""LEBLOND KING FLAT SHEET - DUCK-EGG 106 X 118""
//            },
//            {
//                ""productId"": 2,
//                ""code"": ""A/BF025/01Q"",
//                ""description"": ""LEBLOND QUEEN FLAT SHEET - DUCK-EGG 94 X 118""
//            }
//        ]
//    }
//]";
        }

        public async Task<PassGenericFormSaveResponse> SaveGenericProductFormAsync(int userId, PassGenericFormSave objSave)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[DynamicForm_Save]", new {
                MemberID = userId,
                JSON = objSave.json
            }, null, null, System.Data.CommandType.StoredProcedure);

            return new PassGenericFormSaveResponse()
            {
                Success = results.Read<bool>().First(),
                ErrorMessage = results.Read<string>().First(),
                ChangeSummary = results.Read<PassGenericFormSaveChangeSummary>()
            };
        }

        public async Task<IEnumerable<MaintenanceFieldSelectResult>> FieldList_Select()
        {
            return await this.Database.Connection.QueryAsync<MaintenanceFieldSelectResult>("[Maintenance].[FieldList_Select]", null, null, null, System.Data.CommandType.StoredProcedure);
        }

        public async Task<BasketStatusOrderDetail> FetchBasketStatusOrderDetail(FetchOrderDetail objEnquiry)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[BasketStatusCheck_OrderDetails]", new
            {
                objEnquiry.OrderHeadID
            }, null, null, System.Data.CommandType.StoredProcedure);

            return new BasketStatusOrderDetail()
            {
                OrderHead = results.Read<BasketStatusOrderHeadInfo>().FirstOrDefault(),
                OrderLines = results.Read<BasketStatusOrderLineInfo>()
            };
        }

        public async Task<BasketStatusImportDetail> FetchBasketStatusImportDetail(FetchImportDetail objEnquiry)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[BasketStatusCheck_ImportDetails]", new
            {
                objEnquiry.TradeOrderImportFileID
            }, null, null, System.Data.CommandType.StoredProcedure);

            return new BasketStatusImportDetail()
            {
                FileInfo = results.Read<BasketStatusImportFileInfo>().FirstOrDefault()
            };
        }

        public async Task<bool> WaterfallCheck(string waterfallProductCode)
        {
            return await this.Database.Connection.QuerySingleAsync<bool>("[portal].[PremadeWaterfall_Check]", new
            {
                WaterfallProductCode = waterfallProductCode
            }, null, null, System.Data.CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<Supplier>> SupplierList(SharedEFClasses.Models.Orders.PassProductCode objProductCode)
        {
            return await this.Database.Connection.QueryAsync<Supplier>("[portal].[Supplier_SelectByProductCode]", new
            {
                ProductCode = objProductCode.code
            }, null, null, System.Data.CommandType.StoredProcedure);
        }

        public async Task<DuplicateLineCheckResult> OrderLineDuplicateCheck(string tradeDataSourceJson, PassDuplicateLineCheck objCheck)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[OrderLine_DuplicateCheck]", new
            {
                TradeDataSourceJson = tradeDataSourceJson,
                LineReference = objCheck.lineReference,
                ProductCode = objCheck.productCode,
                Quantity = objCheck.quantity
            }, null, null, System.Data.CommandType.StoredProcedure);

            var result = new DuplicateLineCheckResult()
            {
                orderNumbers = results.Read<string>().ToList()
            };

            return result;
        }

        public async Task<DuplicateLineCheckResult> OrderReferenceDuplicateCheck(string tradeDataSourceJson, PassOrderReference objCheck)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[OrderReference_DuplicateCheck]", new
            {
                TradeDataSourceJson = tradeDataSourceJson,
                OrderReference = objCheck.OrderReference
            }, null, null, System.Data.CommandType.StoredProcedure);

            var result = new DuplicateLineCheckResult()
            {
                orderNumbers = results.Read<string>().ToList()
            };

            return result;
        }
    }
}
