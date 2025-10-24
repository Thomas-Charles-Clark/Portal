using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using SharedEFClasses.Models.General;

using SharedEFClasses.Models;

using SharedEFClasses;

namespace Portal.Areas.CreditControl.ViewModels
{
    public class StatementsViewModel : BaseViewModel
    {
        public StatementsViewModel(RoleProperties properties, string applicationHeading, string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {

        }

        public static async Task<StatementsViewModel> CreateAsync(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var portalDb = new PortalDbContext();

            var result = new StatementsViewModel(properties, applicationHeading, applicationSubHeading);

            return result;
        }
    }
}