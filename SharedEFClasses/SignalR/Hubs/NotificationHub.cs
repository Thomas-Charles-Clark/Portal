using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.Identity;
using SharedEFClasses.Models;
using SharedEFClasses.Utilities;
using Microsoft.AnalysisServices.AdomdClient;
using SharedEFClasses.Models.General;
using Microsoft.Owin.Security.Notifications;

namespace SharedEFClasses.SignalR.Hubs
{
    public class NotificationHub : Hub
    {
        private PortalDbContext portalDb { get; set; }

        public NotificationHub(PortalDbContext portalDb)
        {
            this.portalDb = portalDb;
        }

        public void SendNotification(Notification objNotification)
        {
            Clients.User($"{objNotification.FAOMemberID}").receiveNotification(objNotification);
        }

        public void AcknowledgeNotification(long notificationId)
        {
            var n = portalDb.Notifications.SingleOrDefault(p => p.NotificationID == notificationId);

            n.AcknowledgedDT = DateTime.Now;

            portalDb.SaveChanges();
        }

        public void FetchNotifications()
        {
            var memberId = Context.User.Identity.GetUserId<int>();

            var notifications = portalDb.Notifications.Where(n => n.FAOMemberID == memberId && n.Acknowledged == false && n.Deleted == false).ToList();

            Clients.User($"{memberId}").receiveNotifications(notifications);
        }
    }
}