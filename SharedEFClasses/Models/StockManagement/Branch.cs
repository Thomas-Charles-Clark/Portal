using Newtonsoft.Json;

using Org.BouncyCastle.Asn1.Mozilla;

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
    [Table("Branch", Schema = "StockManagement")]
    public class Branch
    {
        [Key]
        public int BranchID { get; set; }
        public string Name { get; set; }
        public int? TradeAccountID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public int ModifiedMemberID { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("TradeAccountID")]
        public virtual TradeAccount TradeAccount { get; set; }

        [ForeignKey("ModifiedMemberID")]
        public virtual Member LastModifiedBy { get; set; }

        [JsonIgnore]
        [InverseProperty("Branch")]
        public virtual ICollection<Branch_BranchGroup> BranchGroups { get; set; }

        [NotMapped]
        public IEnumerable<int> BranchGroupIDs
        {
            get
            {
                return BranchGroups.Select(bg => bg.BranchGroupID);
            }
        }

        [JsonIgnore]
        [InverseProperty("Branch")]
        public virtual ICollection<BranchStockLocation> BranchStockLocations { get; set; }

        [JsonIgnore]
        [InverseProperty("Branch")]
        public virtual ICollection<Range> Ranges { get; set; }
    }
}
