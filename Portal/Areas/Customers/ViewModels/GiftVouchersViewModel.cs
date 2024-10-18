using Portal.Models;
using Portal.Utilities;
using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Customers;
using SharedEFClasses.Models.General;
using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Areas.Customers.ViewModels
{
    public class GiftVouchersViewModel : BaseViewModel
    {
        public string GiftVoucherCode { get; set; }
        public List<PriceList> PriceLists { get; set; }
        public List<GiftVoucherType> GiftVoucherTypes { get; set; }

        public GiftVouchersViewModel(string giftVoucherCode, RoleProperties properties, string applicationHeading, string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            GiftVoucherCode = giftVoucherCode;
        }

        public static async Task<GiftVouchersViewModel> CreateAsync(
            string giftVoucherCode,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var portalDb = new PortalDbContext();

            var result = new GiftVouchersViewModel(giftVoucherCode, properties, applicationHeading, applicationSubHeading);

            result.GiftVoucherTypes = portalDb.GiftVoucherTypes.ToList();

            result.PriceLists = portalDb.PriceLists.ToList();

            return result;
        }
    }
}