using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Portal.Areas.Products.Controllers
{
    //[System.Web.Http.Authorize]
    //public partial class TradeAccountsODataController : ODataController
    //{
    //    private PortalDbContext PortalDb { get; set; }
    //    private readonly ApplicationUserManager UserManager;

    //    public TradeAccountsODataController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
    //    {
    //        this.UserManager = userManager;
    //        this.PortalDb = portalDbContext;
    //    }

    //    [EnableQuery]
    //    public IQueryable<TradeAccount> get()
    //    {
    //        return PortalDb.TradeAccounts.Where(p => p.Status == "O").AsQueryable();
    //    }

    //    protected override void Dispose(bool disposing)
    //    {
    //        PortalDb.Dispose();
    //        UserManager.Dispose();
    //        base.Dispose(disposing);
    //    }
    //}
}