using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using Microsoft.AnalysisServices.AdomdClient;
using System.Diagnostics;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Applications;
using SharedEFClasses.Models.TradeOrders;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Models.Customers;
using SharedEFClasses.Models.General;
using SharedEFClasses.Utilities;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Orders;
using System.Text;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<SharedEFClasses.Models.Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public ICollection<Application> FetchApplications(int memberId)
        {
            var results = new List<Application>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@MemberID", memberId)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Application_Select]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
        
            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Application>(reader).ToList();

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

            return results;
        }

        public DatabaseJSONResult FetchContactDetails(int tradeAccountId, string departmentInitials)
        {
            var result = new DatabaseJSONResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TradeAccountID", tradeAccountId),
                new SqlParameter("@DepartmentInitials", departmentInitials)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[pub].[DesignersGuildContactDetails_Select]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                var sb = new StringBuilder();

                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }

                reader.Close();

                this.Database.Connection.Close();

                result.JSON = sb.ToString();
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


        /// <summary>
        /// Sends an email via the portal.Email queue
        /// </summary>
        /// <param name="destination">Destination</param>
        /// <param name="cc">CC</param>
        /// <param name="bcc">BCC</param>
        /// <param name="subject">Subject</param>
        /// <param name="body">Body</param>
        /// <param name="emailTemplateId">EmailTemplateID</param>
        /// <param name="emailSourceId">EmailSourceID</param>
        /// <param name="emailTypeId">EmailTemplateID</param>
        /// <returns></returns>
        public long QueueAndSendEmail(
            string destination,
            string subject,
            string body,
            short emailSourceId,
            string cc = null,
            string bcc = null,
            short emailTemplateId = 1,
            short emailTypeId = 2)
        {
            long result = -1;

            try
            {
                var cmd = this.Database.Connection.CreateCommand();

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.CommandText = "[portal].[Email_Insert]";

                cmd.Parameters.AddRange(new SqlParameter[]
                { 
                    new SqlParameter("@To", destination),
                    new SqlParameter("@CC", cc ?? (object)DBNull.Value),
                    new SqlParameter("@BCC", bcc ?? (object)DBNull.Value),
                    new SqlParameter("@Subject", subject),
                    new SqlParameter("@Body", body),
                    new SqlParameter("@EmailTemplateID", emailTemplateId),
                    new SqlParameter("@EmailSourceID", emailSourceId),
                    new SqlParameter("@EmailTypeID", emailTypeId)
                });

                var p = new SqlParameter("@EmailID", DBNull.Value);

                p.Direction = ParameterDirection.Output;
                p.SqlDbType = SqlDbType.BigInt;

                cmd.Parameters.Add(p);

                this.Database.Connection.Open();

                cmd.ExecuteNonQuery();

                result = Convert.ToInt64(p.Value);

                var sendCmd = this.Database.Connection.CreateCommand();

                sendCmd.CommandText = "[portal].[Email_Send]";
                sendCmd.CommandType = CommandType.StoredProcedure;

                sendCmd.Parameters.Add(new SqlParameter("@SingleEmailID", result));

                var sendResult = sendCmd.ExecuteNonQuery();

                this.Database.Connection.Close();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }

            return result;
        }

        public List<ResourceSelect> Resource_Select(byte languageId)
        {
            var results = new List<ResourceSelect>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@LanguageID", languageId)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Resource_Select]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ResourceSelect>(reader).ToList();

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

            return results;
        }
    }
}