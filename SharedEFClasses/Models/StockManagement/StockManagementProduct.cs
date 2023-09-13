using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.StockManagement
{

    [Table("Product", Schema = "StockManagement")]
    public partial class StockManagementProduct
    {
        [Key]
        public int ProductID { get; set; }

        public byte? StatusGroupID { get; set; }

        [StringLength(1)]
        public string Status { get; set; }

        [Column(TypeName = "money")]
        public decimal? ClearanceDiscountPercentage { get; set; }

        public bool InStock { get; set; }

        public decimal? AverageDailySales { get; set; }

        public int? AverageDailySalesDurationDays { get; set; }

        [Column("01_30DaySales")]
        public decimal? _01_30DaySales { get; set; }

        [Column("31_60DaySales")]
        public decimal? _31_60DaySales { get; set; }

        [Column("61_90DaySales")]
        public decimal? _61_90DaySales { get; set; }

        [Column("91_120DaySales")]
        public decimal? _91_120DaySales { get; set; }

        [Column("21_150DaySales")]
        public decimal? _21_150DaySales { get; set; }

        [Column("151_180DaySales")]
        public decimal? _151_180DaySales { get; set; }

        public decimal? LifetimeSales { get; set; }

        public DateTime? FirstSaleDate { get; set; }

        public DateTime? LastSaleDate { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool? Deleted { get; set; }

        [ForeignKey("StatusGroupID")]
        [InverseProperty("Products")]
        public virtual StatusGroup StatusGroup { get; set; }
    }

}