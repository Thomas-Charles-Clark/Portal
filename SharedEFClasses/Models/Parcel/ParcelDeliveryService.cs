using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Parcel
{
    [Table("DeliveryService", Schema = "parcel")]
    public class ParcelDeliveryService
    {
        [Key]
        public byte DeliveryServiceID { get; set; }

        public string Name { get; set; }

        public decimal ParcelWeightChargeLimit { get; set; }
    }
}
