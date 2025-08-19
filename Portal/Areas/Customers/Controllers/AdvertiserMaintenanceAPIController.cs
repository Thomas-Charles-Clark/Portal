using Kendo.Mvc.UI;

using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Kendo.Mvc.Extensions;

using System.Data.Entity;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.IO;
using SharedEFClasses.Models.ContractPricing;
using Portal.Utilities.DynamicRoles;
using System.Collections;
using Microsoft.AspNet.Identity;
using Portal.Areas.Customers.Models;
using SharedEFClasses.Utilities;

namespace Portal.Areas.Customers.Controllers
{
    [DynamicRoleAuthorize]
    public class AdvertiserMaintenanceApiController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private ApplicationUserManager UserManager { get; set; }

        public AdvertiserMaintenanceApiController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.PortalDb = portalDbContext;
            this.UserManager = userManager;
        }

        [HttpPost]
        public async Task<IHttpActionResult> SendAdvertiserMaintenanceNotice([FromBody] PassAdvertiserMaintenanceSend dto)
        {
            var inkyMarkup = $@"
            <style type=""text/css"">
                {PortalFramework.FoundationEmailCSS}
            </style>
            <meta name=""x-apple-disable-message-reformatting""/>
            <container>
	            <row>
		            <columns>
			            <p class=""text-left"" style=""margin-top: 0"">
				            {System.Text.RegularExpressions.Regex.Replace(dto.Body, "\n", "<br/>")}
			            </p>
		            </columns>
	            </row>
                <spacer size=""15""></spacer>
            </container>
            ";
            
            var emailTo = dto.To;

            var replyTo = dto.ReplyTo;

            using (var client = new HttpClient())
            {
                var content = new StringContent(inkyMarkup);

                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

                var inkyResult = await client.PostAsync(PortalFramework.InkyEndpoint, content);

                inkyMarkup = await inkyResult.Content.ReadAsStringAsync();
            }

            var body = inkyMarkup;

            var memberId = User.Identity.GetUserId<int>();

#pragma warning disable 4014
            System.Threading.Tasks.Task.Factory.StartNew(() =>
            {
                ((EmailService)UserManager.EmailService).SendFoundationEmailAsync(new IdentityMessage()
                {
                    Body = body,
                    Subject = dto.Subject,
                    Destination = emailTo
                },
                replyTo);
            });
#pragma warning restore 4014

            return Ok(new { });
        }
    }
}
