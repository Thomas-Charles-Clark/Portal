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

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<ContractManagement_ContractList_SelectResult> ContractManagement_ContractList_Select(ContractPricingDealsDto objDto)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[ContractManagement_ContractList_Select]", new
            {
                objDto.TradeAccountID
            }, null, 60, CommandType.StoredProcedure);

            return new ContractManagement_ContractList_SelectResult()
            {
                TradeAccountContractJSON = results.ReadSingle<string>(),
                TradeAccountGroupContractJSON = results.ReadSingle<string>()
            };
        }

        public async Task<ContractManagement_ContractImpact_SelectResult> ContractManagement_ContractImpact_Select(ContractPricingImpactDto objDto)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[ContractManagement_ContractImpact_Select]", new
            {
                objDto.TradeAccountID,
                objDto.ContractListJSON
            }, null, 60, CommandType.StoredProcedure);

            return new ContractManagement_ContractImpact_SelectResult()
            {
                Results = results.Read<ContractManagement_ContractImpact_Result>()
            };
        }
    }
}
