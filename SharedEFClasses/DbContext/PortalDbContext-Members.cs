using Microsoft.AspNet.Identity.EntityFramework;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Applications;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.General;
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
        public MemberSearchViewResult MemberSearch(
            PassMemberSearch objMemberSearch
            )
        {
            SqlParameter tradeAccountId = new SqlParameter("@TradeAccountID", (object)objMemberSearch.tradeAccountId ?? DBNull.Value);
            SqlParameter tradeAccountGroupId = new SqlParameter("@TradeAccountGroupID", (object)objMemberSearch.tradeAccountGroupId ?? DBNull.Value);
            SqlParameter searchString = new SqlParameter("@SearchString", (object)objMemberSearch.term ?? DBNull.Value);
            SqlParameter languageId = new SqlParameter("@LanguageID", objMemberSearch.languageId);
            SqlParameter pageNumber = new SqlParameter("@PageNumber", objMemberSearch.pageNumber);
            SqlParameter pageSize = new SqlParameter("@PageSize", objMemberSearch.pageSize);

            var result = new MemberSearchViewResult();

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = @"portal.Member_Search
                    @TradeAccountID,
                    @TradeAccountGroupID,
                    @SearchString,
                    @LanguageID,
                    @PageNumber,
                    @PageSize";

            cmd.Parameters.Add(tradeAccountId);
            cmd.Parameters.Add(tradeAccountGroupId);
            cmd.Parameters.Add(searchString);
            cmd.Parameters.Add(languageId);
            cmd.Parameters.Add(pageNumber);
            cmd.Parameters.Add(pageSize);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                var searchResults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<MemberSearchResult>(reader);

                result.Members = searchResults.ToList();

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

        public bool SubscribeMember(PassMemberSubscribe objSubscribe)
        {
            SqlParameter email = new SqlParameter("@Email", objSubscribe.Email);
            SqlParameter fullName = new SqlParameter("@FullName", (object)objSubscribe.FullName ?? DBNull.Value);
            SqlParameter countryId = new SqlParameter("@CountryID", objSubscribe.CountryID);
            SqlParameter languageId = new SqlParameter("@LanguageID", objSubscribe.LanguageID);
            SqlParameter sourceId = new SqlParameter("@SourceID", objSubscribe.SourceID);
            SqlParameter marketingCountryId = new SqlParameter("@MarketingCountryID", objSubscribe.MarketingCountryID);
            SqlParameter marketingLanguageId = new SqlParameter("@MarketingLanguageID", objSubscribe.MarketingLanguageID);

            var result = false;

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "pub.Member_SubscribeFromFacebook";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add(email);
            cmd.Parameters.Add(fullName);
            cmd.Parameters.Add(countryId);
            cmd.Parameters.Add(languageId);
            cmd.Parameters.Add(sourceId);
            cmd.Parameters.Add(marketingCountryId);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<bool>(reader).Single();
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