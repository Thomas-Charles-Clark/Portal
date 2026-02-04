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
		public bool UserMayAdministrate { get; set; }

		public SupplierPayments_Dashboard_SelectResult Dashboard { get; set; }

		public SupplierPaymentsViewModel(
			bool userMayAdministrate,
			RoleProperties properties,
			string applicationHeading, 
			string applicationSubHeading)
			: base(properties,
				   applicationHeading,
				   applicationSubHeading)
		{
			UserMayAdministrate = userMayAdministrate;
		}

		public static async Task<SupplierPaymentsViewModel> CreateAsync(
			int userId,
			bool userMayAdministrate,
			RoleProperties properties,
			string applicationHeading,
			string applicationSubHeading)
		{
			var result = new SupplierPaymentsViewModel(userMayAdministrate, properties, applicationHeading, applicationSubHeading);

			var now = DateTime.Now;

			var startOfWeek = now.StartOfWeek(DayOfWeek.Monday);

			var periodId = Convert.ToInt32($"{startOfWeek:yyyyMMdd}");

			var dto = new SupplierPayments_Dashboard_SelectDTO() 
			{ 
				MemberID = userId,
				PeriodID = periodId
			};

			result.Dashboard = await new PortalDbContext().SupplierPayments_Dashboard_Select(dto);

			return result;
		}
	}
}