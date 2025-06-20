using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;
using SharedEFClasses.Models.IncomingEmail;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public TreatmentInvoiceLinesResult FetchTreatmentInvoiceLines(PassInvoiceSearch objSearch, bool completed)
        {
            var result = new TreatmentInvoiceLinesResult();

            DateTime? fromDt = null;

            switch (objSearch.dateRangeId)
            {
                case 12:
                    fromDt = DateTime.Now.AddYears(-1);
                    break;
                case 6:
                    fromDt = DateTime.Now.AddMonths(-6);
                    break;
                case 1:
                    fromDt = DateTime.Now.AddDays(-DateTime.Now.Day).AddDays(1);
                    break;
                case -1:
                    fromDt = null;
                    break;
            }

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@OrderHeadID", objSearch.orderHeadId ?? (object)DBNull.Value),
                new SqlParameter("@SupplierInvoiceID", objSearch.supplierInvoiceId ?? (object)DBNull.Value),
                new SqlParameter("@FromDT", fromDt ?? (object)DBNull.Value),
                new SqlParameter("@Completed", completed)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[TreatmentLines_SupplierInvoice_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<TreatmentInvoiceLine>(reader).ToList();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }

        public PaintInvoiceLinesResult FetchPaintInvoiceLines(PassInvoiceSearch objSearch, bool completed)
        {
            var result = new PaintInvoiceLinesResult();

            DateTime? fromDt = null;

            switch (objSearch.dateRangeId)
            {
                case 12:
                    fromDt = DateTime.Now.AddYears(-1);
                    break;
                case 6:
                    fromDt = DateTime.Now.AddMonths(-6);
                    break;
                case 1:
                    fromDt = DateTime.Now.AddDays(-DateTime.Now.Day).AddDays(1);
                    break;
                case -1:
                    fromDt = null;
                    break;
            }

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@OrderHeadID", objSearch.orderHeadId ?? (object)DBNull.Value),
                new SqlParameter("@SupplierInvoiceID", objSearch.supplierInvoiceId ?? (object)DBNull.Value),
                new SqlParameter("@FromDT", fromDt ?? (object)DBNull.Value),
                new SqlParameter("@Completed", completed)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[PaintLines_SupplierInvoice_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<PaintInvoiceLine>(reader).ToList();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }

        public FurnitureInvoiceLinesResult FetchFurnitureInvoiceLines(PassInvoiceSearch objSearch, bool completed)
        {
            var result = new FurnitureInvoiceLinesResult();

            DateTime? fromDt = null;

            switch (objSearch.dateRangeId)
            {
                case 12:
                    fromDt = DateTime.Now.AddYears(-1);
                    break;
                case 6:
                    fromDt = DateTime.Now.AddMonths(-6);
                    break;
                case 1:
                    fromDt = DateTime.Now.AddDays(-DateTime.Now.Day).AddDays(1);
                    break;
                case -1:
                    fromDt = null;
                    break;
            }

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@OrderHeadID", objSearch.orderHeadId ?? (object)DBNull.Value),
                new SqlParameter("@SupplierInvoiceID", objSearch.supplierInvoiceId ?? (object)DBNull.Value),
                new SqlParameter("@FromDT", fromDt ?? (object)DBNull.Value),
                new SqlParameter("@Completed", completed)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[FurnitureLines_SupplierInvoice_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<FurnitureInvoiceLine>(reader).ToList();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }

        public async Task<IEnumerable<InvoiceBookingDashboard>> GetInvoiceBookingDashboard(PassInvoiceBookingDashboardParams dto)
        {
            /*
             
                var productPageIds = new DataTable();

                productPageIds.Columns.Add("ProductPageID", typeof(int));

                foreach (var p in dto.ProductPageIDs.Distinct())
                {
                    productPageIds.Rows.Add(p);
                }

                var results = await this.Database.Connection.QueryAsync<string>("[ads].[ProductPageFeed_Download_Excel_Product]", new
                {
                    dto.CountryID,
                    dto.LanguageID,
                    dto.DisplayPrices,
                    dto.UserID,
                    dto.DisplayClearance,
                    dto.TradeAccountCode,
                    productPageIds
                }, null, null, CommandType.StoredProcedure);

             */

            var groupIds = new DataTable();

            groupIds.Columns.Add("I");

            foreach (var g in dto.ActiveDirectoryGroupIDs)
            {
                groupIds.Rows.Add(g);
            }

            var result = await this.Database.Connection.QueryAsync<InvoiceBookingDashboard>("[IncomingEmail].[Dashboard_Select]", new { 
                GroupIDs = groupIds,
                dto.MailboxID,
                dto.BudgetHolderCode,
                dto.SupplierCode,
                dto.From,
                dto.To
            }, null, null, CommandType.StoredProcedure);

            return result;
        }

        public async Task<IncomingEmail_Attachment_ParsedData_SelectResult> IncomingEmail_Attachment_ParsedData_Select(PassAttachmentDetail dto)
        {
            var result = await this.Database.Connection.QuerySingleOrDefaultAsync<IncomingEmail_Attachment_ParsedData_SelectResult>("[IncomingEmail].[Attachment_ParsedData_Select]", new { 
                AttachmentID = dto.AttachmentID
            }, null, null, CommandType.StoredProcedure);

            return result;
        }

        public async Task<Attachment_DuplicateCheck_Result> IncomingEmail_Invoice_DuplicateCheck(PassAttachmentDetail dto)
        {
            var reader = await this.Database.Connection.QueryMultipleAsync("[IncomingEmail].[Invoice_Duplicate_Check]", dto, null, null, CommandType.StoredProcedure);

            return new Attachment_DuplicateCheck_Result()
            {
                Duplicates = await reader.ReadAsync<Attachment_DuplicateCheck_SelectResult>()
            };
        }

        public async Task<int?> IncomingEmail_Attachment_ParsedData_Save(PassAttachmentDetail dto)
        {
            var result = await this.Database.Connection.QuerySingleOrDefaultAsync<int?>("[IncomingEmail].[Attachment_ParsedData_Save]", dto, null, null, CommandType.StoredProcedure);

            return result;
        }

        public async Task<int?> IncomingEmail_Supplier_Save(PassSupplierDetail dto)
        {
            var result = await this.Database.Connection.QuerySingleOrDefaultAsync<int?>("[IncomingEmail].[Email_Supplier_Update]", dto, null, null, CommandType.StoredProcedure);

            return result;
        }

        public async Task<int?> IncomingEmail_Attachment_Submit(PassAttachmentSubmit dto)
        {
            var result = await this.Database.Connection.QuerySingleOrDefaultAsync<int?>("[IncomingEmail].[Invoice_Submit]", dto, null, null, CommandType.StoredProcedure);

            return result;
        }

        public async Task<InvoiceDueDateResult> IncomingEmail_InvoiceDates_Select(PassInvoiceDateParams dto)
        {
            var result = await this.Database.Connection.QuerySingleOrDefaultAsync<InvoiceDueDateResult>("[portal].[InvoiceDates_Select]", dto, null, null, CommandType.StoredProcedure);

            return result;
        }
    }
}