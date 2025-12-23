using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using SharedEFClasses.Models.General;

using SharedEFClasses.Models;

using SharedEFClasses;
using System.Data.Entity;

namespace Portal.Areas.CreditControl.ViewModels
{
    public class StatementsViewModel : BaseViewModel
    {
        public string CreditControllerCode { get; set; }

        public StatementsViewModel(string creditControllerCode,RoleProperties properties, string applicationHeading, string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            CreditControllerCode = creditControllerCode;
        }

        public static async Task<StatementsViewModel> CreateAsync(
            int memberId,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var portalDb = new PortalDbContext();

            var creditController = await portalDb.CreditControllersLive.FirstOrDefaultAsync(cc => cc.MemberID == memberId);
            
            var result = new StatementsViewModel(creditController?.Code, properties, applicationHeading, applicationSubHeading);

            return result;
        }
    }
}