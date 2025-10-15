using Dapper;

using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Documents;
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
        public int SaveDocumentSend(PassDocumentSend objSearch, int memberId)
        {
            var result = -1;

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@DocumentID", objSearch.DocumentID),
                new SqlParameter("@BasketID", objSearch.BasketID ?? (object)DBNull.Value),
                new SqlParameter("@TransactionID", objSearch.TransactionID ?? (object)DBNull.Value),
                new SqlParameter("@OrderHeadID", objSearch.OrderHeadID ?? (object)DBNull.Value),
                new SqlParameter("@TradeAccountID", objSearch.TradeAccountID ?? (object)DBNull.Value),
                new SqlParameter("@SentByMemberID", memberId),
                new SqlParameter("@To", objSearch.To ?? (object)DBNull.Value),
                new SqlParameter("@ReplyTo", objSearch.ReplyTo ?? (object)DBNull.Value),
                new SqlParameter("@CC", objSearch.CC ?? (object)DBNull.Value),
                new SqlParameter("@BCC", objSearch.BCC ?? (object)DBNull.Value),
                new SqlParameter("@FileAttachments", objSearch.FileAttachments ?? (object)DBNull.Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[DocumentSent_Insert]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteNonQuery();
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

        public DocumentSendHistoryResult FetchDocumentSendHistory(PassDocumentSendFetch objSearch)
        {
            var result = new DocumentSendHistoryResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@DocumentID", objSearch.documentType),
                new SqlParameter("@BasketID", objSearch.basketId ?? (object)DBNull.Value),
                new SqlParameter("@TransactionID", objSearch.transactionId ?? (object)DBNull.Value),
                new SqlParameter("@OrderHeadID", objSearch.orderHeadId ?? (object)DBNull.Value),
                new SqlParameter("@TradeAccountID", objSearch.tradeAccountId ?? (object)DBNull.Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[DocumentSent_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DocumentSend>(reader).ToList();
            }
            catch (SqlException e)
            {
                //PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }

        public async Task<DocumentSentReportResult> FetchDocumentSentReport(PassDocumentSentReportDto dto)
        {
            var results = await this.Database.Connection.QueryMultipleAsync("[portal].[DocumentSent_Report]", new {
                dto.DocumentID,
                dto.Page,
                dto.PageSize,
                dto.SearchString,
                dto.FromDate,
                dto.ToDate,
                dto.SentDTSortDirection,
                dto.TradeAccountID
            }, null, null, CommandType.StoredProcedure);

            return new DocumentSentReportResult()
            {
                DashboardPods = results.Read<DocumentSentReport_Pod>(),
                Records = results.Read<DocumentSentReport_Record>()
            };
        }
    }
}