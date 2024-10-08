using Kendo.Mvc.UI;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Kendo.Mvc.Extensions;
using System.Threading.Tasks;
using Portal.Controllers;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.DotDigital;
using SharedEFClasses.Models.Products;

namespace Portal.Areas.Email.Controllers
{ 
    [DynamicRoleAuthorize]
    public class EmailContactsAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private ApplicationUserManager UserManager { get; set; }

        public EmailContactsAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.PortalDb = portalDbContext;
            this.UserManager = userManager;
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchDetails([FromBody]PassMember objMember)
        {
            return Ok(await PortalDb.FetchDotDigitalMemberControls(objMember.MemberID));
        }

        [HttpPost]
        public async Task<IHttpActionResult> ChangeAccount([FromBody] PassDotDigitalAccountChange objParams)
        {
            if (objParams.SourceAccountID.HasValue)
            {
                _ = await PortalDb.DotDigitalUnsubscribe(objParams);
            }

            return Ok(await PortalDb.ChangeDotDigitalAccount(objParams));
        }

        [HttpPost]
        public async Task<IHttpActionResult> Subscribe([FromBody] PassMember objMember)
        {
            return Ok(await PortalDb.Member_Subscribe(objMember.MemberID));
        }

        [HttpPost]
        public async Task<IHttpActionResult> Resubscribe([FromBody] PassMember objMember)
        {
            return Ok(await PortalDb.Member_Resubscribe(objMember.GUID));
        }

        [HttpPost]
        public async Task<IHttpActionResult> Unsubscribe([FromBody] PassMember objMember)
        {
            return Ok(await PortalDb.Member_Unsubscribe(objMember));
        }

        [HttpPost]
        public async Task<IHttpActionResult> ExtantEmailCheck([FromBody] PassEmail objEmail)
        {
            return Ok(await PortalDb.Member_ExtantCheck(objEmail));
        }

        [HttpPost]
        public async Task<IHttpActionResult> CreateNew([FromBody] PassCreateContact objCreation)
        {
            var result = await PortalDb.EmailContact_Create(objCreation);

            return Ok(result);
        }
    }
}
