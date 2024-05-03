using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Projects.Models
{
    public class ApplicationDbInitializer : CreateDatabaseIfNotExists<ProjectsDbContext>
    {
        protected override void Seed(ProjectsDbContext context)
        {
            InitializeIdentityForEF(context);
            base.Seed(context);
        }

        //Create User=Admin@Admin.com with password=Admin@123456 in the Admin role        
        public static void InitializeIdentityForEF(ProjectsDbContext db)
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

    public class ProjectsDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public ProjectsDbContext()
            : base("vm-sql")
        {
        }

        static ProjectsDbContext()
        {
            // Set the database intializer which is run once during application start
            // This seeds the database with admin user credentials and admin role
            System.Data.Entity.Database.SetInitializer<ProjectsDbContext>(new ApplicationDbInitializer());
        }

        public static ProjectsDbContext Create()
        {
            return new ProjectsDbContext();
        }
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        
        public ProjectDashboardResult ProjectDashboard(PassProjectDashboardFilters objFilters)
        {
            var result = new ProjectDashboardResult();

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "[portal].[Project_DashboardSelect]";

            var projectCategoryId = new SqlParameter("@ProjectCategoryID", objFilters.ProjectCategoryID ?? (object)DBNull.Value);
            var projectTypeId = new SqlParameter("@ProjectTypeID", objFilters.ProjectTypeID ?? (object)DBNull.Value);
            var tradeMarketId = new SqlParameter("@TradeMarketID", objFilters.TradeMarketID ?? (object)DBNull.Value);
            var ownerMemberId = new SqlParameter("@OwnerMemberID", objFilters.OwnerMemberID ?? (object)DBNull.Value);
            var countryId = new SqlParameter("@CountryID", objFilters.CountryID ?? (object)DBNull.Value);

            cmd.Parameters.Add(projectCategoryId);
            cmd.Parameters.Add(projectTypeId);
            cmd.Parameters.Add(tradeMarketId);
            cmd.Parameters.Add(ownerMemberId);
            cmd.Parameters.Add(countryId);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProjectDashboardResult>(reader).Single();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }

        public ProjectGridResult ProjectGrid(PassProjectGridFilters objFilters)
        {
            var result = new ProjectGridResult();

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "[portal].[Project_Search]";

            var widget = new SqlParameter("@Widget", objFilters.Widget ?? (object)DBNull.Value);
            var projectCategoryId = new SqlParameter("@ProjectCategoryID", objFilters.ProjectCategoryID ?? (object)DBNull.Value);
            var projectStatusId = new SqlParameter("@ProjectStatusID", objFilters.ProjectStatusID ?? (object)DBNull.Value);
            var projectTypeId = new SqlParameter("@ProjectTypeID", objFilters.ProjectTypeID ?? (object)DBNull.Value);
            var tradeMarketId = new SqlParameter("@TradeMarketID", objFilters.TradeMarketID ?? (object)DBNull.Value);
            var countryId = new SqlParameter("@CountryID", objFilters.CountryID ?? (object)DBNull.Value);
            var ownerMemberId = new SqlParameter("@OwnerMemberID", objFilters.OwnerMemberID ?? (object)DBNull.Value);
            var authorMemberId = new SqlParameter("@AuthorMemberID", objFilters.AuthorMemberID ?? (object)DBNull.Value);
            var searchTerm = new SqlParameter("@SearchTerm", objFilters.SearchTerm ?? (object)DBNull.Value);
            var showCompleted = new SqlParameter("@ShowCompleted", objFilters.ShowCompleted);

            cmd.Parameters.Add(widget);
            cmd.Parameters.Add(projectCategoryId);
            cmd.Parameters.Add(projectStatusId);
            cmd.Parameters.Add(projectTypeId);
            cmd.Parameters.Add(tradeMarketId);
            cmd.Parameters.Add(countryId);
            cmd.Parameters.Add(authorMemberId);
            cmd.Parameters.Add(ownerMemberId);
            cmd.Parameters.Add(searchTerm);
            cmd.Parameters.Add(showCompleted);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<ProjectGridRecord>(reader).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                this.Database.Connection.Close();
            }

            return result;
        }
    }
}