using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;
using SharedEFClasses.Models.Suppliers.PaymentRequest;
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
        public SupplierPaymentRequest_Dashboard_SelectResult SupplierPaymentRequest_Dashboard_Select(SupplierPaymentRequest_Dashboard_SelectDTO dto)
        {
            var results = this.Database.Connection.QueryMultiple("[payment].[Dashboard_Select]", new
            {
                MemberID = dto.MemberID,
                WeekcommencingOverride = dto.WeekCommencingOverride
            }, null, null, System.Data.CommandType.StoredProcedure);

            return new SupplierPaymentRequest_Dashboard_SelectResult()
            {
                WeekCommencingRecord = results.ReadSingle<SupplierPaymentRequestDashboard_WeekCommencingRecord>(),
                RequestedTotals = results.Read<SupplierPaymentRequestDashboard_RequestedTotal>().ToList(),
                ApprovedTotals = results.Read<SupplierPaymentRequestDashboard_ApprovedTotal>().ToList()
            };
        }
    }
}
