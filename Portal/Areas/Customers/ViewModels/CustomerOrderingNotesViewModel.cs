using Portal.Models;
using Portal.Utilities;
using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Customers;
using SharedEFClasses.Models.General;
using SharedEFClasses.Utilities;
using System.Collections.Generic;

namespace Portal.Areas.Customers.ViewModels
{
    public class CustomerOrderingNotesViewModel : BaseViewModel
    {
        public CustomerOrderingNotesViewModel(
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