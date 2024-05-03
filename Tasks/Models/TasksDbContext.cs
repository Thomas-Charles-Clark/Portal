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

namespace Tasks.Models
{
    public class ApplicationDbInitializer : CreateDatabaseIfNotExists<TasksDbContext>
    {
        protected override void Seed(TasksDbContext context)
        {
            InitializeIdentityForEF(context);
            base.Seed(context);
        }

        //Create User=Admin@Admin.com with password=Admin@123456 in the Admin role        
        public static void InitializeIdentityForEF(TasksDbContext db)
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

    public class TasksDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public TasksDbContext()
            : base("vm-sql")
        {
        }

        static TasksDbContext()
        {
            // Set the database intializer which is run once during application start
            // This seeds the database with admin user credentials and admin role
            System.Data.Entity.Database.SetInitializer<TasksDbContext>(new ApplicationDbInitializer());
        }

        public static TasksDbContext Create()
        {
            return new TasksDbContext();
        }
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        
        public TaskDashboardResult TaskDashboard(PassTaskDashboardFilters objFilters)
        {
            var result = new TaskDashboardResult();

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "[portal].[Task_DashboardSelect]";

            var createdByMemberId = new SqlParameter("@AuthorMemberID", objFilters.CreatedByMemberID ?? (object)DBNull.Value);
            var createdByDepartmentId = new SqlParameter("@AuthorDepartmentID", objFilters.CreatedByDepartmentID ?? (object)DBNull.Value);
            var createdByLocationId = new SqlParameter("@AuthorLocationID", objFilters.CreatedByLocationID ?? (object)DBNull.Value);
            var assignedToMemberId = new SqlParameter("@OwnerMemberID", objFilters.AssignedToMemberID ?? (object)DBNull.Value);
            var assignedToDepartmentId = new SqlParameter("@OwnerDepartmentID", objFilters.AssignedToDepartmentID ?? (object)DBNull.Value);
            var assignedToLocationId = new SqlParameter("@OwnerLocationID", objFilters.AssignedToLocationID ?? (object)DBNull.Value);
            var taskStatusId = new SqlParameter("@TaskStatusID", objFilters.TaskStatusID ?? (object)DBNull.Value);
            var projectId = new SqlParameter("@ProjectID", objFilters.ProjectID ?? (object)DBNull.Value);
            var taskTypeId = new SqlParameter("@TaskTypeID", objFilters.TaskTypeID ?? (object)DBNull.Value);

            cmd.Parameters.Add(createdByMemberId);
            cmd.Parameters.Add(createdByDepartmentId);
            cmd.Parameters.Add(createdByLocationId);
            cmd.Parameters.Add(assignedToMemberId);
            cmd.Parameters.Add(assignedToDepartmentId);
            cmd.Parameters.Add(assignedToLocationId);
            cmd.Parameters.Add(taskStatusId);
            cmd.Parameters.Add(projectId);
            cmd.Parameters.Add(taskTypeId);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<TaskDashboardResult>(reader).Single();
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

        public TaskGridResult TaskGrid(PassTaskGridFilters objFilters)
        {
            var result = new TaskGridResult();

            var cmd = this.Database.Connection.CreateCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "[portal].[Task_Grid_Select]";

            var createdByMemberId = new SqlParameter("@AuthorMemberID", objFilters.CreatedByMemberID ?? (object)DBNull.Value);
            var createdByDepartmentId = new SqlParameter("@AuthorDepartmentID", objFilters.CreatedByDepartmentID ?? (object)DBNull.Value);
            var createdByLocationId = new SqlParameter("@AuthorLocationID", objFilters.CreatedByLocationID ?? (object)DBNull.Value);
            var assignedToMemberId = new SqlParameter("@OwnerMemberID", objFilters.AssignedToMemberID ?? (object)DBNull.Value);
            var assignedToDepartmentId = new SqlParameter("@OwnerDepartmentID", objFilters.AssignedToDepartmentID ?? (object)DBNull.Value);
            var assignedToLocationId = new SqlParameter("@OwnerLocationID", objFilters.AssignedToLocationID ?? (object)DBNull.Value);
            var taskStatusId = new SqlParameter("@TaskStatusID", objFilters.TaskStatusID ?? (object)DBNull.Value);
            var projectId = new SqlParameter("@ProjectID", objFilters.ProjectID ?? (object)DBNull.Value);
            var taskTypeId = new SqlParameter("@TaskTypeID", objFilters.TaskTypeID ?? (object)DBNull.Value);
            var widget = new SqlParameter("@Widget", objFilters.Widget ?? (object)DBNull.Value);
            var showCompleted = new SqlParameter("@ShowCompleted", objFilters.ShowCompleted);

            cmd.Parameters.Add(createdByMemberId);
            cmd.Parameters.Add(createdByDepartmentId);
            cmd.Parameters.Add(createdByLocationId);
            cmd.Parameters.Add(assignedToMemberId);
            cmd.Parameters.Add(assignedToDepartmentId);
            cmd.Parameters.Add(assignedToLocationId);
            cmd.Parameters.Add(taskStatusId);
            cmd.Parameters.Add(projectId);
            cmd.Parameters.Add(taskTypeId);
            cmd.Parameters.Add(widget);
            cmd.Parameters.Add(showCompleted);

            try
            {
                this.Database.Connection.Open();

                var reader = cmd.ExecuteReader();

                result.Results = ((IObjectContextAdapter)this)
                    .ObjectContext
                    .Translate<TaskGridRecord>(reader).ToList();
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