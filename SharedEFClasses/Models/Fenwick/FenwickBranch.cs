using Newtonsoft.Json;

using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeAccounts;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Fenwick
{
    [Table("Branch", Schema = "Fenwicks")]
    public partial class FenwickBranch
    {
        [Key]
        public int BranchID { get; set; }

        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(50)]
        public string SalesAccountCode { get; set; }

        [StringLength(50)]
        public string WarehouseToBranchTransferAccountCode { get; set; }

        [StringLength(50)]
        public string BranchToWarehouseTransferAccountCode { get; set; }

        [StringLength(10)]
        public string StockLocationCode { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public int ModifiedMemberID { get; set; }

        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        public int? FenwickStoreID { get; set; }

        [Column(TypeName = "date")]
        public DateTime? OpenDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? CloseDate { get; set; }

        [JsonIgnore]
        [InverseProperty("Branch")]
        public virtual ICollection<FenwickInvoice> Invoices { get; set; }

        [JsonIgnore]
        [ForeignKey("ModifiedMemberID")]
        [InverseProperty("ModifiedFenwickBranches")]
        public virtual Member ModifiedByMember { get; set; }

        [JsonIgnore]
        [InverseProperty("Branch")]
        public virtual ICollection<SelfBillInvoice> SelfBillInvoices { get; set; }
    }
}