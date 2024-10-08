using Kendo.Mvc.UI;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public class DotDigitalMemberControl
    {
        public string Email { get; set; }

        public short CountryID { get; set; }

        public string CountryName { get; set; }

        public byte PriceListID { get; set; }

        public string PriceListName { get; set; }

        public short MarketID { get; set; }

        public string MarketName { get; set; }

        public byte DotDigitalAccountID { get; set; }

        public string DotDigitalAccountName { get; set; }

        public long SignUpAddressBookID { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        public DateTime? UnsubscribedDT { get; set; }

        public DateTime? HardBounceDT { get; set; }

        public int TradeAccountID { get; set; }

        public bool TradeEmailRegisteredInMertex { get; set; }

        public bool Deleted { get; set; }

        public bool Unsubscribed { get; set; }

        public bool HardBounced { get; set; }

        public bool PermissionToEmail { get; set; }

        public DateTime? PermissionLastUpdatedDT { get; set; }

        public string PermissionLegalBasis { get; set; }
        
        /// <summary>
        ///  This is not Exception as in Error, this is Exception as in 'Allow user to exist across multiple DotDigital accounts'.
        /// </summary>
        public bool EmailException { get; set; }

        public bool TradeEmail { get; set; }

        public bool RetailStoreEmail { get; set; }

        public bool SyncToESP { get; set; }

        public string StatusDescription { get; set; }
    }
}
