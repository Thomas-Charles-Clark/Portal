using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.StockManagement;

using System.Collections.Generic;
using System.Linq;

namespace Portal.Areas.Stock.ViewModels
{
    public class RangeManagementViewModel : BaseViewModel
    {
        public IEnumerable<StockLocation> StockLocations { get; set; }

        public RangeManagementViewModel(
            List<StockLocation> sls,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            StockLocations = sls;
        }
    }
}