using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using Newtonsoft.Json;

using SharedEFClasses.Models;
using SharedEFClasses.Models.Mertexer;
using SharedEFClasses.Models.OrderBook;

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
        public async Task<IEnumerable<OrderBook_PreDefinedSummary_SelectResult>> FetchOrderBookDateSummaries(PassOrderBookMainParams dto)
        {
            var results = await this.Database.Connection.QueryAsync<OrderBook_PreDefinedSummary_SelectResult>("[portal].[OrderBook_DateSummary_Select]", dto, null, 30, CommandType.StoredProcedure);

            return results;
        }
        
        public async Task<string> FetchOrderBookPreDefinedSummaries(PassOrderBookMainParams dto)
        {
            var result = await this.Database.Connection.QuerySingleAsync<string>("[portal].[OrderBook_ProblemSummary_Select]", dto, null, 30, CommandType.StoredProcedure);

            return result;
        }

        public async Task<OrderBook_MainSummary_SelectResult> FetchOrderBookMainSummary(PassOrderBookMainParams dto)
        {
            var reader = await this.Database.Connection.QueryMultipleAsync("[portal].[OrderBook_MainSummary_Select]", dto, null, 30, CommandType.StoredProcedure);

            return new OrderBook_MainSummary_SelectResult()
            {
                RowHeadings = await reader.ReadAsync<OrderBook_MainSummary_OrderGroupStockLocation>(),
                ColumnHeadings = await reader.ReadAsync<OrderBook_MainSummary_OrderStatusOrderStatusGroup>(),
                Data = await reader.ReadAsync<OrderBook_MainSummary_DataRow>()
            };
        }
    }
}