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
    public class BranchesController : BaseODataController
    {
        public BranchesController(PortalDbContext dbContext) : base(dbContext)
        {

        }

        // GET: odata/GetBranches
        [EnableQuery(MaxNodeCount = 200)] 
        public IQueryable<Branch> GetBranches()
        {
            return PortalDb.Branches.Where(p => p.Deleted == false).AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<Branch> BranchGroupFilter(int? branchGroupId)
        {
            if (branchGroupId.HasValue)
            {
                return PortalDb.Branches.Where(p => p.Deleted == false && (p.BranchGroups.Select(bg => bg.BranchGroupID).ToList().Contains(branchGroupId.Value))).AsQueryable();
            }
            else
            {
                return PortalDb.Branches.Where(p => p.Deleted == false).AsQueryable();
            }
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<Branch> BranchValueMapper (int? branchId)
        {
            return PortalDb.Branches.Where(p => p.Deleted == false && p.BranchID == branchId).AsQueryable();
        }
    }
}
