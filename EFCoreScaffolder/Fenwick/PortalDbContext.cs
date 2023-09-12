using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.Fenwicks;

public partial class PortalDbContext : DbContext
{
    public PortalDbContext(DbContextOptions<PortalDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Branch> Branches { get; set; }

    public virtual DbSet<Invoice> Invoices { get; set; }

    public virtual DbSet<InvoiceFile> InvoiceFiles { get; set; }

    public virtual DbSet<Member> Members { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Range> Ranges { get; set; }

    public virtual DbSet<SelfBillInvoice> SelfBillInvoices { get; set; }

    public virtual DbSet<StockLocation> StockLocations { get; set; }

    public virtual DbSet<TradeAccount> TradeAccounts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Branch>(entity =>
        {
            entity.HasKey(e => e.BranchID).HasName("PK_Fenwicks_Branch");

            entity.Property(e => e.CreatedDT).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ModifiedDT).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.BranchToWarehouseTransferAccountCodeNavigation).WithMany(p => p.BranchBranchToWarehouseTransferAccountCodeNavigations)
                .HasPrincipalKey(p => p.Code)
                .HasForeignKey(d => d.BranchToWarehouseTransferAccountCode)
                .HasConstraintName("FK_Fenwicks_Branch_BranchToWarehouseTransferAccountCode");

            entity.HasOne(d => d.ModifiedMember).WithMany(p => p.Branches)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Fenwicks_Branch_MemberID");

            entity.HasOne(d => d.SalesAccountCodeNavigation).WithMany(p => p.BranchSalesAccountCodeNavigations)
                .HasPrincipalKey(p => p.Code)
                .HasForeignKey(d => d.SalesAccountCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Fenwicks_Branch_SalesAccountCode");

            entity.HasOne(d => d.StockLocationCodeNavigation).WithMany(p => p.Branches)
                .HasPrincipalKey(p => p.Code)
                .HasForeignKey(d => d.StockLocationCode)
                .HasConstraintName("FK_Fenwicks_Branch_StockLocationCode");

            entity.HasOne(d => d.WarehouseToBranchTransferAccountCodeNavigation).WithMany(p => p.BranchWarehouseToBranchTransferAccountCodeNavigations)
                .HasPrincipalKey(p => p.Code)
                .HasForeignKey(d => d.WarehouseToBranchTransferAccountCode)
                .HasConstraintName("FK_Fenwicks_Branch_WarehouseToBranchTransferAccountCode");
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.InvoiceID).HasName("PK_Fenwicks_Invoice");

            entity.Property(e => e.CreatedDT).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.NetSalesMinusCommission).HasComputedColumnSql("(CONVERT([decimal](18,2),[NetSales]-[Commission]))", true);
            entity.Property(e => e.Processed).HasComputedColumnSql("(CONVERT([bit],case when [ProcessedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.SaleOrCredit)
                .HasComputedColumnSql("(CONVERT([char](1),case when [Quantity]>(0) then 'S' else 'C' end))", true)
                .IsFixedLength();

            entity.HasOne(d => d.Branch).WithMany(p => p.Invoices)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Invoice_Branch");

            entity.HasOne(d => d.InvoiceFile).WithMany(p => p.Invoices)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Fenwicks_Invoice_InvoiceFileID");

            entity.HasOne(d => d.ProductCodeNavigation).WithMany(p => p.Invoices)
                .HasPrincipalKey(p => p.Code)
                .HasForeignKey(d => d.ProductCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Fenwicks_Invoice_ProductCode");

            entity.HasOne(d => d.TradeAccountCodeNavigation).WithMany(p => p.InvoiceTradeAccountCodeNavigations)
                .HasPrincipalKey(p => p.Code)
                .HasForeignKey(d => d.TradeAccountCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Fenwicks_Invoice_TradeAccountCode");

            entity.HasOne(d => d.TradeAccount).WithMany(p => p.InvoiceTradeAccounts).HasConstraintName("FK_Fenwicks_Invoice_TradeAccount");
        });

        modelBuilder.Entity<InvoiceFile>(entity =>
        {
            entity.HasKey(e => e.InvoiceFileID).HasName("PK_Fenwicks_InvoiceFile");

            entity.Property(e => e.CreatedDT).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.Processed).HasComputedColumnSql("(CONVERT([bit],case when [ProcessedDT] IS NULL then (0) else (1) end))", true);
        });

        modelBuilder.Entity<Member>(entity =>
        {
            entity.Property(e => e.CountryID).HasDefaultValueSql("((81))");
            entity.Property(e => e.CreatedDT).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.GUID).HasDefaultValueSql("(newid())");
            entity.Property(e => e.HardBounce).HasComputedColumnSql("(CONVERT([bit],case when [HardBounceDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.InvalidEmail).HasComputedColumnSql("(CONVERT([bit],case when [InvalidEmailDT] IS NULL then (0) else (1) end))", false);
            entity.Property(e => e.LanguageID).HasDefaultValueSql("((1))");
            entity.Property(e => e.Locked).HasDefaultValueSql("((0))");
            entity.Property(e => e.MemberSegmentID).HasDefaultValueSql("((8))");
            entity.Property(e => e.ModifiedDT).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.SecurityStamp).HasDefaultValueSql("(newid())");
            entity.Property(e => e.Unsubscribed).HasComputedColumnSql("(CONVERT([bit],case when [UnsubscribedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.UserName).HasComputedColumnSql("([Email])", true);
            entity.Property(e => e.ValidEmail).HasDefaultValueSql("((1))");

            entity.HasOne(d => d.TradeAccount).WithMany(p => p.Members).HasConstraintName("FK_Member_TradeAccount");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductID).HasName("PK_Products");

            entity.Property(e => e.Bundle).HasComputedColumnSql("(CONVERT([bit],case when [Code] like 'BUND%' then (1) else (0) end,(0)))", true);
            entity.Property(e => e.Code).HasComment("Mertex Product Code");
            entity.Property(e => e.CreatedDT).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.DeliveryProductTypeID).HasDefaultValueSql("((91))");
            entity.Property(e => e.Enabled).HasDefaultValueSql("((1))");
            entity.Property(e => e.MaintainMinimumStockLevel)
                .HasDefaultValueSql("('N')")
                .IsFixedLength();
            entity.Property(e => e.MarketRestrictionCode).UseCollation("Latin1_General_CS_AS");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("(N'C')")
                .IsFixedLength();
            entity.Property(e => e.UKVATCode).HasDefaultValueSql("(N'S')");
        });

        modelBuilder.Entity<Range>(entity =>
        {
            entity.HasKey(e => e.RangeID).HasName("PK_Fenwicks_Range");

            entity.Property(e => e.CreatedDT).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.ModifiedDT).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.ModifiedMember).WithMany(p => p.Ranges)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Fenwicks_Range_MemberID");

            entity.HasOne(d => d.Product).WithMany(p => p.Ranges)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Fenwicks_Range_ProductID");
        });

        modelBuilder.Entity<SelfBillInvoice>(entity =>
        {
            entity.HasKey(e => e.SelfBillInvoiceID).HasName("PK_Fenwicks_SelfBillInvoice");

            entity.Property(e => e.CreatedDT).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.SignedOff).HasComputedColumnSql("(CONVERT([bit],case when [SignedOffDT] IS NULL then (0) else (1) end))", true);

            entity.HasOne(d => d.Branch).WithMany(p => p.SelfBillInvoices)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Fenwicks_SelfBillInvoice_BranchID");

            entity.HasOne(d => d.SignedOffMember).WithMany(p => p.SelfBillInvoices).HasConstraintName("FK_Fenwicks_SelfBillInvoice_SignedOffMemberID");
        });

        modelBuilder.Entity<StockLocation>(entity =>
        {
            entity.HasKey(e => e.StockLocationID).HasName("PK__StockLoctioID");

            entity.Property(e => e.CreatedDT).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.DefaultFulfilmentTypeID).HasDefaultValueSql("((1))");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.DespatchCutOff).HasDefaultValueSql("('12:00:00')");
            entity.Property(e => e.LocationCountryID).HasDefaultValueSql("((81))");
            entity.Property(e => e.ModifiedDT).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.SortOrder).HasDefaultValueSql("((9999))");

            entity.HasOne(d => d.ParentStockLocation).WithMany(p => p.InverseParentStockLocation).HasConstraintName("FK__StockLoca__Paren__5B42406F");
        });

        modelBuilder.Entity<TradeAccount>(entity =>
        {
            entity.Property(e => e.AcceptSundry).HasDefaultValueSql("((1))");
            entity.Property(e => e.AllowBotOrderProcessing).HasDefaultValueSql("((1))");
            entity.Property(e => e.AllowTillCreditNotes).HasDefaultValueSql("((0))");
            entity.Property(e => e.AllowTradePrice).HasDefaultValueSql("((1))");
            entity.Property(e => e.CARRCODE).HasComment("SAMPLES ONLY - This is SAMP_SERVICE from SLCUST");
            entity.Property(e => e.CheckForDuplicates).HasDefaultValueSql("((1))");
            entity.Property(e => e.ContractPricing).HasDefaultValueSql("((1))");
            entity.Property(e => e.CountryID).HasDefaultValueSql("((81))");
            entity.Property(e => e.CreditNoteCopies).HasDefaultValueSql("((1))");
            entity.Property(e => e.Deleted).HasComputedColumnSql("(CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end))", true);
            entity.Property(e => e.DeliveryType).IsFixedLength();
            entity.Property(e => e.DirectDelivery).HasDefaultValueSql("((0))");
            entity.Property(e => e.GUID).HasDefaultValueSql("(newid())");
            entity.Property(e => e.HAULCODE).HasComment("SAMPLES ONLY - This is SAMP_HAULIER from SLCUST");
            entity.Property(e => e.InformPromiseDateChange).HasDefaultValueSql("('E')");
            entity.Property(e => e.InvoiceCopies).HasDefaultValueSql("((1))");
            entity.Property(e => e.JohnLewisLabels).HasDefaultValueSql("((0))");
            entity.Property(e => e.MertexUpsertQueued).HasComputedColumnSql("(CONVERT([bit],case when isnull([MertexUpsertQueuedDT],'1900-01-01')>isnull([MertexUpsertLastDT],'1900-01-01') then (1) else (0) end,(0)))", false);
            entity.Property(e => e.ModifiedDT).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Open).HasComputedColumnSql("(CONVERT([bit],case [Status] when 'O' then (1) else (0) end))", true);
            entity.Property(e => e.OrderPriority).HasDefaultValueSql("((1))");
            entity.Property(e => e.OrderStockLocationID).HasDefaultValueSql("((107))");
            entity.Property(e => e.OverheadTradeAccountID).HasDefaultValueSql("((2436))");
            entity.Property(e => e.PackingListCopies).HasDefaultValueSql("((1))");
            entity.Property(e => e.PaymentDetailsType).HasDefaultValueSql("((0))");
            entity.Property(e => e.PrintPricesOnDeliveryNote).HasDefaultValueSql("((0))");
            entity.Property(e => e.SendInvoiceToDeliveryAddress).HasDefaultValueSql("((0))");
            entity.Property(e => e.SendOverdueLetters).HasDefaultValueSql("((1))");
            entity.Property(e => e.StatementPrint).HasDefaultValueSql("((1))");
            entity.Property(e => e.StockAPIKey).HasDefaultValueSql("(newid())");

            entity.HasOne(d => d.OverheadTradeAccount).WithMany(p => p.InverseOverheadTradeAccount)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TradeAccount_AssociatedOverheadTradeAccountID");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
