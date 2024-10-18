using Microsoft.Owin.Security;

using Org.BouncyCastle.Asn1;

using SharedEFClasses.Models.General;
using SharedEFClasses.Models.MertexLive;
using SharedEFClasses.Models.Orders;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("GiftVoucher", Schema = "dbo")]
    public class GiftVoucher
    {
        [Key]
        public short GiftVoucherID { get; set; }

        public byte GiftVoucherTypeID { get; set; }

        public string Code { get; set; }

        public byte PriceListID { get; set; }

        public decimal ValueInc { get; set; }

        public decimal ValueEx { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime? AuthorisedDT { get; set; }

        public DateTime? ExpiryDT { get; set; }

        public DateTime? UsedDT { get; set; }

        public DateTime? CancelledDT { get; set; }

        public int? RedeemTransactionID { get; set; }

        public int? SaleTransactionID { get; set; }

        public string CreatorUserID { get; set; }

        public int? CreditTransactionID { get; set; }

        public string Reason { get; set; }

        public int? CreatorMemberID { get; set; }

        public string SaleOrderID { get; set; }
           
        public string RedeemOrderID { get; set; }

        public int? RedeemedByMemberID { get; set; }

        public string Message { get; set; }

        public string CreditOrderID { get; set; }

        [ForeignKey("SaleOrderID")]
        public virtual OrderHeadLive SaleOrder { get; set; }

        [ForeignKey("RedeemOrderID")]
        public virtual OrderHeadLive RedeemOrder { get; set; }

        [ForeignKey("CreditOrderID")]
        public virtual OrderHeadLive CreditOrder { get; set; }

        [ForeignKey("GiftVoucherTypeID")]
        public virtual GiftVoucherType GiftVoucherType { get; set; }

        [ForeignKey("PriceListID")]
        public virtual PriceList PriceList { get; set; }

        [ForeignKey("CreatorMemberID")]
        public virtual Member CreatedByMember { get; set; }

        [ForeignKey("RedeemedByMemberID")]
        public virtual Member RedeemedByMember { get; set; }

        [ForeignKey("GiftVoucherID")]
        public virtual ICollection<OrderLine> OrderLines { get; set; }
    }
}
