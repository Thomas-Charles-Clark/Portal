using SharedEFClasses.Models.Documents;
using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Portal.Areas.TradeAccounts.ViewModels
{
	public class TradeAccountContactsViewModel : BaseViewModel
	{
		public TradeAccountContactsViewModel(RoleProperties properties, string applicationHeading, string applicationSubHeading)
			: base(properties,
				   applicationHeading,
				   applicationSubHeading)
		{

		}

		public static async Task<TradeAccountContactsViewModel> CreateAsync(
			RoleProperties properties,
			string applicationHeading,
			string applicationSubHeading)
		{
			var portalDb = new PortalDbContext();

			var result = new TradeAccountContactsViewModel(properties, applicationHeading, applicationSubHeading);

			return result;
		}
	}
}