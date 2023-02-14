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

namespace SharedEFClasses.Models
{
    public partial class PortalDbContext : IdentityDbContext<SharedEFClasses.Models.Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public MertexerV2SQL.Models.Misc.TradeAccountAddressReturn TradeAccountNumber_FetchAddresses(string tradeAccountNumber)
        {
            var result = new MertexerV2SQL.Models.Misc.TradeAccountAddressReturn();

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[TradeAccountNumber_FetchAddresses_Samples] @TradeAccountNumber";

            var tradeAccountNumberParam = new SqlParameter("@TradeAccountNumber", tradeAccountNumber);

            cmd.Parameters.Add(tradeAccountNumberParam);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                var primary = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<MertexerV2SQL.Models.Misc.TradeAccountPrimaryAddress>(reader);

                result.PrimaryAddresses = primary.ToList();

                reader.NextResult();

                var secondaries = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<MertexerV2SQL.Models.Misc.TradeAccountSecondaryAddress>(reader);

                result.SecondaryAddresses = secondaries.ToList();
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
        
        public List<TradeAccountNumber_AutocompleteResult> TradeAccountNumber_Autocomplete(string term, int memberId, int? tradeAccountId = null, short? marketId = null)
        {
            try
            {
                var termParam = new SqlParameter("@Term", term ?? (object)DBNull.Value);
                var marketIdParam = new SqlParameter("@MarketID", marketId ?? (object)DBNull.Value);
                var memberIdParam = new SqlParameter("@MemberID", memberId);
                var tradeAccountIdParam = new SqlParameter("@TradeAccountID", tradeAccountId ?? (object)DBNull.Value);
                var results = this.Database.SqlQuery<TradeAccountNumber_AutocompleteResult>("portal.TradeAccount_Search @Term, @MemberID, @TradeAccountID, @MarketID",
                    termParam,
                    memberIdParam,
                    tradeAccountIdParam,
                    marketIdParam).ToList();

                results.ForEach(c =>
                {
                    if (c.CurrencyID != null)
                    {
                        c.Currency = this.Currencies.Where(p => p.CurrencyID == c.CurrencyID).SingleOrDefault();
                    }
                });

                return results;
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);

                return new List<TradeAccountNumber_AutocompleteResult>();
            }
        }

        public TradeOrderEnquiryResult TradeOrderEnquirySearch(
            PassOrderEnquirySearch objEnquiry
            )
        {
            switch (objEnquiry.period)
            {
                case "today":
                    objEnquiry.to = null;
                    objEnquiry.from = DateTime.Now.Date;
                    break;

                case "last-30-days":
                    objEnquiry.to = null;
                    objEnquiry.from = DateTime.Now.AddDays(-30);
                    break;

                case "last-3-months":
                    objEnquiry.to = null;
                    objEnquiry.from = DateTime.Now.AddMonths(-3);
                    break;

                case "last-6-months":
                    objEnquiry.to = null;
                    objEnquiry.from = DateTime.Now.AddMonths(-6);
                    break;

                case "all-time":
                    objEnquiry.to = null;
                    objEnquiry.from = null;
                    break;

                default:
                    if (objEnquiry.period != null)
                    {
                        var year = DateTime.Now.Year;
                        if (Int32.TryParse(objEnquiry.period, out year))
                        {
                            // we've parsed a year... what year was it!
                            objEnquiry.from = new DateTime(year, 1, 1);
                            if (year != DateTime.Now.Year)
                            {
                                objEnquiry.to = new DateTime(year + 1, 1, 1);
                            }
                        }
                    }
                    break;
            }

            var parameters = new SqlParameter[] 
            {
                new SqlParameter("@TradeAccountGroupID", (object)objEnquiry.tradeAccountGroupId ?? DBNull.Value),
                new SqlParameter("@TradeAccountID", (object)objEnquiry.tradeAccountId ?? DBNull.Value),
                new SqlParameter("@SearchString", (object)objEnquiry.term ?? DBNull.Value),
                new SqlParameter("@From", (object)objEnquiry.from ?? DBNull.Value),
                new SqlParameter("@To", (object)objEnquiry.to ?? DBNull.Value),
                new SqlParameter("@ProductTypeID", (object)objEnquiry.productTypeId ?? DBNull.Value),
                new SqlParameter("@LanguageID", (object)objEnquiry.languageId ?? DBNull.Value),
                new SqlParameter("@OrderStatus", (object)objEnquiry.orderStatus ?? DBNull.Value)
            };

            var result = new TradeOrderEnquiryResult();

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = @"portal.OrderStatus_Enquiry 
                    @TradeAccountGroupID, 
                    @TradeAccountID,
                    @LanguageID,
                    @OrderStatus,
                    @SearchString,
                    @From,
                    @To,
                    @ProductTypeID";

            cmd.Parameters.AddRange(parameters);

            var lines = new List<TradeOrderEnquiryLineResult>();

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                var searchResults = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<TradeOrderEnquiryLineResult>(reader);

                lines = searchResults.ToList();
                //reader.NextResult();
                //var totalCount = ((IObjectContextAdapter)this)
                //    .ObjectContext
                //    .Translate<int>(reader);

                //result.TotalResultsCount = totalCount.Single();
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

            result.SearchResults = lines.GroupBy(p => p.OrderHeadID).Select(q => new TradeOrderEnquiryHeadResult()
            {
                OrderHeadID = q.First().OrderHeadID,
                OrderDate = q.First().OrderDate,
                CustomerOrderReference = q.First().CustomerOrderReference,
                FullName = q.First().FullName,
                Email = q.First().Email,
                PhoneNumber = q.First().PhoneNumber,
                AddressLine1 = q.First().AddressLine1,
                AddressLine2 = q.First().AddressLine2,
                Town = q.First().Town,
                County = q.First().County,
                Postcode = q.First().Postcode,
                Country = q.First().Country,
                ContactPreference = q.First().ContactPreference,
                OrderLines = q.ToList()
            }).ToList();
            
            result.TotalResultsCount = result.SearchResults.Count;

            return result;
        }

        public void TradeAccountAddress_UpdateLatLng(PassTradeAccountAddressCoordinates objCoords)
        {
            try
            {

            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            var a = this.TradeAccounts.Where(p => p.TradeAccountID == objCoords.tradeAccountId).Single();

            a.Latitude = objCoords.lat;
            a.Longitude = objCoords.lng;

            this.SaveChangesAsync();
        }


        public void TradeAccount_Competitor_Update(int memberId, PassCompetitorProductTypeGroups objCompetitor)
        {
            try
            {

            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            objCompetitor.productTypeGroups = objCompetitor.productTypeGroups
                                                           .Where(p => p.EstimatedValue != null ||
                                                                       p.Note != null || 
                                                                       p.oldNotes != null)
                                                           .ToList();


            foreach (var upsertRecord in objCompetitor.productTypeGroups)
            {
                var extantRecord = this.TradeAccount_Competitors
                    .Where(p => p.TradeAccountID == objCompetitor.tradeAccountId 
                             && p.CompetitorID == objCompetitor.competitor.CompetitorID
                             && p.ProductTypeGroupID == upsertRecord.ProductTypeGroupID)
                    .SingleOrDefault();

                // save estimatedValue
                // save newNote
                // update oldNotes

                // might need to create a whole new TAC record, might not.

                if (extantRecord == null)
                {
                    // need a whole new TAC record.
                    var tac = this.TradeAccount_Competitors.Add(new TradeAccount_Competitor()
                    {
                        TradeAccountID = objCompetitor.tradeAccountId,
                        CompetitorID = objCompetitor.competitor.CompetitorID,
                        Value = upsertRecord.EstimatedValue,
                        ProductTypeGroupID = upsertRecord.ProductTypeGroupID
                    });

                    this.SaveChanges();

                    if (!String.IsNullOrEmpty(upsertRecord.Note))
                    {
                        tac.Notes = new List<TradeAccountCompetitorNote>
                        {
                            new TradeAccountCompetitorNote()
                            {
                                TradeAccountCompetitorID = tac.TradeAccountCompetitorID,
                                CreatedMemberID = memberId,
                                Note = upsertRecord.Note
                            }
                        };
                    }

                    this.SaveChanges();
                }
                else
                {
                    extantRecord.Value = upsertRecord.EstimatedValue;

                    if (!String.IsNullOrEmpty(upsertRecord.Note))
                    {
                        extantRecord.Notes.Add(new TradeAccountCompetitorNote()
                        {
                            TradeAccountCompetitorID = extantRecord.TradeAccountCompetitorID,
                            CreatedMemberID = memberId,
                            Note = upsertRecord.Note
                        });
                    }

                    if (upsertRecord.oldNotes != null)
                    {
                        foreach (var note in upsertRecord.oldNotes.Where(p => p.Editable))
                        {
                            var extantNote = extantRecord.Notes.Where(p => p.NoteID == note.NoteID).Single();

                            extantNote.Note = note.observable;
                        }
                    }

                    this.SaveChanges();
                }
            }
        }

        public TradeAccountPotentialUpsertResult UpsertTradeAccountPotential(int memberId, PassTradeAccountPotential objPotential)
        {
            var result = new TradeAccountPotentialUpsertResult();

            try
            {
                if (objPotential.editingPotentialId.HasValue)
                {
                    var record = this.TradeAccountPotential.Where(p => p.PotentialID == objPotential.editingPotentialId).Single();

                    if (record.Potential == true && objPotential.editingPotential == false)
                    {
                        record.NoPotentialDT = DateTime.Now;
                        result.NoPotentialSince = PortalFramework.DateTimeDistanceString(record.NoPotentialDT, true, true);
                    }

                    if (objPotential.editingPotential == true)
                        record.NoPotentialDT = null;

                    record.Value = objPotential.editingValue;
                    record.Potential = objPotential.editingPotential;
                    record.FinancialYear = objPotential.editingFinancialYear;
                    record.Note = objPotential.editingNote;
                    record.ModifiedMemberID = memberId;

                    this.SaveChanges();

                    result.PotentialID = objPotential.editingPotentialId.Value;
                }
                else
                {
                    DateTime? noPotentialDt = objPotential.editingPotential ? null : (DateTime?)DateTime.Now;

                    var added = this.TradeAccountPotential.Add(new TradeAccountPotential()
                    {
                        Potential = objPotential.editingPotential,
                        NoPotentialDT = noPotentialDt,
                        Value = objPotential.editingValue,
                        FinancialYear = objPotential.editingFinancialYear,
                        BrandID = objPotential.editingBrandId,
                        ProductTypeGroupID = objPotential.editingProductTypeGroupId,
                        TradeAccountID = objPotential.tradeAccountId,
                        Note = objPotential.editingNote,
                        ModifiedMemberID = memberId
                    });

                    this.SaveChanges();

                    result.PotentialID = added.PotentialID;
                    result.NoPotentialSince = PortalFramework.DateTimeDistanceString(noPotentialDt, true, true);
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                if (this.Database.Connection.State != ConnectionState.Closed)
                    this.Database.Connection.Close();
            }

            return result;
        }

        public TradeAccount_SalesBy_ProductTypeGroup_Brand_Result TradeAccount_SalesBy_ProductTypeGroup_Brand(int tradeAccountId, string period)
        {
            try
            {
                var result = new TradeAccount_SalesBy_ProductTypeGroup_Brand_Result
                {
                    Period = period,
                    TradeAccountID = tradeAccountId,
                    Sales = new List<TradeAccount_ProductTypeGroup_Brand_Sales>()
                };

                string periodParameter = period;

                //switch (period)
                //{
                //    case "last-twelve":
                //        periodParameter = String.Format("[Date].[Month Name].&[{0}] : [Date].[Month Name].&[{1}]",
                //                                        DateTime.Now.AddYears(-1).ToString("MMMM yyyy"),
                //                                        DateTime.Now.ToString("MMMM yyyy"));
                //        break;
                //    default: break;
                //}

                using (var cubeConn = new AdomdConnection("Data Source=10.172.153.167;Catalog=TestBed"))
                {
                    cubeConn.Open();

                    AdomdCommand cubeComm = cubeConn.CreateCommand();

                    cubeComm.CommandText = @"
                    WITH 
                      MEMBER [Measures].[Brand ID] AS 
                        [Product].[Brand].CurrentMember.Member_Key
                      MEMBER [Measures].[Product Type Group ID] AS 
                        [Product].[Product Type Group].CurrentMember.Member_Key

                    SELECT
                    {   
                        [Measures].[Net Sales], 
                        [Measures].[Brand ID], 
                        [Measures].[Product Type Group ID]
                    } ON COLUMNS,
                    { 
                        (
                            [Product].[Brand].[Brand] * [Product].[Product Type Group].[Product Type Group]
                        ) 
                    } ON ROWS
                    FROM 
                    (
                        SELECT 
                        ( 
                            { 
                                StrToSet(@Period)
                            } 
                        ) ON COLUMNS
                        FROM 
                        (
                            SELECT 
                            ( 
                                { 
                                    StrToMember(@TradeAccount)
                                } 
                            ) ON COLUMNS
                            FROM 
                                [SalesAnalysis]
                        )
                    ) 
                    WHERE 
                    (
                        StrToMember(@TradeAccount),
                        StrToSet(@Period)
                    )";

                    //var cellSet = cubeComm.ExecuteCellSet();
                    //[Trade Account].[Trade Account].&[10221],
                    //[Date].[Financial Year Name].&[Fiscal Calendar 2017]
                    //[Date].[Month Name].&[January 2017] : [Date].[Month Name].&[July 2017]

                    cubeComm.Parameters.Add("TradeAccount", String.Format("[Trade Account].[Trade Account].&[{0}]", tradeAccountId));
                    cubeComm.Parameters.Add("Period", String.Format("[Date].[Financial Year].[Financial Year].[{0}]", periodParameter));

                    var reader = cubeComm.ExecuteReader();

                    while (reader.Read())
                    {
                        result.Sales.Add(new TradeAccount_ProductTypeGroup_Brand_Sales()
                        {
                            Value = reader.IsDBNull(2) ? null : (decimal?)reader.GetDecimal(2),
                            BrandID = reader.IsDBNull(3) ? (byte)0 : Convert.ToByte(reader.GetInt16(3)),
                            ProductTypeGroupID = reader.IsDBNull(4) ? (byte)0 : Convert.ToByte(reader.GetInt16(4))
                        });
                    }

                    //Debug.WriteLine("CellSet Cells.Count: {0}", cellSet.Cells.Count);


                    cubeConn.Close();

                    cubeConn.Dispose();
                }

                return result;
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public TradeAccount_Summary_Result TradeAccount_Summary(PassTradeAccountSummaryFilters objFilters)
        {
            try
            {
                var result = new TradeAccount_Summary_Result();

                TradeAccountSummary_FullMonthAndParallel(objFilters, ref result);

                TradeAccountSummary_MonthToDateAndParallel(objFilters, ref result);

                TradeAccountSummary_FullFinancialYearAndParallel(objFilters, ref result);

                TradeAccountSummary_FinancialYearToDateAndParallel(objFilters, ref result);

                TradeAccountSummary_FullCalendarYearAndParallel(objFilters, ref result);

                TradeAccountSummary_CalendarYeartoDateAndParallel(objFilters, ref result);

                return result;
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public void TradeAccountSummary_FullMonthAndParallel(PassTradeAccountSummaryFilters objFilters, ref TradeAccount_Summary_Result result)
        {
            try
            {
                using (var cubeConn = new AdomdConnection("Data Source=10.172.153.167;Catalog=TestBed"))
                {
                    cubeConn.Open();

                    AdomdCommand cubeComm = cubeConn.CreateCommand();

                    cubeComm.CommandText = @"
                    WITH 
                        SET [CurrentMonth] AS StrToMember(@ThisMonth)
                        SET [PreviousYear] AS TAIL({NULL: PARALLELPERIOD([Date].[Calendar Drilldown].[Year], 1, [CurrentMonth].ITEM(0))}, 1)
                        SET [BeforeThat] AS TAIL({NULL: PARALLELPERIOD([Date].[Calendar Drilldown].[Year], 2, [CurrentMonth].ITEM(0))}, 1)

	                    MEMBER
	                    [Measures].[Net Sales FM] AS
	                    SUM (
		                    ([CurrentMonth].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales LYFM] AS
	                    SUM (
		                    ([PreviousYear].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales PLYFM] AS
	                    SUM (
		                    MTD([BeforeThat].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
	                    MEMBER
	                    [Measures].[Net Credits FM] AS
	                    SUM (
		                    ([CurrentMonth].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Net Credits LYFM] AS
	                    SUM (
		                    ([PreviousYear].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Net Credits PLYFM] AS
	                    SUM (
		                    MTD([BeforeThat].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Order Count FM] AS
	                    SUM (
		                    ([CurrentMonth].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Order Count LYFM] AS
	                    SUM (
		                    ([PreviousYear].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Order Count PLYFM] AS
	                    SUM (
		                    ([BeforeThat].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count FM] AS
	                    SUM (
		                    ([CurrentMonth].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count LYFM] AS
	                    SUM (
		                    ([PreviousYear].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count PLYFM] AS
	                    SUM (
		                    ([BeforeThat].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales % Variance TYLY] AS
	                        IIF([Measures].[Net Sales LYFM] = 0, NULL, ((ABS([Measures].[Net Sales FM]) - ABS([Measures].[Net Sales LYFM])) / ABS([Measures].[Net Sales LYFM]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Sales % Variance LYPY] AS
	                        IIF([Measures].[Net Sales PLYFM] = 0, NULL, ((ABS([Measures].[Net Sales LYFM]) - ABS([Measures].[Net Sales PLYFM])) / ABS([Measures].[Net Sales PLYFM]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Order Count % Variance TYLY] AS
	                        IIF([Measures].[Order Count LYFM] = 0, NULL, ((ABS([Measures].[Order Count FM]) - ABS([Measures].[Order Count LYFM])) / ABS([Measures].[Order Count LYFM]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Order Count % Variance LYPY] AS
	                        IIF([Measures].[Order Count PLYFM] = 0, NULL, ((ABS([Measures].[Order Count LYFM]) - ABS([Measures].[Order Count PLYFM])) / ABS([Measures].[Order Count PLYFM]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Credits % Variance TYLY] AS
	                        IIF([Measures].[Net Credits LYFM] = 0, NULL, ((ABS([Measures].[Net Credits FM]) - ABS([Measures].[Net Credits LYFM])) / ABS([Measures].[Net Credits LYFM]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Credits % Variance LYPY] AS
	                        IIF([Measures].[Net Credits PLYFM] = 0, NULL, ((ABS([Measures].[Net Credits LYFM]) - ABS([Measures].[Net Credits PLYFM])) / ABS([Measures].[Net Credits PLYFM]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Sample Order Count % Variance TYLY] AS
	                        IIF([Measures].[Sample Order Count LYFM] = 0, NULL, ((ABS([Measures].[Sample Order Count FM]) - ABS([Measures].[Sample Order Count LYFM])) / ABS([Measures].[Sample Order Count LYFM]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Sample Order Count % Variance LYPY] AS
	                        IIF([Measures].[Sample Order Count PLYFM] = 0, NULL, ((ABS([Measures].[Sample Order Count LYFM]) - ABS([Measures].[Sample Order Count PLYFM])) / ABS([Measures].[Sample Order Count PLYFM]))), FORMAT_STRING = 'percent'
                    SELECT
                        {
		                    [Measures].[Net Sales FM],
		                    [Measures].[Net Sales LYFM],
		                    [Measures].[Net Credits FM],
		                    [Measures].[Net Credits LYFM],
		                    [Measures].[Order Count FM],
		                    [Measures].[Order Count LYFM],
		                    [Measures].[Sample Order Count FM],
		                    [Measures].[Sample Order Count LYFM],
		                    [Measures].[Net Sales % Variance TYLY],
		                    [Measures].[Net Sales % Variance LYPY],
		                    [Measures].[Order Count % Variance TYLY],
		                    [Measures].[Order Count % Variance LYPY],
		                    [Measures].[Net Credits % Variance TYLY],
		                    [Measures].[Net Credits % Variance LYPY],
		                    [Measures].[Sample Order Count % Variance TYLY],
		                    [Measures].[Sample Order Count % Variance LYPY]
                        } ON COLUMNS,
                        {
		                    [CurrentMonth].ITEM(0)
                        } ON ROWS
                    FROM 
                    [SalesAnalysis]
                    WHERE 
                    (
	                     StrToMember(@TradeAccount)
	                    ,StrToMember(@Brand)
	                    ,StrToMember(@ProductTypeGroup)
                    )";

                    cubeComm.Parameters.Add("ThisMonth", String.Format("[Date].[Calendar Drilldown].[Month].[{0}]",
                        DateTime.Now.ToString("MMMM yyyy")));

                    cubeComm.Parameters.Add("TradeAccount", String.Format("[Trade Account].[Trade Account].&[{0}]",
                        objFilters.tradeAccountId));

                    cubeComm.Parameters.Add("Brand", String.Format("[Product].[Brand].{0}",
                        objFilters.brandId.HasValue ? String.Format("&[{0}]", objFilters.brandId) : "[All]"));

                    cubeComm.Parameters.Add("ProductTypeGroup", String.Format("[Product].[Product Type Group].{0}",
                        objFilters.productTypeGroupId.HasValue ? String.Format("&[{0}]", objFilters.productTypeGroupId) : "[All]"));

                    var r = new DataTable();

                    using (var adapter = new AdomdDataAdapter(cubeComm))
                    {
                        adapter.Fill(r);
                        adapter.Dispose();
                    }

                    cubeConn.Close();

                    cubeConn.Dispose();

                    result.NetSales_FM = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Sales FM]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Sales FM]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetSales_LYFM = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Sales LYFM]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Sales LYFM]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetCredits_FM = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Credits FM]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Credits FM]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetCredits_LYFM = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Credits LYFM]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Credits LYFM]"]), 0, MidpointRounding.AwayFromZero);
                    result.OrderCount_FM = Convert.ToInt32(r.Rows[0]["[Measures].[Order Count FM]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Order Count FM]"]);
                    result.OrderCount_LYFM = Convert.ToInt32(r.Rows[0]["[Measures].[Order Count LYFM]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Order Count LYFM]"]);
                    result.SampleOrderCount_FM = Convert.ToInt32(r.Rows[0]["[Measures].[Sample Order Count FM]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Sample Order Count FM]"]);
                    result.SampleOrderCount_LYFM = Convert.ToInt32(r.Rows[0]["[Measures].[Sample Order Count LYFM]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Sample Order Count LYFM]"]);
                    result.NetSalesVariance_FM_LYFM = Convert.ToString(r.Rows[0]["[Measures].[Net Sales % Variance TYLY]"]);
                    result.NetSalesVariance_LYFM_PLYFM = Convert.ToString(r.Rows[0]["[Measures].[Net Sales % Variance LYPY]"]);
                    result.OrderCountVariance_FM_LYFM = Convert.ToString(r.Rows[0]["[Measures].[Order Count % Variance TYLY]"]);
                    result.OrderCountVariance_LYFM_PLYFM = Convert.ToString(r.Rows[0]["[Measures].[Order Count % Variance LYPY]"]);
                    result.NetCreditsVariance_FM_LYFM = Convert.ToString(r.Rows[0]["[Measures].[Net Credits % Variance TYLY]"]);
                    result.NetCreditsVariance_LYFM_PLYFM = Convert.ToString(r.Rows[0]["[Measures].[Net Credits % Variance LYPY]"]);
                    result.SampleOrderCountVariance_FM_LYFM = Convert.ToString(r.Rows[0]["[Measures].[Sample Order Count % Variance TYLY]"]);
                    result.SampleOrderCountVariance_LYFM_PLYFM = Convert.ToString(r.Rows[0]["[Measures].[Sample Order Count % Variance LYPY]"]);
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public void TradeAccountSummary_MonthToDateAndParallel(PassTradeAccountSummaryFilters objFilters, ref TradeAccount_Summary_Result result)
        {
            try
            {
                using (var cubeConn = new AdomdConnection("Data Source=10.172.153.167;Catalog=TestBed"))
                {
                    cubeConn.Open();

                    AdomdCommand cubeComm = cubeConn.CreateCommand();

                    cubeComm.CommandText = @"
                    WITH 
                        SET [SpecifiedDate] AS StrToSet(@Today)
                        SET [PreviousYear] AS TAIL({NULL: PARALLELPERIOD([Date].[Calendar Drilldown].[Year], 1, [SpecifiedDate].ITEM(0))}, 1)
                        SET [BeforeThat] AS TAIL({NULL: PARALLELPERIOD([Date].[Calendar Drilldown].[Year], 2, [SpecifiedDate].ITEM(0))}, 1)

	                    MEMBER
	                    [Measures].[Net Sales MTD] AS
	                    SUM (
		                    MTD([SpecifiedDate].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales LYMTD] AS
	                    SUM (
		                    MTD([PreviousYear].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales PLYMTD] AS
	                    SUM (
		                    MTD([BeforeThat].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
	                    MEMBER
	                    [Measures].[Net Credits MTD] AS
	                    SUM (
		                    MTD([SpecifiedDate].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Net Credits LYMTD] AS
	                    SUM (
		                    MTD([PreviousYear].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Net Credits PLYMTD] AS
	                    SUM (
		                    MTD([BeforeThat].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Order Count MTD] AS
	                    SUM (
		                    MTD([SpecifiedDate].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Order Count LYMTD] AS
	                    SUM (
		                    MTD([PreviousYear].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Order Count PLYMTD] AS
	                    SUM (
		                    MTD([BeforeThat].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count MTD] AS
	                    SUM (
		                    MTD([SpecifiedDate].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count LYMTD] AS
	                    SUM (
		                    MTD([PreviousYear].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count PLYMTD] AS
	                    SUM (
		                    MTD([BeforeThat].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales % Variance TYLY] AS
	                        IIF([Measures].[Net Sales LYMTD] = 0, NULL, ((ABS([Measures].[Net Sales MTD]) - ABS([Measures].[Net Sales LYMTD])) / ABS([Measures].[Net Sales LYMTD]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Sales % Variance LYPY] AS
	                        IIF([Measures].[Net Sales PLYMTD] = 0, NULL, ((ABS([Measures].[Net Sales LYMTD]) - ABS([Measures].[Net Sales PLYMTD])) / ABS([Measures].[Net Sales PLYMTD]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Credits % Variance TYLY] AS
	                        IIF([Measures].[Net Credits LYMTD] = 0, NULL, ((ABS([Measures].[Net Credits MTD]) - ABS([Measures].[Net Credits LYMTD])) / ABS([Measures].[Net Credits LYMTD]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Credits % Variance LYPY] AS
	                        IIF([Measures].[Net Credits PLYMTD] = 0, NULL, ((ABS([Measures].[Net Credits LYMTD]) - ABS([Measures].[Net Credits PLYMTD])) / ABS([Measures].[Net Credits PLYMTD]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Order Count % Variance TYLY] AS
	                        IIF([Measures].[Order Count LYMTD] = 0, NULL, ((ABS([Measures].[Order Count MTD]) - ABS([Measures].[Order Count LYMTD])) / ABS([Measures].[Order Count LYMTD]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Order Count % Variance LYPY] AS
	                        IIF([Measures].[Order Count PLYMTD] = 0, NULL, ((ABS([Measures].[Order Count LYMTD]) - ABS([Measures].[Order Count PLYMTD])) / ABS([Measures].[Order Count PLYMTD]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Sample Order Count % Variance TYLY] AS
	                        IIF([Measures].[Sample Order Count LYMTD] = 0, NULL, ((ABS([Measures].[Sample Order Count MTD]) - ABS([Measures].[Sample Order Count LYMTD])) / ABS([Measures].[Sample Order Count LYMTD]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Sample Order Count % Variance LYPY] AS
	                        IIF([Measures].[Sample Order Count PLYMTD] = 0, NULL, ((ABS([Measures].[Sample Order Count LYMTD]) - ABS([Measures].[Sample Order Count PLYMTD])) / ABS([Measures].[Sample Order Count PLYMTD]))), FORMAT_STRING = 'percent'
                    SELECT
	                    {
		                    [Measures].[Net Sales MTD],
		                    [Measures].[Net Sales LYMTD],
		                    [Measures].[Net Credits MTD],
		                    [Measures].[Net Credits LYMTD],
		                    [Measures].[Order Count MTD],
		                    [Measures].[Order Count LYMTD],
		                    [Measures].[Sample Order Count MTD],
		                    [Measures].[Sample Order Count LYMTD],
		                    [Measures].[Net Sales % Variance TYLY],
		                    [Measures].[Net Sales % Variance LYPY],
		                    [Measures].[Net Credits % Variance TYLY],
		                    [Measures].[Net Credits % Variance LYPY],
		                    [Measures].[Order Count % Variance TYLY],
		                    [Measures].[Order Count % Variance LYPY],
		                    [Measures].[Sample Order Count % Variance TYLY],
		                    [Measures].[Sample Order Count % Variance LYPY]
	                    } ON COLUMNS,
	                    {
		                    [SpecifiedDate]
	                    } ON ROWS
                    FROM [SalesAnalysis]
                    WHERE 
                    (
	                     StrToMember(@TradeAccount)
	                    ,StrToMember(@Brand)
	                    ,StrToMember(@ProductTypeGroup)
                    )";

                    cubeComm.Parameters.Add("Today", String.Format("[Date].[Calendar Drilldown].&[{0}]",
                        DateTime.Now.ToString("yyyy-MM-ddT00:00:00")));

                    cubeComm.Parameters.Add("TradeAccount", String.Format("[Trade Account].[Trade Account].&[{0}]",
                        objFilters.tradeAccountId));

                    cubeComm.Parameters.Add("Brand", String.Format("[Product].[Brand].{0}",
                        objFilters.brandId.HasValue ? String.Format("&[{0}]", objFilters.brandId) : "[All]"));

                    cubeComm.Parameters.Add("ProductTypeGroup", String.Format("[Product].[Product Type Group].{0}",
                        objFilters.productTypeGroupId.HasValue ? String.Format("&[{0}]", objFilters.productTypeGroupId) : "[All]"));

                    var r = new DataTable();

                    using (var adapter = new AdomdDataAdapter(cubeComm))
                    {
                        adapter.Fill(r);
                        adapter.Dispose();
                    }

                    cubeConn.Close();

                    cubeConn.Dispose();

                    result.NetSales_MTD = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Sales MTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Sales MTD]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetSales_LYMTD = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Sales LYMTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Sales LYMTD]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetCredits_MTD = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Credits MTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Credits MTD]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetCredits_LYMTD = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Credits LYMTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Credits LYMTD]"]), 0, MidpointRounding.AwayFromZero);
                    result.OrderCount_MTD = Convert.ToInt32(r.Rows[0]["[Measures].[Order Count MTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Order Count MTD]"]);
                    result.OrderCount_LYMTD = Convert.ToInt32(r.Rows[0]["[Measures].[Order Count LYMTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Order Count LYMTD]"]);
                    result.SampleOrderCount_MTD = Convert.ToInt32(r.Rows[0]["[Measures].[Sample Order Count MTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Sample Order Count MTD]"]);
                    result.SampleOrderCount_LYMTD = Convert.ToInt32(r.Rows[0]["[Measures].[Sample Order Count LYMTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Sample Order Count LYMTD]"]);
                    result.NetSalesVariance_MTD_LYMTD = Convert.ToString(r.Rows[0]["[Measures].[Net Sales % Variance TYLY]"]);
                    result.NetSalesVariance_LYMTD_PLYMTD = Convert.ToString(r.Rows[0]["[Measures].[Net Sales % Variance LYPY]"]);
                    result.NetCreditsVariance_MTD_LYMTD = Convert.ToString(r.Rows[0]["[Measures].[Net Credits % Variance TYLY]"]);
                    result.NetCreditsVariance_LYMTD_PLYMTD = Convert.ToString(r.Rows[0]["[Measures].[Net Credits % Variance LYPY]"]);
                    result.OrderCountVariance_MTD_LYMTD = Convert.ToString(r.Rows[0]["[Measures].[Order Count % Variance TYLY]"]);
                    result.OrderCountVariance_LYMTD_PLYMTD = Convert.ToString(r.Rows[0]["[Measures].[Order Count % Variance LYPY]"]);
                    result.SampleOrderCountVariance_MTD_LYMTD = Convert.ToString(r.Rows[0]["[Measures].[Sample Order Count % Variance TYLY]"]);
                    result.SampleOrderCountVariance_LYMTD_PLYMTD = Convert.ToString(r.Rows[0]["[Measures].[Sample Order Count % Variance LYPY]"]);
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public void TradeAccountSummary_FullFinancialYearAndParallel(PassTradeAccountSummaryFilters objFilters, ref TradeAccount_Summary_Result result)
        {
            try
            {
                using (var cubeConn = new AdomdConnection("Data Source=10.172.153.167;Catalog=TestBed"))
                {
                    cubeConn.Open();

                    AdomdCommand cubeComm = cubeConn.CreateCommand();

                    cubeComm.CommandText = @"
                    WITH 
                        SET [CurrentFY] AS StrToSet(@Year)
                        SET [PreviousFY] AS TAIL({NULL: PARALLELPERIOD([Date].[Financial Drilldown].[Financial Year], 1, [CurrentFY].ITEM(0))}, 1)
                        SET [BeforeThat] AS TAIL({NULL: PARALLELPERIOD([Date].[Financial Drilldown].[Financial Year], 2, [CurrentFY].ITEM(0))}, 1)

	                    MEMBER
	                    [Measures].[Net Sales FY] AS
	                    SUM (
		                    ([CurrentFY].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales LYFY] AS
	                    SUM (
		                    ([PreviousFY].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales PLYFY] AS
	                    SUM (
		                    ([BeforeThat].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
	                    MEMBER
	                    [Measures].[Net Credits FY] AS
	                    SUM (
		                    ([CurrentFY].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Net Credits LYFY] AS
	                    SUM (
		                    ([PreviousFY].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Net Credits PLYFY] AS
	                    SUM (
		                    ([BeforeThat].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Order Count FY] AS
	                    SUM (
		                    ([CurrentFY].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Order Count LYFY] AS
	                    SUM (
		                    ([PreviousFY].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Order Count PLYFY] AS
	                    SUM (
		                    ([BeforeThat].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count FY] AS
	                    SUM (
		                    ([CurrentFY].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count LYFY] AS
	                    SUM (
		                    ([PreviousFY].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count PLYFY] AS
	                    SUM (
		                    ([BeforeThat].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales % Variance TYLY] AS
	                        IIF([Measures].[Net Sales LYFY] = 0, NULL, ((ABS([Measures].[Net Sales FY]) - ABS([Measures].[Net Sales LYFY])) / ABS([Measures].[Net Sales LYFY]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Sales % Variance LYPY] AS
	                        IIF([Measures].[Net Sales PLYFY] = 0, NULL, ((ABS([Measures].[Net Sales LYFY]) - ABS([Measures].[Net Sales PLYFY])) / ABS([Measures].[Net Sales PLYFY]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Credits % Variance TYLY] AS
	                        IIF([Measures].[Net Credits LYFY] = 0, NULL, ((ABS([Measures].[Net Credits FY]) - ABS([Measures].[Net Credits LYFY])) / ABS([Measures].[Net Credits LYFY]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Credits % Variance LYPY] AS
	                        IIF([Measures].[Net Credits PLYFY] = 0, NULL, ((ABS([Measures].[Net Credits LYFY]) - ABS([Measures].[Net Credits PLYFY])) / ABS([Measures].[Net Credits PLYFY]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Order Count % Variance TYLY] AS
	                        IIF([Measures].[Order Count LYFY] = 0, NULL, ((ABS([Measures].[Order Count FY]) - ABS([Measures].[Order Count LYFY])) / ABS([Measures].[Order Count LYFY]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Order Count % Variance LYPY] AS
	                        IIF([Measures].[Order Count PLYFY] = 0, NULL, ((ABS([Measures].[Order Count LYFY]) - ABS([Measures].[Order Count PLYFY])) / ABS([Measures].[Order Count PLYFY]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Sample Order Count % Variance TYLY] AS
	                        IIF([Measures].[Sample Order Count LYFY] = 0, NULL, ((ABS([Measures].[Sample Order Count FY]) - ABS([Measures].[Sample Order Count LYFY])) / ABS([Measures].[Sample Order Count LYFY]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Sample Order Count % Variance LYPY] AS
	                        IIF([Measures].[Sample Order Count PLYFY] = 0, NULL, ((ABS([Measures].[Sample Order Count LYFY]) - ABS([Measures].[Sample Order Count PLYFY])) / ABS([Measures].[Sample Order Count PLYFY]))), FORMAT_STRING = 'percent'
                    SELECT
                        {
		                    [Measures].[Net Sales FY],
		                    [Measures].[Net Sales LYFY],
		                    [Measures].[Net Credits FY],
		                    [Measures].[Net Credits LYFY],
		                    [Measures].[Order Count FY],
		                    [Measures].[Order Count LYFY],
		                    [Measures].[Sample Order Count FY],
		                    [Measures].[Sample Order Count LYFY],
		                    [Measures].[Net Sales % Variance TYLY],
		                    [Measures].[Net Sales % Variance LYPY],
		                    [Measures].[Net Credits % Variance TYLY],
		                    [Measures].[Net Credits % Variance LYPY],
		                    [Measures].[Order Count % Variance TYLY],
		                    [Measures].[Order Count % Variance LYPY],
		                    [Measures].[Sample Order Count % Variance TYLY],
		                    [Measures].[Sample Order Count % Variance LYPY]
                        } ON COLUMNS,
                        {
		                    [CurrentFY]
                        } ON ROWS
                    FROM 
                    [SalesAnalysis]
                    WHERE 
                    (
	                     StrToMember(@TradeAccount)
	                    ,StrToMember(@Brand)
	                    ,StrToMember(@ProductTypeGroup)
                    )";

                    cubeComm.Parameters.Add("Year", String.Format("[Date].[Financial Drilldown].[Financial Year].[Fiscal Calendar {0}]",
                        DateTime.Now.AddYears(1).ToString("yyyy")));

                    cubeComm.Parameters.Add("TradeAccount", String.Format("[Trade Account].[Trade Account].&[{0}]",
                        objFilters.tradeAccountId));

                    cubeComm.Parameters.Add("Brand", String.Format("[Product].[Brand].{0}",
                        objFilters.brandId.HasValue ? String.Format("&[{0}]", objFilters.brandId) : "[All]"));

                    cubeComm.Parameters.Add("ProductTypeGroup", String.Format("[Product].[Product Type Group].{0}",
                        objFilters.productTypeGroupId.HasValue ? String.Format("&[{0}]", objFilters.productTypeGroupId) : "[All]"));

                    var r = new DataTable();

                    using (var adapter = new AdomdDataAdapter(cubeComm))
                    {
                        adapter.Fill(r);
                        adapter.Dispose();
                    }

                    cubeConn.Close();

                    cubeConn.Dispose();

                    result.NetSales_FY = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Sales FY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Sales FY]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetSales_LFY = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Sales LYFY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Sales LYFY]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetCredits_FY = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Credits FY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Credits FY]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetCredits_LFY = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Credits LYFY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Credits LYFY]"]), 0, MidpointRounding.AwayFromZero);
                    result.OrderCount_FY = Convert.ToInt32(r.Rows[0]["[Measures].[Order Count FY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Order Count FY]"]);
                    result.OrderCount_LFY = Convert.ToInt32(r.Rows[0]["[Measures].[Order Count LYFY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Order Count LYFY]"]);
                    result.SampleOrderCount_FY = Convert.ToInt32(r.Rows[0]["[Measures].[Sample Order Count FY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Sample Order Count FY]"]);
                    result.SampleOrderCount_LFY = Convert.ToInt32(r.Rows[0]["[Measures].[Sample Order Count LYFY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Sample Order Count LYFY]"]);
                    result.NetSalesVariance_FY_LFY = Convert.ToString(r.Rows[0]["[Measures].[Net Sales % Variance TYLY]"]);
                    result.NetSalesVariance_LFY_PLFY = Convert.ToString(r.Rows[0]["[Measures].[Net Sales % Variance LYPY]"]);
                    result.NetCreditsVariance_FY_LFY = Convert.ToString(r.Rows[0]["[Measures].[Net Credits % Variance TYLY]"]);
                    result.NetCreditsVariance_LFY_PLFY = Convert.ToString(r.Rows[0]["[Measures].[Net Credits % Variance LYPY]"]);
                    result.OrderCountVariance_FY_LFY = Convert.ToString(r.Rows[0]["[Measures].[Order Count % Variance TYLY]"]);
                    result.OrderCountVariance_LFY_PLFY = Convert.ToString(r.Rows[0]["[Measures].[Order Count % Variance LYPY]"]);
                    result.SampleOrderCountVariance_FY_LFY = Convert.ToString(r.Rows[0]["[Measures].[Sample Order Count % Variance TYLY]"]);
                    result.SampleOrderCountVariance_LFY_PLFY = Convert.ToString(r.Rows[0]["[Measures].[Sample Order Count % Variance LYPY]"]);
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }
        
        public void TradeAccountSummary_FinancialYearToDateAndParallel(PassTradeAccountSummaryFilters objFilters, ref TradeAccount_Summary_Result result)
        {
            try
            {
                using (var cubeConn = new AdomdConnection("Data Source=10.172.153.167;Catalog=TestBed"))
                {
                    cubeConn.Open();

                    AdomdCommand cubeComm = cubeConn.CreateCommand();

                    cubeComm.CommandText = @"
                    WITH 
                        SET [SpecifiedDate] AS StrToSet(@Today)
                        SET [PreviousYear] AS TAIL({NULL: ParallelPeriod([Date].[Financial Drilldown].[Financial Year], 1, [SpecifiedDate].ITEM(0))}, 1)
                        SET [BeforeThat] AS TAIL({NULL: ParallelPeriod([Date].[Financial Drilldown].[Financial Year], 2, [SpecifiedDate].ITEM(0))}, 1)
	                    	
                        MEMBER
	                    [Measures].[Net Sales FYTD] AS
	                    SUM (
		                    PeriodsToDate([Date].[Financial Drilldown].[Financial Year],
					                        [SpecifiedDate].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales LFYTD] AS
	                    SUM (
		                    PeriodsToDate([Date].[Financial Drilldown].[Financial Year],
					                        [PreviousYear].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales PLFYTD] AS
	                    SUM (
		                    PeriodsToDate([Date].[Financial Drilldown].[Financial Year],
					                        [BeforeThat].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
                        MEMBER
	                    [Measures].[Net Credits FYTD] AS
	                    SUM (
		                    PeriodsToDate([Date].[Financial Drilldown].[Financial Year],
					                        [SpecifiedDate].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Net Credits LFYTD] AS
	                    SUM (
		                    PeriodsToDate([Date].[Financial Drilldown].[Financial Year],
					                        [PreviousYear].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Net Credits PLFYTD] AS
	                    SUM (
		                    PeriodsToDate([Date].[Financial Drilldown].[Financial Year],
					                        [BeforeThat].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Order Count FYTD] AS
	                    SUM (
		                    PeriodsToDate([Date].[Financial Drilldown].[Financial Year],
					                        [SpecifiedDate].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Order Count LFYTD] AS
	                    SUM (
		                    PeriodsToDate([Date].[Financial Drilldown].[Financial Year],
					                        [PreviousYear].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Order Count PLFYTD] AS
	                    SUM (
		                    PeriodsToDate([Date].[Financial Drilldown].[Financial Year],
					                        [BeforeThat].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count FYTD] AS
	                    SUM (
		                    PeriodsToDate([Date].[Financial Drilldown].[Financial Year],
					                        [SpecifiedDate].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count LFYTD] AS
	                    SUM (
		                    PeriodsToDate([Date].[Financial Drilldown].[Financial Year],
					                        [PreviousYear].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count PLFYTD] AS
	                    SUM (
		                    PeriodsToDate([Date].[Financial Drilldown].[Financial Year],
					                        [BeforeThat].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales % Variance TYLY] AS
	                        IIF([Measures].[Net Sales LFYTD] = 0, NULL, ((ABS([Measures].[Net Sales FYTD]) - ABS([Measures].[Net Sales LFYTD])) / ABS([Measures].[Net Sales LFYTD]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Sales % Variance LYPY] AS
	                        IIF([Measures].[Net Sales PLFYTD] = 0, NULL, ((ABS([Measures].[Net Sales LFYTD]) - ABS([Measures].[Net Sales PLFYTD])) / ABS([Measures].[Net Sales PLFYTD]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Credits % Variance TYLY] AS
	                        IIF([Measures].[Net Credits LFYTD] = 0, NULL, ((ABS([Measures].[Net Credits FYTD]) - ABS([Measures].[Net Credits LFYTD])) / ABS([Measures].[Net Credits LFYTD]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Credits % Variance LYPY] AS
	                        IIF([Measures].[Net Credits PLFYTD] = 0, NULL, ((ABS([Measures].[Net Credits LFYTD]) - ABS([Measures].[Net Credits PLFYTD])) / ABS([Measures].[Net Credits PLFYTD]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Order Count % Variance TYLY] AS
	                        IIF([Measures].[Order Count LFYTD] = 0, NULL, ((ABS([Measures].[Order Count FYTD]) - ABS([Measures].[Order Count LFYTD])) / ABS([Measures].[Order Count LFYTD]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Order Count % Variance LYPY] AS
	                        IIF([Measures].[Order Count PLFYTD] = 0, NULL, ((ABS([Measures].[Order Count LFYTD]) - ABS([Measures].[Order Count PLFYTD])) / ABS([Measures].[Order Count PLFYTD]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Sample Order Count % Variance TYLY] AS
	                        IIF([Measures].[Sample Order Count LFYTD] = 0, NULL, ((ABS([Measures].[Sample Order Count FYTD]) - ABS([Measures].[Sample Order Count LFYTD])) / ABS([Measures].[Sample Order Count LFYTD]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Sample Order Count % Variance LYPY] AS
	                        IIF([Measures].[Sample Order Count PLFYTD] = 0, NULL, ((ABS([Measures].[Sample Order Count LFYTD]) - ABS([Measures].[Sample Order Count PLFYTD])) / ABS([Measures].[Sample Order Count PLFYTD]))), FORMAT_STRING = 'percent'
                    SELECT
	                    {
		                    [Measures].[Net Sales FYTD], 
		                    [Measures].[Net Sales LFYTD],
		                    [Measures].[Net Credits FYTD], 
		                    [Measures].[Net Credits LFYTD],
		                    [Measures].[Order Count FYTD],
		                    [Measures].[Order Count LFYTD],
		                    [Measures].[Sample Order Count FYTD],
		                    [Measures].[Sample Order Count LFYTD],
		                    [Measures].[Net Sales % Variance TYLY],
		                    [Measures].[Net Sales % Variance LYPY],
		                    [Measures].[Net Credits % Variance TYLY],
		                    [Measures].[Net Credits % Variance LYPY],
		                    [Measures].[Order Count % Variance TYLY],
		                    [Measures].[Order Count % Variance LYPY],
		                    [Measures].[Sample Order Count % Variance TYLY],
		                    [Measures].[Sample Order Count % Variance LYPY]
	                    } ON COLUMNS,
	                    {
		                    [SpecifiedDate]
	                    } ON ROWS
                    FROM [SalesAnalysis]
                    WHERE 
                    (
	                     StrToMember(@TradeAccount)
	                    ,StrToMember(@Brand)
	                    ,StrToMember(@ProductTypeGroup)
                    )";

                    cubeComm.Parameters.Add("Today", String.Format("[Date].[Financial Drilldown].[Financial Day].&[{0}]",
                        DateTime.Now.ToString("yyyy-MM-ddT00:00:00")));

                    cubeComm.Parameters.Add("TradeAccount", String.Format("[Trade Account].[Trade Account].&[{0}]",
                        objFilters.tradeAccountId));

                    cubeComm.Parameters.Add("Brand", String.Format("[Product].[Brand].{0}",
                        objFilters.brandId.HasValue ? String.Format("&[{0}]", objFilters.brandId) : "[All]"));

                    cubeComm.Parameters.Add("ProductTypeGroup", String.Format("[Product].[Product Type Group].{0}",
                        objFilters.productTypeGroupId.HasValue ? String.Format("&[{0}]", objFilters.productTypeGroupId) : "[All]"));

                    var r = new DataTable();

                    using (var adapter = new AdomdDataAdapter(cubeComm))
                    {
                        adapter.Fill(r);
                        adapter.Dispose();
                    }

                    cubeConn.Close();

                    cubeConn.Dispose();

                    result.NetSales_FYTD = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Sales FYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Sales FYTD]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetSales_LFYTD = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Sales LFYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Sales LFYTD]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetCredits_FYTD = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Credits FYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Credits FYTD]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetCredits_LFYTD = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Credits LFYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Credits LFYTD]"]), 0, MidpointRounding.AwayFromZero);
                    result.OrderCount_FYTD = Convert.ToInt32(r.Rows[0]["[Measures].[Order Count FYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Order Count FYTD]"]);
                    result.OrderCount_LFYTD = Convert.ToInt32(r.Rows[0]["[Measures].[Order Count LFYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Order Count LFYTD]"]);
                    result.SampleOrderCount_FYTD = Convert.ToInt32(r.Rows[0]["[Measures].[Sample Order Count FYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Sample Order Count FYTD]"]);
                    result.SampleOrderCount_LFYTD = Convert.ToInt32(r.Rows[0]["[Measures].[Sample Order Count LFYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Sample Order Count LFYTD]"]);
                    result.NetSalesVariance_FYTD_LFYTD = Convert.ToString(r.Rows[0]["[Measures].[Net Sales % Variance TYLY]"]);
                    result.NetSalesVariance_LFYTD_PLFYTD = Convert.ToString(r.Rows[0]["[Measures].[Net Sales % Variance LYPY]"]);
                    result.NetCreditsVariance_FYTD_LFYTD = Convert.ToString(r.Rows[0]["[Measures].[Net Credits % Variance TYLY]"]);
                    result.NetCreditsVariance_LFYTD_PLFYTD = Convert.ToString(r.Rows[0]["[Measures].[Net Credits % Variance LYPY]"]);
                    result.OrderCountVariance_FYTD_LFYTD = Convert.ToString(r.Rows[0]["[Measures].[Order Count % Variance TYLY]"]);
                    result.OrderCountVariance_LFYTD_PLFYTD = Convert.ToString(r.Rows[0]["[Measures].[Order Count % Variance LYPY]"]);
                    result.SampleOrderCountVariance_FYTD_LFYTD = Convert.ToString(r.Rows[0]["[Measures].[Sample Order Count % Variance TYLY]"]);
                    result.SampleOrderCountVariance_LFYTD_PLFYTD = Convert.ToString(r.Rows[0]["[Measures].[Sample Order Count % Variance LYPY]"]);
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }
        
        public void TradeAccountSummary_FullCalendarYearAndParallel(PassTradeAccountSummaryFilters objFilters, ref TradeAccount_Summary_Result result)
        {
            try
            {
                using (var cubeConn = new AdomdConnection("Data Source=10.172.153.167;Catalog=TestBed"))
                {
                    cubeConn.Open();

                    AdomdCommand cubeComm = cubeConn.CreateCommand();

                    cubeComm.CommandText = @"
                    WITH 
                        SET [CurrentCY] AS StrToSet(@Year)
                        SET [PreviousCY] AS TAIL({NULL: PARALLELPERIOD([Date].[Calendar Drilldown].[Year], 1, [CurrentCY].ITEM(0))}, 1)
                        SET [BeforeThat] AS TAIL({NULL: PARALLELPERIOD([Date].[Calendar Drilldown].[Year], 2, [CurrentCY].ITEM(0))}, 1)
	                    MEMBER
	                    [Measures].[Net Sales CY] AS
	                    SUM (
		                    ([CurrentCY].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales LYCY] AS
	                    SUM (
		                    ([PreviousCY].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales PLYCY] AS
	                    SUM (
		                    ([BeforeThat].ITEM(0))
		                    ,[Measures].[Net Sales]
	                    )
	                    MEMBER
	                    [Measures].[Net Credits CY] AS
	                    SUM (
		                    ([CurrentCY].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Net Credits LYCY] AS
	                    SUM (
		                    ([PreviousCY].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Net Credits PLYCY] AS
	                    SUM (
		                    ([BeforeThat].ITEM(0))
		                    ,[Measures].[Net Credit]
	                    )
	                    MEMBER
	                    [Measures].[Order Count CY] AS
	                    SUM (
		                    ([CurrentCY].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Order Count LYCY] AS
	                    SUM (
		                    ([PreviousCY].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Order Count PLYCY] AS
	                    SUM (
		                    ([BeforeThat].ITEM(0))
		                    ,[Measures].[Order Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count CY] AS
	                    SUM (
		                    ([CurrentCY].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count LYCY] AS
	                    SUM (
		                    ([PreviousCY].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Sample Order Count PLYCY] AS
	                    SUM (
		                    ([BeforeThat].ITEM(0))
		                    ,[Measures].[Sample OrderLine Count]
	                    )
	                    MEMBER
	                    [Measures].[Net Sales % Variance TYLY] AS
	                        IIF([Measures].[Net Sales LYCY] = 0, NULL, ((ABS([Measures].[Net Sales CY]) - ABS([Measures].[Net Sales LYCY])) / ABS([Measures].[Net Sales LYCY]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Sales % Variance LYPY] AS
	                        IIF([Measures].[Net Sales PLYCY] = 0, NULL, ((ABS([Measures].[Net Sales LYCY]) - ABS([Measures].[Net Sales PLYCY])) / ABS([Measures].[Net Sales PLYCY]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Credits % Variance TYLY] AS
	                        IIF([Measures].[Net Credits LYCY] = 0, NULL, ((ABS([Measures].[Net Credits CY]) - ABS([Measures].[Net Credits LYCY])) / ABS([Measures].[Net Credits LYCY]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Net Credits % Variance LYPY] AS
	                        IIF([Measures].[Net Credits PLYCY] = 0, NULL, ((ABS([Measures].[Net Credits LYCY]) - ABS([Measures].[Net Credits PLYCY])) / ABS([Measures].[Net Credits PLYCY]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Order Count % Variance TYLY] AS
	                        IIF([Measures].[Order Count LYCY] = 0, NULL, ((ABS([Measures].[Order Count CY]) - ABS([Measures].[Order Count LYCY])) / ABS([Measures].[Order Count LYCY]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Order Count % Variance LYPY] AS
	                        IIF([Measures].[Order Count PLYCY] = 0, NULL, ((ABS([Measures].[Order Count LYCY]) - ABS([Measures].[Order Count PLYCY])) / ABS([Measures].[Order Count PLYCY]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Sample Order Count % Variance TYLY] AS
	                        IIF([Measures].[Sample Order Count LYCY] = 0, NULL, ((ABS([Measures].[Sample Order Count CY]) - ABS([Measures].[Sample Order Count LYCY])) / ABS([Measures].[Sample Order Count LYCY]))), FORMAT_STRING = 'percent'
	                    MEMBER
	                    [Measures].[Sample Order Count % Variance LYPY] AS
	                        IIF([Measures].[Sample Order Count PLYCY] = 0, NULL, ((ABS([Measures].[Sample Order Count LYCY]) - ABS([Measures].[Sample Order Count PLYCY])) / ABS([Measures].[Sample Order Count PLYCY]))), FORMAT_STRING = 'percent'
                    SELECT
                        {
		                    [Measures].[Net Sales CY],
		                    [Measures].[Net Sales LYCY],
		                    [Measures].[Net Credits CY],
		                    [Measures].[Net Credits LYCY],
		                    [Measures].[Order Count CY],
		                    [Measures].[Order Count LYCY],
		                    [Measures].[Sample Order Count CY],
		                    [Measures].[Sample Order Count LYCY],
		                    [Measures].[Net Sales % Variance TYLY],
		                    [Measures].[Net Sales % Variance LYPY],
		                    [Measures].[Net Credits % Variance TYLY],
		                    [Measures].[Net Credits % Variance LYPY],
		                    [Measures].[Order Count % Variance TYLY],
		                    [Measures].[Order Count % Variance LYPY],
		                    [Measures].[Sample Order Count % Variance TYLY],
		                    [Measures].[Sample Order Count % Variance LYPY]
                        } ON COLUMNS,
                        {
		                    [CurrentCY]
                        } ON ROWS
                    FROM 
                    [SalesAnalysis]
                    WHERE 
                    (
	                     StrToMember(@TradeAccount)
	                    ,StrToMember(@Brand)
	                    ,StrToMember(@ProductTypeGroup)
                    )";

                    cubeComm.Parameters.Add("Year", String.Format("[Date].[Calendar Drilldown].[Year].[Calendar {0}]",
                        DateTime.Now.ToString("yyyy")));

                    cubeComm.Parameters.Add("TradeAccount", String.Format("[Trade Account].[Trade Account].&[{0}]",
                        objFilters.tradeAccountId));

                    cubeComm.Parameters.Add("Brand", String.Format("[Product].[Brand].{0}",
                        objFilters.brandId.HasValue ? String.Format("&[{0}]", objFilters.brandId) : "[All]"));

                    cubeComm.Parameters.Add("ProductTypeGroup", String.Format("[Product].[Product Type Group].{0}",
                        objFilters.productTypeGroupId.HasValue ? String.Format("&[{0}]", objFilters.productTypeGroupId) : "[All]"));

                    var r = new DataTable();

                    using (var adapter = new AdomdDataAdapter(cubeComm))
                    {
                        adapter.Fill(r);
                        adapter.Dispose();
                    }

                    cubeConn.Close();

                    cubeConn.Dispose();

                    result.NetSales_CY = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Sales CY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Sales CY]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetSales_LCY = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Sales LYCY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Sales LYCY]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetCredits_CY = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Credits CY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Credits CY]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetCredits_LCY = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Credits LYCY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Credits LYCY]"]), 0, MidpointRounding.AwayFromZero);
                    result.OrderCount_CY = Convert.ToInt32(r.Rows[0]["[Measures].[Order Count CY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Order Count CY]"]);
                    result.OrderCount_LCY = Convert.ToInt32(r.Rows[0]["[Measures].[Order Count LYCY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Order Count LYCY]"]);
                    result.SampleOrderCount_CY = Convert.ToInt32(r.Rows[0]["[Measures].[Sample Order Count CY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Sample Order Count CY]"]);
                    result.SampleOrderCount_LCY = Convert.ToInt32(r.Rows[0]["[Measures].[Sample Order Count LYCY]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Sample Order Count LYCY]"]);
                    result.NetSalesVariance_CY_LCY = Convert.ToString(r.Rows[0]["[Measures].[Net Sales % Variance TYLY]"]);
                    result.NetSalesVariance_LCY_PLCY = Convert.ToString(r.Rows[0]["[Measures].[Net Sales % Variance LYPY]"]);
                    result.NetCreditsVariance_CY_LCY = Convert.ToString(r.Rows[0]["[Measures].[Net Credits % Variance TYLY]"]);
                    result.NetCreditsVariance_LCY_PLCY = Convert.ToString(r.Rows[0]["[Measures].[Net Credits % Variance LYPY]"]);
                    result.OrderCountVariance_CY_LCY = Convert.ToString(r.Rows[0]["[Measures].[Order Count % Variance TYLY]"]);
                    result.OrderCountVariance_LCY_PLCY = Convert.ToString(r.Rows[0]["[Measures].[Order Count % Variance LYPY]"]);
                    result.SampleOrderCountVariance_CY_LCY = Convert.ToString(r.Rows[0]["[Measures].[Sample Order Count % Variance TYLY]"]);
                    result.SampleOrderCountVariance_LCY_PLCY = Convert.ToString(r.Rows[0]["[Measures].[Sample Order Count % Variance LYPY]"]);
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public void TradeAccountSummary_CalendarYeartoDateAndParallel(PassTradeAccountSummaryFilters objFilters, ref TradeAccount_Summary_Result result)
        {
            try
            {
                using (var cubeConn = new AdomdConnection("Data Source=10.172.153.167;Catalog=TestBed"))
                {
                    cubeConn.Open();

                    AdomdCommand cubeComm = cubeConn.CreateCommand();

                    cubeComm.CommandText = @"
                    WITH
                        SET [SpecifiedDate] AS StrToSet(@Today)
                        SET [PreviousYear] AS TAIL({NULL: ParallelPeriod([Date].[Calendar Week Drilldown].[Year], 1, [SpecifiedDate].ITEM(0))}, 1)
                        SET [BeforeThat] AS TAIL({NULL: ParallelPeriod([Date].[Calendar Week Drilldown].[Year], 2, [SpecifiedDate].ITEM(0))}, 1)
	                MEMBER
	                [Measures].[Net Sales CYTD] AS
	                SUM (
		                PeriodsToDate([Date].[Calendar Week Drilldown].[Year],
						                [SpecifiedDate].ITEM(0))
		                ,[Measures].[Net Sales]
	                )
	                MEMBER
	                [Measures].[Net Sales LCYTD] AS
	                SUM (
		                PeriodsToDate([Date].[Calendar Week Drilldown].[Year],
						                [PreviousYear].ITEM(0))
		                ,[Measures].[Net Sales]
	                )
	                MEMBER
	                [Measures].[Net Sales PLCYTD] AS
	                SUM (
		                PeriodsToDate([Date].[Calendar Week Drilldown].[Year],
						                [BeforeThat].ITEM(0))
		                ,[Measures].[Net Sales]
	                )
	                MEMBER
	                [Measures].[Net Credits CYTD] AS
	                SUM (
		                PeriodsToDate([Date].[Calendar Week Drilldown].[Year],
						                [SpecifiedDate].ITEM(0))
		                ,[Measures].[Net Credit]
	                )
	                MEMBER
	                [Measures].[Net Credits LCYTD] AS
	                SUM (
		                PeriodsToDate([Date].[Calendar Week Drilldown].[Year],
						                [PreviousYear].ITEM(0))
		                ,[Measures].[Net Credit]
	                )
	                MEMBER
	                [Measures].[Net Credits PLCYTD] AS
	                SUM (
		                PeriodsToDate([Date].[Calendar Week Drilldown].[Year],
						                [BeforeThat].ITEM(0))
		                ,[Measures].[Net Credit]
	                )
	                MEMBER
	                [Measures].[Order Count CYTD] AS
	                SUM (
		                PeriodsToDate([Date].[Calendar Week Drilldown].[Year],
						                [SpecifiedDate].ITEM(0))
		                ,[Measures].[Order Count]
	                )
	                MEMBER
	                [Measures].[Order Count LCYTD] AS
	                SUM (
		                PeriodsToDate([Date].[Calendar Week Drilldown].[Year],
						                [PreviousYear].ITEM(0))
		                ,[Measures].[Order Count]
	                )
	                MEMBER
	                [Measures].[Order Count PLCYTD] AS
	                SUM (
		                PeriodsToDate([Date].[Calendar Week Drilldown].[Year],
						                [BeforeThat].ITEM(0))
		                ,[Measures].[Order Count]
	                )
	                MEMBER
	                [Measures].[Sample Order Count CYTD] AS
	                SUM (
		                PeriodsToDate([Date].[Calendar Week Drilldown].[Year],
						                [SpecifiedDate].ITEM(0))
		                ,[Measures].[Sample OrderLine Count]
	                )
	                MEMBER
	                [Measures].[Sample Order Count LCYTD] AS
	                SUM (
		                PeriodsToDate([Date].[Calendar Week Drilldown].[Year],
						                [PreviousYear].ITEM(0))
		                ,[Measures].[Sample OrderLine Count]
	                )
	                MEMBER
	                [Measures].[Sample Order Count PLCYTD] AS
	                SUM (
		                PeriodsToDate([Date].[Calendar Week Drilldown].[Year],
						                [BeforeThat].ITEM(0))
		                ,[Measures].[Sample OrderLine Count]
	                )
	                MEMBER
	                [Measures].[Net Sales % Variance TYLY] AS
		                IIF([Measures].[Net Sales LCYTD] = 0, NULL, ((ABS([Measures].[Net Sales CYTD]) - ABS([Measures].[Net Sales LCYTD])) / ABS([Measures].[Net Sales LCYTD]))), FORMAT_STRING = 'percent'
	                MEMBER
	                [Measures].[Net Sales % Variance LYPY] AS
		                IIF([Measures].[Net Sales PLCYTD] = 0, NULL, ((ABS([Measures].[Net Sales LCYTD]) - ABS([Measures].[Net Sales PLCYTD])) / ABS([Measures].[Net Sales PLCYTD]))), FORMAT_STRING = 'percent'
	                MEMBER
	                [Measures].[Net Credits % Variance TYLY] AS
		                IIF([Measures].[Net Credits LCYTD] = 0, NULL, ((ABS([Measures].[Net Credits CYTD]) - ABS([Measures].[Net Credits LCYTD])) / ABS([Measures].[Net Credits LCYTD]))), FORMAT_STRING = 'percent'
	                MEMBER
	                [Measures].[Net Credits % Variance LYPY] AS
		                IIF([Measures].[Net Credits PLCYTD] = 0, NULL, ((ABS([Measures].[Net Credits LCYTD]) - ABS([Measures].[Net Credits PLCYTD])) / ABS([Measures].[Net Credits PLCYTD]))), FORMAT_STRING = 'percent'
	                MEMBER
	                [Measures].[Order Count % Variance TYLY] AS
		                IIF([Measures].[Order Count LCYTD] = 0, NULL, ((ABS([Measures].[Order Count CYTD]) - ABS([Measures].[Order Count LCYTD])) / ABS([Measures].[Order Count LCYTD]))), FORMAT_STRING = 'percent'
	                MEMBER
	                [Measures].[Order Count % Variance LYPY] AS
		                IIF([Measures].[Order Count PLCYTD] = 0, NULL, ((ABS([Measures].[Order Count LCYTD]) - ABS([Measures].[Order Count PLCYTD])) / ABS([Measures].[Order Count PLCYTD]))), FORMAT_STRING = 'percent'
	                MEMBER
	                [Measures].[Sample Order Count % Variance TYLY] AS
		                IIF([Measures].[Sample Order Count LCYTD] = 0, NULL, ((ABS([Measures].[Sample Order Count CYTD]) - ABS([Measures].[Sample Order Count LCYTD])) / ABS([Measures].[Sample Order Count LCYTD]))), FORMAT_STRING = 'percent'
	                MEMBER
	                [Measures].[Sample Order Count % Variance LYPY] AS
		                IIF([Measures].[Sample Order Count PLCYTD] = 0, NULL, ((ABS([Measures].[Sample Order Count LCYTD]) - ABS([Measures].[Sample Order Count PLCYTD])) / ABS([Measures].[Sample Order Count PLCYTD]))), FORMAT_STRING = 'percent'
	                SELECT
	                {
		                [Measures].[Net Sales CYTD], 
		                [Measures].[Net Sales LCYTD],
		                [Measures].[Net Credits CYTD], 
		                [Measures].[Net Credits LCYTD],
		                [Measures].[Order Count CYTD],
		                [Measures].[Order Count LCYTD],
		                [Measures].[Sample Order Count CYTD],
		                [Measures].[Sample Order Count LCYTD],
		                [Measures].[Net Sales % Variance TYLY],
		                [Measures].[Net Sales % Variance LYPY],
		                [Measures].[Net Credits % Variance TYLY],
		                [Measures].[Net Credits % Variance LYPY],
		                [Measures].[Order Count % Variance TYLY],
		                [Measures].[Order Count % Variance LYPY],
		                [Measures].[Sample Order Count % Variance TYLY],
		                [Measures].[Sample Order Count % Variance LYPY]
	                } ON COLUMNS,
	                {
		                [SpecifiedDate]
	                } ON ROWS
	                FROM [SalesAnalysis]
                    WHERE 
                    (
	                     StrToMember(@TradeAccount)
	                    ,StrToMember(@Brand)
	                    ,StrToMember(@ProductTypeGroup)
                    )";

                    cubeComm.Parameters.Add("Today", String.Format("[Date].[Calendar Week Drilldown].[Date].&[{0}]",
                        DateTime.Now.ToString("yyyy-MM-ddT00:00:00")));

                    cubeComm.Parameters.Add("TradeAccount", String.Format("[Trade Account].[Trade Account].&[{0}]",
                        objFilters.tradeAccountId));

                    cubeComm.Parameters.Add("Brand", String.Format("[Product].[Brand].{0}",
                        objFilters.brandId.HasValue ? String.Format("&[{0}]", objFilters.brandId) : "[All]"));

                    cubeComm.Parameters.Add("ProductTypeGroup", String.Format("[Product].[Product Type Group].{0}",
                        objFilters.productTypeGroupId.HasValue ? String.Format("&[{0}]", objFilters.productTypeGroupId) : "[All]"));

                    var r = new DataTable();

                    using (var adapter = new AdomdDataAdapter(cubeComm))
                    {
                        adapter.Fill(r);
                        adapter.Dispose();
                    }

                    cubeConn.Close();

                    cubeConn.Dispose();

                    result.NetSales_CYTD = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Sales CYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Sales CYTD]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetSales_LCYTD = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Sales LCYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Sales LCYTD]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetCredits_CYTD = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Credits CYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Credits CYTD]"]), 0, MidpointRounding.AwayFromZero);
                    result.NetCredits_LCYTD = Math.Round(Convert.ToDecimal(r.Rows[0]["[Measures].[Net Credits LCYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Net Credits LCYTD]"]), 0, MidpointRounding.AwayFromZero);
                    result.OrderCount_CYTD = Convert.ToInt32(r.Rows[0]["[Measures].[Order Count CYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Order Count CYTD]"]);
                    result.OrderCount_LCYTD = Convert.ToInt32(r.Rows[0]["[Measures].[Order Count LCYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Order Count LCYTD]"]);
                    result.SampleOrderCount_CYTD = Convert.ToInt32(r.Rows[0]["[Measures].[Sample Order Count CYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Sample Order Count CYTD]"]);
                    result.SampleOrderCount_LCYTD = Convert.ToInt32(r.Rows[0]["[Measures].[Sample Order Count LCYTD]"] == DBNull.Value ? 0 : r.Rows[0]["[Measures].[Sample Order Count LCYTD]"]);
                    result.NetSalesVariance_CYTD_LCYTD = Convert.ToString(r.Rows[0]["[Measures].[Net Sales % Variance TYLY]"]);
                    result.NetSalesVariance_LCYTD_PLCYTD = Convert.ToString(r.Rows[0]["[Measures].[Net Sales % Variance LYPY]"]);
                    result.NetCreditsVariance_CYTD_LCYTD = Convert.ToString(r.Rows[0]["[Measures].[Net Credits % Variance TYLY]"]);
                    result.NetCreditsVariance_LCYTD_PLCYTD = Convert.ToString(r.Rows[0]["[Measures].[Net Credits % Variance LYPY]"]);
                    result.OrderCountVariance_CYTD_LCYTD = Convert.ToString(r.Rows[0]["[Measures].[Order Count % Variance TYLY]"]);
                    result.OrderCountVariance_LCYTD_PLCYTD = Convert.ToString(r.Rows[0]["[Measures].[Order Count % Variance LYPY]"]);
                    result.SampleOrderCountVariance_CYTD_LCYTD = Convert.ToString(r.Rows[0]["[Measures].[Sample Order Count % Variance TYLY]"]);
                    result.SampleOrderCountVariance_LCYTD_PLCYTD = Convert.ToString(r.Rows[0]["[Measures].[Sample Order Count % Variance LYPY]"]);
                }
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
        }

        public List<CustomerPrice_EnquiryResult> CustomerPriceCheck(PricingQueryFilter f1, List<int> productIDs)
        {
            var result = new List<CustomerPrice_EnquiryResult>();

            if (productIDs.Count > 0)
            {
                var cmd = this.Database.Connection.CreateCommand();
                cmd.CommandText = "[portal].[Price_Enquiry_AccountPrice]";
                cmd.CommandType = CommandType.StoredProcedure;

                var tradeAccountNumberParam = new SqlParameter("@TradeAccountID", f1.TradeAccountID);

                var dt = new DataTable();

                dt.Columns.Add("ProductID", typeof(int));

                foreach (var i in productIDs)
                {
                    dt.Rows.Add(i);
                }

                var productIDsParam = new SqlParameter("@ProductIDs", dt)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "ProductIDsTableType"
                };

                cmd.Parameters.Add(tradeAccountNumberParam);
                cmd.Parameters.Add(productIDsParam);

                try
                {
                    this.Database.Connection.Open();

                    var reader = cmd.ExecuteReader();

                    result = ((IObjectContextAdapter)this)
                        .ObjectContext
                        .Translate<CustomerPrice_EnquiryResult>(reader).ToList();
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

            result.ForEach(c => {
                var currency = Pricing.PriceCheckerDataSource.GetCurrencies().Where(p => p.CurrencyID == c.CurrencyID).First().Currency;
                c.ProductType = Pricing.PriceCheckerDataSource.GetProductTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.ProductTypeID == c.ProductTypeID).Select(p => p.Name).SingleOrDefault();
                c.Launch = Pricing.PriceCheckerDataSource.GetLaunches(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.LaunchID == c.LaunchID).Select(p => p.Name).SingleOrDefault();
                c.Brand = Pricing.PriceCheckerDataSource.GetBrands(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.BrandID == c.BrandID).Select(p => p.Name).SingleOrDefault();
                c.ItemType = Pricing.PriceCheckerDataSource.GetItemTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.ItemTypeID == c.ItemTypeID).Select(p => p.Name).SingleOrDefault();
                c.ClearanceString = c.Clearance ? "Yes" : "No";
                c.MarginDisparity = c.GrossMargin - c.TargetMargin < 0 ? (byte)5 : (byte)10; 
c.Currency = currency.Name;
                c.CurrencyFormattingCulture = currency.FormattingCulture;
                c.CurrencyCode = currency.Code;
                c.TradePriceList = Pricing.PriceCheckerDataSource.GetTradePriceLists().Where(p => p.TradePriceListID == c.TradePriceListID).Select(p => p.Name).SingleOrDefault();
            });

            return result;
        }



        public List<ListPrice_EnquiryResult> PriceListCheck(PricingQueryFilter f1, List<int> productIDs)
        {
            var result = new List<ListPrice_EnquiryResult>();

            if (productIDs.Count > 0)
            {
                var cmd = this.Database.Connection.CreateCommand();
                cmd.CommandText = "[portal].[Price_Enquiry_ListPrice]";
                cmd.CommandType = CommandType.StoredProcedure;
                
                var tradePriceListParam = new SqlParameter("@TradePriceListID", f1.TradePriceListID ?? (object)DBNull.Value);
                var marketParam = new SqlParameter("@MarketID", f1.MarketID ?? (object)DBNull.Value);
                var currencyParam = new SqlParameter("@CurrencyID", f1.CurrencyID ?? (object)DBNull.Value);

                var dt = new DataTable();

                dt.Columns.Add("ProductID", typeof(int));

                foreach (var i in productIDs)
                {
                    dt.Rows.Add(i);
                }

                var productIDsParam = new SqlParameter("@ProductIDs", dt)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "ProductIDsTableType"
                };

                cmd.Parameters.Add(marketParam);
                cmd.Parameters.Add(tradePriceListParam);
                cmd.Parameters.Add(currencyParam);
                cmd.Parameters.Add(productIDsParam);

                try
                {
                    this.Database.Connection.Open();

                    var reader = cmd.ExecuteReader();

                    result = ((IObjectContextAdapter)this)
                        .ObjectContext
                        .Translate<ListPrice_EnquiryResult>(reader).ToList();
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

            result.ForEach(c => {
                var currency = Pricing.PriceCheckerDataSource.GetCurrencies().Where(p => p.CurrencyID == c.CurrencyID).First().Currency;
                c.Launch = Pricing.PriceCheckerDataSource.GetLaunches(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.LaunchID == c.LaunchID).Select(p => p.Name).SingleOrDefault();
                c.Brand = Pricing.PriceCheckerDataSource.GetBrands(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.BrandID == c.BrandID).Select(p => p.Name).SingleOrDefault();
                c.ProductType = Pricing.PriceCheckerDataSource.GetProductTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.ProductTypeID == c.ProductTypeID).Select(p => p.Name).SingleOrDefault();
                c.ItemType = Pricing.PriceCheckerDataSource.GetItemTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.ItemTypeID == c.ItemTypeID).Select(p => p.Name).SingleOrDefault();
                c.Market = Pricing.PriceCheckerDataSource.GetMarkets().Where(p => p.MarketID == c.MarketID).Select(p => p.Name).SingleOrDefault();
                c.TradePriceList = Pricing.PriceCheckerDataSource.GetTradePriceLists().Where(p => p.TradePriceListID == c.TradePriceListID).Select(p => p.Name).SingleOrDefault();
                c.Currency = currency.Name;
                c.CurrencyFormattingCulture = currency.FormattingCulture;
                c.CurrencyCode = currency.Code;
                c.ClearanceString = c.Clearance ? "Yes" : "No";
                c.MarginDisparity = c.GrossMargin - c.TargetMargin < 0 ? (byte)5 : (byte)10;
            });

            return result;
        }
        
        public List<ContractPrice_EnquiryResult> ContractPriceCheck(PricingQueryFilter f1, List<int> productIDs)
        {
            var result = new List<ContractPrice_EnquiryResult>();

            if (productIDs.Count > 0)
            {
                var cmd = this.Database.Connection.CreateCommand();
                cmd.CommandText = "[portal].[Price_Enquiry_ContractPrice]";
                cmd.CommandType = CommandType.StoredProcedure;

                var dt = new DataTable();

                dt.Columns.Add("ProductID", typeof(int));

                foreach (var i in productIDs)
                {
                    dt.Rows.Add(i);
                }

                var parameters = new SqlParameter[]
                {
                    new SqlParameter("@TradeAccountID", f1.TradeAccountID ?? (object)DBNull.Value),
                    new SqlParameter("@MarketID", f1.MarketID ?? (object)DBNull.Value),
                    new SqlParameter("@TradePriceListID", f1.TradePriceListID ?? (object)DBNull.Value),
                    new SqlParameter("@CurrencyID", f1.CurrencyID ?? (object)DBNull.Value)
                };

                var productIDsParam = new SqlParameter("@ProductIDs", dt)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "ProductIDsTableType"
                };

                cmd.Parameters.AddRange(parameters);
                cmd.Parameters.Add(productIDsParam);

                try
                {
                    this.Database.Connection.Open();

                    var reader = cmd.ExecuteReader();

                    result = ((IObjectContextAdapter)this)
                        .ObjectContext
                        .Translate<ContractPrice_EnquiryResult>(reader).ToList();
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

            result.ForEach(c => {
                var currency = Pricing.PriceCheckerDataSource.GetCurrencies().Where(p => p.CurrencyID == c.CurrencyID).First().Currency;
                c.Launch = Pricing.PriceCheckerDataSource.GetLaunches(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.LaunchID == c.LaunchID).Select(p => p.Name).SingleOrDefault();
                c.Brand = Pricing.PriceCheckerDataSource.GetBrands(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.BrandID == c.BrandID).Select(p => p.Name).SingleOrDefault();
                c.ProductType = Pricing.PriceCheckerDataSource.GetProductTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.ProductTypeID == c.ProductTypeID).Select(p => p.Name).SingleOrDefault();
                c.ItemType = Pricing.PriceCheckerDataSource.GetItemTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.ItemTypeID == c.ItemTypeID).Select(p => p.Name).SingleOrDefault();
                c.Market = Pricing.PriceCheckerDataSource.GetMarkets().Where(p => p.MarketID == c.MarketID).Select(p => p.Name).SingleOrDefault();
                c.TradePriceList = Pricing.PriceCheckerDataSource.GetTradePriceLists().Where(p => p.TradePriceListID == c.TradePriceListID).Select(p => p.Name).SingleOrDefault();
                c.Currency = currency.Name;
                c.CurrencyFormattingCulture = currency.FormattingCulture;
                c.CurrencyCode = currency.Code;
                c.ClearanceString = c.Clearance ? "Yes" : "No";
                c.MarginDisparity = c.GrossMargin - c.TargetMargin < 0 ? (byte)5 : (byte)10;
            });

            return result;
        }
        
        public List<ContractAgreement_EnquiryResult> ContractAgreementCheck(PricingQueryFilter f1, List<int> productIDs)
        {
            var result = new List<ContractAgreement_EnquiryResult>();
            
            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Price_Enquiry_ContractAgreement]";
            cmd.CommandType = CommandType.StoredProcedure;

            var dt = new DataTable();

            dt.Columns.Add("ProductID", typeof(int));

            foreach (var i in productIDs)
            {
                dt.Rows.Add(i);
            }

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TradeAccountID", f1.TradeAccountID ?? (object)DBNull.Value),
                new SqlParameter("@MarketID", f1.MarketID ?? (object)DBNull.Value),
                new SqlParameter("@TradePriceListID", f1.TradePriceListID ?? (object)DBNull.Value),
                new SqlParameter("@CurrencyID", f1.CurrencyID ?? (object)DBNull.Value)
            };

            var productIDsParam = new SqlParameter("@ProductIDs", dt)
            {
                SqlDbType = SqlDbType.Structured,
                TypeName = "ProductIDsTableType"
            };

            cmd.Parameters.AddRange(parameters);
            cmd.Parameters.Add(productIDsParam);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ContractAgreement_EnquiryResult>(reader).ToList();
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

            result.ForEach(c => {
                var currency = Pricing.PriceCheckerDataSource.GetCurrencies().Where(p => p.CurrencyID == c.CurrencyID).First().Currency;
                c.Product = c.ProductID.HasValue ? Pricing.PriceCheckerDataSource.GetProducts(null, null, null, c.ProductID, null, null, f1.IncludeClearance, f1.IncludeSamples).Select(p => p.Code + " - " + p.Name).FirstOrDefault() : null;
                c.Quality = Pricing.PriceCheckerDataSource.GetQualities(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.QualityID == c.QualityID).Select(p => p.Code + " - " + p.Name).SingleOrDefault();
                c.Brand = Pricing.PriceCheckerDataSource.GetBrands(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.BrandID == c.BrandID).Select(p => p.Name).SingleOrDefault();
                c.ItemType = Pricing.PriceCheckerDataSource.GetItemTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.ItemTypeID == c.ItemTypeID).Select(p => p.Name).SingleOrDefault();
                c.Brand = Pricing.PriceCheckerDataSource.GetBrands(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.BrandID == c.BrandID).Select(p => p.Name).SingleOrDefault();
                c.ProductGroup = Pricing.PriceCheckerDataSource.GetProductGroups().Where(p => p.ProductGroupID == c.ProductGroupID).Select(p => p.Name).SingleOrDefault();
                c.ItemType = Pricing.PriceCheckerDataSource.GetItemTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.ItemTypeID == c.ItemTypeID).Select(p => p.Name).SingleOrDefault();
                c.Market = Pricing.PriceCheckerDataSource.GetMarkets().Where(p => p.MarketID == c.MarketID).Select(p => p.Name).SingleOrDefault();
                c.TradePriceList = Pricing.PriceCheckerDataSource.GetTradePriceLists().Where(p => p.TradePriceListID == c.TradePriceListID).Select(p => p.Name).SingleOrDefault();
                c.Currency = currency.Name;
                c.CurrencyFormattingCulture = currency.FormattingCulture;
                c.CurrencyCode = currency.Code;
            });

            return result;
        }
        
        public List<ProductNoPrices_EnquiryResult> ProductsNoPricesCheck(PricingQueryFilter f1, List<int> productIDs)
        {
            var result = new List<ProductNoPrices_EnquiryResult>();

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandText = "[portal].[Price_Enquiry_NoPrice]";
            cmd.CommandType = CommandType.StoredProcedure;

            var dt = new DataTable();

            dt.Columns.Add("ProductID", typeof(int));

            foreach (var i in productIDs)
            {
                dt.Rows.Add(i);
            }

            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TradeAccountID", f1.TradeAccountID ?? (object)DBNull.Value),
                new SqlParameter("@MarketID", f1.MarketID ?? (object)DBNull.Value),
                new SqlParameter("@TradePriceListID", f1.TradePriceListID ?? (object)DBNull.Value),
                new SqlParameter("@CurrencyID", f1.CurrencyID ?? (object)DBNull.Value)
            };
            
                var productIDsParam = new SqlParameter("@ProductIDs", dt)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "ProductIDsTableType"
                };

            cmd.Parameters.AddRange(parameters);
            cmd.Parameters.Add(productIDsParam);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProductNoPrices_EnquiryResult>(reader).ToList();
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

            result.ForEach(c => {
                var currency = Pricing.PriceCheckerDataSource.GetCurrencies().Where(p => p.CurrencyID == c.CurrencyID).First().Currency;
                c.Launch = Pricing.PriceCheckerDataSource.GetLaunches(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.LaunchID == c.LaunchID).Select(p => p.Name).SingleOrDefault();
                c.Brand = Pricing.PriceCheckerDataSource.GetBrands(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.BrandID == c.BrandID).Select(p => p.Name).SingleOrDefault();
                c.ProductType = Pricing.PriceCheckerDataSource.GetProductTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.ProductTypeID == c.ProductTypeID).Select(p => p.Name).SingleOrDefault();
                c.ItemType = Pricing.PriceCheckerDataSource.GetItemTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.ItemTypeID == c.ItemTypeID).Select(p => p.Name).SingleOrDefault();
                c.Market = Pricing.PriceCheckerDataSource.GetMarkets().Where(p => p.MarketID == c.MarketID).Select(p => p.Name).SingleOrDefault();
                c.TradePriceList = Pricing.PriceCheckerDataSource.GetTradePriceLists().Where(p => p.TradePriceListID == c.TradePriceListID).Select(p => p.Name).SingleOrDefault();
                c.Currency = currency.Name;
                c.CurrencyFormattingCulture = currency.FormattingCulture;
                c.CurrencyCode = currency.Code;
                c.ClearanceString = c.Clearance ? "Yes" : "No";
            });

            return result;
        }

        public List<LowMargin_EnquiryResult> LowMarginCheck(PricingQueryFilter f1, List<int> productIDs)
        {
            var result = new List<LowMargin_EnquiryResult>();

            if (productIDs.Count > 0)
            {
                var cmd = this.Database.Connection.CreateCommand();
                cmd.CommandText = "[portal].[Price_Enquiry_LowMargin]";
                cmd.CommandType = CommandType.StoredProcedure;

                var dt = new DataTable();

                dt.Columns.Add("ProductID", typeof(int));

                foreach (var i in productIDs)
                {
                    dt.Rows.Add(i);
                }

                var parameters = new SqlParameter[]
                {
                    new SqlParameter("@TradeAccountID", f1.TradeAccountID ?? (object)DBNull.Value),
                    new SqlParameter("@MarketID", f1.MarketID ?? (object)DBNull.Value),
                    new SqlParameter("@TradePriceListID", f1.TradePriceListID ?? (object)DBNull.Value),
                    new SqlParameter("@CurrencyID", f1.CurrencyID ?? (object)DBNull.Value)
                };

                var productIDsParam = new SqlParameter("@ProductIDs", dt)
                {
                    SqlDbType = SqlDbType.Structured,
                    TypeName = "ProductIDsTableType"
                };

                cmd.Parameters.AddRange(parameters);
                cmd.Parameters.Add(productIDsParam);

                try
                {
                    this.Database.Connection.Open();

                    var reader = cmd.ExecuteReader();

                    result = ((IObjectContextAdapter)this)
                        .ObjectContext
                        .Translate<LowMargin_EnquiryResult>(reader).ToList();
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

            result.ForEach(c => {
                var currency = Pricing.PriceCheckerDataSource.GetCurrencies().Where(p => p.CurrencyID == c.CurrencyID).First().Currency;
                c.Launch = Pricing.PriceCheckerDataSource.GetLaunches(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.LaunchID == c.LaunchID).Select(p => p.Name).SingleOrDefault();
                c.Brand = Pricing.PriceCheckerDataSource.GetBrands(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.BrandID == c.BrandID).Select(p => p.Name).SingleOrDefault();
                c.ProductType = Pricing.PriceCheckerDataSource.GetProductTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.ProductTypeID == c.ProductTypeID).Select(p => p.Name).SingleOrDefault();
                c.ItemType = Pricing.PriceCheckerDataSource.GetItemTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => p.ItemTypeID == c.ItemTypeID).Select(p => p.Name).SingleOrDefault();
                c.Market = Pricing.PriceCheckerDataSource.GetMarkets().Where(p => p.MarketID == c.MarketID).Select(p => p.Name).SingleOrDefault();
                c.TradePriceList = Pricing.PriceCheckerDataSource.GetTradePriceLists().Where(p => p.TradePriceListID == c.TradePriceListID).Select(p => p.Name).SingleOrDefault();
                c.Currency = currency.Name;
                c.CurrencyFormattingCulture = currency.FormattingCulture;
                c.CurrencyCode = currency.Code;
                c.ClearanceString = c.Clearance ? "Yes" : "No";
                c.MarginDisparity = c.GrossMargin - c.TargetMargin < 0 ? (byte)5 : (byte)10;
            });

            return result;
        }
        
        public List<TradeAccountFilterSelectResult> SalesStatisticsFilterSelect(PassTradeAccountFilterParams objFilterParams)
        {
            var results = new List<TradeAccountFilterSelectResult>();

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "[portal].[Filter_TradeAccount_Select]";

            var includeArea = new SqlParameter("@IncludeArea", objFilterParams?.IncludeArea ?? (object)DBNull.Value);
            var includeCurrency = new SqlParameter("@IncludeCurrency", objFilterParams?.IncludeCurrency ?? (object)DBNull.Value);
            
            cmd.Parameters.Add(includeArea);
            cmd.Parameters.Add(includeCurrency);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<TradeAccountFilterSelectResult>(reader).ToList();
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

        public List<OutstandingOrderResult> LoadOutstandingOrders(PassOutstandingOrderLoad objLoad)
        {
            var results = new List<OutstandingOrderResult>();
            
            try
            {
                var cmd = this.Database.Connection.CreateCommand();

                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "[portal].[OutstandingOrder_Select]";

                var tradeAccountId = new SqlParameter("@TradeAccountID", objLoad.tradeAccountId);
                var orderLineStatusGroupId = new SqlParameter("@OrderLineStatusGroupID", objLoad.orderLineStatusGroupId);
            
                cmd.Parameters.Add(tradeAccountId);
                cmd.Parameters.Add(orderLineStatusGroupId);

                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<OutstandingOrderResult>(reader).ToList();
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

        
        public TradeContactUpsertResult TradeAccountContactUpsert(PassTradeAccountContactUpsert objTradeAccountContactUpsert)
        {
            var parameters = new SqlParameter[]
            {
                new SqlParameter("@TradeAccountContactID", SqlDbType.BigInt),
                new SqlParameter("@DecisionMaker", objTradeAccountContactUpsert.DecisionMaker ?? false),
                new SqlParameter("@TradeAccountID", objTradeAccountContactUpsert.TradeAccountID),
                new SqlParameter("@TitleID", objTradeAccountContactUpsert.TitleID ?? (object)DBNull.Value),
                new SqlParameter("@TradeAccountContactTypeID", objTradeAccountContactUpsert.TradeAccountContactTypeID ?? (object)DBNull.Value),
                new SqlParameter("@FullName", objTradeAccountContactUpsert.FullName ?? (object)DBNull.Value),
                new SqlParameter("@Email", objTradeAccountContactUpsert.Email ?? (object)DBNull.Value),
                new SqlParameter("@HomePhone", objTradeAccountContactUpsert.HomePhone ?? (object)DBNull.Value),
                new SqlParameter("@WorkPhone", objTradeAccountContactUpsert.WorkPhone ?? (object)DBNull.Value),
                new SqlParameter("@MobilePhone", objTradeAccountContactUpsert.MobilePhone ?? (object)DBNull.Value),
                new SqlParameter("@Birthday", objTradeAccountContactUpsert.Birthday ?? (object)DBNull.Value),
                new SqlParameter("@LinkedIn", objTradeAccountContactUpsert.LinkedIn ?? (object)DBNull.Value),
                new SqlParameter("@SkypeID", objTradeAccountContactUpsert.SkypeID ?? (object)DBNull.Value),
                new SqlParameter("@WhatsApp", objTradeAccountContactUpsert.WhatsApp ?? (object)DBNull.Value),
                new SqlParameter("@Notes", objTradeAccountContactUpsert.Notes ?? (object)DBNull.Value),
                new SqlParameter("@Website", objTradeAccountContactUpsert.Website ?? (object)DBNull.Value),
                new SqlParameter("@Facebook", objTradeAccountContactUpsert.Facebook ?? (object)DBNull.Value),
                new SqlParameter("@Twitter", objTradeAccountContactUpsert.Twitter ?? (object)DBNull.Value),
                new SqlParameter("@Pinterest", objTradeAccountContactUpsert.Pinterest ?? (object)DBNull.Value),
                new SqlParameter("@YouTube", objTradeAccountContactUpsert.YouTube ?? (object)DBNull.Value),
                new SqlParameter("@Instagram", objTradeAccountContactUpsert.Instagram ?? (object)DBNull.Value),
                new SqlParameter("@Role", objTradeAccountContactUpsert.Role ?? (object)DBNull.Value),
                new SqlParameter("@ReceiveOrderConfirmations", objTradeAccountContactUpsert.ReceiveOrderConfirmations),
                new SqlParameter("@ReceiveMarketing", objTradeAccountContactUpsert.ReceiveMarketing),
                new SqlParameter("@ReceiveFinancial", objTradeAccountContactUpsert.ReceiveFinancial),
                new SqlParameter("@ReceivePricelists", objTradeAccountContactUpsert.ReceivePricelists)
            };

            var result = new TradeContactUpsertResult();

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.CommandText = "[portal].[TradeAccountContact_Upsert]";

            cmd.Parameters.AddRange(parameters);

            cmd.Parameters["@TradeAccountContactID"].Value = objTradeAccountContactUpsert.TradeAccountContactID ?? (object)DBNull.Value;
            cmd.Parameters["@TradeAccountContactID"].Direction = ParameterDirection.InputOutput;
            
            try
            {
                this.Database.Connection.Open();
                
                cmd.ExecuteNonQuery();

                this.Database.Connection.Close();

                result.TradeAccountContactID = Convert.ToInt64(cmd.Parameters["@TradeAccountContactID"].Value);
            }
            catch (SqlException e)
            {
                PortalFramework.LogErrorToDatabase(e);
                throw e;
            }
            finally
            {
                if (this.Database.Connection.State != ConnectionState.Closed)
                    this.Database.Connection.Close();
            }

            return result;
        }
        
        public List<PatternBookSaturation_EnquiryResult> PatternBookSaturationEnquiry(PassTradeAccountID objTradeAccountId)
        {
            var results = new List<PatternBookSaturation_EnquiryResult>();
            
            try
            {
                var cmd = this.Database.Connection.CreateCommand();

                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "[portal].[PatternBookSaturation_Enquiry]";

                var tradeAccountId = new SqlParameter("@TradeAccountID", objTradeAccountId.tradeAccountId);
            
                cmd.Parameters.Add(tradeAccountId);

                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<PatternBookSaturation_EnquiryResult>(reader).ToList();
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