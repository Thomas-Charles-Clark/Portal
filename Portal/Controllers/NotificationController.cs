using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

using Portal.Utilities;

using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.SignalR.Hubs;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Portal.Controllers
{
    public class NotificationController : ApiController
    {
        private PortalDbContext PortalDbContext { get; set; }

        public NotificationController(PortalDbContext context) 
        {
            PortalDbContext = context;
        } 

        [HttpPost]
        [NotificationAuthentication]
        public IHttpActionResult NotifyUser([FromBody]Notification objNotification)
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();

            hubContext.Clients.User($"{objNotification.FAOMemberID}").receiveNotification(objNotification);

            return Ok(new { });
        }

        //[HttpGet]
        //[NotificationAuthentication]
        //public IHttpActionResult NotifyUser()
        //{
        //    var notice = PortalDbContext.Notifications.FirstOrDefault();

        //    if (notice != null)
        //    {
        //        Hub.SendNotification(new PassNotification()
        //        {
        //            targetMemberId = 8,
        //            notification = notice
        //        });

        //        return Content(System.Net.HttpStatusCode.OK, "Notified");
        //    }
        //    else
        //    {
        //        return Content(System.Net.HttpStatusCode.PreconditionFailed, "Not Notified");
        //    }
        //}
    }
}