using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Maintenance;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.Samples;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Xml;
using System.Xml.Linq;

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public List<ProductCode_Autocomplete_Samples_Result> ProductCode_Autocomplete_Samples(PassProductCodeAutoComplete objAutocomplete)
        {
            try
            {
                SqlParameter term = new SqlParameter("@Term", objAutocomplete.term);
                SqlParameter priceListId = new SqlParameter("@PriceListID", objAutocomplete.tradePriceListId);
                SqlParameter exactlyRRP = new SqlParameter("@ExactlyRRP", objAutocomplete.exactlyRRP ?? (object)DBNull.Value);
                SqlParameter lessThanRRP = new SqlParameter("@LessThanRRP", objAutocomplete.lessThanRRP ?? (object)DBNull.Value);
                SqlParameter productTypeId = new SqlParameter("@ProductTypeID", objAutocomplete.productTypeId ?? (object)DBNull.Value);
                var results = this.Database.SqlQuery<ProductCode_Autocomplete_Samples_Result>("portal.ProductCode_Autocomplete_Samples @Term, @PriceListID, @ExactlyRRP, @LessThanRRP, @ProductTypeID", term, priceListId, exactlyRRP, lessThanRRP, productTypeId).ToList();
                return results;
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
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
                    .Translate<ProductCode_Autocomplete_Samples_Result>(reader);

                result.Alternatives = alternatives.ToList();
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

        public List<ProductCode_Autocomplete_Samples_Result> ProductID_Search_Samples(PassSampleRequestProductFilters objFilters)
        {
            var results = new List<ProductCode_Autocomplete_Samples_Result>();

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[ProductID_Search_Samples]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(new SqlParameter[]
            {
                new SqlParameter("@StockStatusID", objFilters.StockStatusID ?? (object)DBNull.Value),
                new SqlParameter("@ItemTypeID", objFilters.ItemTypeID ?? (object)DBNull.Value),
                new SqlParameter("@ProductGroupID", objFilters.ProductGroupID ?? (object)DBNull.Value),
                new SqlParameter("@BrandID", objFilters.BrandID ?? (object)DBNull.Value),
                new SqlParameter("@ColourID", objFilters.ColourID ?? (object)DBNull.Value),
                new SqlParameter("@PatternID", objFilters.PatternID ?? (object)DBNull.Value),
                new SqlParameter("@LaunchID", objFilters.LaunchID ?? (object)DBNull.Value),

                new SqlParameter("@Term", objFilters.term ?? (object)DBNull.Value),
                new SqlParameter("@RRP_A", objFilters.rrpA ?? (object)DBNull.Value),
                new SqlParameter("@RRP_B", objFilters.rrpB ?? (object)DBNull.Value),
                new SqlParameter("@RRP_Operator", objFilters.rrpOperatorId),
                new SqlParameter("@TradePriceListID", objFilters.tradePriceListId)
            });

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductCode_Autocomplete_Samples_Result>(reader).ToList();
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

        public List<Product> ProductSearch_Autocomplete(PassProductSearchAutocompleteFilters objFilters)
        {
            try
            {
                var results = new List<Product>();

                // With thanks. Faced this exact problem:
                // https://stackoverflow.com/questions/54903321/json-serializer-tries-to-access-a-entityframework-context-that-is-long-gone-for
                this.Configuration.LazyLoadingEnabled = false;
                // and that was the perfect answer. Yay!

                using (var spt = new StoredProcedureTranslator<PortalDbContext>(this))
                {
                    var parameters = new SqlParameter[]
                    {
                    new SqlParameter("@ProductGroupID", objFilters.ProductGroupID ?? (object)DBNull.Value),
                    new SqlParameter("@ProductGroupID2", objFilters.ProductGroupID2 ?? (object)DBNull.Value),
                    new SqlParameter("@ItemTypeID", objFilters.ItemTypeID ?? (object)DBNull.Value),
                    new SqlParameter("@SearchTerm", objFilters.SearchTerm ?? (object)DBNull.Value)
                    };

                    results = spt.Translate<Product>("[portal].[ProductCode_Autocomplete]", parameters)
                        .Include<ProductGroup>()
                        .ToList();
                }

                return results;
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public List<ProductFilter_ItemTypeSelect> ItemTypeSelect(PassProductSearch objSearch)
        {
            var results = new List<ProductFilter_ItemTypeSelect>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@ProductFilterID", objSearch.productFilterId ?? (object)DBNull.Value),
                new SqlParameter("@ProductFilterGroupID", objSearch.productFilterGroupId ?? (object)DBNull.Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[ItemType_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductFilter_ItemTypeSelect>(reader).ToList();
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

        public List<ProductFilter_StockSelect> ProductStockFilterSelect(PassProductSearchFilter objFilter)
        {
            var results = new List<ProductFilter_StockSelect>();

            //var parameters = new SqlParameter[]
            //{
            //    new SqlParameter("@TradeAccountID", objFilter.tradeAccountId),
            //    new SqlParameter("@LaunchID", objFilter.launchId ?? (object)DBNull.Value),
            //    new SqlParameter("@Clearance", objFilter.clearance ?? (object)DBNull.Value),
            //    new SqlParameter("@New", objFilter.searchNew),
            //};

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[StockFilter_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            //cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductFilter_StockSelect>(reader).ToList();
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

        public FilterButtonSelectResult FetchProductSearchFilters(PassProductSearchFilter objFilter)
        {
            var result = new FilterButtonSelectResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TradeAccountID", objFilter.tradeAccountId),
                new SqlParameter("@Lifecycle", objFilter.clearance ?? (object)DBNull.Value),
                new SqlParameter("@ApplicationID", objFilter.applicationId ?? (object)DBNull.Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[ProductFilter_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.CurrentSet = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductFilter_SelectResult>(reader).ToList();

                reader.NextResult();

                result.CompleteSet = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductFilter_SelectResult>(reader).ToList();
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

        public ProductSearchResultWrapper ProductSearch(PassProductSearch objSearch)
        {
            var result = new ProductSearchResultWrapper();

            if (objSearch?.collectionId != null)
            {
                objSearch.searchTerm = null;
            }

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@Widget", objSearch?.widget?.Value ?? (object)DBNull.Value),
                new SqlParameter("@LaunchID", objSearch?.launchId ?? (object)DBNull.Value),
                new SqlParameter("@SearchString", objSearch?.searchTerm ?? (object)DBNull.Value),
                new SqlParameter("@BrandID", objSearch?.brandId ?? (object)DBNull.Value),
                //new SqlParameter("@ProductTypeID", objSearch?.productTypeId ?? (object)DBNull.Value),
                //new SqlParameter("@ProductTypeGroupID", objSearch?.productTypeGroupId ?? (object)DBNull.Value),
                //new SqlParameter("@ProductGroupID", objSearch?.productGroupId ?? (object)DBNull.Value),
                new SqlParameter("@ProductFilterGroupID", objSearch?.widget?.ProductFilterGroupID ?? (object)DBNull.Value),
                new SqlParameter("@ItemTypeID", objSearch?.itemTypeId ?? (object)DBNull.Value),
                new SqlParameter("@StockFilterID", objSearch?.stockFilterId ?? (object)DBNull.Value),
                new SqlParameter("@Lifecycle", objSearch?.clearance ?? (object)DBNull.Value),
                new SqlParameter("@New", objSearch?.searchNew),
                new SqlParameter("@TradeAccountID", objSearch?.tradeAccountId ?? (object)DBNull.Value),
                new SqlParameter("@CollectionID", objSearch?.collectionId ?? (object)DBNull.Value),
                new SqlParameter("@Metric", objSearch?.metric ?? (object)DBNull.Value),
                new SqlParameter("@ColourID", objSearch?.colourId ?? (object)DBNull.Value),
                new SqlParameter("@PatternID", objSearch?.patternId ?? (object)DBNull.Value),
                new SqlParameter("@MartindaleID", objSearch?.martindaleId ?? (object)DBNull.Value),
                new SqlParameter("@WideWidth", objSearch?.wideWidth ?? (object)DBNull.Value),
                new SqlParameter("@SortOrder", objSearch?.sortOrder ?? (object)DBNull.Value),
                new SqlParameter("@SizeID", objSearch?.sizeId ?? (object)DBNull.Value),
                new SqlParameter("@PageSize", objSearch?.pageSize ?? (object)DBNull.Value),
                new SqlParameter("@PriceOperator", objSearch?.priceOperator ?? (object)DBNull.Value),
                new SqlParameter("@PriceMin", objSearch?.priceMin ?? (object)DBNull.Value),
                new SqlParameter("@PriceMax", objSearch?.priceMax ?? (object)DBNull.Value),
                new SqlParameter("@StockOperator", objSearch?.stockOperator ?? (object)DBNull.Value),
                new SqlParameter("@Stock", objSearch.stock ?? (object)DBNull.Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Product_Search]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductSearchResult>(reader).ToList();
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

            if (objSearch.widget?.Value == "PatternBook")
            {
                cmd.CommandText = "[portal].[PatternBookSaturation_Select]";

                parameters = new List<SqlParameter>()
                {
                    new SqlParameter("@TradeAccountID", objSearch?.tradeAccountId ?? (object)DBNull.Value),
                    new SqlParameter("@BrandID", objSearch?.brandId ?? (object)DBNull.Value),
                    new SqlParameter("@LaunchID", objSearch?.launchId ?? (object)DBNull.Value),
                    new SqlParameter("@ProductFilterID", objSearch?.widget?.ProductFilterID ?? (object)DBNull.Value),
                    new SqlParameter("@Lifestyle", objSearch?.clearance ?? (object)DBNull.Value),
                    new SqlParameter("@New", objSearch.searchNew)
                };

                cmd.Parameters.Clear();

                cmd.Parameters.AddRange(parameters.ToArray());

                try
                {
                    this.Database.Connection.Open();
                    // Run the sproc 
                    var reader = cmd.ExecuteReader();

                    result.PatternBookSaturation = ((IObjectContextAdapter)this)
                        .ObjectContext
                        .Translate<PatternBookSaturation>(reader).ToList();
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
            }

            return result;
        }

        public DownloadSearchResultWrapper DownloadSearch(PassProductSearch objSearch)
        {
            var result = new DownloadSearchResultWrapper();

            if (objSearch?.collectionId != null)
            {
                objSearch.searchTerm = null;
            }

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@Widget", objSearch?.widget?.Value ?? (object)DBNull.Value),
                new SqlParameter("@LaunchID", objSearch?.launchId ?? (object)DBNull.Value),
                new SqlParameter("@SearchString", objSearch?.searchTerm ?? (object)DBNull.Value),
                new SqlParameter("@BrandID", objSearch?.brandId ?? (object)DBNull.Value),
                //new SqlParameter("@ProductTypeID", objSearch?.productTypeId ?? (object)DBNull.Value),
                //new SqlParameter("@ProductTypeGroupID", objSearch?.productTypeGroupId ?? (object)DBNull.Value),
                //new SqlParameter("@ProductGroupID", objSearch?.productGroupId ?? (object)DBNull.Value),
                new SqlParameter("@ProductFilterGroupID", objSearch?.widget?.ProductFilterGroupID ?? (object)DBNull.Value),
                new SqlParameter("@ItemTypeID", objSearch?.itemTypeId ?? (object)DBNull.Value),
                new SqlParameter("@StockFilterID", objSearch?.stockFilterId ?? (object)DBNull.Value),
                new SqlParameter("@Lifecycle", objSearch?.clearance ?? (object)DBNull.Value),
                new SqlParameter("@New", objSearch?.searchNew),
                new SqlParameter("@TradeAccountID", objSearch?.tradeAccountId ?? (object)DBNull.Value),
                new SqlParameter("@CollectionID", objSearch?.collectionId ?? (object)DBNull.Value),
                new SqlParameter("@Metric", objSearch?.metric ?? (object)DBNull.Value),
                new SqlParameter("@ColourID", objSearch?.colourId ?? (object)DBNull.Value),
                new SqlParameter("@PatternID", objSearch?.patternId ?? (object)DBNull.Value),
                new SqlParameter("@MartindaleID", objSearch?.martindaleId ?? (object)DBNull.Value),
                new SqlParameter("@WideWidth", objSearch?.wideWidth ?? (object)DBNull.Value),
                new SqlParameter("@SortOrder", objSearch?.sortOrder ?? (object)DBNull.Value),
                new SqlParameter("@SizeID", objSearch?.sizeId ?? (object)DBNull.Value),
                new SqlParameter("@Page", objSearch?.page ?? 1),
                new SqlParameter("@PageSize", objSearch?.pageSize ?? (object)DBNull.Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Download_Search]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            var images = new List<DownloadSearchImageResult>();

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.ResultCount = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<int>(reader).Single();

                reader.NextResult();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DownloadSearchResult>(reader).ToList();

                reader.NextResult();

                images = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DownloadSearchImageResult>(reader).ToList();
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

            result.Results.ForEach(c =>
            {
                c.Images = images.Where(p => p.ProductPageID == c.ProductPageID && p.ProductFilterID == c.ProductFilterID).OrderBy(p => p.SortOrder).ToList();
            });

            return result;
        }


        public List<QuickDisplay_Result> ProductSearchQuickDisplay(PassProductSearchFilter objFilter)
        {
            var results = new List<QuickDisplay_Result>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@LaunchID", objFilter.launchId ?? (object)DBNull.Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[QuickDisplay_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<QuickDisplay_Result>(reader).ToList();
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

        public QuickDisplayProductSelectResult QuickDisplay_Select(PassQuickDisplayProductSelect objFilter)
        {
            var result = new QuickDisplayProductSelectResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@QuickDisplayID", objFilter.QuickDisplayID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[QuickDisplay_Product_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.Products = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductSearchResult>(reader).ToList();

                reader.NextResult();

                result.Quantities = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<QuickDisplayProductQuantity>(reader).ToList();
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

        public Product_TechInfo_Result FetchTechInfo(PassProductID objProductId)
        {
            var result = new Product_TechInfo_Result();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@ProductID", objProductId.ProductID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Product_TechInfo_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.Core = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Product_TechInfo>(reader).SingleOrDefault();

                if (result.Core == null)
                    result.Core = new Models.Products.Product_TechInfo();

                reader.NextResult();

                result.Collections = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Product_TechInfo_Collection>(reader).ToList();

                reader.NextResult();

                result.Tests = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Product_TechInfo_Test>(reader).ToList();

                reader.NextResult();

                result.Usages = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Product_TechInfo_Usage>(reader).ToList();

                reader.NextResult();

                result.Attributes = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Product_TechInfo_Attribute>(reader).ToList();
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

            cmd.CommandText = "[portal].[Product_CareInstructions_Select]";

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.FabricWallpaperAftercares = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Product_TechInfo_Aftercare>(reader).ToList();

                reader.NextResult();

                result.FinishedProductAftercares = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Product_TechInfo_Attribute>(reader).ToList();
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

        public List<ProductSearchKeyword> ProductSearchKeywordAutocomplete(PassProductSearch objSearch)
        {
            var results = new List<ProductSearchKeyword>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@SearchTerm", objSearch.searchTerm ?? (object)DBNull.Value),
                new SqlParameter("@ProductTypeID", objSearch.productTypeId ?? (object)DBNull.Value),
                new SqlParameter("@BrandID", objSearch.brandId ?? (object)DBNull.Value),
                new SqlParameter("@LaunchID", objSearch.launchId ?? (object)DBNull.Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Product_Search_CollectionHint]";
            cmd.CommandType = CommandType.StoredProcedure;

            var seasonalResults = new List<ProductSearchKeyword>();

            if (objSearch.seasonal)
            {
                cmd.Parameters.AddRange(parameters);

                //if (objSearch.widget == "Fabric" ||
                //    objSearch.widget == "Wallpaper" ||
                //    objSearch.widget == "FabricCutting" ||
                //    objSearch.widget == "FabricReturnable" ||
                //    objSearch.widget == "PatternBook")
                //{
                try
                {
                    this.Database.Connection.Open();
                    // Run the sproc 
                    var reader = cmd.ExecuteReader();

                    seasonalResults = ((IObjectContextAdapter)this)
                        .ObjectContext
                        .Translate<ProductSearchKeyword>(reader).ToList();
                }
                finally
                {
                    this.Database.Connection.Close();
                }

                seasonalResults.ForEach(c =>
                {
                    c.Type = "Collection";
                    //c.Suggestion = $"{c.BrandCode} - {c.Suggestion}";
                });
            }

            results.AddRange(seasonalResults);

            cmd.CommandText = "[portal].[Product_Search_KeywordHint]";

            cmd.Parameters.Clear();

            cmd.Parameters.Add(new SqlParameter("@SearchTerm", objSearch.searchTerm ?? (object)DBNull.Value));

            var standardResults = new List<ProductSearchKeyword>();

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                standardResults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductSearchKeyword>(reader).ToList();
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

            standardResults.ForEach(c =>
            {
                c.Type = "Standard";
                c.Suggestion = $"{c.Suggestion}";
            });

            results.AddRange(standardResults);

            cmd.CommandText = "[portal].[Product_Search_DiscontinuedHint]";

            cmd.Parameters.Clear();

            cmd.Parameters.Add(new SqlParameter("@SearchTerm", objSearch.searchTerm ?? (object)DBNull.Value));

            var discoResults = new List<ProductSearchKeyword>();

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                discoResults.AddRange(((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductSearchKeyword>(reader).ToList());
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

            discoResults.ForEach(c =>
            {
                c.Type = "Disallowed";
                c.Suggestion = $"{c.Suggestion}";
            });

            results.AddRange(discoResults);


            cmd.CommandText = "[portal].[Product_Search_MissingPriceHint]";

            cmd.Parameters.Clear();

            cmd.Parameters.Add(new SqlParameter("@SearchTerm", objSearch.searchTerm ?? (object)DBNull.Value));
            cmd.Parameters.Add(new SqlParameter("@TradeAccountID", objSearch.tradeAccountId));

            var missingPriceResults = new List<ProductSearchKeyword>();

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                missingPriceResults.AddRange(((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductSearchKeyword>(reader).ToList());
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

            missingPriceResults.ForEach(c =>
            {
                c.Type = "Disallowed";
                c.Suggestion = $"{c.Suggestion}";
            });

            results.AddRange(missingPriceResults);

            return results;
        }

        public List<ProductPageImage> FetchProductPageImages(PassStockViewerLoad objProduct)
        {
            var results = new List<ProductPageImage>();

            var parameters = new List<SqlParameter>();

            if (objProduct.ProductPageID.HasValue)
            {
                parameters.Add(new SqlParameter("@ProductPageID", objProduct.ProductPageID));
            }
            else
            {
                parameters.Add(new SqlParameter("@ProductID", objProduct.ProductID ?? (object)DBNull.Value));
            }

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[ProductPage_Image_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductPageImage>(reader).ToList();
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

        public List<Product_SelectByQualityResult> ProductCodeAutocompleteBespoke(PassBespokeAutocomplete objFetch)
        {
            var results = new List<Product_SelectByQualityResult>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TradeAccountID", objFetch.tradeAccountId),
                new SqlParameter("@ProductGroupID", objFetch.productGroupId),
                new SqlParameter("@ItemTypeID", objFetch.itemTypeId),
                new SqlParameter("@SearchTerm", objFetch.term)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[ProductCode_Autocomplete_Bespoke]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Product_SelectByQualityResult>(reader).ToList();
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

        public short? QualitySelectByCode(PassProductFetchByQuality objQuality)
        {
            var result = (short?)null;

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@Code", Regex.Match(objQuality.code, "^([^\\/]*)").Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Quality_SelectByCode]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<short?>(reader).Single();
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


        public List<Product_SelectByQualityResult> ProductSelectByQuality(PassProductFetchByQuality objQuality)
        {
            var results = new List<Product_SelectByQualityResult>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@QualityID", objQuality.qualityId),
                new SqlParameter("@ProductTypeID", objQuality.productTypeId),
                new SqlParameter("@TradeAccountID", objQuality.tradeAccountId),
                new SqlParameter("@Status", objQuality.status)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Product_SelectByQuality]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Product_SelectByQualityResult>(reader).ToList();
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

        //public List<BasketRefreshPricesStockResult> BasketRefreshPricesStock(PassProductBasket objBasket)
        //{
        //    var results = new List<BasketRefreshPricesStockResult>();

        //    var basket = new DataTable();

        //    basket.Columns.Add("RowNumber", typeof(short));
        //    basket.Columns.Add("BasketSpitID", typeof(byte));
        //    basket.Columns.Add("ProductID", typeof(int));
        //    basket.Columns.Add("Quantity", typeof(decimal));
        //    basket.Columns.Add("ProductFilterID", typeof(byte));
        //    basket.Columns.Add("TreatmentID", typeof(short));
        //    basket.Columns.Add("OrderTypeID", typeof(byte));
        //    basket.Columns.Add("DeliveryGroupID", typeof(byte));
        //    basket.Columns.Add("FulfilmentTypeID", typeof(byte));
        //    basket.Columns.Add("StockLocationID", typeof(short));
        //    basket.Columns.Add("DiscountPercentage", typeof(byte));
        //    basket.Columns.Add("DesignProductID", typeof(int));
        //    basket.Columns.Add("FabricProductID", typeof(int));
        //    basket.Columns.Add("WallpaperProductID", typeof(int));
        //    basket.Columns.Add("ModelProductID", typeof(int));
        //    basket.Columns.Add("HeaderWidth", typeof(byte));
        //    basket.Columns.Add("FeelerLength", typeof(byte));
        //    basket.Columns.Add("Waterfall", typeof(bool));
        //    basket.Columns.Add("Memo", typeof(string));
        //    basket.Columns.Add("Width", typeof(short));
        //    basket.Columns.Add("Length", typeof(short));
        //    basket.Columns.Add("Diameter", typeof(short));
        //    basket.Columns.Add("BespokeSize", typeof(decimal));
        //    basket.Columns.Add("FinalPrice", typeof(decimal));
        //    basket.Columns.Add("NetWeight", typeof(decimal));

        //    foreach (var i in objBasket.basketItems)
        //    {
        //        basket.Rows.Add(
        //            i.rowNumber,
        //            i.basketSplitId,
        //            i.record.ProductID,
        //            i.quantity,
        //            i.productFilterId,
        //            i.treatmentId,
        //            i.orderTypeId,
        //            i.deliveryGroupId,
        //            i.fulfilmentTypeId,
        //            i.stockLocationId,
        //            i.discount,
        //            i.designProductId,
        //            i.fabricProductId,
        //            i.wallpaperProductId,
        //            i.modelProductId,
        //            i.headerWidth,
        //            i.feelerLength,
        //            i.waterfall,
        //            i.memo,
        //            i.width,
        //            i.length,
        //            i.diameter,
        //            i.bespokeSize,
        //            i.finalPrice,
        //            i.netWeight
        //        );
        //    }

        //    var parameters = new SqlParameter[]
        //    {
        //        new SqlParameter("@Basket", basket)
        //        {
        //            SqlDbType = SqlDbType.Structured,
        //            TypeName = "portal.BasketTableType"
        //        },
        //        new SqlParameter("@TradeAccountID", objBasket.tradeAccountId)
        //    };

        //    // Create a SQL command to execute the sproc
        //    var cmd = this.Database.Connection.CreateCommand();
        //    cmd.CommandText = "[portal].[Basket_Price_Select]";
        //    cmd.CommandType = CommandType.StoredProcedure;

        //    cmd.Parameters.AddRange(parameters);

        //    try
        //    {
        //        this.Database.Connection.Open();
        //        // Run the sproc 
        //        var reader = cmd.ExecuteReader();

        //        results = ((IObjectContextAdapter)this)
        //            .ObjectContext
        //            .Translate<BasketRefreshPricesStockResult>(reader).ToList();
        //    }
            //catch (SqlException e)
            //{
            //    PortalFramework.LogErrorToDatabase(e);
                //throw e;
            //}
    //    finally
    //    {
    //        this.Database.Connection.Close();
    //    }

    //    return results;
    //}

    public List<FulfilmentOptionSelectResult> FetchFulfilmentOptions(PassFulfilmentOptionsSelect objSelect)
        {
            var results = new List<FulfilmentOptionSelectResult>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketID", objSelect.basketId),
                new SqlParameter("@ProductID", objSelect.productId ?? (object)DBNull.Value),
                new SqlParameter("@TradeAccountID", objSelect.tradeAccountId),
                new SqlParameter("@OperatorTypeID", objSelect.operatorTypeId)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[FulfilmentOption_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results.AddRange(((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<FulfilmentOptionSelectResult>(reader).ToList());
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

        public List<ProductSortOptionResult> FetchProductSortOptions()
        {
            var results = new List<ProductSortOptionResult>();

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Product_SortOption_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductSortOptionResult>(reader).ToList();
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

        public SubmitBasketResult SubmitBasket(int memberId, PassBasketID objBasketId)
        {
            var result = new SubmitBasketResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@MemberID", memberId),
                new SqlParameter("@BasketID", objBasketId.BasketID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_Submit]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.ProcessingResultJson = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<string>(reader).SingleOrDefault();

                reader.NextResult();

                result.SubmissionResults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<HeldOrderSelectResult>(reader).ToList();
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

            result.SubmissionResults.ForEach(c =>
            {
                c.BasketItems = this.BasketItems.Where(p => p.BasketID == c.BasketID && p.Deleted == false).ToList();
                c.BasketItemLineMemos = this.BasketItemLineMemos.Where(p => p.BasketItem.BasketID == c.BasketID).ToList();
            });

            return result;
        }

        public List<ProductSearchResult> FetchAlsoLookAts(PassStockViewerLoad objProduct)
        {
            var results = new List<ProductSearchResult>();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@TradeAccountID", objProduct.TradeAccountID)
            };

            if (objProduct.ProductPageID.HasValue)
            {
                parameters.Add(new SqlParameter("@ProductPageID", objProduct.ProductPageID));
            }
            else
            {
                parameters.Add(new SqlParameter("@ProductID", objProduct.ProductID ?? (object)DBNull.Value));
            }

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Product_AlsoLookAt_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductSearchResult>(reader).ToList();
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

        public FetchStockInfoResult FetchStockInfo(PassFetchProductStockInfo objFetch)
        {
            var result = new FetchStockInfoResult();

            var productIdTable = new DataTable();

            productIdTable.Columns.Add("ProductID", typeof(int));

            foreach (var i in objFetch.ProductIDs)
            {
                productIdTable.Rows.Add(i);
            }

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@TradeAccountID", objFetch.TradeAccountID ?? (object)DBNull.Value),
                new SqlParameter("@ProductIDs",  productIdTable)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[dbo].[ProductIDsTableType]"
                },
                new SqlParameter("EnquiryType", objFetch.EnquiryType)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Stock_Select]";

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.stockResults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductStockFetchResult>(reader).ToList();

                reader.NextResult();

                result.availabilityMessages = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<StockInfoAvailabilityMessage>(reader).ToList();
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

        public FetchStockInfoResult FetchStockInfoSingular(PassFetchProductStockInfoSingular objFetch)
        {
            var result = new FetchStockInfoResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@TradeAccountID", objFetch.TradeAccountID),
                new SqlParameter("@ProductID", objFetch.ProductID ?? (object)DBNull.Value),
                new SqlParameter("@ProductCode", objFetch.ProductCode ?? (object)DBNull.Value)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[Stock_Select_Singular]";

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.stockResults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductStockFetchResult>(reader).ToList();

                reader.NextResult();

                result.availabilityMessages = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<StockInfoAvailabilityMessage>(reader).ToList();
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

        public List<ProductSearchResult> FetchCoordinatingProducts(PassStockViewerLoad objProduct)
        {
            var results = new List<ProductSearchResult>();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@TradeAccountID", objProduct.TradeAccountID)
            };

            if (objProduct.ProductPageID.HasValue)
            {
                parameters.Add(new SqlParameter("@ProductPageID", objProduct.ProductPageID));
            }
            else
            {
                parameters.Add(new SqlParameter("@ProductID", objProduct.ProductID ?? (object)DBNull.Value));
            }

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Product_CoordinatingProduct_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductSearchResult>(reader).ToList();
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

        public List<ProductSearchResult> FetchAlternateColourways(PassStockViewerLoad objProduct)
        {
            var results = new List<ProductSearchResult>();

            if (objProduct.ProductID.HasValue)
            {
                var parameters = new List<SqlParameter>()
                {
                    new SqlParameter("@ProductID", objProduct.ProductID),
                    new SqlParameter("@TradeAccountID", objProduct.TradeAccountID)
                };

                // Create a SQL command to execute the sproc
                var cmd = this.Database.Connection.CreateCommand();
                cmd.CommandText = "[portal].[Product_AlternateColourway_Select]";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddRange(parameters.ToArray());

                try
                {
                    this.Database.Connection.Open();
                    // Run the sproc 
                    var reader = cmd.ExecuteReader();

                    results = ((IObjectContextAdapter)this)
                        .ObjectContext
                        .Translate<ProductSearchResult>(reader).ToList();
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
            }

            return results;
        }

        public List<ProductSearchResult> FetchAlternateProducts(PassStockViewerLoad objProduct)
        {
            var results = new List<ProductSearchResult>();

            if (objProduct.ProductID.HasValue)
            {
                var parameters = new List<SqlParameter>()
                {
                    new SqlParameter("@ProductID", objProduct.ProductID),
                    new SqlParameter("@TradeAccountID", objProduct.TradeAccountID)
                };

                // Create a SQL command to execute the sproc
                var cmd = this.Database.Connection.CreateCommand();
                cmd.CommandText = "[portal].[Product_AlternativeProduct_Select]";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddRange(parameters.ToArray());

                try
                {
                    this.Database.Connection.Open();
                    // Run the sproc 
                    var reader = cmd.ExecuteReader();

                    results = ((IObjectContextAdapter)this)
                        .ObjectContext
                        .Translate<ProductSearchResult>(reader).ToList();
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
            }

            return results;
        }

        public List<USP_Result> FetchUSPs(PassStockViewerLoad objProduct)
        {
            var results = new List<USP_Result>();

            var parameters = new List<SqlParameter>();

            if (objProduct.ProductPageID.HasValue)
            {
                parameters.Add(new SqlParameter("@ProductPageID", objProduct.ProductPageID));
            }
            else
            {
                parameters.Add(new SqlParameter("@ProductID", objProduct.ProductID ?? (object)DBNull.Value));
            }

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Product_USP_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<USP_Result>(reader).ToList();
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

        public List<ProductSearchResult> FetchSamplingOptions(PassStockViewerLoad objProduct)
        {
            var results = new List<ProductSearchResult>();

            if (objProduct.ProductID.HasValue)
            {
                var parameters = new List<SqlParameter>()
                {
                    new SqlParameter("@ProductID", objProduct.ProductID),
                    new SqlParameter("@TradeAccountID", objProduct.TradeAccountID)
                };

                // Create a SQL command to execute the sproc
                var cmd = this.Database.Connection.CreateCommand();
                cmd.CommandText = "[portal].[Product_SamplingOptions_Select]";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddRange(parameters.ToArray());

                try
                {
                    this.Database.Connection.Open();
                    // Run the sproc 
                    var reader = cmd.ExecuteReader();

                    results = ((IObjectContextAdapter)this)
                        .ObjectContext
                        .Translate<ProductSearchResult>(reader).ToList();
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
            }

            return results;
        }

        public TreatmentOptionResult FetchTreatmentOptions(PassProductID objProduct)
        {
            var result = new TreatmentOptionResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@ProductID", objProduct.ProductID)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Product_TreatmentOption_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.Treatments = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BasketItemTreatmentProvider>(reader).ToList();

                reader.NextResult();

                result.TestsPassed = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductTestPassed>(reader).ToList();

                reader.NextResult();

                result.QualityCompositions = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<QualityComposition>(reader).ToList();
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally {
                this.Database.Connection.Close();
            }

            return result;
        }
        
        public List<ProductSearchResult> FetchPatternBookContents(PassStockViewerLoad objProduct)
        {
            var results = new List<ProductSearchResult>();

            if (objProduct.ProductID.HasValue)
            {
                var parameters = new List<SqlParameter>()
                {
                    new SqlParameter("@ProductID", objProduct.ProductID),
                    new SqlParameter("@TradeAccountID", objProduct.TradeAccountID)
                };

                // Create a SQL command to execute the sproc
                var cmd = this.Database.Connection.CreateCommand();
                cmd.CommandText = "[portal].[Product_PatternBookContents_Select]";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddRange(parameters.ToArray());

                try
                {
                    this.Database.Connection.Open();
                    // Run the sproc 
                    var reader = cmd.ExecuteReader();

                    results = ((IObjectContextAdapter)this)
                        .ObjectContext
                        .Translate<ProductSearchResult>(reader).ToList();
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
            }

            return results;
        }

        public List<ProductSearchResult> FetchBesokeStockedHanger(PassStockViewerLoad objProduct)
        {
            var results = new List<ProductSearchResult>();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@ProductID", objProduct.ProductID),
                new SqlParameter("@TradeAccountID", objProduct.TradeAccountID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Product_StockedHanger_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductSearchResult>(reader).ToList();
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

        public string FetchRugShape(PassStockViewerLoad objProduct)
        {
            var result = "";

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@ProductID", objProduct.ProductID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Product_BespokeRug_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<string>(reader).SingleOrDefault();
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

        public BespokeProductPrice FetchBespokeProductPrice(PassBespokeProductSize objBespoke)
        {
            var result = new BespokeProductPrice();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@TradeAccountID", objBespoke.tradeAccountId),
                new SqlParameter("@ProductID", objBespoke.productId),
                new SqlParameter("@BespokeSize", objBespoke.bespokeSize)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Product_BespokePrice_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BespokeProductPrice>(reader).SingleOrDefault();
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

        public ProductTreatmentResult FetchTreatments(PassProductFilter objFilter)
        {
            var result = new ProductTreatmentResult();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@ProductFilterID", objFilter.ProductFilterID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Product_TreatmentOption_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.Treatments = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductTreatment>(reader).ToList();
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

        public int SaveTreatments(PassBasketItemTreatmentSave objSave)
        {
            var result = -1;

            var treatmentTable = new DataTable();

            treatmentTable.Columns.Add("TreatmentID", typeof(byte));

            if (objSave.BasketItemTreatments != null)
            {
                foreach (var i in objSave.BasketItemTreatments)
                {
                    treatmentTable.Rows.Add(i);
                }
            }

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketItemID", objSave.BasketItemID),
                new SqlParameter("@TreatmentProviderID", objSave.TreatmentProviderID ?? (object)DBNull.Value),
                new SqlParameter("@BasketItemTreatments",  treatmentTable)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "[portal].[TreatmentTableType]"
                },
                new SqlParameter("@ExpressTreatment", objSave.ExpressTreatment)
            };

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandText = "[portal].[BasketItem_ReviewTreatment_Save]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters.ToArray());

            try
            {
                this.Database.Connection.Open();

                result = cmd.ExecuteNonQuery();
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

        public List<ProductPageImage> FetchCollectionImages(PassProductID objProductId)
        {
            var results = new List<ProductPageImage>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@ProductID", objProductId.ProductID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Collection_Image_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductPageImage>(reader).ToList();
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

        public List<ProductSearchResult> FetchBespokeOptions(PassStockViewerLoad objLoad)
        {
            var results = new List<ProductSearchResult>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@ProductID", objLoad.ProductID),
                new SqlParameter("@TradeAccountID", objLoad.TradeAccountID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Product_BespokeOptions_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductSearchResult>(reader).ToList();
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

        public List<SizeOption> FetchSizeOptions(PassProductFilter objFilter)
        {
            var results = new List<SizeOption>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@ProductFilterID", objFilter?.ProductFilterID ?? (object)DBNull.Value),
                new SqlParameter("@ProductFilterGroupID", objFilter?.ProductFilterGroupID ?? (object)DBNull.Value)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Size_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<SizeOption>(reader).ToList();
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

        public List<long> Feed_Image_Select(PassDownloadBasket objBasket)
        {
            List<long> results = new List<long>();

            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["VM-SQL1"].ConnectionString))
                {
                    SqlCommand comm = new SqlCommand("[portal].[Download_Excel_ImageFeed]", conn)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    SqlParameter ppids = comm.CreateParameter();

                    comm.Parameters.AddWithValue("@TradeAccountID", objBasket.TradeAccountID);
                    comm.Parameters.AddWithValue("@DisplayPrices", objBasket.DisplayPrices);

                    ppids.ParameterName = "@DownloadList";
                    ppids.TypeName = "[portal].[DownloadListTableType]";
                    ppids.SqlDbType = System.Data.SqlDbType.Structured;

                    DataTable dt = new DataTable();
                    dt.Columns.Add("ProductPageID", typeof(int));
                    dt.Columns.Add("ProductFilterID", typeof(byte));
                    dt.Columns.Add("RowNumber", typeof(int));

                    foreach (var i in objBasket.IDs)
                    {
                        var split = i.Split(new char[] { '-' }, StringSplitOptions.None);

                        dt.Rows.Add(split[0], Convert.ToInt32(split[1]), null);
                    }

                    ppids.Value = dt;

                    comm.Parameters.Add(ppids);

                    conn.Open();

                    SqlDataReader reader = comm.ExecuteReader();
                    while (reader.Read())
                    {
                        results.Add(reader.GetInt64(0));
                    }

                    reader.Close();
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }

            return results;
        }

        public XDocument ProductPageFeedExcelXML(int userId, short countryId, byte languageId, bool displayPrices, bool displayClearance, PassDownloadBasket objBasket)
        {
            XDocument result = new XDocument();

            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["VM-SQL1"].ConnectionString))
                {
                    SqlCommand comm = new SqlCommand("portal.Download_Excel_ProductFeed", conn)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    comm.Parameters.AddWithValue("@MemberID", userId);
                    comm.Parameters.AddWithValue("@TradeAccountID", objBasket.TradeAccountID);
                    comm.Parameters.AddWithValue("@DisplayPrices", objBasket.DisplayPrices);

                    SqlParameter ppids = comm.CreateParameter();

                    ppids.ParameterName = "@DownloadList";
                    ppids.TypeName = "[portal].[DownloadListTableType]";
                    ppids.SqlDbType = System.Data.SqlDbType.Structured;

                    DataTable dt = new DataTable();
                    dt.Columns.Add("ProductPageID", typeof(int));
                    dt.Columns.Add("ProductFilterID", typeof(byte));
                    dt.Columns.Add("RowNumber", typeof(int));

                    foreach (var i in objBasket.IDs)
                    {
                        var split = i.Split(new char[] { '-' }, StringSplitOptions.None);

                        dt.Rows.Add(split[0], Convert.ToInt32(split[1]), null);
                    }

                    ppids.Value = dt;

                    comm.Parameters.Add(ppids);

                    conn.Open();
                    XmlReader reader = comm.ExecuteXmlReader();
                    while (reader.Read())
                    {
                        result = XDocument.Parse(reader.ReadOuterXml());
                    }

                    reader.Close();
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }

            return result;
        }

        //public XDocument ProductFeedExcelXMLEarlyAccess(int userId, short countryId, byte languageId, bool displayPrices, bool displayClearance, PassDownloadBasket objBasket)
        //{
        //    XDocument result = new XDocument();

        //    try
        //    {
        //        using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["VM-SQL1"].ConnectionString))
        //        {
        //            SqlCommand comm = new SqlCommand("portal.Download_Excel_ProductFeed", conn)
        //            {
        //                CommandType = System.Data.CommandType.StoredProcedure
        //            };

        //            comm.Parameters.AddWithValue("@MemberID", userId);
        //            comm.Parameters.AddWithValue("@TradeAccountID", objBasket.TradeAccountID);
        //            comm.Parameters.AddWithValue("@DisplayPrices", objBasket.DisplayPrices);

        //            SqlParameter ppids = comm.CreateParameter();

        //            ppids.ParameterName = "@DownloadList";
        //            ppids.TypeName = "[portal].[DownloadListTableType]";
        //            ppids.SqlDbType = System.Data.SqlDbType.Structured;

        //            DataTable dt = new DataTable();
                      //dt.Columns.Add("ProductPageID", typeof(int));
                      //dt.Columns.Add("ProductFilterID", typeof(byte));
                      //dt.Columns.Add("RowNumber", typeof(int));

        //            foreach (var i in objBasket.IDs)
        //            {
        //                var split = i.Split(new char[] { '-' }, StringSplitOptions.None);

        //                dt.Rows.Add(split[0], Convert.ToInt32(split[1]), null);
        //            }


        //            ppids.Value = dt;

        //            comm.Parameters.Add(ppids);

        //            conn.Open();
        //            XmlReader reader = comm.ExecuteXmlReader();
        //            while (reader.Read())
        //            {
        //                result = XDocument.Parse(reader.ReadOuterXml());
        //            }

        //            reader.Close();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }

        //    return result;
        //}


        public XDocument ProductPageFeedWooCommerceXML(int userId, short countryId, byte languageId, bool displayPrices, PassDownloadBasket objBasket)
        {
            XDocument result = null;

            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["VM-SQL1"].ConnectionString))
                {
                    SqlCommand comm = new SqlCommand("portal.Download_Wordpress_XML", conn)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    SqlParameter ppids = comm.CreateParameter();

                    comm.Parameters.AddWithValue("@MemberID", userId);
                    comm.Parameters.AddWithValue("@TradeAccountID", objBasket.TradeAccountID);
                    comm.Parameters.AddWithValue("@DisplayPrices", objBasket.DisplayPrices);

                    ppids.ParameterName = "@DownloadList";
                    ppids.TypeName = "[portal].[DownloadListTableType]";
                    ppids.SqlDbType = System.Data.SqlDbType.Structured;

                    DataTable dt = new DataTable();
                    dt.Columns.Add("ProductPageID", typeof(int));
                    dt.Columns.Add("ProductFilterID", typeof(byte));
                    dt.Columns.Add("RowNumber", typeof(int));

                    foreach (var i in objBasket.IDs)
                    {
                        var split = i.Split(new char[] { '-' }, StringSplitOptions.None);

                        dt.Rows.Add(split[0], Convert.ToInt32(split[1]), null);
                    }

                    ppids.Value = dt;

                    comm.Parameters.Add(ppids);

                    conn.Open();

                    XmlReader reader = comm.ExecuteXmlReader();
                    while (reader.Read())
                    {
                        result = XDocument.Parse(reader.ReadOuterXml());
                    }

                    reader.Close();
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }

            return result;
        }

        public XDocument ProductPageFeedMagentoXML(int userId, short countryId, byte languageId, bool displayPrices, PassDownloadBasket objBasket)
        {
            XDocument result = null;

            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["VM-SQL1"].ConnectionString))
                {
                    SqlCommand comm = new SqlCommand("portal.Download_Magento_XML", conn)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    SqlParameter ppids = comm.CreateParameter();

                    comm.Parameters.AddWithValue("@MemberID", userId);
                    comm.Parameters.AddWithValue("@TradeAccountID", objBasket.TradeAccountID);
                    comm.Parameters.AddWithValue("@DisplayPrices", objBasket.DisplayPrices);

                    ppids.ParameterName = "@DownloadList";
                    ppids.TypeName = "[portal].[DownloadListTableType]";
                    ppids.SqlDbType = System.Data.SqlDbType.Structured;

                    DataTable dt = new DataTable();
                    dt.Columns.Add("ProductPageID", typeof(int));
                    dt.Columns.Add("ProductFilterID", typeof(byte));
                    dt.Columns.Add("RowNumber", typeof(int));

                    foreach (var i in objBasket.IDs)
                    {
                        var split = i.Split(new char[] { '-' }, StringSplitOptions.None);

                        dt.Rows.Add(split[0], Convert.ToInt32(split[1]), null);
                    }

                    ppids.Value = dt;

                    comm.Parameters.Add(ppids);

                    conn.Open();

                    XmlReader reader = comm.ExecuteXmlReader();
                    while (reader.Read())
                    {
                        result = XDocument.Parse(reader.ReadOuterXml());
                    }

                    reader.Close();
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }

            return result;
        }

        public DataTable ProductPageFeedShopifyCSV(int userId, short countryId, byte languageId, bool displayPrices, PassDownloadBasket objBasket, string fileName)
        {
            DataTable result = new DataTable();

            try
            {
                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["VM-SQL1"].ConnectionString))
                {
                    SqlCommand comm = new SqlCommand("portal.Download_Shopify_CSV", conn)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    SqlParameter ppids = comm.CreateParameter();

                    comm.Parameters.AddWithValue("@MemberID", userId);
                    comm.Parameters.AddWithValue("@TradeAccountID", objBasket.TradeAccountID);
                    comm.Parameters.AddWithValue("@DisplayPrices", objBasket.DisplayPrices);
                    comm.Parameters.AddWithValue("@Metric", objBasket.UnitOfMeasurement);

                    ppids.ParameterName = "@DownloadList";
                    ppids.TypeName = "[portal].[DownloadListTableType]";
                    ppids.SqlDbType = System.Data.SqlDbType.Structured;

                    DataTable dt = new DataTable();
                    dt.Columns.Add("ProductPageID", typeof(int));
                    dt.Columns.Add("ProductFilterID", typeof(byte));
                    dt.Columns.Add("RowNumber", typeof(int));

                    foreach (var i in objBasket.IDs)
                    {
                        var split = i.Split(new char[] { '-' }, StringSplitOptions.None);

                        dt.Rows.Add(split[0], Convert.ToInt32(split[1]), null);
                    }

                    ppids.Value = dt;

                    comm.Parameters.Add(ppids);

                    conn.Open();

                    result.Load(comm.ExecuteReader());
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }

            CreateFileFromTable(result, fileName, ",");

            return result;
        }

        private void CreateFileFromTable(DataTable dt, String fileName, String delimiter)
        {
            FileStream fs;
            fs = File.Create(fileName);

            using (StreamWriter sw = new StreamWriter(fs, System.Text.Encoding.UTF8))
            {
                string rowLine = string.Empty;

                for (int i = 0; i < dt.Columns.Count; i++)
                {
                    rowLine = rowLine + (dt.Columns[i].ColumnName);
                    if (i < dt.Columns.Count - 1) rowLine = rowLine + delimiter;
                    else sw.WriteLine(rowLine);
                }

                foreach (DataRow row in dt.Rows)
                {
                    rowLine = string.Empty;
                    for (int i = 0; i < dt.Columns.Count; i++)
                    {
                        rowLine = rowLine + "\"" + row[i].ToString().Replace("\"", "\"\"") + "\"";
                        if (i < dt.Columns.Count - 1) rowLine = rowLine + delimiter;
                        else sw.WriteLine(rowLine);
                    }
                }
                byte[] buffer = new byte[fs.Length];
                fs.Read(buffer, 0, buffer.Length);

                sw.Flush();
                sw.Close();
                fs.Close();
            }
        }

        public AdvertisingImageResult AdvertisingImages_Generate(PassAdvertisingGenerate objAdv)
        {
            var results = new AdvertisingImageResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@Page", objAdv.Page),
                new SqlParameter("@PageSize", objAdv.PageSize)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Download_AdvertisingImages_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results.Images = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<AdvertisingImage_Select>(reader).ToList();

                reader.NextResult();

                results.ResultCount = ((IObjectContextAdapter)this)
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

            return results;
        }

        public bool Member_AdvertisingImage_Insert(PassAdvertisingImageUsage objAdv)
        {
            bool result = false;

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@MemberID", objAdv.MemberID),
                new SqlParameter("@AdvertisingImageID", objAdv.AdvertisingImageID),
                new SqlParameter("@AdvertisingImageTypeID", objAdv.AdvertisingImageTypeID),
                new SqlParameter("@CountryID", objAdv.CountryID),
                new SqlParameter("@LanguageID", objAdv.LanguageID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Member_AdvertisingImage_Insert]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
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

        public DownloadBasketSummaryResponse Download_BasketSummary(PassDownloadBasket objBasket)
        {
            var result = new DownloadBasketSummaryResponse();

            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@TradeAccountID", objBasket.TradeAccountID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Download_BasketSummary]";
            cmd.CommandType = CommandType.StoredProcedure;

            var ppids = new SqlParameter();
            
            ppids.ParameterName = "@DownloadList";
            ppids.TypeName = "[portal].[DownloadListTableType]";
            ppids.SqlDbType = SqlDbType.Structured;

            DataTable dt = new DataTable();
            dt.Columns.Add("ProductPageID", typeof(int));
            dt.Columns.Add("ProductFilterID", typeof(byte));
            dt.Columns.Add("RowNumber", typeof(int));

            foreach (var i in objBasket.IDs)
            {
                var split = i.Split(new char[] { '-' }, StringSplitOptions.None);

                dt.Rows.Add(split[0], Convert.ToInt32(split[1]), null);
            }

            ppids.Value = dt;

            parameters.Add(ppids);

            cmd.Parameters.AddRange(parameters.ToArray());
            
            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.BasketContents = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<DownloadProductFilterCount>(reader).ToList();
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
        
        public List<SizeOption> FetchTradeAccountVisitOrders(PassTradeAccountVisit objVisit)
        {
            var results = new List<SizeOption>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TradeAccountVisitID", objVisit.TradeAccountVisitID)
            };

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[TradeAccountVisit_Transaction_Select]";
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<SizeOption>(reader).ToList();
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

        public FetchFurnitureDesignResult FetchFurnitureDesigns(PassFurnitureThing objThing)
        {
            var result = new FetchFurnitureDesignResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketItemID", objThing.basketItemId ?? (object)DBNull.Value)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Furniture_Design_Select]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.designs = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Products.FurnitureDesign>(reader).ToList();
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

        public FetchFurnitureModelResult FetchFurnitureModels(PassFurnitureDesign objDesign)
        {
            var result = new FetchFurnitureModelResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketItemID", objDesign.basketItemId ?? (object)DBNull.Value),
                new SqlParameter("@DesignID", objDesign.designId)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Furniture_Model_Select]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.models = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Products.FurnitureModel>(reader).ToList();
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

        public FetchFurnitureSupplierResult FetchFurnitureSuppliers(PassFurnitureModel objModel)
        {
            var result = new FetchFurnitureSupplierResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketItemID", objModel.basketItemId ?? (object)DBNull.Value),
                new SqlParameter("@ModelID", objModel.modelId)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Furniture_Supplier_Select]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.suppliers = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<Products.FurnitureSupplier>(reader).ToList();
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

        public DatabaseJSONResult FetchFurnitureModelOptions(PassFurnitureSupplier objSupplier)
        {
            var result = new DatabaseJSONResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketItemID", objSupplier.basketItemId ?? (object)DBNull.Value),
                new SqlParameter("@ModelID", objSupplier.modelId),
                new SqlParameter("@SupplierID", objSupplier.supplierId),
                new SqlParameter("@FurnitureDeliveryTo", objSupplier.furnitureDeliveryTo ?? (object)DBNull.Value)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Furniture_ModelOption_Select]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.JSON = String.Join("", ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<string>(reader).ToList());
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

        public FurnitureMaterialBreakdownResult FetchFurnitureMaterialBreakdown(PassFurnitureSupplier objSupplier)
        {
            var result = new FurnitureMaterialBreakdownResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketItemID", objSupplier.basketItemId ?? (object)DBNull.Value),
                new SqlParameter("@SupplierID", objSupplier.supplierId),
                new SqlParameter("@ModelID", objSupplier.modelId)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Furniture_Material_Breakdown]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<FurnitureMaterial>(reader).ToList();
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

        public int SaveFurnitureJSON(PassFurnitureJSON objJson)
        {
            var result = -1;

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketItemID", objJson.basketItemId),
                new SqlParameter("@BespokeFurnitureJSON", objJson.json),
                new SqlParameter("@AdvancedOrderStepID", objJson.advancedOrderStepId),
                new SqlParameter("@FurnitureSupplierID", objJson.supplierId),
                new SqlParameter("@FurnitureDeliveryTo", objJson.destinationId),
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Furniture_Save]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                while(reader.Read())
                {
                    result = reader.GetInt32(0);
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

            return result;
        }

        public BespokeFurnitureMaterialSearchResult BespokeFurnitureMaterialSearch(PassFurnitureSearch objSearch)
        {
            var result = new BespokeFurnitureMaterialSearchResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketItemID", objSearch.basketItemId),
                new SqlParameter("@ModelID", objSearch.modelId),
                new SqlParameter("@SupplierID", objSearch.supplierId),
                new SqlParameter("@ComponentID", objSearch.componentId ?? (object)DBNull.Value),
                new SqlParameter("@MaterialTypeCode", objSearch.materialTypeId),
                new SqlParameter("@SearchString", objSearch.searchString ?? ""),
                new SqlParameter("@Width", objSearch.customersOwnWidth ?? (object)DBNull.Value),
                new SqlParameter("@VerticalPatternRepeat", objSearch.customersOwnPatternRepeat ?? (object)DBNull.Value)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Furniture_Material_Search]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<FurnitureMaterialSearchResult>(reader).ToList();
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

        public List<long> BespokeFurnitureBasketItemSelect(PassBasketItemID objBasketItemId)
        {
            var results = new List<long>();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketItemID", objBasketItemId.BasketItemID)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Furniture_Material_BasketItem_Select]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<long>(reader).ToList();
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

        public RetailTillPhaseReturn FetchRetailTillPhase(PassBasketID objBasketId)
        {
            var result = new RetailTillPhaseReturn();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@BasketID", objBasketId.BasketID)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_RetailTill_Select]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<RetailTillBasketGroup>(reader).ToList();
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

        public bool SaveBasketRetailParameters(PassBasketRetailParameters objRetail)
        {
            var parameters = new List<SqlParameter>()
            {
                new SqlParameter("@BasketID", objRetail.basketId),
                new SqlParameter("@RetailSessionNumber", objRetail.retailSessionNumber),
                new SqlParameter("@RetailTillNumber", objRetail.retailTillNumber)
            };

            DataTable dt = new DataTable();

            dt.Columns.Add("BasketSplitID", typeof(string));
            dt.Columns.Add("RetailPaymentJSON", typeof(string));

            foreach (var i in objRetail.retailPayments.Where(p => p.payments != null))
            {
                dt.Rows.Add(i.basketSplitId, JsonConvert.SerializeObject(i.payments, Newtonsoft.Json.Formatting.None));
            }

            var payments = new SqlParameter("@RetailPayments", dt)
            {
                SqlDbType = SqlDbType.Structured,
                TypeName = "[portal].[BasketSplitRetailPaymentTableType]"
            };

            parameters.Add(payments);

            // Create a SQL command to execute the sproc
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Basket_RetailTill_Save]";
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

            return true;
        }

        public DatabaseBatchPieceResult FetchStockBatchPiece(PassStockBatchPiece objStock)
        {
            var result = new DatabaseBatchPieceResult();

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@ProductCode", objStock.productCode),
                new SqlParameter("@StockLocation", objStock.stockLocation),
                new SqlParameter("@EnquiryType", objStock.enquiryType)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "SELECT * FROM clr.fnc_Mertex_Stock_BatchPiece(@ProductCode, @StockLocation, @EnquiryType)";
            cmd.CommandType = CommandType.Text;
            cmd.Parameters.AddRange(parameters);

            try
            {
                this.Database.Connection.Open();
                // Run the sproc 
                var reader = cmd.ExecuteReader();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<BatchPieceResult>(reader).ToList();
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

        public int CreateRingFence(int memberId, PassCreateRingFence objCreation, PassCreateRingFencePieceLength objPiece)
        {
            var result = -1;

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TradeAccountID", objCreation.tradeAccountId),
                new SqlParameter("@TradeAccountGroupID", objCreation.tradeAccountGroupId),
                new SqlParameter("@ProductID", objCreation.productId),
                new SqlParameter("@StockLocationID", objCreation.stockLocationId),
                new SqlParameter("@Quantity", objPiece.quantity),
                new SqlParameter("@Piece", objPiece.piece),
                new SqlParameter("@Batch", objPiece.batch),
                new SqlParameter("@ExpiryDT", objCreation.expiryDt),
                new SqlParameter("@MemberID", memberId)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[RingFencePreAllocation_Insert]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);

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

        public int DeleteRingFence(int memberId, PassDeleteRingFence objDeletion)
        {
            var result = -1;

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@RingFencePreAllocationID", objDeletion.ringFencePreAllocationId),
                new SqlParameter("@MemberID", memberId)
            };

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[RingFencePreAllocation_Delete]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);

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
    }
}