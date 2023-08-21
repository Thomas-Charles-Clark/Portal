using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeAccounts;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.StockManagement
{
    [Table("BranchStockLocation", Schema = "StockManagement")]
    public class BranchStockLocation
    {
        [Key]
        public int BranchStockLocationID { get; set; }

        public int BranchID { get; set; }

        public short StockLocationID { get; set; }

        public short WarehouseStockLocationID { get; set; }

        public int WarehouseToBranchTransferTradeAccountID { get; set; }
        
        public int BranchToWarehouseTransferTradeAccountID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public int ModifiedMemberID { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("WarehouseToBranchTransferTradeAccountID")]
        public virtual TradeAccount WarehouseToBranchTransferTradeAccount { get; set; }

        [ForeignKey("BranchToWarehouseTransferTradeAccountID")]
        public virtual TradeAccount BranchToWarehouseTransferTradeAccount { get; set; }

        [ForeignKey("ModifiedMemberID")]
        public virtual Member LastModifiedBy { get; set; }

        [ForeignKey("BranchID")]
        public virtual Branch Branch { get; set; }

        [ForeignKey("StockLocationID")]
        public virtual StockLocation StockLocation { get; set; }

        [ForeignKey("WarehouseStockLocationID")]
        public virtual StockLocation WarehouseStockLocation { get; set; }
    }
}
