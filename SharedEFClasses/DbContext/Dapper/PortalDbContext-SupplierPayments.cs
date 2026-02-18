using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;
using SharedEFClasses.Models.Suppliers.PaymentApproval;
using SharedEFClasses.Models.Suppliers.PaymentApprovals;
using SharedEFClasses.Models.Suppliers.PaymentRequest;
using SharedEFClasses.Models.Suppliers.PaymentRequests;
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
		public async Task<SupplierPaymentRequest_SelectResult> SupplierPayment_Request_Select(SupplierPaymentRequest_SelectDTO dto)
		{
			var results = await this.Database.Connection.QueryMultipleAsync("[payment].[Request_Select]", dto, null, null, System.Data.CommandType.StoredProcedure);

			return new SupplierPaymentRequest_SelectResult()
			{
				Records = await results.ReadAsync<SupplierPaymentRequest_SelectRecord>(),
			};
		}

		public async Task<SupplierPayments_Dashboard_SelectResult> SupplierPayments_Dashboard_Select(SupplierPayments_Dashboard_SelectDTO dto)
		{
			var results = await this.Database.Connection.QueryMultipleAsync("[payment].[Dashboard_Select]", new { 
				dto.PeriodID
			}, null, null, System.Data.CommandType.StoredProcedure);

			return new SupplierPayments_Dashboard_SelectResult()
			{
				Records = await results.ReadAsync<SupplierPayments_Dashboard_SelectRecord>(),
				PeriodMessage = await results.ReadSingleOrDefaultAsync<SupplierPayments_Dashboard_PeriodMessage>()
			};
		}

		public SupplierPaymentApproval_SelectResult SupplierPayment_Approval_Select(SupplierPaymentApproval_SelectDTO dto)
		{
			var results = this.Database.Connection.QueryMultiple("[payment].[Approval_Select]", dto, null, null, System.Data.CommandType.StoredProcedure);

			return new SupplierPaymentApproval_SelectResult()
			{
				SupplierSummaryRecords = results.Read<SupplierPaymentApproval_SupplierSummaryRecord>().ToList(),
				SupplierDetailRecords = results.Read<SupplierPaymentApproval_SupplierDetailRecord>().ToList(),
				NewCollectionProductHeadings = results.Read<SupplierPaymentApproval_NewCollectionProductHeadings>().Single()
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

		public SupplierPayments_History_SummaryResult SupplierPayment_History_Summary_Select(SupplierPayments_History_Summary_SelectDTO dto)
		{
			var results = this.Database.Connection.QueryMultiple("[payment].[History_Summary_Select]", dto, null, null, System.Data.CommandType.StoredProcedure);

			return new SupplierPayments_History_SummaryResult()
			{
				Records = results.Read<SupplierPayments_History_SummaryRecord>().ToList()
			};
		}

		public bool SupplierPayment_Period_Initialise(SupplierPayments_Period_InitialiseDTO dto)
		{
			var results = this.Database.Connection.Query("payment.Period_Initialise", dto,
				null, true, 30, CommandType.StoredProcedure);

			return true;
		}

		public async Task<SupplierPaymentApproval_Basket_SelectResult> SupplierPayment_Approval_Basket_Select(SupplierPaymentApproval_Basket_SelectDTO dto)
		{
			var reader = await this.Database.Connection.QueryMultipleAsync("[payment].[Approval_Basket_Select]", dto, null, null, System.Data.CommandType.StoredProcedure);

			return new SupplierPaymentApproval_Basket_SelectResult()
			{
				Records = await reader.ReadAsync<SupplierPaymentApproval_Basket_SelectRecord>()
			};
		}

		public async Task<SupplierPayment_Decision_FinaliseRecord> SupplierPayment_Payment_Decision_Finalise(SupplierPaymentApproval_Payment_Decision_FinaliseDTO dto)
		{
			var result = await this.Database.Connection.QuerySingleAsync<SupplierPayment_Decision_FinaliseRecord>("[payment].[Payment_Decision_Finalise]", new { 
				PeriodID = dto.PeriodID
			}, null, null, System.Data.CommandType.StoredProcedure);

			return result;
		}

		public async Task<SupplierPayments_SupplierResult> SupplierPayment_Supplier_Select(SupplierPayments_Supplier_SelectDTO dto)
		{
			var results = this.Database.Connection.QueryMultiple("[payment].[Supplier_Select]", dto, null, 60, System.Data.CommandType.StoredProcedure);

			return new SupplierPayments_SupplierResult()
			{
				Records = results.Read<SupplierPayments_SupplierRecord>().ToList()
			};
		}
	}
}
