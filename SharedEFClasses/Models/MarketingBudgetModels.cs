using Kendo.Mvc.UI.Fluent;

using Newtonsoft.Json;

using NLog.LayoutRenderers;

using SharedEFClasses.Models.General;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("MarketingChannel", Schema = "dbo")]
    public class MarketingChannelObject
    {
        [Key]
        public short MarketingChannelID { get; set; }

        public string MarketingChannelGroup { get; set; }

        public string MarketingChannel { get; set; }

        public string MarketingChannelType { get; set; }

        [JsonIgnore]
        [InverseProperty("MarketingChannel")]
        public virtual ICollection<MarketingBudget> MarketingBudgetRecords { get; set; }
    }

    [Table("MarketingBudget", Schema = "dbo")]
    public class MarketingBudget
    {
        [Key]
        public long MarketingBudgetID { get; set; }
        public byte PriceListID { get; set; }
        public short MarketingChannelID { get; set; }
        public DateTime Period { get; set; }
        public decimal? Cost { get; set; }
        public decimal? Target { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime ModifiedDT { get; set; }
        public int ModifiedByMemberID { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("PriceListID")]
        public virtual PriceList PriceList { get; set; }

        [ForeignKey("MarketingChannelID")]
        public virtual MarketingChannelObject MarketingChannel { get; set; }

        [ForeignKey("ModifiedByMemberID")]
        public virtual Member LastModifiedBy { get; set; }
    }

    #region Data Passing

    public class PassMarketingBudgetSearch 
    { 
        public byte? PriceListID { get; set; }
        public short? MarketingChannelID { get; set; }
        public DateTime? Period { get; set; }
    }

    #endregion
}
