using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Products;
using System.Collections.Generic;

namespace Portal.Areas.Stock.ViewModels
{
    public class RingFenceViewModel : BaseViewModel
    {
        public List<StockLocation> StockLocations { get; set; }
     
        public RingFenceViewModel(
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