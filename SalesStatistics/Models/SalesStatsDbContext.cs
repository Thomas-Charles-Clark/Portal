using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace SalesStatistics.Models
{
    public class ApplicationDbInitializer : CreateDatabaseIfNotExists<SalesStatsDbContext>
    {
        protected override void Seed(SalesStatsDbContext context)
        {
            InitializeIdentityForEF(context);
            base.Seed(context);
        }

        //Create User=Admin@Admin.com with password=Admin@123456 in the Admin role        
        public static void InitializeIdentityForEF(SalesStatsDbContext db)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var roleManager = HttpContext.Current.GetOwinContext().Get<ApplicationRoleManager>();
            const string name = "admin@admin.com";
            const string password = "Admin@123456";
            const string roleName = "Admin";

            //Create Role Admin if it does not exist
            var role = roleManager.FindByName(roleName);
            if (role == null)
            {
                role = new IdentityRole(roleName);
                var roleresult = roleManager.Create(role);
            }

            var user = userManager.FindByName(name);
            if (user == null)
            {
                user = new Member { Email = name };
                var result = userManager.Create(user, password);
                result = userManager.SetLockoutEnabled(user.Id, false);
            }

            // Add user admin to Role Admin if not already added
            var rolesForUser = userManager.GetRoles(user.Id);
            if (!rolesForUser.Contains(role.Name))
            {
                var result = userManager.AddToRole(user.Id, role.Name);
            }
        }
    }

    public class SalesStatsDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public SalesStatsDbContext()
            : base("vm-sql")
        {
        }

        static SalesStatsDbContext()
        {
            // Set the database intializer which is run once during application start
            // This seeds the database with admin user credentials and admin role
            System.Data.Entity.Database.SetInitializer<SalesStatsDbContext>(new ApplicationDbInitializer());
        }

        public static SalesStatsDbContext Create()
        {
            return new SalesStatsDbContext();
        }
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        public FetchSalesStatisticsResult FetchSalesStatistics(PassStatisticsSummary objSummary)
        {
            var result = new FetchSalesStatisticsResult(
                SalesStatisticsProcedure<TotalSalesResult>(objSummary, "[portal].[CustomerSalesAnalysis_TotalSales]"),
                SalesStatisticsProcedure<SalesByAreaResult>(objSummary, "[portal].[CustomerSalesAnalysis_SalesByArea]"),
                SalesStatisticsProcedure<CustomerDashboardResult>(objSummary, "[portal].[CustomerSalesAnalysis_SalesByCustomerDashboard]"),
                SalesStatisticsProcedure<SalesByCustomerResult>(objSummary, "[portal].[CustomerSalesAnalysis_SalesByCustomer]"),
                SalesByQuarter(objSummary)
            );
            
            return result;
        }

        public List<T> SalesStatisticsProcedure<T>(PassStatisticsSummary objSummary, string procName)
        {
            var result = new List<T>();

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = procName;

            var widget = new SqlParameter("@Widget", objSummary?.Widget ?? (object)DBNull.Value);
            var salesRepresentativeId = new SqlParameter("@SalesRepresentativeID", objSummary?.SalesRepresentativeID ?? (object)DBNull.Value);
            var salesMarketId = new SqlParameter("@SalesMarketID", objSummary?.SalesMarketID ?? (object)DBNull.Value);
            var currencyId = new SqlParameter("@CurrencyID", objSummary?.CurrencyID ?? (object)DBNull.Value);
            var tradeaccountId = new SqlParameter("@TradeAccountID", objSummary?.TradeAccountID ?? (object)DBNull.Value);
            var salesAgentId = new SqlParameter("@SalesAgentID", objSummary?.SalesRepresentativeID ?? (object)DBNull.Value);
            
            cmd.Parameters.Add(salesMarketId);
            cmd.Parameters.Add(currencyId);

            switch (objSummary?.SalesRepOrAgent)
            {
                case true:
                    cmd.Parameters.Add(salesRepresentativeId);
                    break;
                case false:
                    cmd.Parameters.Add(salesAgentId);
                    break;
                case null:
                    cmd.Parameters.Add(salesRepresentativeId);
                    cmd.Parameters.Add(salesAgentId);
                    break;
            }

            if (typeof(T) == typeof(SalesByCustomerResult))
            {
                cmd.Parameters.Add(widget);
                var pageNo = new SqlParameter("@PageNumber", objSummary?.PageNumber);
                var pageSize = new SqlParameter("@PageSize", objSummary?.PageSize);
            }

            if (typeof(T) == typeof(TotalSalesResult))
            {
                cmd.Parameters.Add(tradeaccountId);
            }

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<T>(reader).ToList();
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }

        

        public SalesByCustomerResultWrapper SalesByCustomer(PassStatisticsSummary objSummary)
        {
            var result = new SalesByCustomerResultWrapper();

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "[portal].[CustomerSalesAnalysis_SalesByCustomer]";

            var widget = new SqlParameter("@Widget", objSummary?.Widget ?? (object)DBNull.Value);
            var salesRepresentativeId = new SqlParameter("@SalesRepresentativeID", objSummary?.SalesRepresentativeID ?? (object)DBNull.Value);
            var salesMarketId = new SqlParameter("@SalesMarketID", objSummary?.SalesMarketID ?? (object)DBNull.Value);
            var currencyId = new SqlParameter("@CurrencyID", objSummary?.CurrencyID ?? (object)DBNull.Value);

            var salesAgentId = new SqlParameter("@SalesAgentID", objSummary?.SalesRepresentativeID ?? (object)DBNull.Value);
            
            cmd.Parameters.Add(salesMarketId);
            cmd.Parameters.Add(currencyId);

            switch (objSummary?.SalesRepOrAgent)
            {
                case true:
                    cmd.Parameters.Add(salesRepresentativeId);
                    break;
                case false:
                    cmd.Parameters.Add(salesAgentId);
                    break;
                case null:
                    cmd.Parameters.Add(salesRepresentativeId);
                    cmd.Parameters.Add(salesAgentId);
                    break;
            }

            cmd.Parameters.Add(widget);

            var pageNo = new SqlParameter("@PageNumber", objSummary?.PageNumber ?? (object)DBNull.Value);
            var pageSize = new SqlParameter("@PageSize", objSummary?.PageSize ?? (object)DBNull.Value);

            cmd.Parameters.Add(pageNo);
            cmd.Parameters.Add(pageSize);
            
            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<SalesByCustomerResult>(reader).ToList();

                reader.NextResult();
                
                result.Totals = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<SalesByCustomerTotalsData>(reader).Single();
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }
        
        public SalesByQuarterResult SalesByQuarter(PassStatisticsSummary objSummary)
        {
            var result = new SalesByQuarterResult();

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "[portal].[CustomerSalesAnalysis_SalesByQuarter]";

            var salesRepresentativeId = new SqlParameter("@SalesRepresentativeID", objSummary?.SalesRepresentativeID ?? (object)DBNull.Value);
            var salesMarketId = new SqlParameter("@SalesMarketID", objSummary?.SalesMarketID ?? (object)DBNull.Value);
            var currencyId = new SqlParameter("@CurrencyID", objSummary?.CurrencyID ?? (object)DBNull.Value);
            var salesAgentId = new SqlParameter("@SalesAgentID", objSummary?.SalesRepresentativeID ?? (object)DBNull.Value);

            switch (objSummary?.SalesRepOrAgent)
            {
                case true:
                    cmd.Parameters.Add(salesRepresentativeId);
                    break;
                case false:
                    cmd.Parameters.Add(salesAgentId);
                    break;
                case null:
                    cmd.Parameters.Add(salesRepresentativeId);
                    cmd.Parameters.Add(salesAgentId);
                    break;
            }
            
            cmd.Parameters.Add(salesMarketId);
            cmd.Parameters.Add(currencyId);
            
            var tradeAccountId = new SqlParameter("@TradeAccountID", objSummary?.TradeAccountID ?? (object)DBNull.Value);
            cmd.Parameters.Add(tradeAccountId);
            
            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.Financial = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<SalesByQuarterFinancialResult>(reader).ToList();

                reader.NextResult();

                result.Calendar = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<SalesByQuarterCalendarResult>(reader).ToList();
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }

        public SalesStatisticsCurrenciesResult SalesStatisticsCurrencies(PassSalesRepMarket objFilters)
        {
            var result = new SalesStatisticsCurrenciesResult();

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "[portal].[CustomerSalesAnalysis_Currency_Select]";

            var salesMarketId = new SqlParameter("@SalesMarketID", objFilters?.SalesMarketID ?? (object)DBNull.Value);
            var salesRepresentativeId = new SqlParameter("@SalesRepresentativeID", objFilters?.SalesRepresentativeID ?? (object)DBNull.Value);
            
            cmd.Parameters.Add(salesMarketId);
            cmd.Parameters.Add(salesRepresentativeId);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<SalesStatisticsCurrencyRecord>(reader).ToList();
            }
            finally
            {
                this.Database.Connection.Close();
            }
            
            return result;
        }

        //public SalesStatisticsByMonthRangeResult CustomerAnalysis(PassCustomerAnalysis objFilters)
        public SalesStatisticsByMonthRangeResult CustomerAnalysis(PassCustomerAnalysis objFilters)
        {
            var result = new SalesStatisticsByMonthRangeResult();

            var customers = new List<SalesStatisticsByMonthRangeCustomerRecord>();
            var periodValues = new List<SalesStatisticsByMonthRangePeriodValueRecord>();

            var cmd = this.Database.Connection.CreateCommand();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "[portal].[CustomerSalesAnalysis_SalesByMonthRange]";

            var from = new SqlParameter("@From", objFilters.StartMonthID);
            var to = new SqlParameter("@To", objFilters.EndMonthID);

            var salesMarketId = new SqlParameter("@SalesMarketID", objFilters.SalesMarketID ?? (object)DBNull.Value);
            var salesAreaId = new SqlParameter("@SalesAreaID", objFilters.SalesAreaID ?? (object)DBNull.Value);
            var salesRepresentativeId = new SqlParameter("@SalesRepresentativeID", objFilters.SalesRepresentativeID ?? (object)DBNull.Value);
            var salesAgentId = new SqlParameter("@SalesAgentID", objFilters?.SalesRepresentativeID ?? (object)DBNull.Value);

            var brandId = new SqlParameter("@BrandID", objFilters.BrandID ?? (object)DBNull.Value);
            var productGroupId = new SqlParameter("@ProductGroupID", objFilters.ProductGroupID ?? (object)DBNull.Value);
            var itemTypeId = new SqlParameter("@ItemTypeID", objFilters.ItemTypeID ?? (object)DBNull.Value);
            var launchId = new SqlParameter("@LaunchID", objFilters.LaunchID ?? (object)DBNull.Value);

            var tradeAccountGroupId = new SqlParameter("@TradeAccountGroupID", objFilters.TradeAccountGroupID ?? (object)DBNull.Value);
            var partnerId = new SqlParameter("@PartnerID", objFilters.PartnerID ?? (object)DBNull.Value);
            var tradeAccountTypeId = new SqlParameter("@TradeAccountTypeID", objFilters.TradeAccountTypeID ?? (object)DBNull.Value);
            var status = new SqlParameter("@Status", objFilters.StatusID ?? (object)DBNull.Value);
            var tagId = new SqlParameter("@TagID", objFilters.TagID ?? (object)DBNull.Value);

            var searchString = new SqlParameter("@SearchString", objFilters.SearchString ?? (object)DBNull.Value);
            var currencyId = new SqlParameter("@CurrencyID", objFilters.CurrencyID ?? (object)DBNull.Value);
            
            var includeAdvertising = new SqlParameter("@Advertising", objFilters.IncludeAdvertising ?? true);
            

            switch (objFilters?.SalesRepOrAgent)
            {
                case true:
                    cmd.Parameters.Add(salesRepresentativeId);
                    break;
                case false:
                    cmd.Parameters.Add(salesAgentId);
                    break;
                case null:
                    cmd.Parameters.Add(salesRepresentativeId);
                    cmd.Parameters.Add(salesAgentId);
                    break;
            }

            cmd.Parameters.Add(from);
            cmd.Parameters.Add(to);

            cmd.Parameters.Add(salesMarketId);
            cmd.Parameters.Add(salesAreaId);
            
            cmd.Parameters.Add(brandId);
            cmd.Parameters.Add(productGroupId);
            cmd.Parameters.Add(itemTypeId);
            cmd.Parameters.Add(launchId);

            cmd.Parameters.Add(tradeAccountGroupId);
            cmd.Parameters.Add(partnerId);
            cmd.Parameters.Add(tradeAccountTypeId);
            cmd.Parameters.Add(status);
            cmd.Parameters.Add(tagId);

            cmd.Parameters.Add(searchString);
            cmd.Parameters.Add(currencyId);
            
            cmd.Parameters.Add(includeAdvertising);
            
            var pageNo = new SqlParameter("@PageNumber", objFilters.PageNumber ?? (object)DBNull.Value);
            var pageSize = new SqlParameter("@PageSize", objFilters.PageSize ?? (object)DBNull.Value);

            cmd.Parameters.Add(pageNo);
            cmd.Parameters.Add(pageSize);
            
            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                customers = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<SalesStatisticsByMonthRangeCustomerRecord>(reader).ToList();

                reader.NextResult();
                
                periodValues = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<SalesStatisticsByMonthRangePeriodValueRecord>(reader).ToList();

                reader.NextResult();

                result.Totals = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<SalesStatisticsPeriodTotal>(reader).ToList(); // this can have missing periods.
            
                reader.NextResult();

                result.Targets = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<SalesStatisticsPeriodTotal>(reader).ToList(); // this can have missing periods.
            }
            finally
            {
                this.Database.Connection.Close();
            }

            var results = new List<dynamic>();

            var objLock = new object();

            Parallel.ForEach(customers, new ParallelOptions() { MaxDegreeOfParallelism = 10 }, c => {
                
                var values = periodValues.Where(p => p.TradeAccountID == c.TradeAccountID).ToList();

                dynamic expando = new ExpandoObject();

                expando.TradeAccountID = c.TradeAccountID;
                expando.Code = c.Code;
                expando.Name = c.Name;
                expando.Status = c.Status;
                expando.SalesMarketCode = c.SalesMarketCode;
                expando.SalesAreaCode = c.SalesAreaCode;
                expando.SalesAreaName = c.SalesAreaName;
                expando.Email = c.Email;
                expando.PhoneNumber = c.PhoneNumber;
                expando.AddressLine1 = c.AddressLine1;
                expando.AddressLine2 = c.AddressLine2;
                expando.AddressLine3 = c.AddressLine3;
                expando.AddressLine4 = c.AddressLine4;
                expando.Postcode = c.Postcode;
                expando.CountryCode = c.CountryCode;
                expando.DeliveryAddressLine1 = c.DeliveryAddressLine1;
                expando.DeliveryAddressLine2 = c.DeliveryAddressLine2;
                expando.DeliveryAddressLine3 = c.DeliveryAddressLine3;
                expando.DeliveryAddressLine4 = c.DeliveryAddressLine4;
                expando.DeliveryAddressPostcode = c.DeliveryAddressPostcode;
                expando.DeliveryCountryCode = c.DeliveryAddressCountryCode;

                expando.PeriodTotalValue = values.Select(p => p.Value).Sum();

                for (var i = 0; i < values.Count; i++)
                {
                    ((IDictionary<string, object>)expando)[$"Period_{values[i].Period}_Value"] = values[i].Value;
                    ((IDictionary<string, object>)expando)[$"Period_{values[i].Period}_ValueCurr"] = values[i].ValueCurr;
                }

                lock(objLock)
                {
                    results.Add(expando);
                }
            });

            result.Results = results;

            return result;
        }
    }
}