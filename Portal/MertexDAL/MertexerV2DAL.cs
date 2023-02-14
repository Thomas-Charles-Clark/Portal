using MertexerV2;
using MertexerV2.Utilities;
using MertexerV2SQL.Models.Misc;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Applications;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.Samples;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Xml.Linq;
using System.Xml.XPath;

namespace Portal.MertexDAL
{
    public static class MertexerV2DAL
    {
        public static IEnumerable<(string supplierCode, string supplierName, MiscellaneousInvoiceAddress address)> SupplierList(PortalDbContext portalDb, 
            MertexerV2SQL.Models.Misc.PassProductCode objProductCode)
        {
            var results = MertexerV2SQL.MiscFunctions.MiscellaneousFunctions.SupplierList(objProductCode).ToList();

            results.ForEach(r => 
            {
                var country = portalDb.Countries.Where(p => p.Code == r.address.PotentialCountryCode).SingleOrDefault();

                if (country != null)
                {
                    r.address.CountryID = country.CountryID;
                    r.address.CountryName = country.Name;
                    r.address.CountryCode = country.Code;
                }
            });

            return results;
        }

        public static TradeAccountAddressReturn FetchTradeAccountAddresses(string tradeAccountCode, PortalDbContext portalDb)
        {
            var tradeDataSourceJson = portalDb.TradeAccounts.Where(p => p.Code == tradeAccountCode).Select(p => p.UniVerseDataSources).Single();

            var result = MertexerV2SQL.MiscFunctions.MiscellaneousFunctions.FetchTradeAccountAddresses(tradeDataSourceJson, tradeAccountCode);

            if (result.InvoiceAddress?.CountryCode != null)
            {
                var country = portalDb.Countries.Where(p => p.Code == result.InvoiceAddress.CountryCode).Single();

                result.InvoiceAddress.CountryID = country.CountryID;
                result.InvoiceAddress.Country = country.Name;
                result.InvoiceAddress.EU = country.EU;
            }

            if (result.PrimaryAddress?.CountryCode != null)
            {
                var country = portalDb.Countries.Where(p => p.Code == result.PrimaryAddress.CountryCode).Single();

                result.PrimaryAddress.CountryID = country.CountryID;
                result.PrimaryAddress.Country = country.Name;
                result.PrimaryAddress.EU = country.EU;
            }

            return result;
        }

        //public static OrderTrackingSearchResult OrderTrackingSearch(PassAutocompleteTerm objSearch)
        //{
        //    var portalDb = new PortalDbContext();

        //    var result = new OrderTrackingSearchResult();

        //    int orderHeadId = -1;

        //    if (Int32.TryParse(objSearch.searchTerm, out orderHeadId))
        //    {
        //        var oh = portalDb.OrderHeads.Where(p => p.OrderHeadID == orderHeadId).SingleOrDefault();

        //        if (oh == null)
        //        {
        //            if (portalDb.Database.Connection.Database == "FlockDev")
        //            {
        //                var liveDb = new PortalDbContext("VM-SQL1-Flock");

        //                oh = liveDb.OrderHeads.Where(p => p.OrderHeadID == orderHeadId).SingleOrDefault();
        //            }
        //        }

        //        if (oh != null)
        //        {
        //            var tradeDataSourceJson = portalDb.TradeAccounts.Where(p => p.TradeAccountID == oh.Transaction.TradeAccountID).Select(p => p.UniVerseDataSources).Single();

        //            result = new OrderTrackingSearchResult(MertexerV2SQL.MiscFunctions.MiscellaneousFunctions.OrderTrackingSearch(tradeDataSourceJson, objSearch));

        //            if (!String.IsNullOrEmpty(result.ResultStatus) && result.ResultStatus.Contains("not found"))
        //            {
        //                result.MertexReportDataOrderSearchResults = portalDb.TradeOrder_SearchByReference(objSearch.searchTerm);
        //            }
        //            else
        //            {
        //                result.TradeAccount = portalDb.TradeAccounts.Where(p => p.Code == result.CustomerReference).Single();
        //            }
        //        }
        //        else
        //        {
        //            result.MertexReportDataOrderSearchResults = portalDb.TradeOrder_SearchByReference(objSearch.searchTerm);
        //        }
        //    }
        //    else
        //    {
        //        result.MertexReportDataOrderSearchResults = portalDb.TradeOrder_SearchByReference(objSearch.searchTerm);
        //    }

        //    return result;
        //}


        //public static List<MertexPCALookupResult> AddressBookSearch(PassPCAPredictFind objDetail)
        //{
        //    var result = new List<MertexPCALookupResult>();

        //    using (var ce = new MertexerV2.Utilities.CommandExecutor())
        //    {
        //        ce.Arbitrary("SET.TERM.TYPE wyse60 WIDTH 421 LENGTH 42");
        //        ce.Arbitrary("CASE OFF");
        //        var preResults = ce.Arbitrary($"LIST DELADD DELNAME CONTACT DELADDR1 DELADDR2 DELADDR3 DELADDR4 DELPCODE COUNTRY E.MAIL PHONE1 WITH CUSREF = \"{objDetail.tradeAccountCode}\" AND COUNTRY = \"{objDetail.countries}\" BY DELREF ID.SUP COL.HDR.SUPP COUNT.SUP")
        //            .Split(new string[] { "\r\n", "\u001b;" }, StringSplitOptions.RemoveEmptyEntries)
        //            .ToList();

        //        preResults.ForEach(c =>
        //        {
        //            var parts = c.Split(new char[] { '\t' }, StringSplitOptions.RemoveEmptyEntries).ToList();

        //            result.Add(new MertexPCALookupResult()
        //            {
        //                Label = "",
        //                Name = "",
        //                Line1 = "",
        //                Line2 = "",
        //                City = "",
        //                Province = "",
        //                PostalCode = ""
        //            });
        //        });
        //    }



        //    return result;
        //}

    }
}