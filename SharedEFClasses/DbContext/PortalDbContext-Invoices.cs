using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;
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
    }
}