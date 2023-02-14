using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Portal.Models
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
            catch (Exception ex)
            {
                throw ex;
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
            catch (Exception ex)
            {
                throw ex;
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
            cmd.CommandText = @"portal.Care_Enquiry
                    @TradeAccountGroupID,
                    @TradeAccountID,
                    @LanguageID,
                    @CareStatus,
                    @PageNumber,
                    @PageSize,
                    @SearchString,
                    @From,
                    @To,
                    @ProductTypeID
                    ";

            cmd.Parameters.Add(tradeAccountGroupId);
            cmd.Parameters.Add(tradeAccountId);
            cmd.Parameters.Add(languageId);
            cmd.Parameters.Add(carestatusId);
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
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }
    }
}