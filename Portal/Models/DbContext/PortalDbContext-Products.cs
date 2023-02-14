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
        public List<ProductCode_AutocompleteResult> ProductCode_Autocomplete(PassProductCodeAutoComplete objAutocomplete)
        {
            SqlParameter term = new SqlParameter("@Term", objAutocomplete.term);
            SqlParameter priceListId = new SqlParameter("@PriceListID", objAutocomplete.tradePriceListId);
            SqlParameter exactlyRRP = new SqlParameter("@ExactlyRRP", objAutocomplete.exactlyRRP ?? (object)DBNull.Value);
            SqlParameter lessThanRRP = new SqlParameter("@LessThanRRP", objAutocomplete.lessThanRRP ?? (object)DBNull.Value);
            var results = this.Database.SqlQuery<ProductCode_AutocompleteResult>("portal.ProductCode_Autocomplete_Samples @Term, @PriceListID, @ExactlyRRP, @LessThanRRP", term, priceListId, exactlyRRP, lessThanRRP).ToList();
            return results;
        }

        public ProductCode_Autocomplete_AlternativesReturn ProductCode_Autocomplete_Alternatives(string _term, short? _tradePriceListId)
        {
            var result = new ProductCode_Autocomplete_AlternativesReturn();

            SqlParameter term = new SqlParameter("@Term", _term);
            SqlParameter priceListId = new SqlParameter("@TradePriceListID", (object)_tradePriceListId ?? DBNull.Value);

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[ProductCode_Autocomplete_Alternatives] @Term, @TradePriceListID";

            cmd.Parameters.Add(term);
            cmd.Parameters.Add(priceListId);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                var searchResults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductCode_Autocomplete_Alternatives_Result>(reader);

                result.SearchResults = searchResults.ToList();

                reader.NextResult();
                var alternatives = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductCode_AutocompleteResult>(reader);

                result.Alternatives = alternatives.ToList();
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }

        public List<ProductCode_AutocompleteResult> ProductID_Search_Samples(List<int> productIDs, PassSampleRequestProductFilters objFilters)
        {
            var results = new List<ProductCode_AutocompleteResult>();

            SqlParameter termParam = new SqlParameter("@Term", objFilters.term ?? (object)DBNull.Value);
            SqlParameter rrpAParam = new SqlParameter("@RRP_A", objFilters.rrpA ?? (object)DBNull.Value);
            SqlParameter rrpBParam = new SqlParameter("@RRP_B", objFilters.rrpB ?? (object)DBNull.Value);
            SqlParameter rrpOperatorParam = new SqlParameter("@RRP_Operator", objFilters.rrpOperatorId);

            SqlParameter priceListId = new SqlParameter("@TradePriceListID", objFilters.tradePriceListId ?? (object)DBNull.Value);

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[ProductID_Search_Samples]";
            cmd.CommandType = CommandType.StoredProcedure;
            
            DataTable dt = new DataTable();

            dt.Columns.Add("ProductID", typeof(int));

            foreach (var i in productIDs)
            {
                dt.Rows.Add(i);
            }

            SqlParameter productIDsParam = new SqlParameter("@ProductIDs", dt);

            productIDsParam.SqlDbType = SqlDbType.Structured;
            productIDsParam.TypeName = "ProductIDsTableType";

            cmd.Parameters.Add(productIDsParam);
            cmd.Parameters.Add(termParam);
            cmd.Parameters.Add(rrpAParam);
            cmd.Parameters.Add(rrpBParam);
            cmd.Parameters.Add(rrpOperatorParam);
            cmd.Parameters.Add(priceListId);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductCode_AutocompleteResult>(reader).ToList();
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return results;
        }

        public List<KeywordHintResult> SearchTerm_KeywordHint(PassAutocompleteTerm objTerm)
        {
            var result = new List<KeywordHintResult>();

            SqlParameter keyword = new SqlParameter("@Keyword", objTerm.term);
            SqlParameter languageId = new SqlParameter("@LanguageID", (byte)1);

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[pub].[Keyword_Search] @Keyword, @LanguageID";

            cmd.Parameters.Add(keyword);
            cmd.Parameters.Add(languageId);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<KeywordHintResult>(reader).ToList();
                
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }

        public ContractAgreementCheckResult ContractAgreementCheck(PassLoadSPA objLoad)
        {
            var result = new ContractAgreementCheckResult();

            SqlParameter tradeAccountId = new SqlParameter("@TradeAccountID", objLoad.TradeAccountID);
            SqlParameter productId = new SqlParameter("@ProductID", objLoad.ProductID);
            SqlParameter quantity = new SqlParameter("@Quantity", objLoad.Quantity ?? (object)DBNull.Value);

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[ContractAgreement_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add(tradeAccountId);
            cmd.Parameters.Add(productId);
            cmd.Parameters.Add(quantity);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.TradeContractPrices = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ContractAgreementTradeContractPrices>(reader).ToList();

                reader.NextResult();

                result.TradeContractDiscounts = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ContractAgreementTradeContractDiscounts>(reader).ToList();
                
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }
    }
}