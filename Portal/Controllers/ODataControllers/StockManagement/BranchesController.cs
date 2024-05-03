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
using Portal.Void;
using System.Web;
using Microsoft.AspNet.Identity;
using Kendo.Mvc;

namespace Portal.Controllers
{
    [System.Web.Http.Authorize]
    public class BranchesController : BaseODataController
    {
        public BranchesController(ApplicationUserManager userManager,  PortalDbContext dbContext) : base(userManager, dbContext)
        {

        }

        // GET: odata/GetBranches
        [EnableQuery(MaxNodeCount = 200)] 
        public IQueryable<Branch> GetBranches()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var role = user.Roles.FirstOrDefault(r => r.Role.Id == 107);

            if (role?.Role.Properties?.BranchIDs?.Any() == true) // Range Management (Fenwick Review)
            {                                                       
                return PortalDb.Branches.Where(p => p.Deleted == false && role.Role.Properties.BranchIDs.Contains(p.BranchID)).AsQueryable();
            }
            else
            {
                return PortalDb.Branches.Where(p => p.Deleted == false).AsQueryable();
            }
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
