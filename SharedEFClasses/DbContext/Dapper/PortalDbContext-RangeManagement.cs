using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models.RangeManagement;

using SimpleImpersonation;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Xml.Linq;

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
            var sql = @"EXEC [portal].[RangeManagement_Product_Select] @BranchID, @ProductFilterGroupID, @ProductFilterID, @LaunchID, @BrandID, @StatusGroupID, @StockStatus, @SearchTerm, @SaleStatus;
                EXEC [portal].[RangeManagement_ProductFilterTotals_Select] @BranchID;";

            var searchResults = await this.Database.Connection.QueryAsync<RangeManagementProductSearchRecord>("[portal].[RangeManagement_Product_Select]", new
            {
                dto.BranchID,
                dto.ProductFilterGroupID,
                dto.ProductFilterID,
                dto.LaunchID,
                dto.BrandID,
                dto.StatusGroupID,
                StockStatus = dto.StockStatusCode,
                dto.SearchTerm,
                SaleStatus = dto.SaleStatusCode
            }, null, null, CommandType.StoredProcedure);

            var totalResults = await this.Database.Connection.QueryAsync<RangeManagementProductFilterTotal>("[portal].[RangeManagement_ProductFilterTotals_Select]", new
            {
                dto.BranchID
            }, null, null, CommandType.StoredProcedure);

            return new RangeManagementProductSearchResponse()
            {
                Results = searchResults,
                Totals = totalResults
            };
        }

        public async Task<RangeManagementProductFilterTotal> RangeManagementProductFilterTotal(RangeManagementProductFilterTotalDto dto)
        {
            var results = await this.Database.Connection.QuerySingleAsync<RangeManagementProductFilterTotal>("[portal].[RangeManagement_ProductFilterTotals_Select]", new
            {
                dto.BranchID,
                dto.ProductFilterID
            }, null, null, CommandType.StoredProcedure);

            return results;
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
                StockStatus = dto.AddStockStatusCode,
                dto.SearchTerm,
                SaleStatus = dto.SaleStatusCode
            }, null, null, CommandType.StoredProcedure);

            return new RangeManagementProductSearchResponse()
            {
                Results = reply.Read<RangeManagementProductSearchRecord>()
            };
        }

        public async Task<RangeManagementTransferOrdersResponse> RangeManagementTransferOrders(RangeManagementTransferOrdersDto dto)
        {
            var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[RangeManagement_Transfer_Select]", new
            {
                dto.BranchID,
                dto.TransferDirection
            }, null, null, CommandType.StoredProcedure);

            return new RangeManagementTransferOrdersResponse()
            {
                Results = reply.Read<RangeManagementTransferOrderResult>()
            };
        }

        public async Task<int> RangeManagementTransferOrdersRefresh(RangeManagementTransferOrdersDto dto)
        {
            var reply = await this.Database.Connection.QueryMultipleAsync("[portal].[RangeManagement_Transfer_Refresh]", new
            {
                dto.BranchID
            }, null, null, CommandType.StoredProcedure);

            return 0;
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

        public async Task<IEnumerable<RangeManagementTransferBasketRecord>> RangeManagementBasketSelect(RangeManagementBranchCheckDto dto)
        {
            var reply = await this.Database.Connection.QueryAsync<RangeManagementTransferBasketRecord>("[portal].[RangeManagement_TransferBasket_Select]", new
            {
                dto.BranchID
            }, null, null, CommandType.StoredProcedure);

            return reply;
        }

        public async Task<int> RangeManagementBasketRelease(RangeManagementBranchCheckDto dto)
        {
            var _ = await this.Database.Connection.QueryAsync("[portal].[RangeManagement_TransferBasket_Release]", new
            {
                dto.BranchID
            }, null, null, CommandType.StoredProcedure);

            return 0;
        }

        public async Task<IEnumerable<RangeMangementNote>> RangeManagementFetchNotes(RangeManagementNotesDto dto)
        {
            var results = await this.Database.Connection.QueryAsync<RangeMangementNote>("[portal].[RangeManagement_RangeNote_Select]", new
            {
                dto.BranchID,
                dto.ProductID
            }, null, null, CommandType.StoredProcedure);

            return results;
        }

        public async Task<int> RangeManagementSaveNote(RangeManagementNotesDto dto)
        {
            var _ = await this.Database.Connection.QueryAsync("[portal].[RangeManagement_RangeNote_Add]", new
            {
                dto.BranchID,
                dto.ProductID,
                dto.MemberID,
                dto.Note
            }, null, null, CommandType.StoredProcedure);

            return 0;
        }

        public async Task<int> RangeManagementSendNewSeasonNotification(RangeManagementNotesDto dto)
        {
            var credentials = new UserCredentials("DESIGNERSGUILD\\SQLAgentFileAccess", "34949C02-4677-4711-999C-8E038E26B10F");

            var token = credentials.LogonUser(LogonType.Interactive);

            await WindowsIdentity.RunImpersonated(token, async () =>
            {
                using (var conn = new SqlConnection(ConfigurationManager.ConnectionStrings["VM-SQL-IntegratedConnectionString"].ConnectionString))
                {
                    var _ = await this.Database.Connection.QueryAsync("[portal].[RangeManagement_InventoryNotification_NewSeasonProduct]", new
                    {
                        BranchID = dto.BranchID,
                        MemberID = dto.MemberID
                    }, null, null, CommandType.StoredProcedure);
                }
            });

            return 0;
        }

		public async Task<int> RangeManagementSendCurrentProductsNotification(RangeManagementNotesDto dto)
		{
			var credentials = new UserCredentials("DESIGNERSGUILD\\SQLAgentFileAccess", "34949C02-4677-4711-999C-8E038E26B10F");

			var token = credentials.LogonUser(LogonType.Interactive);

			await WindowsIdentity.RunImpersonated(token, async () =>
			{
				using (var conn = new SqlConnection(ConfigurationManager.ConnectionStrings["VM-SQL-IntegratedConnectionString"].ConnectionString))
				{
					var _ = await this.Database.Connection.QueryAsync("[portal].[RangeManagement_InventoryNotification_CurrentStockedProducts]", new
					{
						dto.BranchID,
						dto.MemberID
					}, null, null, CommandType.StoredProcedure);
				}
			});

			return 0;
		}

		public async Task<int> RangeManagementSendExitingProductsNotification(RangeManagementNotesDto dto)
        {
            var credentials = new UserCredentials("DESIGNERSGUILD\\SQLAgentFileAccess", "34949C02-4677-4711-999C-8E038E26B10F");

            var token = credentials.LogonUser(LogonType.Interactive);

            await WindowsIdentity.RunImpersonated(token, async () =>
            {
                using (var conn = new SqlConnection(ConfigurationManager.ConnectionStrings["VM-SQL-IntegratedConnectionString"].ConnectionString))
                {
                    var _ = await this.Database.Connection.QueryAsync("[portal].[RangeManagement_InventoryNotification_ExitingProducts]", new
                    {
                        BranchID = dto.BranchID,
                        MemberID = dto.MemberID
                    }, null, null, CommandType.StoredProcedure);
                }
            });

            return 0;
        }

        public async Task<int> RangeManagementSendCarryForwardsProductsNotification(RangeManagementNotesDto dto)
        {
            var credentials = new UserCredentials("DESIGNERSGUILD\\SQLAgentFileAccess", "34949C02-4677-4711-999C-8E038E26B10F");

            var token = credentials.LogonUser(LogonType.Interactive);

            await WindowsIdentity.RunImpersonated(token, async () =>
            {
                using (var conn = new SqlConnection(ConfigurationManager.ConnectionStrings["VM-SQL-IntegratedConnectionString"].ConnectionString))
                {
                    var _ = await this.Database.Connection.QueryAsync("[portal].[RangeManagement_InventoryNotification_CarryForwardProduct]", new
                    {
                        BranchID = dto.BranchID,
                        MemberID = dto.MemberID
                    }, null, null, CommandType.StoredProcedure);
                }
            });

            return 0;
        }

        public async Task<XDocument> RangeManagementProductPageFeedExcelXML(RangeManagementXlsxDto dto)
        {
            var productPageIds = new DataTable();

            productPageIds.Columns.Add("ProductPageID", typeof(int));

            foreach (var p in dto.ProductPageIDs.Distinct())
            {
                productPageIds.Rows.Add(p);
            }

            var results = await this.Database.Connection.QueryAsync<string>("[ads].[ProductPageFeed_Download_Excel_Product]", new
            {
                dto.CountryID,
                dto.LanguageID,
                dto.DisplayPrices,
                dto.UserID,
                dto.DisplayClearance,
                dto.TradeAccountCode,
                productPageIds
            }, null, null, CommandType.StoredProcedure);

            return XDocument.Parse(String.Concat(results));
        }
    }
}
