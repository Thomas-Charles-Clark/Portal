using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Customers;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public CustomerEnquiryViewResult CustomerEnquirySearch(
            int? _tradeAccountId
            )
        {
            if (!_tradeAccountId.HasValue)
            {
                return null;
            }

            SqlParameter tradeAccountId = new SqlParameter("@TradeAccountID", (object)_tradeAccountId ?? DBNull.Value);
            SqlParameter languageId = new SqlParameter("@LanguageID", 1);

            var result = new CustomerEnquiryViewResult();

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = @"portal.Customer_Enquiry
                    @TradeAccountID,
                    @LanguageID";

            cmd.Parameters.Add(tradeAccountId);
            cmd.Parameters.Add(languageId);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                var enquiryResult = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerEnquiryResult>(reader);

                result.CustomerDetails = enquiryResult.Single();

                reader.NextResult();
                
                result.CustomerDetails.Address = ((IObjectContextAdapter)this)
                       .ObjectContext
                       .Translate<CustomerAddress>(reader).SingleOrDefault();

                reader.NextResult();

                result.CustomerDetails.Address.Country = ((IObjectContextAdapter)this)
                       .ObjectContext
                       .Translate<Country>(reader).SingleOrDefault();

                reader.NextResult();

                result.CustomerDetails.Currency = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Currency>(reader).SingleOrDefault();

                reader.NextResult();

                var openOrderCount = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<int>(reader).Single();

                reader.NextResult();

                var orderStatusResult = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerEnquiryOrderStatusResult>(reader);

                result.OrderStatus = orderStatusResult.SingleOrDefault();

                if (result.OrderStatus != null)
                {
                    result.OrderStatus.OpenOrderCount = openOrderCount;
                    result.OrderStatus.LastOrderText = Utilities.PortalFramework.DateTimeDistanceString(result.OrderStatus.LastOrderDate);
                }

                reader.NextResult();

                var openCareRecordCount = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<int>(reader).Single();

                reader.NextResult();

                var careStatusResult = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerEnquiryCareStatusResult>(reader);

                result.CareStatus = careStatusResult.SingleOrDefault();

                if (result.CareStatus != null)
                {
                    result.CareStatus.OpenCareRecordCount = openCareRecordCount;
                    result.CareStatus.LastCareHeadText = Utilities.PortalFramework.DateTimeDistanceString(result.CareStatus.LastCareHeadDate);
                }

                reader.NextResult();

                var taskStatusResult = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerEnquiryTaskStatusResult>(reader);

                result.TaskStatus = taskStatusResult.SingleOrDefault();

                if (result.TaskStatus != null)
                {
                    result.TaskStatus.LastTaskText = Utilities.PortalFramework.DateTimeDistanceString(result.TaskStatus.LastTaskDate);
                }

                result.CustomerDetails.OpenSince = Utilities.PortalFramework.DateTimeDistanceString(result.CustomerDetails.OpenedDate);
                result.CustomerDetails.LastVisit = Utilities.PortalFramework.DateTimeDistanceString(result.CustomerDetails.LastVisitDate);
                result.CustomerDetails.NextVisit = Utilities.PortalFramework.DateTimeDistanceString(result.CustomerDetails.NextVisitDate);
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


        public CustomerVisitViewResult CustomerVisitSearch(
            PassVisitSearch objVisitSearch
            )
        {
            SqlParameter tradeAccountId = new SqlParameter("@TradeAccountID", objVisitSearch.TradeAccountID);
            SqlParameter searchString = new SqlParameter("@SearchString", (object)objVisitSearch.Term ?? DBNull.Value);
            SqlParameter languageId = new SqlParameter("@LanguageID", objVisitSearch.LanguageID);
            
            switch (objVisitSearch.Period)
            {
                case "today":
                    objVisitSearch.To = null;
                    objVisitSearch.From = DateTime.Now.Date;
                    break;

                case "last-30-days":
                    objVisitSearch.To = null;
                    objVisitSearch.From = DateTime.Now.AddDays(-30);
                    break;

                case "last-3-months":
                    objVisitSearch.To = null;
                    objVisitSearch.From = DateTime.Now.AddMonths(-3);
                    break;

                case "last-6-months":
                    objVisitSearch.To = null;
                    objVisitSearch.From = DateTime.Now.AddMonths(-6);
                    break;

                case "all-time":
                    objVisitSearch.To = null;
                    objVisitSearch.From = null;
                    break;

                default:
                    if (objVisitSearch.Period != null)
                    {
                        var year = DateTime.Now.Year;
                        if (Int32.TryParse(objVisitSearch.Period, out year))
                        {
                            // we've parsed a year... what year was it!
                            objVisitSearch.From = new DateTime(year, 1, 1);
                            if (year != DateTime.Now.Year)
                            {
                                objVisitSearch.To = new DateTime(year + 1, 1, 1);
                            }
                        }
                    }
                    break;
            }

            SqlParameter from = new SqlParameter("@From", (object)objVisitSearch.From ?? DBNull.Value);
            SqlParameter to = new SqlParameter("@To", (object)objVisitSearch.To ?? DBNull.Value);

            var result = new CustomerVisitViewResult();

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = @"portal.TradeAccountVisit_Enquiry
                    @TradeAccountID,
                    @SearchString,
                    @From,
                    @To,
                    @LanguageID";

            cmd.Parameters.Add(tradeAccountId);
            cmd.Parameters.Add(searchString);
            cmd.Parameters.Add(from);
            cmd.Parameters.Add(to);
            cmd.Parameters.Add(languageId);

            var attendees = new List<VisitAttendeesResult>();

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                var searchResults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<VisitEnquiryResult>(reader);

                result.Results = searchResults.ToList();

                reader.NextResult();
                var visitAttendees = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<VisitAttendeesResult>(reader);

                attendees = visitAttendees.ToList();
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

            result.Results.ForEach(c => {
                c.Attendees = attendees.Where(p => p.TradeAccountVisitID == c.TradeAccountVisitID).ToList();
            });

            return result;
        }

        public CustomerCareViewResult CustomerCareEnquiry(PassCareSearch objCareSearch)
        {
            var result = new CustomerCareViewResult();

            SqlParameter tradeAccountGroupId = new SqlParameter("@TradeAccountGroupID", objCareSearch.tradeAccountGroupId);
            SqlParameter tradeAccountId = new SqlParameter("@TradeAccountID", objCareSearch.tradeAccountId);
            SqlParameter languageId = new SqlParameter("@LanguageID", objCareSearch.languageId);
            SqlParameter carestatusId = new SqlParameter("@CareStatus", objCareSearch.careStatusId);
            SqlParameter pageNumber = new SqlParameter("@PageNumber", objCareSearch.pageNumber);
            SqlParameter pageSize = new SqlParameter("@PageSize", objCareSearch.pageSize);
            SqlParameter searchString = new SqlParameter("@SearchString", (object)objCareSearch.term ?? DBNull.Value);
            SqlParameter from = new SqlParameter("@From", (object)objCareSearch.from ?? DBNull.Value);
            SqlParameter to = new SqlParameter("@To", (object)objCareSearch.from ?? DBNull.Value);
            SqlParameter productTypeId = new SqlParameter("@ProductTypeID", (object)objCareSearch.productTypeId ?? DBNull.Value);

            switch (objCareSearch.period)
            {
                case "today":
                    objCareSearch.to = null;
                    objCareSearch.from = DateTime.Now.Date;
                    break;

                case "last-30-days":
                    objCareSearch.to = null;
                    objCareSearch.from = DateTime.Now.AddDays(-30);
                    break;

                case "last-3-months":
                    objCareSearch.to = null;
                    objCareSearch.from = DateTime.Now.AddMonths(-3);
                    break;

                case "last-6-months":
                    objCareSearch.to = null;
                    objCareSearch.from = DateTime.Now.AddMonths(-6);
                    break;

                case "all-time":
                    objCareSearch.to = null;
                    objCareSearch.from = null;
                    break;

                default:
                    if (objCareSearch.period != null)
                    {
                        var year = DateTime.Now.Year;
                        if (Int32.TryParse(objCareSearch.period, out year))
                        {
                            // we've parsed a year... what year was it!
                            objCareSearch.from = new DateTime(year, 1, 1);
                            if (year != DateTime.Now.Year)
                            {
                                objCareSearch.to = new DateTime(year + 1, 1, 1);
                            }
                        }
                    }
                    break;
            }

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandText = @"portal.Care_Enquiry";

            cmd.Parameters.Add(tradeAccountGroupId);
            cmd.Parameters.Add(tradeAccountId);
            cmd.Parameters.Add(languageId);
            //cmd.Parameters.Add(carestatusId);
            cmd.Parameters.Add(pageNumber);
            cmd.Parameters.Add(pageSize);
            cmd.Parameters.Add(searchString);
            cmd.Parameters.Add(from);
            cmd.Parameters.Add(to);
            cmd.Parameters.Add(productTypeId);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                var searchResults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CareEnquiryResult>(reader);

                result.Results = searchResults.ToList();

                reader.NextResult();
                result.TotalResultsCount = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<int>(reader).Single();
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



        public CustomerSummaryResult CustomerCareEnquiry(PassTradeAccountID objTradeAccount)
        {
            var result = new CustomerSummaryResult();

            var tradeAccountId = new SqlParameter("@TradeAccountID", objTradeAccount.tradeAccountId);
            
            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandText = @"portal.Customer_Summary";
            
            cmd.Parameters.Add(tradeAccountId);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.CustomerInfo = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerInfo>(reader).Single();

                reader.NextResult();
                reader.NextResult();
                reader.NextResult();
                reader.NextResult();
                reader.NextResult();

                //result.SalesGroupings = ((IObjectContextAdapter)this)
                //    .ObjectContext
                //    .Translate<CustomerSalesGrouping>(reader).ToList();

                //reader.NextResult();

                result.CustomerAddresses = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerSummaryAddress>(reader).ToList();

                reader.NextResult();

                result.CustomerContactsOrderConfirmations = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerSummaryContact>(reader).ToList();

                reader.NextResult();

                result.CustomerContactsMarketing = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerSummaryContact>(reader).ToList();

                reader.NextResult();

                result.CustomerContactsFinancial = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerSummaryContact>(reader).ToList();

                reader.NextResult();

                result.CustomerContactsPricelists = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerSummaryContact>(reader).ToList();

                reader.NextResult();

                result.CustomerContactsOther = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<CustomerSummaryContact>(reader).ToList();
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

            result.CustomerAddresses.ForEach(c => {
                c.Tags = this.TradeAccountAddressTags.Where(p => p.TradeAccountAddressID == c.TradeAccountAddressID).ToList();
            });

            return result;
        }

        public TradeAdminInviteViabilityResult CheckTradeAccountInviteViability(PassTradeAccountID objTradeAccountId)
        {
            var viableTradePriceLists = new List<short>();

            var result = new TradeAdminInviteViabilityResult();

            var account = this.TradeAccounts.Where(p => p.TradeAccountID == objTradeAccountId.tradeAccountId).SingleOrDefault();

            if (account == null)
            {
                // You've done something very wrong here, oh dear.
                result.Viable = false;
                result.UnviabilityReasons.Add($"Trade Account ID {objTradeAccountId.tradeAccountId} was not found!");
                return result;
            }

            try
            {
                this.Database.Connection.Open();

                var tradePriceListCmd = this.Database.Connection.CreateCommand();
                tradePriceListCmd.CommandText = @"
                        SELECT  DISTINCT
                                TPL.TradePriceListID
                        FROM    dbo.TradePriceList AS TPL
                                INNER JOIN dbo.PriceList AS PL ON PL.PriceListID = TPL.PriceListID
                                INNER JOIN dbo.Country AS C ON C.PriceListID = PL.PriceListID
                                INNER JOIN dbo.Country_Language AS CL ON CL.CountryID = C.CountryID
                        WHERE   pub.fnc_DateControl(CL.OnDate,CL.OffDate,SYSDATETIME()) = 1";
                var reader = tradePriceListCmd.ExecuteReader();

                while (reader.Read())
                {
                    if (!reader.IsDBNull(0))
                        viableTradePriceLists.Add(reader.GetInt16(0));
                }
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

            // die early if necessary 
            if (!viableTradePriceLists.Contains(account.TradePriceListID))
            {
                result.Viable = false;
                result.RegistrationStatus = "there is no site set up for this trade account to use yet. Please contact IT Support.";
                result.Email = account.Email;
                result.Name = account.Name;
                return result;
            }

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TradeAccountID", objTradeAccountId.tradeAccountId)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = @"
SELECT X.CountryID,
       X.LanguageID,
       X.Email,
       X.Name,
       X.RegistrationStatus
FROM  (
      SELECT    CL.CountryID,
                CL.LanguageID,
                TA.Email,
                TA.Name,
                CASE WHEN M.TradeAccountID = TA.TradeAccountID AND M.TradeAuthenticationComplete = 1 THEN 'Registration Complete'
                     WHEN M.TradeAccountID = TA.TradeAccountID AND M.TradeAuthEmailSentDT IS NOT NULL AND M.TradeAuthEmailSentDT < M.TradeAuthenticationGUIDExpiryDT THEN 'Registration Pending'
                     WHEN M.TradeAccountID <> TA.TradeAccountID AND M.TradeAuthenticationComplete = 1 THEN 'Email address registered to another account!'
                     ELSE 'Ready to Send Invite'
                     END AS RegistrationStatus,
                ROW_NUMBER() OVER (ORDER BY CASE WHEN TA.LanguageID = CL.LanguageID THEN 0 ELSE 1 END ASC, CL.LanguageID) AS RowNumber
        FROM    dbo.TradeAccount AS TA
                INNER JOIN dbo.TradePriceList AS TPL ON TPL.TradePriceListID = TA.TradePriceListID
                INNER JOIN dbo.PriceList AS PL ON PL.PriceListID = TPL.PriceListID
                INNER JOIN dbo.Country AS C ON C.PriceListID = PL.PriceListID
                INNER JOIN dbo.Country_Language AS CL ON CL.CountryID = C.CountryID
                LEFT OUTER JOIN mbr.Member AS M ON M.Email = TA.Email
        WHERE   TA.TradeAccountID = @TradeAccountID
    ) AS X
WHERE X.RowNumber = 1
";
            cmd.CommandType = CommandType.Text;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    result.CountryID = reader.IsDBNull(0) ? (short?)null : reader.GetInt16(0);
                    result.LanguageID = reader.IsDBNull(1) ? (byte?)null : reader.GetByte(1);
                    result.Email = reader.IsDBNull(2) ? (string)null : reader.GetString(2);
                    result.Name = reader.IsDBNull(3) ? (string)null : reader.GetString(3);
                    result.RegistrationStatus = reader.IsDBNull(4) ? (string)null : reader.GetString(4);
                }
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

            //if (result.RegistrationStatus == "Ready to Send Invite" || result.RegistrationStatus == "Registration Pending")
            //{
            //    result.Viable = true;
            //}

            result.Viable = true;

            return result;
        }


        public InviteToB2BResult TradeAccount_InviteToB2B(PassCustomerInvite objInvite, int editorMemberId, bool sendEmail = false)
        {
            var result = new InviteToB2BResult();

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandText = @"portal.TradeAccount_InviteToB2B";

            cmd.Parameters.AddRange(new SqlParameter[]
            {
                new SqlParameter("@TradeAccountID", objInvite.tradeAccountId),
                new SqlParameter("@Name", objInvite.name),
                new SqlParameter("@Email", objInvite.email),
                new SqlParameter("@SendInvite", sendEmail),
                new SqlParameter("@EditorMemberID", editorMemberId)
            });

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.InitialState = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<B2BInviteInitialState>(reader).Single();

                reader.NextResult();

                result.InviteErrors = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<B2BInviteProblems>(reader).SingleOrDefault();

                reader.NextResult();

                result.EmailParts = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<B2BInviteEmailParts>(reader).SingleOrDefault();
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

        public ResendInviteResult TradeAccountUser_ResendInvite(PassResendB2BInvite objInvite, int editorMemberId)
        {
            var result = new ResendInviteResult();

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandText = @"portal.TradeAccount_User_ResendB2BInvite";

            cmd.Parameters.AddRange(new SqlParameter[]
            {
                new SqlParameter("@MemberID", objInvite.memberId),
                new SqlParameter("@EditorMemberID", editorMemberId)
            });

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ResendInviteResult>(reader).Single();

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

        public ResendInviteResult TradeAccountAdmin_ResendInvite(PassResendB2BInvite objInvite, int editorMemberId)
        {
            var result = new ResendInviteResult();

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandText = @"portal.TradeAccount_Admin_ResendB2BInvite";

            cmd.Parameters.AddRange(new SqlParameter[]
            {
                new SqlParameter("@MemberID", objInvite.memberId),
                new SqlParameter("@EditorMemberID", editorMemberId)
            });

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ResendInviteResult>(reader).Single();
                
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

        public tradeAccountUsersModel CheckTradeAccountUsers(PassTradeAccountID objTradeAccountId, short? countryId, byte? languageId, int? memberId)
        {
            var result = new tradeAccountUsersModel();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TradeAccountID", objTradeAccountId.tradeAccountId),
                new SqlParameter("@MemberID", memberId ?? (object)DBNull.Value),
                new SqlParameter("@CountryID", countryId ?? (object)DBNull.Value),
                new SqlParameter("@LanguageID", languageId ?? (object)DBNull.Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandText = @"mbr.TradeMember_Select";

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.tradeAccountDetail = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<tradeAccountDetail>(reader).FirstOrDefault();

                reader.NextResult();

                result.administrators = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<tradeAccountAdmin>(reader).ToList();

                reader.NextResult();

                result.users = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<tradeAccountUser>(reader).ToList();
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

        public DatabaseJSONResult FetchTradeAccountContactDetails(PassTradeAccountIDs ids)
        {
            var result = new DatabaseJSONResult();

            var dt = new DataTable();

            dt.Columns.Add("TradeAccountID", typeof(int));

            ids.tradeAccountIds.ForEach(tid =>
            {
                dt.Rows.Add(tid);
            });

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@TradeAccountIDs", dt)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[dbo].[TradeAccountIDsTableType]"
                 }
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = @"portal.Customer_ContactDetail_Select";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                var sb = new System.Text.StringBuilder();

                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }

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
    }
}