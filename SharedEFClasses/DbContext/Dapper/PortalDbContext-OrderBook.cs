using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using SharedEFClasses.Models;
using SharedEFClasses.Models.Mertexer;
using SharedEFClasses.Models.OrderBook;
using SharedEFClasses.Models.Orders;

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
            var MarketIDs = new DataTable();

            MarketIDs.Columns.Add("ID", typeof(byte));

            dto.MarketIDs?.ForEach(mid => MarketIDs.Rows.Add(mid));

            var OrderLineDetailedStatusGroupIDs = new DataTable();

            OrderLineDetailedStatusGroupIDs.Columns.Add("ID", typeof(byte));

            dto.OrderLineDetailedStatusGroupIDs?.ForEach(mid => OrderLineDetailedStatusGroupIDs.Rows.Add(mid));

            var results = await this.Database.Connection.QueryAsync<OrderBook_PreDefinedSummary_SelectResult>("[portal].[OrderBook_DateSummary_Select]",
                new
                {
                    // Hmmm.
                    dto.DataSource,
                    OrderLineDetailedStatusGroupIDs,

                    // Trade Account Filters
                    dto.MarketID,
                    MarketIDs,
                    dto.SalesRepresentativeID,
                    dto.SalesAgentID,
                    dto.SalesAreaID,
                    dto.CountryID,
                    dto.TradeAccountTypeID,
                    dto.TradeAccountGroupID,
                    dto.PaymentTermsID,
                    dto.PaymentTermsTypeID,
                    dto.TradeAccountID,

                    // Order Filters
                    dto.OrderID,
                    dto.OrderTakerCode,
                    dto.StartDate,
                    dto.EndDate,
                    dto.HaulierCode,
                    dto.Allocated,
                    dto.TransactionTypeID,
                    dto.DeliveryType,

                    // Product Filters
                    dto.ProductGroupID,
                    dto.ItemTypeID,
                    dto.BrandID,
                    dto.CollectionID,
                    dto.LaunchID,
                    dto.QualityID,
                    dto.DesignID,
                    dto.SupplierCode,
                    dto.ProductID,
                    dto.ProductStatus,
                }, null, 30, CommandType.StoredProcedure);

            return results;
        }

        public async Task<OrderBook_SalesSummary_Result> FetchOrderBookSalesSummaries(PassOrderBookBaseParams dto)
        {
            var MarketIDs = new DataTable();

            MarketIDs.Columns.Add("ID", typeof(byte));

            dto.MarketIDs?.ForEach(mid => MarketIDs.Rows.Add(mid));

            var OrderLineDetailedStatusGroupIDs = new DataTable();

            OrderLineDetailedStatusGroupIDs.Columns.Add("ID", typeof(byte));

            dto.OrderLineDetailedStatusGroupIDs?.ForEach(mid => OrderLineDetailedStatusGroupIDs.Rows.Add(mid));

            var db = new PortalDbContext();

            var reader = await db.Database.Connection.QueryMultipleAsync("[portal].[OrderBook_SalesSummary_Select]",
                new
                {
                    // Hmmm.
                    dto.DataSource,
                    OrderLineDetailedStatusGroupIDs,

                    // Trade Account Filters
                    dto.MarketID,
                    MarketIDs,
                    dto.SalesRepresentativeID,
                    dto.SalesAgentID,
                    dto.SalesAreaID,
                    dto.CountryID,
                    dto.TradeAccountTypeID,
                    dto.TradeAccountGroupID,
                    dto.PaymentTermsID,
                    dto.PaymentTermsTypeID,
                    dto.TradeAccountID,

                    // Order Filters
                    dto.OrderID,
                    dto.OrderTakerCode,
                    dto.StartDate,
                    dto.EndDate,
                    dto.HaulierCode,
                    dto.Allocated,
                    dto.TransactionTypeID,
                    dto.DeliveryType,

                    // Product Filters
                    dto.ProductGroupID,
                    dto.ItemTypeID,
                    dto.BrandID,
                    dto.CollectionID,
                    dto.LaunchID,
                    dto.QualityID,
                    dto.DesignID,
                    dto.SupplierCode,
                    dto.ProductID,
                    dto.ProductStatus,
                }, null, 30, CommandType.StoredProcedure);

            var allStrings = await reader.ReadAsync<string>();

            var sb = new StringBuilder();

            foreach ( var item in allStrings)
            {
                sb.Append(item);
            }

            return new OrderBook_SalesSummary_Result()
            {
                SalesResult = JArray.Parse(sb.ToString()),
                BlockerResult = await reader.ReadSingleAsync<OrderBook_SalesSummary_BlockerResult>()
            };
        }
        
        public async Task<string> FetchOrderBookPreDefinedSummaries(PassOrderBookBaseParams dto)
        {
            var MarketIDs = new DataTable();

            MarketIDs.Columns.Add("ID", typeof(byte));

            dto.MarketIDs?.ForEach(mid => MarketIDs.Rows.Add(mid));

            var OrderLineDetailedStatusGroupIDs = new DataTable();

            OrderLineDetailedStatusGroupIDs.Columns.Add("ID", typeof(byte));

            dto.OrderLineDetailedStatusGroupIDs?.ForEach(mid => OrderLineDetailedStatusGroupIDs.Rows.Add(mid));

            var db = new PortalDbContext();

            var results = await db.Database.Connection.QueryAsync<string>("[portal].[OrderBook_ProblemSummary_Select]",
                new
                {
                    // Hmmm.
                    dto.DataSource,
                    OrderLineDetailedStatusGroupIDs,

                    // Trade Account Filters
                    dto.MarketID,
                    MarketIDs,
                    dto.SalesRepresentativeID,
                    dto.SalesAgentID,
                    dto.SalesAreaID,
                    dto.CountryID,
                    dto.TradeAccountTypeID,
                    dto.TradeAccountGroupID,
                    dto.PaymentTermsID,
                    dto.PaymentTermsTypeID,
                    dto.TradeAccountID,

                    // Order Filters
                    dto.OrderID,
                    dto.OrderTakerCode,
                    dto.StartDate,
                    dto.EndDate,
                    dto.HaulierCode,
                    dto.Allocated,
                    dto.TransactionTypeID,
                    dto.DeliveryType,

                    // Product Filters
                    dto.ProductGroupID,
                    dto.ItemTypeID,
                    dto.BrandID,
                    dto.CollectionID,
                    dto.LaunchID,
                    dto.QualityID,
                    dto.DesignID,
                    dto.SupplierCode,
                    dto.ProductID,
                    dto.ProductStatus,
                }, null, 30, CommandType.StoredProcedure);

            var sb = new StringBuilder();

            foreach(var part in results)
            {
                sb.Append(part);
            }

            return sb.ToString();
        }

        public async Task<OrderBook_MainSummary_SelectResult> FetchOrderBookMainSummary(PassOrderBookBaseParams dto)
        {
            var MarketIDs = new DataTable();

            MarketIDs.Columns.Add("ID", typeof(byte));

            dto.MarketIDs?.ForEach(mid => MarketIDs.Rows.Add(mid));

            var OrderLineDetailedStatusGroupIDs = new DataTable();

            OrderLineDetailedStatusGroupIDs.Columns.Add("ID", typeof(byte));

            dto.OrderLineDetailedStatusGroupIDs?.ForEach(mid => OrderLineDetailedStatusGroupIDs.Rows.Add(mid));

            var db = new PortalDbContext();

            var reader = await db.Database.Connection.QueryMultipleAsync("[portal].[OrderBook_MainSummary_Select]",
                new
                {
                    // Hmmm.
                    dto.DataSource,
                    OrderLineDetailedStatusGroupIDs,

                    // Trade Account Filters
                    dto.MarketID,
                    MarketIDs,
                    dto.SalesRepresentativeID,
                    dto.SalesAgentID,
                    dto.SalesAreaID,
                    dto.CountryID,
                    dto.TradeAccountTypeID,
                    dto.TradeAccountGroupID,
                    dto.PaymentTermsID,
                    dto.PaymentTermsTypeID,
                    dto.TradeAccountID,

                    // Order Filters
                    dto.OrderID,
                    dto.OrderTakerCode,
                    dto.StartDate,
                    dto.EndDate,
                    dto.HaulierCode,
                    dto.Allocated,
                    dto.TransactionTypeID,
                    dto.DeliveryType,

                    // Product Filters
                    dto.ProductGroupID,
                    dto.ItemTypeID,
                    dto.BrandID,
                    dto.CollectionID,
                    dto.LaunchID,
                    dto.QualityID,
                    dto.DesignID,
                    dto.SupplierCode,
                    dto.ProductID,
                    dto.ProductStatus,
                }, null, 30, CommandType.StoredProcedure);

            return new OrderBook_MainSummary_SelectResult()
            {
                AccurateAsOfDT = await reader.ReadSingleAsync<DateTime>(),
                RowHeadings = await reader.ReadAsync<OrderBook_MainSummary_OrderGroupStockLocation>(),
                ColumnHeadings = await reader.ReadAsync<OrderBook_MainSummary_OrderStatusOrderStatusGroup>(),
                Data = await reader.ReadAsync<OrderBook_MainSummary_DataRow>(),
                Defaults = await reader.ReadSingleAsync<OrderBook_MainSummary_Defaults>()
            };
        }

        public async Task<OrderBook_DetailView_SelectResult> FetchOrderBookDetail(string procedureName, ExpandoObject dto)
        {
            var exclusions = new List<string>()
            {
                "accurateAsOfDateTime",
                "procedure",
                "displayModes",
                "Title",
                "title",
                "View",
                "view",
                "filterable",
                "marketIds",
                "orderLineDetailedStatusGroupIds"
            };

            var marketIdsDataTable = new DataTable();

            marketIdsDataTable.Columns.Add("ID", typeof(byte));

            var marketIds = ((IDictionary<string, object>)dto)["marketIds"] as List<object>;

            marketIds.ForEach(mid => 
            {
                if (Convert.ToByte(mid) != 0)
                {
                    marketIdsDataTable.Rows.Add(Convert.ToByte(mid));
                }
            });

            var orderLineDetailedStatusGroupsIdsDataTable = new DataTable();

            orderLineDetailedStatusGroupsIdsDataTable.Columns.Add("ID", typeof(byte));

            var oldsgids = ((IDictionary<string, object>)dto)["orderLineDetailedStatusGroupIds"] as List<object>;

            oldsgids?.ForEach(mid => orderLineDetailedStatusGroupsIdsDataTable.Rows.Add(mid));

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

            if (marketIdsDataTable.Rows.Count > 0)
            {
                dynParams.Add("@MarketIDs", marketIdsDataTable.AsTableValuedParameter("dbo.TinyIntList"));
            }

            if (orderLineDetailedStatusGroupsIdsDataTable.Rows.Count > 0)
            {
                dynParams.Add("@OrderLineDetailedStatusGroupIDs", orderLineDetailedStatusGroupsIdsDataTable.AsTableValuedParameter("dbo.TinyIntList"));
            }

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

            var columnData = String.Join("", await reader.ReadAsync<string>());

            if (String.IsNullOrEmpty(columnData))
            {
                columnData = "[]";
            }

            return new OrderBook_DetailView_SelectResult()
            {
                AccurateAsOfDT = accurateDt,
                Columns = JArray.Parse(columnData),
                Data = JArray.Parse(data)
            };

            //return sb.ToString();
        }

        public async Task<DateTime> FetchOrderBookAccurateAsAtDT()
        {
            var result = await this.Database.Connection.QuerySingleAsync<DateTime>("[portal].[OrderBook_MainSummary_AccurateAsOfSelect]", null, null, 30, CommandType.StoredProcedure);

            return result;
        }

        public async Task<OrderBookOrderLineInspectResult> FetchOrderBookOrderLineInspect(PassOrderBookOrderLinePopoverFetch dto)
        {
            var reader = await this.Database.Connection.QueryMultipleAsync("[portal].[OrderBook_OrderLine_Inspect]", dto, null, 30, CommandType.StoredProcedure);

            return new OrderBookOrderLineInspectResult()
            {
                Totals = await reader.ReadSingleAsync<OrderBookOrderLineInspectTotal>(),
                Data = await reader.ReadAsync<OrderBookOrderLineInspectData>()
            };
        }

        public async Task<OrderBookRingFenceInspectResult> FetchOrderBookRingFenceInspect(PassOrderBookRingFencePopoverFetch dto)
        {
            var reader = await this.Database.Connection.QueryMultipleAsync("[portal].[OrderBook_RingFence_Inspect]", dto, null, 30, CommandType.StoredProcedure);

            return new OrderBookRingFenceInspectResult()
            {
                Totals = await reader.ReadSingleAsync<OrderBookRingFenceInspectTotal>(),
                Data = await reader.ReadAsync<OrderBookRingFenceInspectData>()
            };
        }

        public async Task<OrderBookSummaryResult> FetchOrderBookOveriew(PassOrderBookBaseParams dto)
        {
            var MarketIDs = new DataTable();

            MarketIDs.Columns.Add("ID", typeof(byte));

            dto.MarketIDs?.ForEach(mid => MarketIDs.Rows.Add(mid));

            var OrderLineDetailedStatusGroupIDs = new DataTable();

            OrderLineDetailedStatusGroupIDs.Columns.Add("ID", typeof(byte));

            dto.OrderLineDetailedStatusGroupIDs?.ForEach(mid => OrderLineDetailedStatusGroupIDs.Rows.Add(mid));

            var db = new PortalDbContext();

            var reader = await db.Database.Connection.QueryMultipleAsync("[portal].[OrderBook_Overview_Select]",
                new
                {
                    // Hmmm.
                    dto.DataSource,
                    OrderLineDetailedStatusGroupIDs,

                    // Trade Account Filters
                    dto.MarketID,
                    MarketIDs,
                    dto.SalesRepresentativeID,
                    dto.SalesAgentID,
                    dto.SalesAreaID,
                    dto.CountryID,
                    dto.TradeAccountTypeID,
                    dto.TradeAccountGroupID,
                    dto.PaymentTermsID,
                    dto.PaymentTermsTypeID,
                    dto.TradeAccountID,

                    // Order Filters
                    dto.OrderID,
                    dto.OrderTakerCode,
                    dto.StartDate,
                    dto.EndDate,
                    dto.HaulierCode,
                    dto.Allocated,
                    dto.TransactionTypeID,
                    dto.DeliveryType,

                    // Product Filters
                    dto.ProductGroupID,
                    dto.ItemTypeID,
                    dto.BrandID,
                    dto.CollectionID,
                    dto.LaunchID,
                    dto.QualityID,
                    dto.DesignID,
                    dto.SupplierCode,
                    dto.ProductID,
                    dto.ProductStatus,
                }, null, 30, CommandType.StoredProcedure);

            return new OrderBookSummaryResult()
            {
                Results = await reader.ReadAsync<OrderBookSummaryRecord>()
            };
        }

        public async Task<OrderBook_SalesSummary_Result> FetchOrderBookSalesExport(PassOrderBookBaseParams dto)
        {
            var MarketIDs = new DataTable();

            MarketIDs.Columns.Add("ID", typeof(byte));

            dto.MarketIDs?.ForEach(mid => MarketIDs.Rows.Add(mid));

            var OrderLineDetailedStatusGroupIDs = new DataTable();

            OrderLineDetailedStatusGroupIDs.Columns.Add("ID", typeof(byte));

            dto.OrderLineDetailedStatusGroupIDs?.ForEach(mid => OrderLineDetailedStatusGroupIDs.Rows.Add(mid));

            var db = new PortalDbContext();

            var reader = await db.Database.Connection.QueryMultipleAsync("[portal].[OrderBook_DetailView_SalesHistory_Export]",
                new
                {
                    // Hmmm.
                    dto.DataSource,
                    OrderLineDetailedStatusGroupIDs,

                    // Trade Account Filters
                    dto.MarketID,
                    MarketIDs,
                    dto.SalesRepresentativeID,
                    dto.SalesAgentID,
                    dto.SalesAreaID,
                    dto.CountryID,
                    dto.TradeAccountTypeID,
                    dto.TradeAccountGroupID,
                    dto.PaymentTermsID,
                    dto.PaymentTermsTypeID,
                    dto.TradeAccountID,

                    // Order Filters
                    dto.OrderID,
                    dto.OrderTakerCode,
                    dto.StartDate,
                    dto.EndDate,
                    dto.HaulierCode,
                    dto.Allocated,
                    dto.TransactionTypeID,
                    dto.DeliveryType,

                    // Product Filters
                    dto.ProductGroupID,
                    dto.ItemTypeID,
                    dto.BrandID,
                    dto.CollectionID,
                    dto.LaunchID,
                    dto.QualityID,
                    dto.DesignID,
                    dto.SupplierCode,
                    dto.ProductID,
                    dto.ProductStatus,
                }, null, 30, CommandType.StoredProcedure);

            var allStrings = await reader.ReadAsync<string>();

            var sb = new StringBuilder();

            foreach (var item in allStrings)
            {
                sb.Append(item);
            }

            return new OrderBook_SalesSummary_Result()
            {
                SalesResult = JArray.Parse(sb.ToString()),
                BlockerResult = null
            };
        }
    }
}