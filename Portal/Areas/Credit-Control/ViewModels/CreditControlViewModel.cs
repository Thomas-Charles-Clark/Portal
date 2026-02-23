using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using SharedEFClasses.Models.General;

using SharedEFClasses.Models;

using SharedEFClasses;
using System.Data.Entity;
using SharedEFClasses.Models.Orders;
using DocumentFormat.OpenXml.Wordprocessing;

namespace Portal.Areas.CreditControl.ViewModels
{
    public class CreditControlViewModel : BaseViewModel
    {
        public List<TradeMarketStub> TradeMarkets { get; set; }

        public string CreditControllerCode { get; set; }

	    public List<HoldReason> HoldReasons { get; set; }

		public List<OrderImportSource> OrderImportSources { get; set; }

		public CreditControlViewModel(string creditControllerCode,
            List<HoldReason> holdReasons,
            List<OrderImportSource> orderImportSources,
            RoleProperties properties, string applicationHeading, string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            HoldReasons = holdReasons;
            OrderImportSources = orderImportSources;
            CreditControllerCode = creditControllerCode;
        }

        public static async Task<CreditControlViewModel> CreateAsync(
			List<HoldReason> holdReasons,
			List<OrderImportSource> orderImportSources,
			int memberId,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var portalDb = new PortalDbContext();

            var creditController = await portalDb.CreditControllersLive.FirstOrDefaultAsync(cc => cc.MemberID == memberId);
            
            var result = new CreditControlViewModel(creditController?.Code, 
                holdReasons,
				orderImportSources,
				properties, applicationHeading, applicationSubHeading);

            result.TradeMarkets = portalDb.TradeMarkets.Select(t => new TradeMarketStub()
            {
                TradeMarketID = t.TradeMarketID,
                Name = t.Name
            }).ToList();

            return result;
        }
    }
}