using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.TradeAccounts;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SharedEFClasses.Models
{
    public class PaymentTerms
    {
        [Key]
        public byte PaymentTermsID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Terms { get; set; }
        public bool Visible { get; set; }
        public byte? SalesMarketID { get; set; }
        public bool RequirePaymentDetails { get; set; }
        public byte PaymentTermsTypeID { get; set; }

        [JsonIgnore]
        public virtual ICollection<Basket> Baskets { get; set; }

        [JsonIgnore]
        public virtual SalesMarket SalesMarket { get; set; }

        [JsonIgnore]
        public virtual ICollection<Lead> GrantedToLeads { get; set; }

        [JsonIgnore]
        [InverseProperty("PaymentTerms")]
        public virtual ICollection<TradeAccount> GrantedToTradeAccounts { get; set; }

        [ForeignKey("PaymentTermsTypeID")]
        public virtual PaymentTermsType PaymentTermsType { get; set; }

        [JsonIgnore]
        [InverseProperty("PaymentTerms")]
        public virtual ICollection<MertexTradeAccountClassificationSuperSet> MertexTradeAccountClassificationSuperSetRecords { get; set; }

        [NotMapped]
        public string Label
        {
            set
            {

            }
            get
            {
                return $"({Code}) {Name}";
            }
        }
    }
}
