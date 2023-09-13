using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.StockManagement;

public partial class PortalDbContext : DbContext
{
    public PortalDbContext(DbContextOptions<PortalDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<StatusGroup> StatusGroups { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductID).HasName("PK_StockManagement_Product");

            entity.Property(e => e.ProductID).ValueGeneratedNever();
            entity.Property(e => e.CreatedDT).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ModifiedDT).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Status).IsFixedLength();

            entity.HasOne(d => d.StatusGroup).WithMany(p => p.Products).HasConstraintName("FK_StockManagement_Product_StatusGroupID");
        });

        modelBuilder.Entity<StatusGroup>(entity =>
        {
            entity.HasKey(e => e.StatusGroupID).HasName("PK_StockManagement_StatusGroup");

            entity.Property(e => e.CreatedDT).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ModifiedDT).HasDefaultValueSql("(sysdatetime())");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
