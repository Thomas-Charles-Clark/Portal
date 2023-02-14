using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Portal.Controllers
{
    public class PassEmailObject
    {

    }

    public class HeldOrderAPIController : ApiController
    {
        [HttpPost]
        public IHttpActionResult Receive([FromBody]PassEmailObject objEmail)
        {


            return Ok(new { });
        }
    }
}