using Webtex.Models;
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

namespace Webtex.Controllers
{
    //[Authorize]
    public class WebtexAdminAPIController : ApiController
    {
        private PortalDbContext portalDb { get; set; }
        private WebtexDbContext taggingDb { get; set; }

        public WebtexAdminAPIController(PortalDbContext portalDb, WebtexDbContext statsDb)
        {
            this.portalDb = portalDb;
            this.taggingDb = statsDb;
        }
        
        //[HttpGet]
        //public DataSourceResult TagCustomersSearch(
        //    [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
        //    [FromUri]PassTagCustomersSearch objSearch)
        //{
        //    var results = taggingDb.TagCustomersSearch(objSearch);

        //    return results.Results.AsQueryable().ToDataSourceResult(request);
        //}

        //[HttpPost]
        //public IHttpActionResult SalesMarketSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupOneFilters objFilters)
        //{
        //    var data = taggingDb.TradeAccountFilters.ToList();

        //    var salesMarkets = data.Where(p =>
        //        (objFilters.SalesAreaID == null || objFilters.SalesAreaID == p.SalesAreaID) &&
        //        (objFilters.SalesAgentID == null || objFilters.SalesAgentID == p.SalesAgentID) &&
        //        (objFilters.SalesRepresentativeID == null || objFilters.SalesRepresentativeID == p.SalesRepresentativeID)
        //    ).Select(p => new { Name = p.SalesMarketName, SalesMarketID = p.SalesMarketID }).Distinct().OrderBy(p => p.Name).ToList();

        //    return Ok(salesMarkets);
        //}

        //[HttpPost]
        //public IHttpActionResult SalesAreaSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupOneFilters objFilters)
        //{
        //    var data = taggingDb.TradeAccountFilters.ToList();

        //    var salesAreas = data.Where(p =>
        //        (objFilters.SalesMarketID == null || objFilters.SalesMarketID == p.SalesMarketID) &&
        //        (objFilters.SalesAgentID == null || objFilters.SalesAgentID == p.SalesAgentID) &&
        //        (objFilters.SalesRepresentativeID == null || objFilters.SalesRepresentativeID == p.SalesRepresentativeID)
        //    ).Select(p => new { Name = p.SalesAreaName, SalesAreaID = p.SalesAreaID }).Distinct().OrderBy(p => p.Name).ToList();

        //    return Ok(salesAreas);
        //}

        //[HttpPost]
        //public IHttpActionResult SalesAgentSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupOneFilters objFilters)
        //{
        //    var data = taggingDb.TradeAccountFilters.ToList();

        //    var salesAgents = data.Where(p =>
        //        (p.SalesAgentID != null) &&
        //        (objFilters.SalesMarketID == null || objFilters.SalesMarketID == p.SalesMarketID) &&
        //        (objFilters.SalesAreaID == null || objFilters.SalesAreaID == p.SalesAreaID) &&
        //        (objFilters.SalesRepresentativeID == null || objFilters.SalesRepresentativeID == p.SalesRepresentativeID)
        //    ).Select(p => new { Name = p.SalesAgentName, SalesAgentID = p.SalesAgentID }).Distinct().OrderBy(p => p.Name).ToList();

        //    return Ok(salesAgents);
        //}

        //[HttpPost]
        //public IHttpActionResult SalesRepresentativeSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupOneFilters objFilters)
        //{
        //    var data = taggingDb.TradeAccountFilters.ToList();

        //    var salesRepresentative = data.Where(p =>
        //        (objFilters.SalesMarketID == null || objFilters.SalesMarketID == p.SalesMarketID) &&
        //        (objFilters.SalesAreaID == null || objFilters.SalesAreaID == p.SalesAreaID) &&
        //        (objFilters.SalesAgentID == null || objFilters.SalesAgentID == p.SalesAgentID)
        //    ).Select(p => new { Name = p.SalesRepresentativeName, SalesRepresentativeID = p.SalesRepresentativeID }).Distinct().OrderBy(p => p.Name).ToList();

        //    return Ok(salesRepresentative);
        //}
        
        //[HttpPost]
        //public IHttpActionResult BrandSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupTwoFilters objFilters)
        //{
        //    var data = taggingDb.ProductFilters.ToList();

        //    var brands = data.Where(p =>
        //        (objFilters.ProductGroupID == null || objFilters.ProductGroupID == p.ProductGroupID) &&
        //        (objFilters.ItemTypeID == null || objFilters.ItemTypeID == p.ItemTypeID) &&
        //        (objFilters.LaunchID == null || objFilters.LaunchID == p.LaunchID)
        //    ).Select(p => new { Name = p.BrandName, BrandID = p.BrandID }).Distinct().OrderBy(p => p.Name).ToList();

        //    return Ok(brands);
        //}

        //[HttpPost]
        //public IHttpActionResult ProductGroupSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupTwoFilters objFilters)
        //{
        //    var data = taggingDb.ProductFilters.ToList();

        //    var productGroups = data.Where(p =>
        //        (objFilters.BrandID == null || objFilters.BrandID == p.BrandID) &&
        //        (objFilters.ItemTypeID == null || objFilters.ItemTypeID == p.ItemTypeID) &&
        //        (objFilters.LaunchID == null || objFilters.LaunchID == p.LaunchID)
        //    ).Select(p => new { Name = p.ProductGroupName, ProductGroupID = p.ProductGroupID }).Distinct().OrderBy(p => p.Name).ToList();

        //    return Ok(productGroups);
        //}

        //[HttpPost]
        //public IHttpActionResult ItemTypeSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupTwoFilters objFilters)
        //{
        //    var data = taggingDb.ProductFilters.ToList();

        //    var itemTypes = data.Where(p =>
        //        (objFilters.BrandID == null || objFilters.BrandID == p.BrandID) &&
        //        (objFilters.ProductGroupID == null || objFilters.ProductGroupID == p.ProductGroupID) &&
        //        (objFilters.LaunchID == null || objFilters.LaunchID == p.LaunchID)
        //    ).Select(p => new { Name = p.ItemTypeName, ItemTypeID = p.ItemTypeID }).Distinct().OrderBy(p => p.Name).ToList();

        //    return Ok(itemTypes);
        //}

        //[HttpPost]
        //public IHttpActionResult LaunchSlicerEndpoint([FromBody]PassSalesStatsSlicerGroupTwoFilters objFilters)
        //{
        //    var data = taggingDb.ProductFilters.ToList();

        //    var launches = data.Where(p =>
        //        (objFilters.BrandID == null || objFilters.BrandID == p.BrandID) &&
        //        (objFilters.ProductGroupID == null || objFilters.ProductGroupID == p.ProductGroupID) &&
        //        (objFilters.ItemTypeID == null || objFilters.ItemTypeID == p.ItemTypeID)
        //    ).Select(p => new { Name = p.LaunchName, LaunchID = p.LaunchID }).Distinct().OrderByDescending(p => p.LaunchID).ToList();

        //    return Ok(launches);
        //}

        //[HttpPost]
        //public IHttpActionResult AccountGroupSlicerEndpoint()
        //{
        //    var data = portalDb.TradeAccountGroups.OrderBy(p => p.Name).ToList();
            
        //    return Ok(data);
        //}

        //[HttpPost]
        //public IHttpActionResult PartnerSlicerEndpoint()
        //{
        //    return Ok(new[] { new { PartnerID = 1, Name = "Pattern Book Scheme" }, new { PartnerID = 2, Name = "Non Pattern Book Scheme" } });
        //}

        //[HttpPost]
        //public IHttpActionResult CustomerTypeSlicerEndpoint()
        //{
        //    var data = portalDb.CustomerTypes.OrderBy(p => p.Name).ToList();

        //    return Ok(data);
        //}

        //[HttpPost]
        //public IHttpActionResult TagSlicerEndpoint()
        //{
        //    var data = portalDb.Tags.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList();

        //    return Ok(data);
        //}

        //[HttpPost]
        //public IHttpActionResult StatusSlicerEndpoint()
        //{
        //    //var data = portalDb.OrderStatuses.ToList();

        //    return Ok(new[] { new { StatusID = 1, Name = "Open" }, new { StatusID = 2, Name = "Closed" } });
        //}

        //[HttpPost]
        //public IHttpActionResult SalesRepOrAgentSlicerEndpoint()
        //{
        //    return Ok(new[] {
        //        new { SalesRepOrAgent = (bool?)true, Name = "Sales Rep" },
        //        new { SalesRepOrAgent = (bool?)false, Name = "Sales Agent" },
        //        new { SalesRepOrAgent = (bool?)null, Name = "Both" },
        //    });
        //}

        //[HttpPost]
        //public IHttpActionResult DisplaySlicerEndpoint()
        //{
        //    return Ok(new[] { new { IncludeDisplay = true, Name = "Include" }, new { IncludeDisplay = false, Name = "Exclude" } });
        //}

        //[HttpPost]
        //public IHttpActionResult AdvertisingSlicerEndpoint()
        //{
        //    return Ok(new[] { new { IncludeAdvertising = true, Name = "Include" }, new { IncludeAdvertising = false, Name = "Exclude" } });
        //}

        //[HttpPost]
        //public IHttpActionResult TagCustomers([FromBody]PassCustomersToTag objTagging)
        //{
        //    // we need to go through all the selected trade accounts in this objTagging
        //    objTagging.TradeAccountIDs.ForEach(c => {
        //        var ta = portalDb.TradeAccounts.Where(p => p.TradeAccountID == c).Single();

        //        // find all of those incoming tags which aren't already in the list of tags belonging to this account
        //        var toAdd = objTagging.TagIDs.Except(ta.Tags.Select(p => p.TagID)).ToList();

        //        toAdd.ForEach(tagId => {
        //            ta.Tags.Add(new TradeAccount_Tag() {
        //                TradeAccountID = ta.TradeAccountID,
        //                TagID = tagId
        //            });
        //        });
        //    });

        //    portalDb.SaveChanges();

        //    return Ok(new { });
        //}

        //[HttpPost]
        //public IHttpActionResult RemoveTagsFromCustomers([FromBody]PassCustomersToTag objTagging)
        //{
        //    // we need to go through all the selected trade accounts in this objTagging
        //    objTagging.TradeAccountIDs.ForEach(c =>
        //    {
        //        var ta = portalDb.TradeAccounts.Where(p => p.TradeAccountID == c).Single();

        //        // find all of those incoming tags which aren't already in the list of tags belonging to this account
        //        var toRemove = objTagging.TagIDs.Intersect(ta.Tags.Select(p => p.TagID)).ToList();

        //        toRemove.ForEach(tagId =>
        //        {
        //            var tag = ta.Tags.Where(p => p.TagID == tagId).Single();
        //            ta.Tags.Remove(tag);
        //        });
        //    });

        //    portalDb.SaveChanges();

        //    return Ok(new { });
        //}
    }
}
