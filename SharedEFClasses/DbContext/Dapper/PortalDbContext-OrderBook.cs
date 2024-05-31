using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using SharedEFClasses.Models;
using SharedEFClasses.Models.Mertexer;
using SharedEFClasses.Models.OrderBook;

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Razor.Generator;

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
        public async Task<IEnumerable<OrderBook_PreDefinedSummary_SelectResult>> FetchOrderBookDateSummaries(PassOrderBookBaseParams dto)
        {
            var results = await this.Database.Connection.QueryAsync<OrderBook_PreDefinedSummary_SelectResult>("[portal].[OrderBook_DateSummary_Select]", dto, null, 30, CommandType.StoredProcedure);

            return results;
        }
        
        public async Task<string> FetchOrderBookPreDefinedSummaries(PassOrderBookBaseParams dto)
        {
            var results = await this.Database.Connection.QueryAsync<string>("[portal].[OrderBook_ProblemSummary_Select]", dto, null, 30, CommandType.StoredProcedure);

            var sb = new StringBuilder();

            foreach(var part in results)
            {
                sb.Append(part);
            }

            return sb.ToString();
        }

        public async Task<OrderBook_MainSummary_SelectResult> FetchOrderBookMainSummary(PassOrderBookBaseParams dto)
        {
            var reader = await this.Database.Connection.QueryMultipleAsync("[portal].[OrderBook_MainSummary_Select]", dto, null, 30, CommandType.StoredProcedure);

            return new OrderBook_MainSummary_SelectResult()
            {
                AccurateAsOfDT = await reader.ReadSingleAsync<DateTime>(),
                RowHeadings = await reader.ReadAsync<OrderBook_MainSummary_OrderGroupStockLocation>(),
                ColumnHeadings = await reader.ReadAsync<OrderBook_MainSummary_OrderStatusOrderStatusGroup>(),
                Data = await reader.ReadAsync<OrderBook_MainSummary_DataRow>()
            };
        }

        public async Task<OrderBook_DetailView_SelectResult> FetchOrderBookDetail(string procedureName,  ExpandoObject dto)
        {
            var exclusions = new List<string>()
            {
                "accurateAsOfDateTime",
                "procedure",
                "displayModes",
                "Title",
                "title"
            };

            var dynParams = new DynamicParameters();

            dto.ToList().ForEach(kvp =>
            {
                var key = kvp.Key;

                if (key.EndsWith("Id"))
                {
                    key = System.Text.RegularExpressions.Regex.Replace(key, "(\\w)(.*)(\\w)$", m =>
                    {
                        return $"{m.Groups[1].Value.ToUpperInvariant()}{m.Groups[2].Value}{m.Groups[3].Value.ToUpperInvariant()}";
                    });
                }
                else
                {
                    key = System.Text.RegularExpressions.Regex.Replace(key, "^(\\w)(.*)", m =>
                    {
                        return $"{m.Groups[1].Value.ToUpperInvariant()}{m.Groups[2].Value}";
                    });
                }

                if (!exclusions.Contains(kvp.Key))
                {
                    dynParams.Add(key, kvp.Value);
                }
            });

            //var results = await this.Database.Connection.QueryAsync<string>("[portal].[OrderBook_DetailView_BackOrders]", dynParams, null, 30, CommandType.StoredProcedure);

            //var sb = new StringBuilder();

            //foreach (var part in results)
            //{
            //    sb.Append(part);
            //}

            var reader = await this.Database.Connection.QueryMultipleAsync($"[portal].[OrderBook_DetailView_{procedureName}]", dynParams, null, 30, CommandType.StoredProcedure);

            var accurateDt = await reader.ReadSingleAsync<DateTime>();

            var data = String.Join("", await reader.ReadAsync<string>());

            if (String.IsNullOrEmpty(data))
            {
                data = "[]";
            }

            return new OrderBook_DetailView_SelectResult()
            {
                AccurateAsOfDT = accurateDt,
                Data = JArray.Parse(data)
            };

            //return sb.ToString();
        }
    }
}