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
    public class BranchGroupsController : BaseODataController
    {
        public BranchGroupsController(PortalDbContext dbContext) : base(dbContext)
        {

        }

        // GET: odata/GetBranches
        [EnableQuery(MaxNodeCount = 200)]
        public IQueryable<BranchGroup> GetBranchGroups()
        {
            return PortalDb.BranchGroups.Where(p => p.Deleted == false).AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<BranchGroup> BranchGroupValueMapper (int? branchGroupId)
        {
            return PortalDb.BranchGroups.Where(p => p.Deleted == false && p.BranchGroupID == branchGroupId).AsQueryable();
        }
    }
}
