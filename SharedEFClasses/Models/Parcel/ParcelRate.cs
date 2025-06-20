using SharedEFClasses.Models.Mertex;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Parcel
{
    [Table("ParcelRate", Schema = "parcel")]
    public class ParcelRate
    {
        [Key]
        public int ParcelRateID { get; set; }

        public short DestinationID { get; set; }

        public byte ParcelTypeID { get; set; }

        public string CurrencyCode { get; set; }
        
        public decimal PriceCurrency { get; set; }

        public DateTime? ModifiedDT { get; set; }

        [ForeignKey("CurrencyCode")]
        public virtual ExchangeRate ExchangeRate { get; set; }
    }
}
