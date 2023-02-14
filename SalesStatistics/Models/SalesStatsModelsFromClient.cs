using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SalesStatistics.Models
{
    public class PassCustomerAnalysis
    {
        public int StartMonthID { get; set; }
        public int EndMonthID { get; set; }
        public short? SalesMarketID { get; set; }
        public short? SalesAreaID { get; set; }
        public bool? SalesRepOrAgent { get; set; }
        public short? SalesAgentID { get; set; }
        public short? SalesRepresentativeID { get; set; }
        public byte? BrandID { get; set; }
        public byte? ProductGroupID { get; set; }
        public short? ItemTypeID { get; set; }
        public short? LaunchID { get; set; }
        public short? TradeAccountGroupID { get; set; }
        public short? PartnerID { get; set; }
        public short? TradeAccountTypeID { get; set; }
        public byte? StatusID { get; set; }
        public int? TagID { get; set; }
        public string SearchString { get; set; }
        public byte? CurrencyID { get; set; }
        public bool? IncludeAdvertising { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
    }

    public class PassStatisticsSummary
    {
        public short? SalesRepresentativeID { get; set; }
        public byte? SalesMarketID { get; set; }
        public string Widget { get; set; }
        public byte? CurrencyID { get; set; }
        public bool? SalesRepOrAgent { get; set; }
        public bool CurrencyDisplay { get; set; }
        public int? PageNumber { get; set; } // Only used for Customer Dashboard grid
        public int? PageSize { get; set; }   // 
        public int? TradeAccountID { get; set; }
    }

    public class PassSalesStatsSlicerGroupOneFilters
    {
        public byte? SalesMarketID { get; set; }
        public short? SalesAreaID { get; set; }
        public short? SalesAgentID { get; set; }
        public short? SalesRepresentativeID { get; set; }
    }

    public class PassSalesStatsSlicerGroupZeroMarketFilters
    {
        public byte? SalesMarketID { get; set; }
        public short? SalesAreaID { get; set; }
        public short? SalesAgentID { get; set; }
        public short? SalesRepresentativeID { get; set; }
        public bool CurrencyDisplay { get; set; }
    }

    public class PassSalesStatsSlicerGroupTwoFilters
    {
        public byte? BrandID { get; set; }
        public byte? ProductGroupID { get; set; }
        public short? ItemTypeID { get; set; }
        public short? LaunchID { get; set; }
    }

    public class PassCustomersToTag
    {
        public List<int> TradeAccountIDs { get; set; }
        public List<int> TagIDs { get; set; }
    }

    public class PassSalesRepMarket
    {
        public short? SalesRepresentativeID { get; set; }
        public short? SalesMarketID { get; set; }
    }
}