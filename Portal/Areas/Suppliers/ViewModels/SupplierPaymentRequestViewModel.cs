using Portal.Areas.CreditControl.ViewModels;

using SharedEFClasses;
using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Portal.Areas.Suppliers.ViewModels
{
	public class SupplierPaymentRequestViewModel : BaseViewModel
	{
		public bool CanUserMakePaymentDecisions { get; set; }

		public SupplierPaymentRequestViewModel(bool canUserMakePaymentDecisions, RoleProperties properties, string applicationHeading, string applicationSubHeading)
			: base(properties,
				   applicationHeading,
				   applicationSubHeading)
		{
			CanUserMakePaymentDecisions = canUserMakePaymentDecisions;
		}

		public static async Task<SupplierPaymentRequestViewModel> CreateAsync(
			int memberId,
			bool canUserApprove,
			RoleProperties properties,
			string applicationHeading,
			string applicationSubHeading)
		{
			var portalDb = new PortalDbContext();

			var result = new SupplierPaymentRequestViewModel(canUserApprove, properties, applicationHeading, applicationSubHeading);

			return result;
		}
	}
}