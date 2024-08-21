using Microsoft.AspNet.Identity;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Parcel;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeAccounts;

using System;
using System.Collections;
using System.Data.Entity;
using System.Data.Entity.Core.Common.CommandTrees;
using System.Linq;

using System.Threading.Tasks;
using System.Web.Http;

namespace Portal.Areas.Products.Controllers
{
    [System.Web.Http.Authorize]
    public partial class ParcelCalculatorAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public ParcelCalculatorAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpPost]
        public IHttpActionResult FetchRate([FromBody]PassParcelRateFetch dto)
        {
            var rate = PortalDb.ParcelRates.SingleOrDefault(p => p.DestinationID == dto.DestinationID &&
                p.ParcelTypeID == dto.ParcelTypeID);

            return Ok(rate);
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchExchangeRateToCustomerCurrency([FromBody]PassMertexCurrencyCode dto)
        {
            var rate = await PortalDb.ExchangeRates.SingleOrDefaultAsync(p => p.MertexCurrencyCode == dto.MertexCurrencyCode);

            return Ok(rate);
        }
    }
}
