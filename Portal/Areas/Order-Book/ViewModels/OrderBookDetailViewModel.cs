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
    public class OrderBookDetailViewModel : BaseViewModel
    {
        public string ProcedureName { get; set; }
        public ExpandoObject Parameters { get; set; }
        //public OrderBook_DetailView_SelectResult DetailResult { get; set; }

        public OrderBookDetailViewModel(ExpandoObject parameters, RoleProperties properties, string applicationHeading, string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            Parameters = parameters;
        }

        public static async Task<OrderBookDetailViewModel> CreateAsync(
            string procedureName,
            ExpandoObject objParams,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new OrderBookDetailViewModel(objParams, properties, applicationHeading, applicationSubHeading);

            //if (!String.IsNullOrEmpty(procedureName))
            //using (var db = new PortalDbContext())
            //{
            //    result.DetailResult = await db.FetchOrderBookDetail(procedureName, objParams);
            //}

            return result;
        }
    }
}