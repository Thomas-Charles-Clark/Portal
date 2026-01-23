using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using Portal.Models;
using Portal.Utilities.Document;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.CreditControl;
using SharedEFClasses.Models.Documents;
using SharedEFClasses.Models.IncomingEmail;
using SharedEFClasses.Models.Translations;
using SharedEFClasses.Utilities;
using SimpleImpersonation;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Management.Automation.Language;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Portal.Areas.CreditControl.Controllers
{
    public class TranslateResourcesController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public TranslateResourcesController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpPost]
        public IHttpActionResult RefreshDashboard([FromBody] PassTranslationDashboardDTO dto)
        {
            var result = PortalDb.Translation_Dashboard_Select(dto);

            return Ok(result);
        }
    }
}
