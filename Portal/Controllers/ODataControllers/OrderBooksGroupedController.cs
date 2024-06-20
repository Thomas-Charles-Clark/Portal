using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Models;
using Microsoft.AspNet.OData;
using SharedEFClasses.Models.Products;
using SharedEFClasses;
using SharedEFClasses.Models.MertexLive;
using SharedEFClasses.Models.OrderBook;
using iTextSharp.text.html.simpleparser;
using Microsoft.AspNet.OData.Query;

namespace Portal.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using SharedEFClasses.Models.TradeAccounts;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<TradeAccount>("TradeAccounts");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [System.Web.Http.Authorize]
    public class OrderBooksGroupedController : BaseODataController
    {
        public OrderBooksGroupedController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/Products
        [EnableQuery(MaxNodeCount = 200)]
        public IQueryable<OrderBookGrouped> GetOrders()
        {
            var preResult = PortalDb.OrderBooks.GroupBy(ob => new { OrderID = ob.OrderID })
                .Select(ob => new
                {
                    OrderID = ob.Key.OrderID,
                    CustomerOrderReference = ob.FirstOrDefault().CustomerOrderReference
                });

            var result = preResult.Select(pr => new OrderBookGrouped  { OrderID = pr.OrderID, CustomerOrderReference = pr.CustomerOrderReference }).AsQueryable();

            return result;
        }

        // GET: odata/Products
        [EnableQuery(MaxNodeCount = 200)]
        public IQueryable<OrderBookGrouped> GetOrdersForOrderBookSummary()
        {
            var preResult = PortalDb.OrderBooks.GroupBy(ob => new { OrderID = ob.OrderID })
                .Select(ob => new
                {
                    OrderID = ob.Key.OrderID,
                    CustomerOrderReference = ob.FirstOrDefault().CustomerOrderReference
                });

            var result = preResult.Select(pr => new OrderBookGrouped { OrderID = pr.OrderID, CustomerOrderReference = pr.CustomerOrderReference }).AsQueryable();

            return result;
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<OrderBookGrouped> OrderValueMapper(string orderId)
        {
            var results = new List<OrderBookGrouped>() {

            };

            var record = PortalDb.OrderBooks.Where(p =>
                p.OrderID == orderId
            ).AsQueryable().FirstOrDefault();

            if (record != null)
            {
                results.Add(new OrderBookGrouped() { OrderID = record.OrderID, CustomerOrderReference = record.CustomerOrderReference });
            }

            return results.AsQueryable();
        }
    }
}
