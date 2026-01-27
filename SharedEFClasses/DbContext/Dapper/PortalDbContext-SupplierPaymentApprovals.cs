using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;
using SharedEFClasses.Models.Suppliers.PaymentApproval;
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
        public SupplierPaymentApproval_Dashboard_SelectResult SupplierPaymentApproval_Dashboard_Select(SupplierPaymentApproval_Dashboard_SelectDTO dto)
        {
            var results = this.Database.Connection.QueryMultiple("[payment].[Approval_Dashboard_Select]", new
            {
                dto.MemberID,
                dto.WeekCommencing
            }, null, null, System.Data.CommandType.StoredProcedure);

            return new SupplierPaymentApproval_Dashboard_SelectResult()
            {
                SupplierSummaryRecords = results.Read<SupplierPaymentApprovalDashboard_SupplierSummaryRecord>().ToList(),
                SupplierDetailRecords = results.Read<SupplierPaymentApprovalDashboard_SupplierDetailRecord>().ToList()
            };
        }
    }
}
