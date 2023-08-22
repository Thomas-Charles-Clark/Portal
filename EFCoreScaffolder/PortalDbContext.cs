using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.ProductPage;

public partial class PortalDbContext : DbContext
{
    public PortalDbContext(DbContextOptions<PortalDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<Collection> Collections { get; set; }

    public virtual DbSet<Colour> Colours { get; set; }

    public virtual DbSet<Launch> Launches { get; set; }

    public virtual DbSet<Pattern> Patterns { get; set; }

    public virtual DbSet<ProductPage> ProductPages { get; set; }

    public virtual DbSet<ProductType> ProductTypes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Brand>(entity =>
        {
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end,(0)))", true);
            entity.Property(e => e.SortOrder).HasDefaultValueSql("((1))");
            entity.Property(e => e.SubmitToMertex).HasDefaultValueSql("((1))");

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent).HasConstraintName("FK_Brand_Brand");
        });

        modelBuilder.Entity<Collection>(entity =>
        {
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Urlkeywords).HasDefaultValueSql("('TBC')");

            entity.HasOne(d => d.Brand).WithMany(p => p.Collections)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Collection_Brand");

            entity.HasOne(d => d.Launch).WithMany(p => p.Collections)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Collection_Launch");

            entity.HasOne(d => d.ProductType).WithMany(p => p.Collections)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Collection_ProductType");
        });

        modelBuilder.Entity<Colour>(entity =>
        {
            entity.HasKey(e => e.ColourId).HasName("PK_A_Colour");

            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end,0))", true);
            entity.Property(e => e.Hex).IsFixedLength();
            entity.Property(e => e.RecognisedColour).HasDefaultValueSql("((1))");
            entity.Property(e => e.SortOrder).HasDefaultValueSql("((1))");
        });

        modelBuilder.Entity<Launch>(entity =>
        {
            entity.Property(e => e.Year).HasComputedColumnSql("(CONVERT([smallint],datepart(year,[LaunchDate])))", true);
        });

        modelBuilder.Entity<Pattern>(entity =>
        {
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end,0))", true);
        });

        modelBuilder.Entity<ProductPage>(entity =>
        {
            entity.Property(e => e.BrandId).HasDefaultValueSql("((2))");
            entity.Property(e => e.CanonicalContentType).HasComputedColumnSql("(CONVERT([nvarchar](1),case when [CanonicalProductPageID] IS NOT NULL then 'P' else case when [CanonicalCollectionID] IS NOT NULL then 'C'  end end))", true);
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end,0))", true);
            entity.Property(e => e.Heading).HasDefaultValueSql("('')");
            entity.Property(e => e.LaunchId).HasDefaultValueSql("([adm].[NextLaunchID](getdate()))");
            entity.Property(e => e.ProductTypeId).HasDefaultValueSql("((255))");
            entity.Property(e => e.TradeDiscountOperator).IsFixedLength();
            entity.Property(e => e.TradeSwitch).HasComment("NULL = Both; 0 = Retail Only; 1 = Trade Only");

            entity.HasOne(d => d.Brand).WithMany(p => p.ProductPages)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductPage_Brand");

            entity.HasOne(d => d.CanonicalCollection).WithMany(p => p.ProductPages).HasConstraintName("FK_dbo_ProductPage_CanonicalCollectionID");

            entity.HasOne(d => d.Colour).WithMany(p => p.ProductPages).HasConstraintName("FK_ProductPage_Colour");

            entity.HasOne(d => d.Launch).WithMany(p => p.ProductPages)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductPage_Launch");

            entity.HasOne(d => d.Pattern).WithMany(p => p.ProductPages).HasConstraintName("FK_ProductPage_Pattern");

            entity.HasOne(d => d.ProductType).WithMany(p => p.ProductPages)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductPage_ProductType");
        });

        modelBuilder.Entity<ProductType>(entity =>
        {
            entity.Property(e => e.AllowReserves).HasDefaultValueSql("((1))");
            entity.Property(e => e.AllowReturns).HasDefaultValueSql("((1))");
            entity.Property(e => e.AlternateColourwayIncludeSize).HasDefaultValueSql("((1))");
            entity.Property(e => e.AlternateColourways).HasDefaultValueSql("((1))");
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end,(0)))", true);
            entity.Property(e => e.DeliveryGroupId).HasDefaultValueSql("((1))");
            entity.Property(e => e.DispatchGroup).HasDefaultValueSql("((1))");
            entity.Property(e => e.GiftWrappable).HasDefaultValueSql("((1))");
            entity.Property(e => e.GrossMarginTarget).HasDefaultValueSql("((0.5))");
            entity.Property(e => e.IsActualProductType).HasDefaultValueSql("((1))");
            entity.Property(e => e.MaxSkuOrderQuantity).HasDefaultValueSql("((99))");
            entity.Property(e => e.MinimumOrderQuantity).HasDefaultValueSql("((1))");
            entity.Property(e => e.RetailQuantityIncrement).HasDefaultValueSql("((1))");
            entity.Property(e => e.RetailQuantityMaximum).HasDefaultValueSql("((99))");
            entity.Property(e => e.RetailQuantityMinimum).HasDefaultValueSql("((1))");
            entity.Property(e => e.SaleGrossMarginTarget).HasDefaultValueSql("((0.25))");
            entity.Property(e => e.ShowInSearchDropDown).HasDefaultValueSql("((1))");
            entity.Property(e => e.StockLocationId).HasDefaultValueSql("((1))");
            entity.Property(e => e.TargetGm).HasDefaultValueSql("((0.5))");
            entity.Property(e => e.TradeQuantityIncrement).HasDefaultValueSql("((1))");
            entity.Property(e => e.TradeQuantityMaximum).HasDefaultValueSql("((99999))");
            entity.Property(e => e.TradeQuantityMinimum).HasDefaultValueSql("((1))");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
