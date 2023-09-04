using SalesStatistics.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SharedEFClasses.Models;
using Kendo.Mvc.UI;
using System.Web.Http.ModelBinding;
using Kendo.Mvc.Extensions;
using SharedEFClasses.Models.TradeAccounts;
using System.Collections;

namespace SalesStatistics.Controllers
{
    [Authorize]
    public class SalesStatisticsAPIController : ApiController
    {
        private PortalDbContext portalDb { get; set; }
        private SalesStatsDbContext statsDb { get; set; }

        public SalesStatisticsAPIController(PortalDbContext portalDb, SalesStatsDbContext statsDb)
        {
            this.portalDb = portalDb;
            this.statsDb = statsDb;
        }

        [HttpPost]
        public IHttpActionResult FetchTotalsAndQuarterlies([FromBody]PassStatisticsSummary objSummary)
        {
            var quarterlies = statsDb.SalesByQuarter(objSummary);

            var result = new
            {
                TotalSales = statsDb.SalesStatisticsProcedure<TotalSalesResult>(objSummary, "[portal].[CustomerSalesAnalysis_TotalSales]"),
                SalesByQuarterFinancial = quarterlies.Financial,
                SalesByQuarterCalendar = quarterlies.Calendar
            };

            return Ok(result);
        }

        [HttpGet]
        public IHttpActionResult FetchCustomerDashboard([FromUri]PassStatisticsSummary objSummary)
        {
            var result = statsDb.SalesStatisticsProcedure<CustomerDashboardResult>(objSummary, "[portal].[CustomerSalesAnalysis_SalesByCustomerDashboard]");

            return Ok(result);
        }

        [HttpGet]
        public DataSourceResult FetchSalesByArea(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassStatisticsSummary objSummary)
        {
            var result = statsDb.SalesStatisticsProcedure<SalesByAreaResult>(objSummary, "[portal].[CustomerSalesAnalysis_SalesByArea]");

            return result.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public DataSourceResult FetchSalesByCustomer(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request, 
            [FromUri]PassStatisticsSummary objSummary)
        {
            objSummary.PageNumber = request.Page;

            objSummary.PageSize = request.PageSize;
            //    ? null : (int?)request.PageSize;
            //if (objSummary.PageSize == null)
            //    objSummary.PageNumber = null;

            request.Page = 1; // why this is necessary, I'm not entirely sure - I think it tricks the ToDataSourceResult function into 
            // not paging? or... whatever, it causes it to work.

            var results = statsDb.SalesByCustomer(objSummary);

            var dsr = results.Results.AsQueryable().ToDataSourceResult(request);
            
            request.Aggregates.Each(c =>
            {
                c.Aggregates.Each(a =>
                {
                    if (a as Kendo.Mvc.SumFunction != null)
                    {
                        a.MemberType = typeof(decimal);
                    }
                });
            });

            var aggregateOperations = request.Aggregates.ToArray();

            request.Aggregates.Clear();

            // so in here, where we have the need for aggregates coming out of this procedure as a [third]
            // result set (the second being the total row count for the main body of the query)
            // we want to add to the dsr's aggregates object... 
            
            var aggr = new List<Kendo.Mvc.Infrastructure.AggregateResult>();

            foreach (var ao in aggregateOperations)
            {
                var thisTotal = results.Totals.GetType().GetProperty(ao.Member).GetValue(results.Totals, null);

                decimal? value = 0;

                if (thisTotal != null)
                {
                    value = Convert.ToDecimal(thisTotal);
                }

                aggr.Add(new Kendo.Mvc.Infrastructure.AggregateResult(
                        value,
                        1,
                        new Kendo.Mvc.SumFunction()
                        {
                            FunctionName = "Sum",
                            MemberType = typeof(decimal),
                            ResultFormatString = "",
                            Caption = "",
                            SourceField = ao.Member

                        }
                    )
                );
            }
            
            dsr.AggregateResults = aggr;
                
            dsr.Total = results.Totals.TotalRowCount;

            return dsr;
        }
        
        [HttpGet]
        public DataSourceResult FetchCustomerAnalysis(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassCustomerAnalysis objFilters)
        {
            // throws when implementing server-side aggregate functions: Sum is not defined on IQueryable<dynamic>
            // because the delivered objects are dynamic ExpandoObjects, the grid cannot infer their types.

            // or is this simply a lack of definition in the DataSource's schema...
            // nope, that doesn't appear to be the case. 

            objFilters.PageNumber = request.Page;
            objFilters.PageSize = request.PageSize;
            request.Page = 1; // again, random but it causes it to function as expected

            request.Aggregates.Each(c =>
            {
                c.Aggregates.Each(a =>
                {
                    if (a as Kendo.Mvc.SumFunction != null)
                    {
                        a.MemberType = typeof(decimal);
                    }
                });
            });

            var aggregateOperations = request.Aggregates.ToArray();

            request.Aggregates.Clear();

            // so in here, where we have the need for aggregates coming out of this procedure as a [third]
            // result set (the second being the total row count for the main body of the query)
            // we want to add to the dsr's aggregates object... 

            var result = statsDb.CustomerAnalysis(objFilters);

            var dsr = result.Results.AsQueryable().ToDataSourceResult(request);

            var aggr = new List<Kendo.Mvc.Infrastructure.AggregateResult>();

            foreach (var ao in aggregateOperations)
            {
                if (ao.Member == "PeriodTotalValue" || ao.Member == "PeriodTotalCurr" || ao.Member == "PeriodTotalTargetValue" || ao.Member == "PeriodTotalTargetCurr")
                {
                    var thisTotal = result.Totals.Where(p => p.Period == null).SingleOrDefault();
                    
                    var thisTarget = result.Targets.Where(p => p.Period == null).SingleOrDefault();
                    
                    decimal? target = 0;
                    decimal? value = 0;

                    if (thisTotal != null)
                    {
                        value = ao.Member.EndsWith("Value") ? thisTotal?.Value : thisTotal?.ValueCurr;
                        target = ao.Member.EndsWith("Value") ? thisTarget?.Value : thisTarget?.ValueCurr;
                    }

                    aggr.Add(new Kendo.Mvc.Infrastructure.AggregateResult(
                            ao.Member.Contains("Target") ? target : value,
                            1,
                            new Kendo.Mvc.SumFunction()
                            {
                                FunctionName = "Sum",
                                MemberType = typeof(decimal),
                                ResultFormatString = "",
                                Caption = "",
                                SourceField = ao.Member
                            
                            }
                        )
                    );
                }
                else
                {
                    var thisPeriod = Convert.ToInt32(ao.Member
                        .Replace("Period_", "")
                        .Replace("_Value", "")
                        .Replace("_TargetValue", "")
                        .Replace("_Curr", "")
                        .Replace("_TargetCurr", ""));

                    var thisTotal = result.Totals.Where(p => p.Period == thisPeriod).SingleOrDefault();

                    var thisTarget = result.Targets.Where(p => p.Period == thisPeriod).SingleOrDefault();

                    decimal? value = 0;
                    decimal? target = 0;

                    if (thisTotal != null)
                    {
                        value = ao.Member.EndsWith("Value") ? thisTotal.Value : thisTotal.ValueCurr;
                        target = ao.Member.EndsWith("Value") ? thisTarget?.Value : thisTarget?.ValueCurr;
                    }

                    aggr.Add(new Kendo.Mvc.Infrastructure.AggregateResult(
                            ao.Member.Contains("_Target") ? target : value,
                            1,
                            new Kendo.Mvc.SumFunction()
                            {
                                FunctionName = "Sum",
                                MemberType = typeof(decimal),
                                ResultFormatString = "",
                                Caption = "",
                                SourceField = ao.Member
                            
                            }
                        )
                    );
                }
            }

            dsr.AggregateResults = aggr;

            dsr.Total = Convert.ToInt32(result.Totals.Where(p => p.Period == null).Select(p => p.TotalRows).FirstOrDefault());
                
            return dsr;
        }

        [HttpPost]
        public IHttpActionResult SalesMarketSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupZeroMarketFilters objFilters)
        {
            //var data = statsDb.TradeAccountFilters.ToList();

            var data = portalDb.SalesStatisticsFilterSelect(new PassTradeAccountFilterParams() { IncludeArea = false, IncludeCurrency = objFilters.CurrencyDisplay });
            
            var salesMarkets = data.Where(p =>
                (objFilters.SalesAreaID == null || objFilters.SalesAreaID == p.SalesAreaID) &&
                (objFilters.SalesAgentID == null || objFilters.SalesAgentID == p.SalesAgentID) &&
                (objFilters.SalesRepresentativeID == null || objFilters.SalesRepresentativeID == p.SalesRepresentativeID))
                .Select(p => new SalesMarketSlicerTuple
                {
                    Name = p.SalesMarketName,
                    SalesMarketID = p.SalesMarketID,
                    CurrencyID = p.CurrencyID,
                    CurrencyName = p.CurrencyName,
                    CurrencyCode = p.CurrencyCode,
                    FormattingCulture = p.FormattingCulture
                })
                .Distinct()
                .OrderBy(p => p.Name)
                .ToList();
            
            if (objFilters.CurrencyDisplay)
            {
                salesMarkets.ForEach(c => {
                    c.SalesMarketID = c.SalesMarketID;
                    c.Name = $"{c.Name} - {c.CurrencyName}";
                });
            }

            salesMarkets = salesMarkets.Distinct(new SalesMarketTupleComparer()).ToList();

            return Ok(salesMarkets);
        }

        [HttpPost]
        public IHttpActionResult SalesAreaSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupOneFilters objFilters)
        {
            var data = portalDb.TradeAccountFilters.ToList();

            var salesAreas = data.Where(p =>
                (objFilters.SalesMarketID == null || objFilters.SalesMarketID == p.SalesMarketID) &&
                (objFilters.SalesAgentID == null || objFilters.SalesAgentID == p.SalesAgentID) &&
                (objFilters.SalesRepresentativeID == null || objFilters.SalesRepresentativeID == p.SalesRepresentativeID)
            ).Select(p => new { Name = p.SalesAreaName, SalesAreaID = p.SalesAreaID }).Distinct().OrderBy(p => p.Name).ToList();

            return Ok(salesAreas);
        }
        
        [HttpPost]
        public IHttpActionResult SalesRepresentativeSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupOneFilters objFilters)
        {
            var data = portalDb.TradeAccountFilters.ToList();

            var salesRepresentative = data.Where(p =>
                (objFilters.SalesMarketID == null || objFilters.SalesMarketID == p.SalesMarketID) &&
                (objFilters.SalesAreaID == null || objFilters.SalesAreaID == p.SalesAreaID) &&
                (objFilters.SalesAgentID == null || objFilters.SalesAgentID == p.SalesAgentID)
            ).Select(p => new { Name = p.SalesRepresentativeName, SalesRepresentativeID = p.SalesRepresentativeID }).Distinct().OrderBy(p => p.Name).ToList();

            return Ok(salesRepresentative);
        }

        [HttpPost]
        public IHttpActionResult CurrencySlicerEndpoint([FromBody]PassSalesRepMarket objFilters)
        {
            var results = statsDb.SalesStatisticsCurrencies(objFilters);

            return Ok(results.Results);
        }

        [HttpPost]
        public IHttpActionResult SalesRepOrAgentSlicerEndpoint()
        {
            return Ok(new[] {
                new { SalesRepOrAgent = true, Name = "Representative" },
                new { SalesRepOrAgent = false, Name = "Agent" }
                //,
                //new { SalesRepOrAgent = (byte)2, Name = "Either Representative or Agent" },
            });
        }

        
        [HttpPost]
        public IHttpActionResult AccountGroupSlicerEndpoint()
        {
            var data = portalDb.TradeAccountGroups.OrderBy(p => p.Name).ToList();
            
            return Ok(data);
        }
        
        
        [HttpPost]
        public IHttpActionResult BrandSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupTwoFilters objFilters)
        {
            var data = portalDb.Filters_Products.ToList();

            var brands = data.Where(p =>
                (objFilters.ProductGroupID == null || objFilters.ProductGroupID == p.ProductGroupID) &&
                (objFilters.ItemTypeID == null || objFilters.ItemTypeID == p.ItemTypeID) &&
                (objFilters.LaunchID == null || objFilters.LaunchID == p.LaunchID)
            ).Select(p => new { Name = p.BrandName, BrandID = p.BrandID }).Distinct().OrderBy(p => p.Name).ToList();

            return Ok(brands);
        }
        
        [HttpPost]
        public IHttpActionResult ProductGroupSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupTwoFilters objFilters)
        {
            var data = portalDb.Filters_Products.ToList();

            var productGroups = data.Where(p =>
                (objFilters.BrandID == null || objFilters.BrandID == p.BrandID) &&
                (objFilters.ItemTypeID == null || objFilters.ItemTypeID == p.ItemTypeID) &&
                (objFilters.LaunchID == null || objFilters.LaunchID == p.LaunchID)
            ).Select(p => new { Name = p.ProductGroupName, ProductGroupID = p.ProductGroupID }).Distinct().OrderBy(p => p.Name).ToList();

            return Ok(productGroups);
        }

        [HttpPost]
        public IHttpActionResult ItemTypeSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupTwoFilters objFilters)
        {
            var data = portalDb.Filters_Products.ToList();

            var itemTypes = data.Where(p =>
                (objFilters.BrandID == null || objFilters.BrandID == p.BrandID) &&
                (objFilters.ProductGroupID == null || objFilters.ProductGroupID == p.ProductGroupID) &&
                (objFilters.LaunchID == null || objFilters.LaunchID == p.LaunchID)
            ).Select(p => new { Name = p.ItemTypeName, ItemTypeID = p.ItemTypeID }).Distinct().OrderBy(p => p.Name).ToList();

            return Ok(itemTypes);
        }

        [HttpPost]
        public IHttpActionResult LaunchSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupTwoFilters objFilters)
        {
            var data = portalDb.Filters_Products.ToList();

            var launches = data.Where(p =>
                (objFilters.BrandID == null || objFilters.BrandID == p.BrandID) &&
                (objFilters.ProductGroupID == null || objFilters.ProductGroupID == p.ProductGroupID) &&
                (objFilters.ItemTypeID == null || objFilters.ItemTypeID == p.ItemTypeID)
            ).Select(p => new { Name = p.LaunchName, LaunchID = p.LaunchID }).Distinct().OrderByDescending(p => p.LaunchID).ToList();

            return Ok(launches);
        }

        [HttpPost]
        public IHttpActionResult PartnerSlicerEndpoint()
        {
            return Ok(new[] { new { PartnerID = 1, Name = "Pattern Book Scheme" }, new { PartnerID = 2, Name = "Non Pattern Book Scheme" } });
        }

        [HttpPost]
        public IHttpActionResult CustomerTypeSlicerEndpoint()
        {
            var data = portalDb.CustomerTypes.OrderBy(p => p.Name).ToList();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult TagSlicerEndpoint()
        {
            var data = portalDb.Tags.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult StatusSlicerEndpoint()
        {
            return Ok(new[] { new { StatusID = 1, Name = "Open" }, new { StatusID = 2, Name = "Closed" } });
        }
        
        [HttpPost]
        public IHttpActionResult AdvertisingSlicerEndpoint()
        {
            return Ok(new[] 
            { 
                /*new { IncludeAdvertising = true, Name = "Include" }, */
                new { IncludeAdvertising = false, Name = "Exclude" }
            });
        }
    }
}