using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Mertexer;
using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Unity.Interception.Utilities;

using UPSShippingWebService.Classes;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<SampleOrderConfirmationTextResult> FetchSampleOrderConfirmationTopText(PassTradeAccountID dto)
        {
            var result = await this.Database.Connection.QuerySingleAsync<SampleOrderConfirmationTextResult>("[portal].[TradeAccount_SampleOrderConfirmationText_Select]", dto, null, 300, CommandType.StoredProcedure);

            return result;
        }
    }
}