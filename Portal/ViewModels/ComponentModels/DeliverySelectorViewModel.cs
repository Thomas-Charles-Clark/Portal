using Portal.Models;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Samples;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.ViewModels.ComponentModels
{
    public class DeliverySelectorViewModel
    {
        public List<TradeHaulier> Hauliers { get; set; }

        public List<TradeCarriage> CarriageServices { get; set; }

        public List<TradeDeliveryType> DeliveryTypes { get; set; }

        public List<AlternateDeliveryService> AlternateDeliveryServices { get; set; }
        public RoleProperties Properties { get; set; }

        public DeliverySelectorViewModel (
            RoleProperties properties, 
            List<TradeHaulier> hauliers, 
            List<TradeCarriage> carriageServices,
            List<TradeDeliveryType> deliveryTypes,
            List<AlternateDeliveryService> alternateDeliveryServices)
        {
            this.Properties = properties;
            this.Hauliers = hauliers;
            this.CarriageServices = carriageServices;
            this.DeliveryTypes = deliveryTypes;
            this.AlternateDeliveryServices = alternateDeliveryServices;
        }
    }
}