using Portal.Areas.CreditControl.ViewModels;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Suppliers.PaymentApproval;

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
		public SupplierPaymentApproval_Dashboard_SelectResult Dashboard { get; set; }

		public SupplierPaymentApprovalViewModel(
			SupplierPaymentApproval_Dashboard_SelectResult dashboard,
			RoleProperties properties,
			string applicationHeading, 
			string applicationSubHeading)
			: base(properties,
				   applicationHeading,
				   applicationSubHeading)
		{
			Dashboard = dashboard;
		}

		public static async Task<SupplierPaymentApprovalViewModel> CreateAsync(
			int memberId,
			RoleProperties properties,
			string applicationHeading,
			string applicationSubHeading)
		{
			var portalDb = new PortalDbContext();

			var dashboard = portalDb.SupplierPaymentApproval_Dashboard_Select(new SupplierPaymentApproval_Dashboard_SelectDTO()
			{
				MemberID = memberId
			});

			var result = new SupplierPaymentApprovalViewModel(dashboard, properties, applicationHeading, applicationSubHeading);

			return result;
		}
	}
}