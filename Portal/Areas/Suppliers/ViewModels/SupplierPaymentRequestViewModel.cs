using Portal.Areas.CreditControl.ViewModels;

using SharedEFClasses;
using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Portal.Areas.Suppliers.ViewModels
{
	public class SupplierPaymentRequestViewModel : BaseViewModel
	{
		public SupplierPaymentRequestViewModel(RoleProperties properties, string applicationHeading, string applicationSubHeading)
			: base(properties,
				   applicationHeading,
				   applicationSubHeading)
		{

		}

		public static async Task<SupplierPaymentRequestViewModel> CreateAsync(
			int memberId,
			RoleProperties properties,
			string applicationHeading,
			string applicationSubHeading)
		{
			var portalDb = new PortalDbContext();

			var result = new SupplierPaymentRequestViewModel(properties, applicationHeading, applicationSubHeading);

			return result;
		}
	}
}