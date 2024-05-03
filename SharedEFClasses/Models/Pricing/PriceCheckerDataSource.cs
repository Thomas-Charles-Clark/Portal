using SharedEFClasses.Models.Cache;
using SharedEFClasses.Models.General;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models.Pricing
{
    internal class SlicerMarketCacheResult
    {
        public List<SlicerMarket> Results { get; set; }
    }

    internal class SlicerTradePriceListCacheResult
    {
        public List<SlicerTradePriceList> Results { get; set; }
    }

    internal class SlicerCurrenciesCacheResult
    {
        public List<SlicerCurrency> Results { get; set; }
    }

    internal class SliceProductGroupCacheResult
    {
        public List<SlicerProductGroup> Results { get; set; }
    }

    public static class PriceCheckerDataSource
    {
        public static List<SlicerMarket> GetMarkets()
        {
            var objCache = new PortalCache<SlicerMarketCacheResult>("SlicerMarkets");
            
            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                var db = new PortalDbContext();

                result = new SlicerMarketCacheResult()
                {
                    Results = db
                        .TradePriceLists
                        .Where(p => p.MarketID.HasValue && p.Deleted == false)
                        .Select(p => (byte)p.MarketID)
                        .Distinct()
                        .Select(p => new SlicerMarket { MarketID = p, Name = db.Markets.Where(q => q.MarketID == p).Select(q => q.Name).FirstOrDefault() })
                        .ToList()
                };
                
                objCache.Set(DateTime.Now, result, 360);
            }

            return result.Results;
        }

        public static List<SlicerMarket> GetMarkets(PreSlicerFunctionFilter f1)
        {
            var objCache = new PortalCache<SlicerMarketCacheResult>(String.Format("SlicerMarkets~{0}~{1}~{2}",
                f1.MarketID,
                f1.TradePriceListID,
                f1.CurrencyID));

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                var db = new PortalDbContext();

                result = new SlicerMarketCacheResult()
                {
                    Results = db
                        .TradePriceLists
                        .Where(p => p.MarketID.HasValue && p.Deleted == false)
                        .Where(p => f1.MarketID.HasValue ? p.MarketID == f1.MarketID : true)
                        .Where(p => f1.TradePriceListID.HasValue ? p.TradePriceListID == f1.TradePriceListID : true)
                        .Where(p => f1.CurrencyID.HasValue ? p.CurrencyID == f1.CurrencyID : true)
                        .Select(p => p.MarketID)
                        .Distinct()
                        .Select(p => new SlicerMarket { MarketID = (byte)p, Name = db.Markets.Where(q => q.MarketID == p).Select(q => q.Name).FirstOrDefault() })
                        .ToList()
                };

                objCache.Set(DateTime.Now, result, 360);
            }

            return result.Results;
        }

        public static List<SlicerTradePriceList> GetTradePriceLists()
        {
            var objCache = new PortalCache<SlicerTradePriceListCacheResult>("SlicerTradePriceLists");

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                var db = new PortalDbContext();

                result = new SlicerTradePriceListCacheResult()
                {
                    Results = db.TradePriceLists
                        .Where(p => p.MarketID.HasValue && p.Deleted == false)
                        .Select(p => new SlicerTradePriceList { TradePriceListID = p.TradePriceListID, Name = p.Name, CurrencyID = p.CurrencyID.Value })
                        .ToList()
                };

                objCache.Set(DateTime.Now, result, 360);
            }

            return result.Results;                
        }

        public static List<SlicerTradePriceList> GetTradePriceLists(PreSlicerFunctionFilter f1)
        {
            var objCache = new PortalCache<SlicerTradePriceListCacheResult>(String.Format("SlicerTradePriceLists~{0}~{1}~{2}",
                f1.MarketID,
                f1.TradePriceListID,
                f1.CurrencyID
            ));

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                var db = new PortalDbContext();

                result = new SlicerTradePriceListCacheResult()
                {
                    Results = db.TradePriceLists
                        .Where(p => p.MarketID.HasValue && p.Deleted == false)
                        .Where(p => f1.MarketID.HasValue ? p.MarketID == f1.MarketID : true)
                        .Where(p => f1.TradePriceListID.HasValue ? p.TradePriceListID == f1.TradePriceListID : true)
                        .Where(p => f1.CurrencyID.HasValue ? p.CurrencyID == f1.CurrencyID : true)
                        .Select(p => new SlicerTradePriceList { TradePriceListID = p.TradePriceListID, Name = p.Name })
                        .Distinct()
                        .ToList()
                };

                objCache.Set(DateTime.Now, result, 360);
            }

            return result.Results;
        }
        
        public static List<SlicerCurrency> GetCurrencies()
        {
            var objCache = new PortalCache<SlicerCurrenciesCacheResult>("SlicerCurrencies");

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                var db = new PortalDbContext();

                result = new SlicerCurrenciesCacheResult()
                {
                    Results = db
                        .TradePriceLists
                        .Where(p => p.MarketID.HasValue && p.Deleted == false)
                        .Select(p => p.CurrencyID)
                        .Distinct()
                        .Select(p => new SlicerCurrency
                        {
                            CurrencyID = p.Value,
                            Currency = db.Currencies.Where(q => q.CurrencyID == p.Value).Select(q => new CurrencyShim() {
                                Name = q.Name,
                                FormattingCulture = q.FormattingCulture,
                                Code = q.Code
                            }).FirstOrDefault()
                        })
                        .ToList()
                };

                objCache.Set(DateTime.Now, result, 360);
            }

            return result.Results;
        }

        public static List<SlicerCurrency> GetCurrencies(PreSlicerFunctionFilter f1)
        {
            var objCache = new PortalCache<SlicerCurrenciesCacheResult>(String.Format("SlicerCurrencies~{0}~{1}~{2}",
                f1.MarketID,
                f1.TradePriceListID,
                f1.CurrencyID
            ));

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                var db = new PortalDbContext();
                
                result = new SlicerCurrenciesCacheResult()
                {

                    Results = db
                    .TradePriceLists
                    .Where(p => p.MarketID.HasValue && p.Deleted == false)
                    .Where(p => f1.MarketID.HasValue ? p.MarketID == f1.MarketID : true)
                    .Where(p => f1.TradePriceListID.HasValue ? p.TradePriceListID == f1.TradePriceListID : true)
                    .Where(p => f1.CurrencyID.HasValue ? p.CurrencyID == f1.CurrencyID : true)
                    .Select(p => p.CurrencyID)
                    .Distinct()
                    .Select(p => new SlicerCurrency
                    {
                        CurrencyID = p.Value,
                        Currency = db.Currencies.Where(q => q.CurrencyID == p.Value).Select(q => new CurrencyShim()
                        {
                            Name = q.Name,
                            FormattingCulture = q.FormattingCulture,
                            Code = q.Code
                        }).FirstOrDefault()
                    })
                    .ToList()
                };

                objCache.Set(DateTime.Now, result, 360);
            }

            return result.Results;
        }

        public static PriceCheckerSlicersInitialValues GetSlicerInitialValues(short? tradePriceListId, byte? marketId, byte? currencyId)
        {
            var objCache = new PortalCache<PriceCheckerSlicersInitialValues>(String.Format("initialValues~{0}~{1}~{2}", tradePriceListId, marketId, currencyId));

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                result = FetchInitialSlicerValues(tradePriceListId, marketId, currencyId);
                objCache.Set(DateTime.Now, result, 360);
            }

            return result;
        }

        public static List<SlicerBrand> GetBrands(short? tradePriceListId, byte? marketId, byte? currencyId)
        {
            var objCache = new PortalCache<PriceCheckerSlicersInitialValues>(String.Format("brands~{0}~{1}~{2}", tradePriceListId, marketId, currencyId));

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                result = FetchInitialSlicerValues(tradePriceListId, marketId, currencyId);
                objCache.Set(DateTime.Now, result, 360);
            }

            return result.Brands;
        }

        public static List<SlicerProductGroup> GetProductGroups()
        {
            var objCache = new PortalCache<SliceProductGroupCacheResult>("ProductGroups");

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                var db = new PortalDbContext();

                result = new SliceProductGroupCacheResult()
                {
                    Results = db.ProductGroups
                        .Select(p => new SlicerProductGroup
                        {
                            ProductGroupID = p.ProductGroupID,
                            Name = p.Name ?? p.Code
                        })
                        .ToList()
                };
            
                objCache.Set(DateTime.Now, result, 360);
            }

            return result.Results;
        }

        public static List<SlicerProductTypeGroup> GetProductTypeGroups(short? tradePriceListId, byte? marketId, byte? currencyId)
        {
            var objCache = new PortalCache<PriceCheckerSlicersInitialValues>(String.Format("productTypeGroups~{0}~{1}~{2}", tradePriceListId, marketId, currencyId));

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                result = FetchInitialSlicerValues(tradePriceListId, marketId, currencyId);
                objCache.Set(DateTime.Now, result, 360);
            }

            return result.ProductTypeGroups;
        }

        public static List<SlicerProductType> GetProductTypes(short? tradePriceListId, byte? marketId, byte? currencyId)
        {
            var objCache = new PortalCache<PriceCheckerSlicersInitialValues>(String.Format("productTypes~{0}~{1}~{2}", tradePriceListId, marketId, currencyId));

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                result = FetchInitialSlicerValues(tradePriceListId, marketId, currencyId);
                objCache.Set(DateTime.Now, result, 360);
            }

            return result.ProductTypes;
        }

        public static List<SlicerQuality> GetQualities(short? tradePriceListId, byte? marketId, byte? currencyId)
        {
            var objCache = new PortalCache<PriceCheckerSlicersInitialValues>(String.Format("qualities~{0}~{1}~{2}", tradePriceListId, marketId, currencyId));

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                result = FetchInitialSlicerValues(tradePriceListId, marketId, currencyId);
                objCache.Set(DateTime.Now, result, 360);
            }

            return result.Qualities;
        }

        public static List<SlicerItemType> GetItemTypes(short? tradePriceListId, byte? marketId, byte? currencyId)
        {
            var objCache = new PortalCache<PriceCheckerSlicersInitialValues>(String.Format("itemTypes~{0}~{1}~{2}", tradePriceListId, marketId, currencyId));

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                result = FetchInitialSlicerValues(tradePriceListId, marketId, currencyId);
                objCache.Set(DateTime.Now, result, 360);
            }

            return result.ItemTypes;
        }

        public static List<SlicerLaunch> GetLaunches(short? tradePriceListId, byte? marketId, byte? currencyId)
        {
            var objCache = new PortalCache<PriceCheckerSlicersInitialValues>(String.Format("launches~{0}~{1}~{2}", tradePriceListId, marketId, currencyId));

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                result = FetchInitialSlicerValues(tradePriceListId, marketId, currencyId);
                objCache.Set(DateTime.Now, result, 360);
            }

            return result.Launches;
        }

        public static List<SlicerSeason> GetSeasons(short? tradePriceListId, byte? marketId, byte? currencyId)
        {
            var objCache = new PortalCache<PriceCheckerSlicersInitialValues>(String.Format("seasons~{0}~{1}~{2}", tradePriceListId, marketId, currencyId));

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                result = FetchInitialSlicerValues(tradePriceListId, marketId, currencyId);
                objCache.Set(DateTime.Now, result, 360);
            }

            return result.Seasons;
        }

        public static List<SlicerShowClearance> GetClearanceDisplayOptions()
        {
            return new List<SlicerShowClearance>()
            {
                new SlicerShowClearance()
                {
                    Name = "Yes",
                    Value = true
                },
                new SlicerShowClearance()
                {
                    Name = "No",
                    Value = false
                }
            };
        }

        public static List<SlicerIncludeSample> GetIncludeSamplesOptions()
        {
            return new List<SlicerIncludeSample>()
            {
                new SlicerIncludeSample()
                {
                    Name = "Yes",
                    Value = true
                },
                new SlicerIncludeSample()
                {
                    Name = "No",
                    Value = false
                }
            };
        }

        public static List<SlicerProduct> GetProducts(
            string searchTerm, 
            short? collectionId, 
            short? qualityId, 
            int? productId, 
            byte? brandId, 
            byte? productTypeId,
            bool showClearance,
            bool includeSamples)
        {
            var objCache = new PortalCache<GetProductsCacheResult>(String.Format("products~{0}~{1}~{2}~{3}~{4}~{5}~{6}~{7}",
                searchTerm,
                collectionId,
                qualityId,
                productId,
                brandId,
                productTypeId,
                showClearance,
                includeSamples));

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                result = new GetProductsCacheResult()
                {
                    Products = FetchProductIDs(searchTerm,
                        collectionId,
                        qualityId,
                        productId,
                        brandId,
                        productTypeId,
                        showClearance,
                        includeSamples)
                };
                objCache.Set(DateTime.Now, result, 360);
            }

            return result.Products;
        }

        public static List<SlicerProduct> FetchProductIDs(
            string searchTerm, 
            short? collectionId, 
            short? qualityId, 
            int? productId, 
            byte? brandId, 
            byte? productTypeId,
            bool includeClearance,
            bool includeSamples)
        { 
            var results = new List<SlicerProduct>();
            
            using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["vm-sql"].ConnectionString))
            {
                var comm = conn.CreateCommand();
                comm.CommandType = System.Data.CommandType.Text;
                comm.CommandText = @"
                        SELECT
                                P.ProductID,
                                P.BrandID, 
			                    P.ProductTypeID, 
			                    PTG.ProductTypeGroupID,
			                    P.ItemTypeID, 
			                    P.LaunchID, 
			                    S.SeasonID,
                                P.Clearance,
                                CONVERT(BIT, CASE P.ProductTypeID WHEN 55 THEN 1 WHEN 56 THEN 1 ELSE 0 END),
                                ISNULL(P.BasketName, P.Name),
                                P.Code
                        FROM    dbo.Product AS P INNER JOIN
                                    dbo.Brand AS B ON B.BrandID = P.BrandID INNER JOIN
                                    dbo.ProductType AS PT ON PT.ProductTypeID = P.ProductTypeID INNER JOIN
                                    dbo.Launch AS L ON L.LaunchID = P.LaunchID INNER JOIN
                                    dbo.Season AS S ON S.SeasonID = L.SeasonID INNER JOIN
                                    adm.Mertex_ItemType AS IT ON IT.ItemTypeID = P.ItemTypeID INNER JOIN
                                    dbo.Stock AS ST ON ST.ProductID = P.ProductID INNER JOIN
                                    dbo.ProductTypeGroup AS PTG ON PTG.ProductTypeGroupID = PT.ProductTypeGroupID
                                    LEFT OUTER JOIN dbo.Quality AS Q ON Q.QualityID = P.QualityID
                                    LEFT OUTER JOIN dbo.Product_Collection AS PC ON PC.ProductID = P.ProductID
                                    LEFT OUTER JOIN dbo.[Collection] AS C ON C.CollectionID = PC.CollectionID
                    WHERE   ((@PricingApp = 1) OR (@PricingApp = 0 AND P.ProductID IS NOT NULL)) AND 
		                    (
		                        P.[Status] IN ('C', 'L', 'Y') OR -- Current or Limited
		                        (P.[Status] = 'D' AND ST.StockStatusID = 1 AND P.Clearance = 1) OR
		                        ((@PricingApp = 0) OR (@PricingApp = 1 AND P.[Status] = 'P'))
		                    ) AND 
		                    P.ItemTypeID IS NOT NULL AND 
                            ((@IncludeClearance = 1) OR (@IncludeClearance = 0 AND P.Clearance = 0)) AND 
		                    ((@IncludeSamples = 1) OR (@IncludeSamples = 0 AND P.ProductTypeID <> 55 AND P.ProductTypeID <> 56)) AND
		                     ((@CollectionID IS NULL) OR (C.CollectionID = @CollectionID)) AND
                             ((@QualityID IS NULL) OR (Q.QualityID = @QualityID)) AND
                             ((@ProductID IS NULL) OR (P.ProductID = @ProductID)) AND
                             ((@BrandID IS NULL) OR (P.BrandID = @BrandID)) AND
                             ((@ProductTypeID IS NULL) OR (P.ProductTypeID = @ProductTypeID)) AND
                             ((@SearchTerm IS NULL) OR(
                               C.[Name] LIKE @SearchTerm + '%' OR
                               Q.[Name] LIKE @SearchTerm + '%' OR
                               P.[Name] LIKE @SearchTerm + '%'))";

                /*
                -- Show Product without prices - only from pricing app
                 -- Discontinued with Stock
                  -- Include Prelaunch - only from pricing app
                 */
                comm.Parameters.AddWithValue("@PricingApp", true);
                comm.Parameters.AddWithValue("@SearchTerm", searchTerm ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@CollectionID", collectionId ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@QualityID", qualityId ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@ProductID", productId ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@BrandID", brandId ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@ProductTypeID", productTypeId ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@IncludeSamples", includeSamples);
                comm.Parameters.AddWithValue("@IncludeClearance", includeClearance);

                conn.Open();

                var reader = comm.ExecuteReader();

                while (reader.Read())
                {
                    results.Add(new SlicerProduct()
                    {
                        ProductID = reader.GetInt32(0),
                        BrandID = reader.GetByte(1),
                        ProductTypeID = reader.GetByte(2),
                        ProductTypeGroupID = reader.GetByte(3),
                        ItemTypeID = reader.IsDBNull(4) ? null : (short?)reader.GetInt16(4),
                        LaunchID = reader.GetInt16(5),
                        SeasonID = reader.GetByte(6),
                        Clearance = reader.GetBoolean(7),
                        Sample = reader.GetBoolean(8),
                        Name = reader.GetString(9),
                        Code = reader.GetString(10)
                    });
                }

                reader.Close();

                conn.Close();
            }

            return results;
        }
        
        private static List<PriceCheckerSlicerValue> RunQuery(
            short? tradePriceListId,
            byte? marketId,
            byte? currencyId,
            String searchTerm, 
            short? collectionId, 
            short? qualityId, 
            int? productId, 
            byte? brandId, 
            byte? productTypeId,
            bool? includeSamples,
            bool? includeClearance)
        {
            var spResults = new List<PriceCheckerSlicerValue>();

            using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["vm-sql"].ConnectionString))
            {
                var comm = conn.CreateCommand();
                comm.CommandType = System.Data.CommandType.StoredProcedure;
                comm.CommandText = "[portal].[Price_Enquiry_SlicerValues]";

                comm.Parameters.AddWithValue("@TradePriceListID", tradePriceListId ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@MarketID", marketId ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@CurrencyID", currencyId ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@SearchTerm", searchTerm ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@CollectionID", collectionId ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@QualityID", qualityId ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@ProductID", productId ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@ProductTypeID", productTypeId ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@BrandID", brandId ?? (object)DBNull.Value);
                comm.Parameters.AddWithValue("@IncludeSamples", includeSamples ?? false);
                comm.Parameters.AddWithValue("@IncludeClearance", includeClearance ?? false);

                conn.Open();

                var reader = comm.ExecuteReader();

                while (reader.Read())
                {
                    spResults.Add(new PriceCheckerSlicerValue()
                    {
                        BrandID = reader.GetByte(0),
                        ProductTypeID = reader.GetByte(1),
                        ProductTypeGroupID = reader.GetByte(2),
                        LaunchID = reader.GetInt16(3),
                        SeasonID = reader.GetByte(4),
                        ItemTypeID = reader.GetInt16(5)
                    });
                }

                reader.Close();

                conn.Close();
            }

            return spResults;
        }

        public static List<PriceCheckerSlicerValue> GetCompleteMatrix(short? tradePriceListId, byte? marketId, byte? currencyId)
        {
            var objCache = new PortalCache<GetCompleteMatrixResult>("completeMatrix");

            var result = objCache.Get(DateTime.Now);

            if (result == null)
            {
                result = new GetCompleteMatrixResult()
                {
                    Results = RunQuery(tradePriceListId, 
                        marketId, 
                        currencyId, 
                        null, 
                        null, 
                        null, 
                        null, 
                        null,
                        null,
                        null,
                        null)
                };
                objCache.Set(DateTime.Now, result, 360);
            }

            return result.Results;
        }

        public static List<PriceCheckerSlicerValue> GetMatrix(
            short? tradePriceListId,
            byte? marketId,
            byte? currencyId,
            string searchTerm,
            short? collectionId,
            short? qualityId,
            int? productId,
            byte? brandId,
            byte? productTypeId,
            bool? includeSamples,
            bool? includeClearance)
        {
            // it is entirely possible to cache these queries, but... would it be beneficial

            //var objCache = new PriceCheckerCache<List<PriceCheckerSlicerValue>>("completeMatrix");

            //var result = objCache.Get(DateTime.Now);

            //if (result == null)
            //{
            //    result = RunQuery(searchTerm, collectionID, qualityID, productID);
            //    objCache.Set(DateTime.Now, result, 360);
            //}

            return RunQuery(tradePriceListId, marketId, currencyId, searchTerm, collectionId, qualityId, productId, brandId, productTypeId, includeSamples, includeClearance);
        }
        
        public static PriceCheckerSlicersInitialValues FetchInitialSlicerValues(short? tradePriceListId, byte? marketId, byte? currencyId)
        {
            var result = new PriceCheckerSlicersInitialValues();

            var spResults = GetCompleteMatrix(tradePriceListId, marketId, currencyId);

            var portalDb = new PortalDbContext();

            // right, the problem we're facing now is thus:
            // we've got a list of ProductTypeGroups, which have NO concept of owning a BrandID.
            // They... eventually will hold a BrandId though, once we're sure which...
            // hang on, give them all nullable properties of the type they'll eventually have
            // use that?

            var brands = spResults.Select(p => p.BrandID).Distinct().ToList();
            var productTypeGroups = spResults.Select(p => p.ProductTypeGroupID).Distinct().ToList();
            var productTypes = spResults.Select(p => p.ProductTypeID).Distinct().ToList();
            var itemTypes = spResults.Select(p => p.ItemTypeID).Distinct().ToList();
            var launches = spResults.Select(p => p.LaunchID).Distinct().ToList();
            var seasons = spResults.Select(p => p.SeasonID).Distinct().ToList();
            
            result.Brands = portalDb.Brands.Where(p => brands.Contains(p.BrandID))
                .Select(p => new SlicerBrand() { BrandID = p.BrandID, Name = p.Name })
                .ToList();

            result.ProductTypeGroups = portalDb.ProductTypeGroups.Where(p => productTypeGroups.Contains(p.ProductTypeGroupID))
                .Select(p => new SlicerProductTypeGroup() { ProductTypeGroupID = p.ProductTypeGroupID, Name = p.Name })
                .ToList();

            result.ProductTypes = portalDb.ProductTypes.Where(p => productTypes.Contains(p.ProductTypeID))
                .Select(p => new SlicerProductType() { ProductTypeID = p.ProductTypeID, Name = p.Name })
                .ToList();

            result.ItemTypes = portalDb.ItemTypes.Where(p => itemTypes.Contains(p.ItemTypeID))
                .Select(p => new SlicerItemType() { ItemTypeID = p.ItemTypeID, Name = p.Name }).ToList();

            result.Launches = portalDb.Launches.Where(p => launches.Contains(p.LaunchID))
                .Select(p => new SlicerLaunch() { LaunchID = p.LaunchID, Name = p.Name }).ToList();

            result.Seasons = portalDb.Seasons.Where(p => seasons.Contains(p.SeasonID))
                .Select(p => new SlicerSeason() { SeasonID = p.SeasonID, Name = p.Name }).ToList();

            result.Qualities = portalDb.Qualities
                .Select(p => new SlicerQuality() { QualityID = p.QualityID, Name = p.Name, Code = p.Code }).ToList();

            return result;
        }
    }

    public class GetProductsCacheResult
    {
        public List<SlicerProduct> Products { get; set; }
    }

    public class GetCompleteMatrixResult
    {
        public List<PriceCheckerSlicerValue> Results { get; set; }
    }
}