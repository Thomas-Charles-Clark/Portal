using SharedEFClasses.Models.Products;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class ProductFilterGroupResponse
    {
        public IEnumerable<ProductFilterGroup> ProductFilterGroups { get; set; }
        public IEnumerable<ProductFilter> ProductFilters { get; set; }

        public ProductFilterGroupResponse(
            IEnumerable<ProductFilterGroup> productFilterGroups,
            IEnumerable<ProductFilter> productFilters)
        {
            ProductFilterGroups = productFilterGroups;
            ProductFilters = productFilters;
        }
    }
}
