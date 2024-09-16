using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Products.ViewModels
{
    public class PatternBooksViewModel : BaseViewModel
    {
        public PatternBooksViewModel(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {

        }
    }
}