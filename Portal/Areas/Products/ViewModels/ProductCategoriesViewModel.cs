using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Products.ViewModels
{
    public class ProductCategoriesViewModel : BaseViewModel
    {
        public List<Mertex_ProductType> Mertex_ProductTypes { get; set; }
        public List<CodeDescriptionCount> MertexProductGroups { get; set; }
        public List<CodeDescriptionCount> MertexItemTypes { get; set; }

        public ProductCategoriesViewModel(
            List<CodeDescriptionCount> mpgs,
            List<CodeDescriptionCount> mits,
            List<Mertex_ProductType> mpts,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            Mertex_ProductTypes = mpts;
            MertexProductGroups = mpgs;
            MertexItemTypes = mits;
        }
    }
}