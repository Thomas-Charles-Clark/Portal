using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;
using SharedEFClasses.Models.OrderBook;
using SharedEFClasses.Models.Orders;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<IEnumerable<BasketItemSplitSelectResult>> FetchBasketItemSplitResults(PassBasketID dto)
        {
            var results = await this.Database.Connection.QueryAsync<BasketItemSplitSelectResult>("[portal].[BasketItem_Split_Select]", dto, null, 30, CommandType.StoredProcedure);

            return results;
        }

        public async Task<long> SplitBasket(PassBasketSplitRequest dto)
        {
            var basketItemIds = new DataTable();

            basketItemIds.Columns.AddRange(new DataColumn[] {
                new DataColumn("I", typeof(long))
            });

            foreach (var bid in dto.BasketItemIDs)
            {
                basketItemIds.Rows.Add(bid);
            }

            var results = await this.Database.Connection.QuerySingleAsync<long>("[portal].[BasketItem_Split_Submit]", new {
                BasketID = dto.BasketID,
                BasketItemIDs = basketItemIds
            }, null, 30, CommandType.StoredProcedure);

            return results;
        }
    }
}
