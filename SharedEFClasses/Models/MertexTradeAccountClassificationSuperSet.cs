
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Mertex;
using SharedEFClasses.Models.Mertexer;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeAccounts;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace SharedEFClasses.Models
{
    [Table("MertexTradeAccountClassificationSuperSet", Schema = "dbo")]
    public class MertexTradeAccountClassificationSuperSet
    {
        [Key]
        public int MertexTradeAccountClassificationSuperSetID { get; set; }

        public byte? SalesMarketID { get; set; }

        public short? SalesRepresentativeID { get; set; }

        public short? SalesAgentID { get; set; }

        public short? SalesAreaID { get; set; }

        public short? CountryID { get; set; }

        public int? TradeAccountGroupID { get; set; }

        public short? TradeAccountTypeID { get; set; }

        public byte? TradeAccountTypeGroupID { get; set; }

		public byte? PaymentTermsID { get; set; }

        public bool? CreditStopped { get; set; }

        public byte? PaymentTermsTypeID { get; set; }

        public string CreditControllerCode { get; set; }

        public string DebtFunderCode { get; set; }

        public byte? CurrencyID { get; set; }

        [ForeignKey("SalesMarketID")]
        public virtual SalesMarket SalesMarket { get; set; }

        [ForeignKey("SalesRepresentativeID")]
        public virtual SalesRepresentative SalesRepresentative { get; set; }

        [ForeignKey("SalesAgentID")]
        public virtual SalesAgent SalesAgent { get; set; }

        [ForeignKey("SalesAreaID")]
        public virtual SalesArea SalesArea { get; set; }

        [ForeignKey("CountryID")]
        public virtual Country Country { get; set; }

        [ForeignKey("TradeAccountGroupID")]
        public virtual TradeAccountGroup TradeAccountGroup { get; set; }

        [ForeignKey("TradeAccountTypeID")]
        public virtual TradeAccountType TradeAccountType { get; set; }

		[ForeignKey("TradeAccountTypeGroupID")]
		public virtual TradeAccountTypeGroup TradeAccountTypeGroup { get; set; }

		[ForeignKey("PaymentTermsID")]
        public virtual PaymentTerms PaymentTerms { get; set; }

        [ForeignKey("PaymentTermsTypeID")]
        public virtual PaymentTermsType PaymentTermsType { get; set; }

        [ForeignKey("CreditControllerCode")]
        public virtual CreditControllerLive CreditController { get; set; }

        [ForeignKey("DebtFunderCode")]
        public virtual DebtFunder DebtFunder { get; set; }

        [ForeignKey("CurrencyID")]
        public virtual Currency Currency { get; set; }
    }
}
