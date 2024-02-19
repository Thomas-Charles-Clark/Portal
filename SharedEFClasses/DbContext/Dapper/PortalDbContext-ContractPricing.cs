using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SharedEFClasses.Models.ContractPricing;
using System.Data;
using Dapper;
using Newtonsoft.Json;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<ContractManagement_ContractList_SelectResult> ContractManagement_ContractList_Select(ContractPricingDealsDto dto)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[ContractManagement_ContractList_Select]", new
            {
                dto.TradeAccountID
            }, null, 60, CommandType.StoredProcedure);

            return new ContractManagement_ContractList_SelectResult()
            {
                TradeAccountContractJSON = results.ReadSingle<string>(),
                TradeAccountGroupContractJSON = results.ReadSingle<string>()
            };
        }

        public async Task<ContractManagement_ContractImpact_SelectResult> ContractManagement_ContractImpact_Select(ContractPricingImpactDto dto)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[ContractManagement_ContractImpact_Select]", new
            {
                dto.TradeAccountID,
                dto.ContractListJSON,
                dto.LaunchID,
                dto.BrandID,
                dto.ProductGroupID,
                dto.ItemTypeID,
                dto.CollectionID,
                dto.SearchTerm
            }, null, 60, CommandType.StoredProcedure);

            return new ContractManagement_ContractImpact_SelectResult()
            {
                Results = results.Read<ContractManagement_ContractImpact_Result>()
            };
        }

        public async Task<ContractManagement_SalesData_SelectResult> ContractManagement_SalesData_Select(ContractPricingSalesDataDto dto)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[ContractManagement_SalesData_Select]", new
            {
                dto.tradeAccountId,
                productListJson = JsonConvert.SerializeObject(new { dto.productId }),
                qualityListJson = JsonConvert.SerializeObject(new { dto.qualityId })
            }, null, 60, CommandType.StoredProcedure);

            return new ContractManagement_SalesData_SelectResult()
            {
                ProductResults = results.Read<ContractManagement_SalesData_ProductResult>(),
                QualityResults = results.Read<ContractManagement_SalesData_QualityResult>()
            };
        }

        public async Task<ContractManagement_QualitySearch_SelectResult> ContractManagement_Quality_Search(ContractPricingQualityProductSearchDto dto)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[ContractManagement_Quality_Search]", new
            {
                dto.tradeAccountId,
                dto.launchId,
                dto.brandId, 
                dto.productGroupId,
                dto.itemTypeId,
                dto.collectionId,
                dto.searchTerm
            }, null, 60, CommandType.StoredProcedure);

            return new ContractManagement_QualitySearch_SelectResult()
            {
                Results = results.Read<ContractManagement_QualitySearch_Result>()
            };
        }

        public async Task<ContractManagement_ProductSearch_SelectResult> ContractManagement_Product_Search(ContractPricingQualityProductSearchDto dto)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[ContractManagement_Product_Search]", new
            {
                dto.tradeAccountId,
                dto.launchId,
                dto.brandId,
                dto.productGroupId,
                dto.itemTypeId,
                dto.collectionId,
                dto.searchTerm
            }, null, 60, CommandType.StoredProcedure);

            return new ContractManagement_ProductSearch_SelectResult()
            {
                Results = results.Read<ContractManagement_ProductSearch_Result>()
            };
        }

        public async Task<ContractManagement_Contract_MergeResult> ContractManagement_Contract_Merge(ContractPricingMergeDto dto)
        {
            var contractDiscounts = new DataTable();

            contractDiscounts.Columns.AddRange(new DataColumn[] {
                new DataColumn("ProductID", typeof(int)),
                new DataColumn("QualityID", typeof(short)),
                new DataColumn("BrandID", typeof(byte)),
                new DataColumn("ItemTypeID", typeof(short)),
                new DataColumn("ProductGroupID", typeof(byte)),
                new DataColumn("QuantityBreak", typeof(decimal)),
                new DataColumn("Discount", typeof(decimal)),
            });

            foreach (var r in dto.ContractDiscounts)
            {
                contractDiscounts.Rows.Add(r.ProductID, r.QualityID, r.BrandID, r.ItemTypeID, r.ProductGroupID, r.QuantityBreak, r.Discount);
            }

            var contractPrices = new DataTable();

            contractPrices.Columns.AddRange(new DataColumn[] {
                new DataColumn("ProductID", typeof(int)),
                new DataColumn("QualityID", typeof(short)),
                new DataColumn("QuantityBreak", typeof(decimal)),
                new DataColumn("Price", typeof(decimal))
            });

            foreach (var r in dto.ContractPrices)
            {
                contractPrices.Rows.Add(r.ProductID, r.QualityID,r.QuantityBreak, r.Price);
            }

            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[ContractManagement_Contract_Merge]", new
            {
                dto.TradeAccountID,
                dto.TradeAccountGroupID,
                dto.MemberID,
                dto.OnDate,
                dto.OffDate,
                contractDiscounts,
                contractPrices
            }, null, 60, CommandType.StoredProcedure);

            var result = results.ReadSingle<ContractManagement_Contract_MergeResult>();

            return result;
        }
    }
}
