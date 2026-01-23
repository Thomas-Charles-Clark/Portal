using Portal.Areas.CreditControl.ViewModels;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Suppliers.PaymentRequest;

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
		public SupplierPaymentRequest_Dashboard_SelectResult Dashboard { get; set; }

		public SupplierPaymentRequestViewModel(
			SupplierPaymentRequest_Dashboard_SelectResult dashboard,
			RoleProperties properties,
			string applicationHeading, 
			string applicationSubHeading)
			: base(properties,
				   applicationHeading,
				   applicationSubHeading)
		{
			Dashboard = dashboard;
		}

		public static async Task<SupplierPaymentRequestViewModel> CreateAsync(
			int memberId,
			RoleProperties properties,
			string applicationHeading,
			string applicationSubHeading)
		{
			var portalDb = new PortalDbContext();

			var dashboard = portalDb.SupplierPaymentRequest_Dashboard_Select(new SupplierPaymentRequest_Dashboard_SelectDTO()
			{
				MemberID = memberId
			});

			var result = new SupplierPaymentRequestViewModel(dashboard, properties, applicationHeading, applicationSubHeading);

			return result;
		}
	}
}