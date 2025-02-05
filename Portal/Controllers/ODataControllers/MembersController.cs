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
using SharedEFClasses;

namespace Portal.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using SharedEFClasses.Models.TradeAccounts;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<TradeAccount>("TradeAccounts");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [System.Web.Http.Authorize]
    public class MembersController : BaseODataController
    {
        public MembersController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/TradeAccounts
        [EnableQuery(MaxNodeCount = 200)]
        public IQueryable<Member> GetMembers()
        {
            return PortalDb.Users.Where(p => p.Deleted == false).OrderBy(p => p.FullName).AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<Member> MemberFilter(string searchTerm)
        {
            if (!String.IsNullOrEmpty(searchTerm))
            {
                return PortalDb.Users.Where(p => p.Roles.Any() && 
                                                 p.Deleted == false &&
                                                 p.Email.EndsWith("@designersguild.com") &&
                                                 (
                                                    p.FullName.StartsWith(searchTerm)|| 
                                                    p.Email.StartsWith(searchTerm)
                                                 )
                                            ).OrderBy(p => p.FullName).AsQueryable();
            }
            else
            {
                return PortalDb.Users.Where(p => p.Roles.Any() &&
                                                 p.Deleted == false &&
                                                 p.Email.EndsWith("@designersguild.com")).OrderBy(p => p.FullName).AsQueryable();
            }
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<Member> MembersForEmailContacts()
        {
             return PortalDb.Users.Where(p => (p.Deleted == false) && 
                ((p.DotDigitalAccountID == null) || (p.DotDigitalAccount.DotDigitalAccountTypeID == 1))
             ).OrderBy(p => p.FullName).AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<Member> MemberValueMapper(int? id)
        {
            return PortalDb.Users.Where(p => p.Roles.Any() && p.Id == id).AsQueryable();
        }
    }
}
