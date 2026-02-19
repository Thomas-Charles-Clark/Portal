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
		public bool MustInitialiseClientModelInPartial { get; set; }

		public TradeAccountContactsViewModel(RoleProperties properties, string applicationHeading, string applicationSubHeading,
			bool mustInitialiseClientModelInPartial = false)
			: base(properties,
				   applicationHeading,
				   applicationSubHeading)
		{
			MustInitialiseClientModelInPartial = mustInitialiseClientModelInPartial;
		}

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
		public static async Task<TradeAccountContactsViewModel> CreateAsync(
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
			RoleProperties properties,
			string applicationHeading,
			string applicationSubHeading,
			bool mustInitialiseClientModelInPartial = false)
		{
			var portalDb = new PortalDbContext();

			var result = new TradeAccountContactsViewModel(properties, applicationHeading, applicationSubHeading, mustInitialiseClientModelInPartial);

			return result;
		}
	}
}