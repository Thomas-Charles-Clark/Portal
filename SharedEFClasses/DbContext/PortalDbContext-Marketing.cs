using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Marketing;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public MarketingMessagesSearchResult MarketingMessagesSearch(PassMarketingMessagesSearch objSearch)
        {
            var result = new MarketingMessagesSearchResult();

            //SqlParameter searchString = new SqlParameter("@SearchString", objLeadSearch.term ?? (object)DBNull.Value);
            //SqlParameter countryId = new SqlParameter("@CountryID", objLeadSearch.countryId);
            //SqlParameter leadStatusId = new SqlParameter("@LeadStatusID", objLeadSearch.status ?? (object)DBNull.Value);

            //SqlParameter leadSourceId = new SqlParameter("@LeadSourceID", objLeadSearch.leadSourceId ?? (object)DBNull.Value);
            //SqlParameter sourceMemberId = new SqlParameter("@SourceMemberID", objLeadSearch.createdBy?.MemberID ?? (object)DBNull.Value);
            //SqlParameter ownerMemberId = new SqlParameter("@OwnerMemberID", objLeadSearch.assignedTo?.MemberID ?? (object)DBNull.Value);
            //SqlParameter memberTypeId = new SqlParameter("@MemberTypeID", objLeadSearch.memberTypeId ?? (object)DBNull.Value);

            switch (objSearch.Period)
            {
                case "today":
                    objSearch.To = null;
                    objSearch.From = DateTime.Now.Date;
                    break;

                case "last-30-days":
                    objSearch.To = null;
                    objSearch.From = DateTime.Now.AddDays(-30);
                    break;

                case "last-3-months":
                    objSearch.To = null;
                    objSearch.From = DateTime.Now.AddMonths(-3);
                    break;

                case "last-6-months":
                    objSearch.To = null;
                    objSearch.From = DateTime.Now.AddMonths(-6);
                    break;

                case "all-time":
                    objSearch.To = null;
                    objSearch.From = null;
                    break;

                default:
                    if (objSearch.Period != null)
                    {
                        var year = DateTime.Now.Year;
                        if (Int32.TryParse(objSearch.Period, out year))
                        {
                            // we've parsed a year... what year was it!
                            objSearch.From = new DateTime(year, 1, 1);
                            if (year != DateTime.Now.Year)
                            {
                                objSearch.To = new DateTime(year + 1, 1, 1);
                            }
                        }
                    }
                    break;
            }

            SqlParameter searchTerm = new SqlParameter("@SearchTerm", (object)objSearch.SearchTerm ?? DBNull.Value);
            SqlParameter from = new SqlParameter("@From", (object)objSearch.From ?? DBNull.Value);
            SqlParameter to = new SqlParameter("@To", (object)objSearch.To ?? DBNull.Value);
            
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[MarketingMessage_Search]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add(searchTerm);
            cmd.Parameters.Add(from);
            cmd.Parameters.Add(to);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                var searchResults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<MarketingMessageRecord>(reader);

                result.Results = searchResults.ToList();

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