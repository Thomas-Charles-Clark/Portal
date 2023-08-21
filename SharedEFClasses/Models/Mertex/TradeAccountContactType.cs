using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("TradeAccountContactType", Schema = "Mertex")]
    public class TradeAccountContactType
    {
        [Key]
        [StringLength(10)]
        public string TradeAccountContactTypeCode { get; set; }

        [StringLength(100)]
        public string Name { get; set; }

        [Column("CreatedDT")]
        public DateTime CreatedDT { get; set; }

        [Column("DeletedDT")]
        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        [InverseProperty("TradeAccountContactTypeCodeNavigation")]
        public virtual ICollection<TradeAccountContactLive> TradeAccountContacts { get; set; } = new List<TradeAccountContactLive>();
    }

}