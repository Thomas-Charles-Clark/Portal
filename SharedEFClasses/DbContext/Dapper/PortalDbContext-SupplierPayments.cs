using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;
using SharedEFClasses.Models.Suppliers.PaymentApproval;
using SharedEFClasses.Models.Suppliers.PaymentRequest;
using SharedEFClasses.Models.Suppliers.Payments;
using SharedEFClasses.Models.Translations;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
	{
		public async Task<SupplierPayments_Overview_Dashboard_SelectResult> SupplierPayments_Dashboard_Select(SupplierPayments_Dashboard_SelectDTO dto)
		{
			var results = await this.Database.Connection.QueryMultipleAsync("[payment].[Overview_Dashboard_Select]", dto, null, null, System.Data.CommandType.StoredProcedure);

			return new SupplierPayments_Overview_Dashboard_SelectResult()
			{
				Records = await results.ReadAsync<SupplierPayments_Overview_Dashboard_SelectRecord>(),
			};
		}

		public SupplierPaymentApproval_SelectResult SupplierPayment_Approval_Select(SupplierPaymentApproval_SelectDTO dto)
		{
			var results = this.Database.Connection.QueryMultiple("[payment].[Approval_Select]", new
			{
				dto.MemberID,
				dto.WeekCommencing,
				dto.OnlyShowSuppliersWithPaymentRequests
			}, null, null, System.Data.CommandType.StoredProcedure);

			return new SupplierPaymentApproval_SelectResult()
			{
				SupplierSummaryRecords = results.Read<SupplierPaymentApproval_SupplierSummaryRecord>().ToList(),
				SupplierDetailRecords = results.Read<SupplierPaymentApproval_SupplierDetailRecord>().ToList()
			};
		}

		public SupplierPayments_History_DetailResult SupplierPayment_History_Detail_Select(SupplierPayments_History_Detail_SelectDTO dto)
		{
			var results = this.Database.Connection.QueryMultiple("[payment].[History_Detail_Select]", dto, null, null, System.Data.CommandType.StoredProcedure);

			return new SupplierPayments_History_DetailResult()
			{
				Records = results.Read<SupplierPayments_History_DetailRecord>().ToList()
			};
		}
	}
}
