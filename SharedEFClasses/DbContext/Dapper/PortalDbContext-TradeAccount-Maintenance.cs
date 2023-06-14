using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Products;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Unity.Interception.Utilities;

using UPSShippingWebService.Classes;

namespace SharedEFClasses.Models
{
    /*
        
        USE Flock;
		UPDATE paint.OrderHead SET LockedByMemberID = NULL, LockedDT = NULL;
        UPDATE paint.OrderLine SET MixingSessionID = NULL;
        GO
        DELETE FROM paint.MixingSession;
        GO
        DBCC CHECKIDENT ('paint.MixingSession', RESEED, 0);
        GO

     */

    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<string> GetTradeAccountMaintenanceFormJsonAsync(int memberId, string tradeAccountCode)
        {
            var reader = await this.Database.Connection.ExecuteReaderAsync("[portal].[ProductMaintenance_Form_Select]", new
            {
                MemberID = memberId,
                TradeAccountCode = tradeAccountCode
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
            var reader = await this.Database.Connection.ExecuteReaderAsync("[portal].[ProductMaintenance_Data_Select]", new
            {
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
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[DynamicForm_Save]", new
            {
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

    }
}