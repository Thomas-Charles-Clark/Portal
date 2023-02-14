using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Security.Principal;
using System.Web;

namespace Portal.Models.IdentityExtensions
{
    public static class Extensions
    {
        public static string GetFullName(this IIdentity identity)
        {
            var user = HttpContext.Current.GetOwinContext().Get<ApplicationUserManager>().FindById(Convert.ToInt32(identity.GetUserId()));
            return (user != null) ? user.FullName : string.Empty;
        }
    }
}