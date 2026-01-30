using Portal.Areas.CreditControl.ViewModels;
using Portal.Utilities;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Suppliers.PaymentRequest;
using SharedEFClasses.Models.Suppliers.Payments;
using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Portal.Areas.Suppliers.ViewModels
{
	public class SupplierPaymentsViewModel : BaseViewModel
	{
		public SupplierPayments_Overview_Dashboard_SelectResult Dashboard { get; set; }

		public SupplierPaymentsViewModel(
			RoleProperties properties,
			string applicationHeading, 
			string applicationSubHeading)
			: base(properties,
				   applicationHeading,
				   applicationSubHeading)
		{

		}

		public static async Task<SupplierPaymentsViewModel> CreateAsync(
			int userId,
			RoleProperties properties,
			string applicationHeading,
			string applicationSubHeading)
		{
			var result = new SupplierPaymentsViewModel(properties, applicationHeading, applicationSubHeading);

			var dto = new SupplierPayments_Dashboard_SelectDTO() 
			{ 
				MemberID = userId,
				WeekCommencing = DateTime.Now.StartOfWeek(DayOfWeek.Monday)
			};

			result.Dashboard = await new PortalDbContext().SupplierPayments_Dashboard_Select(dto);

			return result;
		}
	}
}