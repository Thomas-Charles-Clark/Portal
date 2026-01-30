using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;

using SharedEFClasses.Models;
using SharedEFClasses.Models.Suppliers.PaymentApproval;
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
    }
}
