using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models.Mertexer;
using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;
using SharedEFClasses.Models.Fenwick;
using SharedEFClasses.Models.StockManagement;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public async Task<FenwickSelfbillInvoiceResponse> FetchFenwickSelfBillInvoiceEntries(int selfBillInvoiceId)
        {
            var reply = await this.Database.Connection.QueryMultipleAsync("[Fenwicks].[Invoice_Select]", new
            {
                SelfBillInvoiceID = selfBillInvoiceId
            }, null, 300, CommandType.StoredProcedure);

            return new FenwickSelfbillInvoiceResponse()
            {
                RecSummaries = reply.Read<FenwickInvoiceReconciliationSummary>(),
                Invoices = reply.Read<FenwickInvoiceResult>()
            };
        }
    }
}
