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
using System.Linq;
using System.Web;

namespace Webtex.Models
{
    public class ApplicationDbInitializer : CreateDatabaseIfNotExists<WebtexDbContext>
    {
        protected override void Seed(WebtexDbContext context)
        {
            InitializeIdentityForEF(context);
            base.Seed(context);
        }

        //Create User=Admin@Admin.com with password=Admin@123456 in the Admin role        
        public static void InitializeIdentityForEF(WebtexDbContext db)
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

    public class WebtexDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public WebtexDbContext()
            : base("vm-sql")
        {
        }

        static WebtexDbContext()
        {
            // Set the database intializer which is run once during application start
            // This seeds the database with admin user credentials and admin role
            System.Data.Entity.Database.SetInitializer<WebtexDbContext>(new ApplicationDbInitializer());
        }

        public static WebtexDbContext Create()
        {
            return new WebtexDbContext();
        }
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        //public DbSet<TradeAccountFilter> TradeAccountFilters { get; set; }

        //public DbSet<ProductFilter> ProductFilters { get; set; }

        //public SalesStatisticsTaggingResult TagCustomersSearch(PassTagCustomersSearch objFilters)
        //{
        //    var result = new SalesStatisticsTaggingResult();

        //    var cmd = this.Database.Connection.CreateCommand();

        //    cmd.CommandType = System.Data.CommandType.StoredProcedure;
        //    cmd.CommandText = "[portal].[CustomerSalesAnalysis_CustomerSalesAnalysis]";

        //    var salesMarketId = new SqlParameter("@SalesMarketID", objFilters.SalesMarketID ?? (object)DBNull.Value);
        //    var salesAreaId = new SqlParameter("@SalesAreaID", objFilters.SalesAreaID ?? (object)DBNull.Value);
        //    var salesRepresentativeId = new SqlParameter("@SalesRepresentativeID", objFilters.SalesRepresentativeID ?? (object)DBNull.Value);
            
        //    var salesAgentId = new SqlParameter("@SalesAgentID", objFilters?.SalesRepresentativeID ?? (object)DBNull.Value);
            
        //    var brandId = new SqlParameter("@BrandID", objFilters.BrandID ?? (object)DBNull.Value);
        //    var productGroupId = new SqlParameter("@ProductGroupID", objFilters.ProductGroupID ?? (object)DBNull.Value);
        //    var itemTypeId = new SqlParameter("@ItemTypeID", objFilters.ItemTypeID ?? (object)DBNull.Value);
        //    var launchId = new SqlParameter("@LaunchID", objFilters.LaunchID ?? (object)DBNull.Value);

        //    var tradeAccountGroupId = new SqlParameter("@TradeAccountGroupID", objFilters.TradeAccountGroupID ?? (object)DBNull.Value);
        //    var partnerId = new SqlParameter("@PartnerID", objFilters.PartnerID ?? (object)DBNull.Value);
        //    var tradeAccountTypeId = new SqlParameter("@TradeAccountTypeID", objFilters.TradeAccountTypeID ?? (object)DBNull.Value);
        //    var status = new SqlParameter("@Status", objFilters.Status ?? (object)DBNull.Value);
        //    var tagId = new SqlParameter("@TagID", objFilters.TagID ?? (object)DBNull.Value);

        //    var searchString = new SqlParameter("@SearchString", objFilters.SearchString ?? (object)DBNull.Value);
        //    var currencyId = new SqlParameter("@CurrencyID", objFilters.CurrencyID ?? (object)DBNull.Value);

        //    var includeDisplay = new SqlParameter("@Display", objFilters.IncludeDisplay ?? (object)DBNull.Value);

        //    var includeAdvertising = new SqlParameter("@Advertising", objFilters.IncludeAdvertising ?? (object)DBNull.Value);

        //    cmd.Parameters.Add(salesMarketId);
        //    cmd.Parameters.Add(salesAreaId);

        //    switch (objFilters.SalesRepOrAgent)
        //    {
        //        case true:
        //            cmd.Parameters.Add(salesRepresentativeId);
        //            break;
        //        case false:
        //            cmd.Parameters.Add(salesAgentId);
        //            break;
        //        case null:
        //            cmd.Parameters.Add(salesRepresentativeId);
        //            cmd.Parameters.Add(salesAgentId);
        //            break;
        //    }

        //    cmd.Parameters.Add(brandId);
        //    cmd.Parameters.Add(productGroupId);
        //    cmd.Parameters.Add(itemTypeId);
        //    cmd.Parameters.Add(launchId);

        //    cmd.Parameters.Add(tradeAccountGroupId);
        //    cmd.Parameters.Add(partnerId);
        //    cmd.Parameters.Add(tradeAccountTypeId);
        //    cmd.Parameters.Add(status);
        //    cmd.Parameters.Add(tagId);

        //    cmd.Parameters.Add(searchString);
        //    cmd.Parameters.Add(currencyId);

        //    cmd.Parameters.Add(includeDisplay);
        //    cmd.Parameters.Add(includeAdvertising);

        //    try
        //    {
        //        this.Database.Connection.Open();

        //        var reader = cmd.ExecuteReader();

        //        result.Results = ((IObjectContextAdapter)this)
        //            .ObjectContext
        //            .Translate<TaggingTradeAccountRecord>(reader).ToList();

        //        reader.NextResult();

        //        result.Tags = ((IObjectContextAdapter)this)
        //            .ObjectContext
        //            .Translate<TaggingRecord>(reader).ToList();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    finally
        //    {
        //        this.Database.Connection.Close();
        //    }

        //    result.Results.ForEach(c => {
        //        c.Tags = result.Tags.Where(p => p.TradeAccountID == c.TradeAccountID).ToArray();
        //    });

        //    return result;
        //}
    }
}