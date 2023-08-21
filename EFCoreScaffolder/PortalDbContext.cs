using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

public partial class PortalDbContext : DbContext
{
    public PortalDbContext(DbContextOptions<PortalDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Carriage> Carriages { get; set; }

    public virtual DbSet<ClaimHead> ClaimHeads { get; set; }

    public virtual DbSet<ClaimLine> ClaimLines { get; set; }

    public virtual DbSet<CommodityCode> CommodityCodes { get; set; }

    public virtual DbSet<CommodityGroupCode> CommodityGroupCodes { get; set; }

    public virtual DbSet<Composition> Compositions { get; set; }

    public virtual DbSet<CompositionBackup180420230> CompositionBackup180420230s { get; set; }

    public virtual DbSet<Currency> Currencies { get; set; }

    public virtual DbSet<DespatchHead> DespatchHeads { get; set; }

    public virtual DbSet<DespatchLine> DespatchLines { get; set; }

    public virtual DbSet<EuexportCommodityGroupCodeMap> EuexportCommodityGroupCodeMaps { get; set; }

    public virtual DbSet<ExchangeRate> ExchangeRates { get; set; }

    public virtual DbSet<FlamCode> FlamCodes { get; set; }

    public virtual DbSet<Haulier> Hauliers { get; set; }

    public virtual DbSet<HeldForSalesReason> HeldForSalesReasons { get; set; }

    public virtual DbSet<InvoiceHead> InvoiceHeads { get; set; }

    public virtual DbSet<InvoiceLine> InvoiceLines { get; set; }

    public virtual DbSet<OrderHead> OrderHeads { get; set; }

    public virtual DbSet<OrderLine> OrderLines { get; set; }

    public virtual DbSet<OrderSyncReport> OrderSyncReports { get; set; }

    public virtual DbSet<ParcelHead> ParcelHeads { get; set; }

    public virtual DbSet<ParcelLine> ParcelLines { get; set; }

    public virtual DbSet<PriceListMap> PriceListMaps { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductAftercare> ProductAftercares { get; set; }

    public virtual DbSet<PurchaseOrderHead> PurchaseOrderHeads { get; set; }

    public virtual DbSet<PurchaseOrderLine> PurchaseOrderLines { get; set; }

    public virtual DbSet<PurchaseOrderStatus> PurchaseOrderStatuses { get; set; }

    public virtual DbSet<PurchasePrice> PurchasePrices { get; set; }

    public virtual DbSet<Quality> Qualities { get; set; }

    public virtual DbSet<Sundry> Sundries { get; set; }

    public virtual DbSet<Supplier> Suppliers { get; set; }

    public virtual DbSet<SyncReport> SyncReports { get; set; }

    public virtual DbSet<SyncReportSent> SyncReportSents { get; set; }

    public virtual DbSet<TradeAccount> TradeAccounts { get; set; }

    public virtual DbSet<TradeAccountContact> TradeAccountContacts { get; set; }

    public virtual DbSet<TradeAccountContactType> TradeAccountContactTypes { get; set; }

    public virtual DbSet<TradeAccountInvoiceAccount> TradeAccountInvoiceAccounts { get; set; }

    public virtual DbSet<UserComputer> UserComputers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Carriage>(entity =>
        {
            entity.HasKey(e => e.Key).HasName("PK__Carriage__C41E028811A53DC0");
        });

        modelBuilder.Entity<ClaimHead>(entity =>
        {
            entity.Property(e => e.Completed).HasComputedColumnSql("(CONVERT([bit],case when [CompletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.Error).HasComputedColumnSql("(CONVERT([bit],case when [ErrorDetails] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.OrderId).UseCollation("Latin1_General_CS_AS");
        });

        modelBuilder.Entity<ClaimLine>(entity =>
        {
            entity.HasKey(e => e.ClaimLineId).HasName("PK_Mertex_ClaimLine");

            entity.Property(e => e.Completed).HasComputedColumnSql("(CONVERT([bit],case when [CompletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.Error).HasComputedColumnSql("(CONVERT([bit],case when [ErrorDetails] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");
        });

        modelBuilder.Entity<CommodityCode>(entity =>
        {
            entity.HasKey(e => e.CommodityCode1).HasName("PK__Commodit__70CCB0F32CC75631");

            entity.Property(e => e.CommodityCode1).ValueGeneratedNever();

            entity.HasOne(d => d.CommodityGroupCodeNavigation).WithMany(p => p.CommodityCodes).HasConstraintName("FK_Mertex_CommodityCode_CommodityGroupCode");
        });

        modelBuilder.Entity<CommodityGroupCode>(entity =>
        {
            entity.HasKey(e => e.CommodityGroupCode1).HasName("PK__Commodit__4CB7839ECE0FD9AF");

            entity.Property(e => e.CommodityGroupCode1).ValueGeneratedNever();
        });

        modelBuilder.Entity<Composition>(entity =>
        {
            entity.HasKey(e => e.Code).HasName("PK_Mertex_Composition");

            entity.Property(e => e.Code).UseCollation("Latin1_General_CS_AS");
        });

        modelBuilder.Entity<CompositionBackup180420230>(entity =>
        {
            entity.Property(e => e.Code).UseCollation("Latin1_General_CS_AS");
        });

        modelBuilder.Entity<Currency>(entity =>
        {
            entity.HasKey(e => e.MertexCurrencyCode).HasName("PK__Currency__3A84C383B106DAA7");

            entity.Property(e => e.MertexCurrencyCode).UseCollation("Latin1_General_CS_AS");
        });

        modelBuilder.Entity<DespatchHead>(entity =>
        {
            entity.HasKey(e => e.DespatchHeadId).HasName("PK_Mertex_Despatch");

            entity.Property(e => e.Completed).HasComputedColumnSql("(CONVERT([bit],case when [Source]='OEDNHHIST' then (1) else (0) end))", true);
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.Error).HasComputedColumnSql("(CONVERT([bit],case when [ErrorDetails] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");
        });

        modelBuilder.Entity<DespatchLine>(entity =>
        {
            entity.HasKey(e => e.DespatchLineId).HasName("PK_Mertex_DespatchLine_DespatchLineID");

            entity.Property(e => e.Completed).HasComputedColumnSql("(CONVERT([bit],case when [Source]='OEDNLHIST' then (1) else (0) end))", true);
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.Error).HasComputedColumnSql("(CONVERT([bit],case when [ErrorDetails] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.ProductCode).UseCollation("Latin1_General_CS_AS");

            entity.HasOne(d => d.DespatchHead).WithMany(p => p.DespatchLines).HasConstraintName("FK_Mertex_DespatchLine_DespatchHeadID");
        });

        modelBuilder.Entity<ExchangeRate>(entity =>
        {
            entity.HasKey(e => e.MertexCurrencyCode).HasName("PK_Mertex_ExchangeRate");

            entity.Property(e => e.MertexCurrencyCode).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");
        });

        modelBuilder.Entity<FlamCode>(entity =>
        {
            entity.HasKey(e => e.Code).HasName("PK_Mertex_FlamCode");

            entity.Property(e => e.Code).UseCollation("Latin1_General_CS_AS");
        });

        modelBuilder.Entity<Haulier>(entity =>
        {
            entity.HasKey(e => e.Code).HasName("PK_Mertex_Haulier_Code");

            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");
        });

        modelBuilder.Entity<HeldForSalesReason>(entity =>
        {
            entity.HasKey(e => e.Code).HasName("PK__HeldForS__A25C5AA696278E9F");
        });

        modelBuilder.Entity<InvoiceHead>(entity =>
        {
            entity.HasKey(e => e.InvoiceId).HasName("PK__InvoiceH__D796AAD525D7AD6A");

            entity.Property(e => e.Completed).HasComputedColumnSql("(CONVERT([bit],case when [CompletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.Error).HasComputedColumnSql("(CONVERT([bit],case when [ErrorDetails] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<InvoiceLine>(entity =>
        {
            entity.HasKey(e => e.InvoiceLineId).HasName("PK__InvoiceL__0D760AF92EE6E2C7");

            entity.Property(e => e.Completed).HasComputedColumnSql("(CONVERT([bit],case when [CompletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.Error).HasComputedColumnSql("(CONVERT([bit],case when [ErrorDetails] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ProductCode).UseCollation("Latin1_General_CS_AS");

            entity.HasOne(d => d.Invoice).WithMany(p => p.InvoiceLines).HasConstraintName("FK__InvoiceLi__Invoi__7BE87672");
        });

        modelBuilder.Entity<OrderHead>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK_Mertex_OrderHead_OrderID");

            entity.HasIndex(e => e.OrderHeadId, "UQ_Mertex_OrderHead_OrderID")
                .IsUnique()
                .HasFilter("([OrderHeadID] IS NOT NULL)");

            entity.Property(e => e.Completed).HasComputedColumnSql("(CONVERT([bit],case when [CompletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.Error).HasComputedColumnSql("(CONVERT([bit],case when [ErrorDetails] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.MertexCurrencyCode).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");
        });

        modelBuilder.Entity<OrderLine>(entity =>
        {
            entity.HasKey(e => e.OrderLineId).HasName("PK_Mertex_OrderLine_OrderLineID");

            entity.Property(e => e.Cancelled).HasComputedColumnSql("(CONVERT([bit],case when [QuantityOrdered]=isnull([QuantityCancelled],(0)) then (1) else (0) end))", true);
            entity.Property(e => e.Completed).HasComputedColumnSql("(CONVERT([bit],case when [LineStatusID]=(5) OR [QuantityOrdered]=isnull([QuantityCancelled],(0)) OR [DeletedDT] IS NOT NULL then (1) else (0) end))", true);
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.Error).HasComputedColumnSql("(CONVERT([bit],case when [ErrorDetails] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.ProductCode).UseCollation("Latin1_General_CS_AS");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderLines)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Mertex_OrderLine_OrderID");
        });

        modelBuilder.Entity<OrderSyncReport>(entity =>
        {
            entity.HasKey(e => e.OrderSyncReportId).HasName("PK_Mertex_OrderSyncReport_OrderSyncReportID");
        });

        modelBuilder.Entity<ParcelHead>(entity =>
        {
            entity.Property(e => e.Completed).HasComputedColumnSql("(CONVERT([bit],case when [CompletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.Error).HasComputedColumnSql("(CONVERT([bit],case when [ErrorDetails] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.VolumetricWeight).HasComputedColumnSql("(CONVERT([decimal](18,2),(([Width]*[Height])*[Depth])/(5000)))", true);

            entity.HasOne(d => d.DespatchHead).WithMany(p => p.ParcelHeads)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Mertex_ParcelHead_DespatchID");
        });

        modelBuilder.Entity<ParcelLine>(entity =>
        {
            entity.Property(e => e.Completed).HasComputedColumnSql("(CONVERT([bit],case when [CompletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.Error).HasComputedColumnSql("(CONVERT([bit],case when [ErrorDetails] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.ProductCode).UseCollation("Latin1_General_CS_AS");

            entity.HasOne(d => d.DespatchLine).WithMany(p => p.ParcelLines)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Mertex_ParcelLine_DespatchLineID");

            entity.HasOne(d => d.ParcelHead).WithMany(p => p.ParcelLines)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Mertex_ParcelLine_ParcelHeadID");
        });

        modelBuilder.Entity<PriceListMap>(entity =>
        {
            entity.HasKey(e => e.TradePriceListCode).HasName("PK_Mertex_PriceListMap");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Code).HasName("PK_Mertex_Product_Code");

            entity.Property(e => e.Code).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.DefaultSupplierCode).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.Error).HasComputedColumnSql("(CONVERT([bit],case when [ErrorDetails] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.FlamCode).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.QualityCode).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.RugSampleProductCode).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.StockCode).UseCollation("Latin1_General_CS_AS");

            entity.HasOne(d => d.DefaultSupplierCodeNavigation).WithMany(p => p.Products).HasConstraintName("FK_Mertex_Product_DefaultSupplierCode");
        });

        modelBuilder.Entity<ProductAftercare>(entity =>
        {
            entity.HasKey(e => new { e.ProductCode, e.AftercareCode }).HasName("PK_Product_Aftercare_1");

            entity.Property(e => e.ProductCode).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.AftercareCode).UseCollation("Latin1_General_CS_AS");
        });

        modelBuilder.Entity<PurchaseOrderHead>(entity =>
        {
            entity.HasKey(e => e.PurchaseOrderHeadId).HasName("PK_Mertex_PurchaseOrderHead");

            entity.Property(e => e.PurchaseOrderHeadId).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.Completed).HasComputedColumnSql("(CONVERT([bit],case when [CompletedDT] IS NULL then (0) else (1) end))", false);
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", false);
            entity.Property(e => e.Error).HasComputedColumnSql("(CONVERT([bit],case when [ErrorDetails] IS NULL then (0) else (1) end))", false);
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.OrderId).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.SupplierCode).UseCollation("Latin1_General_CS_AS");
        });

        modelBuilder.Entity<PurchaseOrderLine>(entity =>
        {
            entity.HasKey(e => e.PurchaseOrderLineId).HasName("PK_Mertex_PurchaseOrderLine");

            entity.Property(e => e.PurchaseOrderLineId).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.Completed).HasComputedColumnSql("(CONVERT([bit],case when [CompletedDT] IS NULL then (0) else (1) end))", false);
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", false);
            entity.Property(e => e.Error).HasComputedColumnSql("(CONVERT([bit],case when [ErrorDetails] IS NULL then (0) else (1) end))", false);
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.OrderId).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.ProductCode).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.PurchaseOrderHeadId).UseCollation("Latin1_General_CS_AS");
        });

        modelBuilder.Entity<PurchaseOrderStatus>(entity =>
        {
            entity.HasKey(e => e.PurchaseOrderStatusId).HasName("PK_Mertex_PurchaseOrderStatus");
        });

        modelBuilder.Entity<PurchasePrice>(entity =>
        {
            entity.Property(e => e.SupplierCode).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.ProductCode).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.MertexCurrencyCode).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.SupplierCodeNavigation).WithMany(p => p.PurchasePrices)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Mertex_PurchasePrice_SupplierCode");
        });

        modelBuilder.Entity<Quality>(entity =>
        {
            entity.HasKey(e => e.Code).HasName("PK_Mertex_Quality");

            entity.Property(e => e.Code).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.CompositionCode).UseCollation("Latin1_General_CS_AS");
        });

        modelBuilder.Entity<Sundry>(entity =>
        {
            entity.HasKey(e => e.Code).HasName("PK__Sundry__A25C5AA6B83FD9B7");

            entity.Property(e => e.Code).UseCollation("Latin1_General_CS_AS");
        });

        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.Code).HasName("PK_Mertex_Supplier");

            entity.Property(e => e.Code).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.MertexCurrencyCode).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.ModifiedDt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.MertexCurrencyCodeNavigation).WithMany(p => p.Suppliers).HasConstraintName("FK_Mertex_Supplier_MertexCurrencyCode");
        });

        modelBuilder.Entity<SyncReport>(entity =>
        {
            entity.HasKey(e => e.SyncReportId).HasName("PK_Mertex_SyncReport");

            entity.Property(e => e.SyncReportId).ValueGeneratedNever();
        });

        modelBuilder.Entity<SyncReportSent>(entity =>
        {
            entity.HasOne(d => d.SyncReport).WithMany()
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Mertex_SyncReportSent_SyncReportID");
        });

        modelBuilder.Entity<TradeAccount>(entity =>
        {
            entity.HasKey(e => e.Code).HasName("PK__TradeAcc__CA404DC53653615F");

            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.TradeAccountCodeNumerical).HasComputedColumnSql("(CONVERT([int],[adm].[RegexReplace]([Code],N'[^\\d]',N' ')))", true);
        });

        modelBuilder.Entity<TradeAccountContact>(entity =>
        {
            entity.HasKey(e => e.TradeAccountContactId).HasName("PK__TradeAcc__0E125F392215424C");

            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);

            entity.HasOne(d => d.TradeAccountContactTypeCodeNavigation).WithMany(p => p.TradeAccountContacts)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TradeAcco__Trade__002F9F50");
        });

        modelBuilder.Entity<TradeAccountContactType>(entity =>
        {
            entity.HasKey(e => e.TradeAccountContactTypeCode).HasName("PK__TradeAcc__AE1BD0BA321220A8");

            entity.Property(e => e.CreatedDt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
        });

        modelBuilder.Entity<TradeAccountInvoiceAccount>(entity =>
        {
            entity.HasKey(e => new { e.ParentTradeAccountCode, e.TradeAccountCode }).HasName("PK__TradeAcc__E213B2414F3B33FB");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
