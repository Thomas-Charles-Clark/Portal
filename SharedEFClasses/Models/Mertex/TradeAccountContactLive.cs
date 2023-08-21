using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("TradeAccountContact", Schema = "Mertex")]
    public class TradeAccountContactLive
    {
        [Key]
        [Column("TradeAccountContactID")]
        public int TradeAccountContactID { get; set; }

        [StringLength(10)]
        public string TradeAccountContactTypeCode { get; set; }

        [StringLength(50)]
        public string TradeAccountCode { get; set; }

        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(254)]
        public string Email { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }

        [StringLength(20)]
        public string Mobile { get; set; }

        [Column("CreatedDT")]
        public DateTime CreatedDT { get; set; }

        [Column("DeletedDT")]
        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        [ForeignKey("TradeAccountContactTypeCode")]
        [InverseProperty("TradeAccountContacts")]
        public virtual TradeAccountContactType TradeAccountContactTypeCodeNavigation { get; set; }
    }
}