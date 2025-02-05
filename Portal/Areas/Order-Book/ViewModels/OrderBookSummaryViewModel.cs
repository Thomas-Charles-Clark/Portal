using Newtonsoft.Json.Linq;

using Portal.Areas.Press.ViewModels;
using Portal.Models;
using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.OrderBook;

using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Common.CommandTrees;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Portal.Areas.Orders.ViewModels
{
    public class OrderBookSummaryViewModel : BaseViewModel
    {
        public IEnumerable<OrderBook_PreDefinedSummary_SelectResult> DateFilters { get; set; }

        public JArray PreDefinedFilters { get; set; }

        public OrderBook_MainSummary_SelectResult MainResult { get; set; }

        public IEnumerable<OrderLineDetailedStatusGroup_SelectResult> OrderLineDetailedStatusGroups { get; set; }
        
        public IEnumerable<OrderBookPreDefineFilterGroup> PreDefinedFilterGroups { get; set; }

        public OrderBookSummaryViewModel(RoleProperties properties, string applicationHeading, string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {

        }

        public static async Task<OrderBookSummaryViewModel> CreateAsync(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var result = new OrderBookSummaryViewModel(properties, applicationHeading, applicationSubHeading);

            using (var db = new PortalDbContext())
            {
                result.OrderLineDetailedStatusGroups = await db.OrderLineDetailedStatusGroup_Select();
                result.PreDefinedFilterGroups = await db.OrderBookPreDefinedFiltersGroups_Select();
            }

            return result;
        }
    }
}