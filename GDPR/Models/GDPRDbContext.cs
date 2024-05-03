using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace GDPR.Models
{
    public class ApplicationDbInitializer : CreateDatabaseIfNotExists<GDPRDbContext>
    {
        protected override void Seed(GDPRDbContext context)
        {
            InitializeIdentityForEF(context);
            base.Seed(context);
        }

        //Create User=Admin@Admin.com with password=Admin@123456 in the Admin role        
        public static void InitializeIdentityForEF(GDPRDbContext db)
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

    public class GDPRDbContext : IdentityDbContext<Member, Role, int, Member_Login, Member_Role, Member_Claim>
    {
        public GDPRDbContext()
            : base("vm-sql")
        {
        }

        static GDPRDbContext()
        {
            // Set the database intializer which is run once during application start
            // This seeds the database with admin user credentials and admin role
            System.Data.Entity.Database.SetInitializer<GDPRDbContext>(new ApplicationDbInitializer());
        }

        public static GDPRDbContext Create()
        {
            return new GDPRDbContext();
        }

        public DbSet<DataCategory> DataCategories { get; set; }
        public DbSet<DataCategory_DataSource> DataCategory_DataSources { get; set; }
        public DbSet<DataCategory_DataStore> DataCategory_DataStores { get; set; }
        public DbSet<DataCategory_IndividualCategory> DataCategory_IndividualCategories { get; set; }
        public DbSet<DataCategory_Supplier_DataTransmissionMethod> DataCategory_Supplier_DataTransmissionMethods { get; set; }
        public DbSet<DataSource> DataSources { get; set; }
        public DbSet<DataStore> DataStores { get; set; }
        public DbSet<DataTransmissionMethod> DataTransmissionMethods { get; set; }
        public DbSet<DataType> DataTypes { get; set; } 
        public DbSet<Department> Departments { get; set; }
        public DbSet<IndividualCategory> IndividualCategories { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<SupplierCategory> SupplierCategories { get; set; }
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            //var gdprSchema = "gdpr";
            //var dataCategory = modelBuilder.Entity<DataCategory>().ToTable("DataCategory", gdprSchema);
            //var dataCategory_DataSource = modelBuilder.Entity<DataCategory_DataSource>().ToTable("DataCategory_DataSource", gdprSchema);
            //var dataCategory_DataStore = modelBuilder.Entity<DataCategory_DataStore>().ToTable("DataCategory_DataStore", gdprSchema);
            //var dataCategory_IndividualCategory = modelBuilder.Entity<DataCategory_IndividualCategory>().ToTable("DataCategory_IndividualCategory", gdprSchema);
            //var dataCategory_Supplier_DataTransmissionMethod = modelBuilder.Entity<DataCategory_Supplier_DataTransmissionMethod>().ToTable("DataCategory_Supplier_DataTransmissionMethod", gdprSchema);
            //var dataSource = modelBuilder.Entity<DataSource>().ToTable("DataSource", gdprSchema);
            //var dataTransmissionMethod = modelBuilder.Entity<DataTransmissionMethod>().ToTable("DataTransmissionMethod", gdprSchema);
            //var dataType = modelBuilder.Entity<DataType>().ToTable("DataType", gdprSchema);
            //var department = modelBuilder.Entity<Department>().ToTable("Department", gdprSchema);
            //var individualCategory = modelBuilder.Entity<IndividualCategory>().ToTable("IndividualCategory", gdprSchema);
            //var supplier = modelBuilder.Entity<Supplier>().ToTable("Supplier", gdprSchema);
            //var supplierCategory = modelBuilder.Entity<SupplierCategory>().ToTable("SupplierCategory", gdprSchema);
        }
    }
}