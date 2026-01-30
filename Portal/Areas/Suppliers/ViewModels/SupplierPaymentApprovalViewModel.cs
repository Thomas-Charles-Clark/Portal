using Portal.Areas.CreditControl.ViewModels;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Suppliers.PaymentApproval;
using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Portal.Areas.Suppliers.ViewModels
{
	public class SupplierPaymentApprovalViewModel : BaseViewModel
	{
		public SupplierPaymentApprovalViewModel(
			RoleProperties properties,
			string applicationHeading, 
			string applicationSubHeading)
			: base(properties,
				   applicationHeading,
				   applicationSubHeading)
		{

		}

		public static async Task<SupplierPaymentApprovalViewModel> CreateAsync(
			int memberId,
			RoleProperties properties,
			string applicationHeading,
			string applicationSubHeading)
		{
			var portalDb = new PortalDbContext();

			var result = new SupplierPaymentApprovalViewModel(properties, applicationHeading, applicationSubHeading);

			return result;
		}
	}
}