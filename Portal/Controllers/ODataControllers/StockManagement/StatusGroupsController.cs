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
using Microsoft.AspNet.OData;
using SharedEFClasses.Models.StockManagement;
using SharedEFClasses;

namespace Portal.Controllers
{
    [System.Web.Http.Authorize]
    public class StatusGroupsController : BaseODataController
    {
        public StatusGroupsController(PortalDbContext dbContext) : base(dbContext)
        {

        }

        // GET: odata/GetBranches
        [EnableQuery(MaxNodeCount = 200)]
        public IQueryable<StatusGroup> GetStatusGroups()
        {
            return PortalDb.StatusGroups.Where(p => p.Deleted == false).AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<StatusGroup> StatusGroupValueMapper (byte? statusGroupId)
        {
            return PortalDb.StatusGroups.Where(p => p.Deleted == false && p.StatusGroupID == statusGroupId).AsQueryable();
        }
    }
}
