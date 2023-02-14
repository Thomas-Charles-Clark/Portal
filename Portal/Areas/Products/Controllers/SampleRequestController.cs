using Microsoft.AspNet.Identity;
using Portal.Areas.Products.ViewModels;
using Portal.Models;
using Portal.Utilities.DynamicRoles;
using Portal.ViewModels.ComponentModels;
using System.Linq;
using System.Web.Mvc;
using NLog;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Utilities;
using SharedEFClasses.Models.General;

namespace Portal.Areas.Products.Controllers
{
    [DynamicRoleAuthorize]
    //[RequireTradeAccount]
    [RouteArea("products")]
    [RoutePrefix("sample-request")]
    [Route("{action=index}")]
    public partial class SampleRequestController : BaseController
    {
        public SampleRequestController(ApplicationUserManager userManager, PortalDbContext portalDbContext) 
            : base(userManager, portalDbContext)
        {
            logger = LogManager.GetCurrentClassLogger();
        }

        [ActionName("test-bed")]
        public ActionResult TestBed()
        {
            var Model = new TestBedViewModel();

            return View("TestBed/TestBed", Model);
        }

        [ActionName("index")]
        public ActionResult Index()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new SampleRequestViewModel(
                user.GetActiveRoleProperties(),
                PortalFramework.GetClientSideCountries(PortalDb),
                PortalDb.TradeHauliers.Where(p => p.UPS_World_Ver == null).ToList(),
                PortalDb.TradeCarriages.Where(p => p.Visible && p.CurrencyID.HasValue).ToList(),
                PortalFramework.GetClientSideLanguages(PortalDb),
                user.DefaultMertexOperator,
                user.GetActiveRoleProperties()?.AccountSelector_CanSearch == true
            );
            
            return View("SampleRequest", model);
        }

        // GET: Samples
        public ActionResult DG()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var hideOrderTaker = false;

            if (UserManager.IsInRole(user.Id, "Distributor") ||
                UserManager.IsInRole(user.Id, "Customer (Admin)") ||
                UserManager.IsInRole(user.Id, "Customer (Place Order)") ||
                UserManager.IsInRole(user.Id, "Customer (Sales Stats)") ||
                UserManager.IsInRole(user.Id, "Customer (Financial Info)") ||
                UserManager.IsInRole(user.Id, "Customer (Downloads)"))
            {
                hideOrderTaker = true;
            }

            var model = new SamplesViewModel(
                user.GetActiveRoleProperties())
            {
                Countries = PortalDb.Countries
                                .Where(p => p.DeletedDT == null)
                                .Select(p => new ClientSideCountry() { Name = p.Name, Code = p.Code, ThreeDigitCode = p.ThreeDigitCode, CountryID = p.CountryID })
                                .OrderBy(p => p.Name)
                                .ToList(),
                    DeliverySelectorViewModel = new DeliverySelectorViewModel(
                        user.GetActiveRoleProperties(),
                        PortalDb.TradeHauliers.Where(p => p.UPS_World_Ver == null).ToList(),
                        PortalDb.TradeCarriages.Where(p => p.Visible && p.CurrencyID.HasValue && p.Haulier.UPS_World_Ver == null).ToList(),
                        PortalDb.TradeDeliveryTypes.ToList(),
                        PortalDb.AlternateDeliveryServices.Where(p => p.Deleted == false && p.HAULCODE == "CC").ToList()
                    ),
                Languages = PortalDb.Languages.Where(p => p.DeletedDT == null).Select(p => new ClientSideLanguage() { LanguageID = p.LanguageID, Name = p.Name }).ToList(),
                DefaultOrderTaker = user.DefaultMertexOperator,
                CanSearch = user.GetActiveRoleProperties()?.AccountSelector_CanSearch == true,
                HideOrderTaker = hideOrderTaker
            };

            return View("SampleRequestDG", model);
        }
    }
}