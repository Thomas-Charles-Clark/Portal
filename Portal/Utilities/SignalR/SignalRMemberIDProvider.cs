using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;

namespace Portal.Utilities.SignalR
{
    public class SignalRMemberIDProvider : IUserIdProvider
    {
        public string GetUserId(IRequest request)
        {
            return request.User.Identity.GetUserId<int>().ToString();
        }
    }
}