using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using Microsoft.AspNet.OData;
using SharedEFClasses.Models.Paying;

namespace Portal.Controllers
{
    [System.Web.Http.Authorize]
    public class PaymentRequestStatusesController : ODataController
    {
        private static PortalDbContext PortalDb { get; set; }

        public PaymentRequestStatusesController(PortalDbContext portalDb)
        {
            PortalDb = portalDb;
        }

		// GET: odata/Colours
		[EnableQuery]
        public IQueryable<PaymentRequestStatus> GetPaymentRequestStatuses()
        {
            return PortalDb.PaymentRequestStatuses.Where(p => p.Deleted == false).AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<PaymentRequestStatus> PaymentRequestStatusValueMapper(byte? paymentRequestStatusId)
        {
            return PortalDb.PaymentRequestStatuses.Where(p => p.PaymentRequestStatusID == paymentRequestStatusId).AsQueryable();
        }
    }
}
