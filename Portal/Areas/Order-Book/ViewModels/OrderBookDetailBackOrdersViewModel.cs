using Newtonsoft.Json.Linq;

using Portal.Areas.Press.ViewModels;
using Portal.Models;
using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.OrderBook;

using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Portal.Areas.Orders.ViewModels
{
    public class OrderBookDetailBackOrdersViewModel : BaseViewModel
    {
        public ExpandoObject Parameters { get; set; }
        //public OrderBook_DetailView_SelectResult DetailResult { get; set; }

        public OrderBookDetailBackOrdersViewModel(ExpandoObject parameters, RoleProperties properties, string applicationHeading, string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            Parameters = parameters;
        }

        public static async Task<OrderBookDetailBackOrdersViewModel> CreateAsync(
            ExpandoObject objParams,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new OrderBookDetailBackOrdersViewModel(objParams, properties, applicationHeading, applicationSubHeading);

            //using (var db = new PortalDbContext())
            //{
            //    result.DetailResult = await db.FetchOrderBookDetailBackOrders(objParams);
            //}

            return result;
        }
    }
}