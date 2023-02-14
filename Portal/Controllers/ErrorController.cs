using Microsoft.AspNet.Identity;
using SharedEFClasses.Models.General;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Portal.Controllers
{
    public class ErrorController : ApiController
    {
        [HttpPost]
        public IHttpActionResult LogClientError([FromBody]PassClientError objError)
        {
            var memberId = User.Identity.GetUserId<int>();

            PortalFramework.LogErrorToDatabase(memberId, objError);

            return Ok(new { });
        }
    }
}
