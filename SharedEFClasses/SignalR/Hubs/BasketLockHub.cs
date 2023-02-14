using Microsoft.AspNet.SignalR;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.SignalR.Hubs
{
    public class BasketLockHub : Hub
    {
        private PortalDbContext PortalDb { get; set; }

        public BasketLockHub(PortalDbContext portalDb)
        {
            this.PortalDb = portalDb;
        }

        public void SendTakeover(int fromUserId, long basketId)
        {
            var b = PortalDb.Baskets.Where(p => p.BasketID == basketId).Single();
            var userName = PortalDb.Users.Where(p => p.Id == fromUserId).Select(p => p.FullName).Single();

            if (b.LockedByMemberID.HasValue)
            {
                Clients.User($"{b.LockedByMemberID}").receiveTakeoverRequest(new
                {
                    fromUserId,
                    basketId,
                    message = $"{userName} is requesting takeover of a basket you are locking: BasketID {b.BasketID}" + (String.IsNullOrEmpty(b.OrderReference) ? "." : $" Order Reference: \"{b.OrderReference}\".")
                });
            }
        }

        public void RefuseTakeover(string notifyUserId, long basketId)
        {
            Clients.User($"{notifyUserId}").receiveTakeoverRefusal(new { basketId });
        }

        public void SendNewBusyMessage(int notifyUserId, string busyMessage)
        {
            Clients.User($"{notifyUserId}").receiveNewBusyMessage(new { busyMessage });
        }

        public void RelinquishBasket(long basketId, int notifyUserId)
        {
            var b = PortalDb.Baskets.Where(p => p.BasketID == basketId).Single();

            b.LockedByMemberID = null;// notifyUserId;

            PortalDb.SaveChanges();

            Clients.User($"{notifyUserId}").receiveTakeoverSuccess(new { basketId });

            //Clients.All.receiveOrderProductsGridViewRefresh();
        }

        public void UnlockBasket(long basketId)
        {
            var b = PortalDb.Baskets.Where(p => p.BasketID == basketId).SingleOrDefault();

            if (b != null)
            {
                b.LockedByMemberID = null;

                PortalDb.SaveChanges();
            }

            // anyone need notifying that a simple unlock has taken place? I don't believe so... but... 
            //Clients.User($"{notifyUserId}").receiveTakeoverSuccess(new { basketId });
        }

        public void UnlockAndRelinquishBasket(long basketId)
        {
            var b = PortalDb.Baskets.Where(p => p.BasketID == basketId).SingleOrDefault();

            if (b != null)
            {
                b.LockedByMemberID = null;
                b.OwnerMemberID = null;

                PortalDb.SaveChanges();
            }

            //Clients.All.receiveOrderProductsGridViewRefresh();
        }

        public void SendDeviceChange(int memberId, long basketId, long id)
        {
            var b = PortalDb.Baskets.Where(p => p.BasketID == basketId).SingleOrDefault();

            if (b != null)
            {
                b.LockedByMemberID = null;

                PortalDb.SaveChanges();
            }

            Clients.User($"{memberId}").receiveDeviceChange(new { id, basketId });
        }
    }
}