using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Security.Principal;
using System.Web;

namespace SharedEFClasses.IdentityExtensions
{ 
    public static class Extensions
    {
        public static string GetFullName(this IIdentity identity)
        {
            var user = HttpContext.Current.GetOwinContext().Get<ApplicationUserManager>().FindById(Convert.ToInt32(identity.GetUserId()));
            return (user != null) ? user.FullName : string.Empty;
        }

        public static string GetEmail(this IIdentity identity)
        {
            var user = HttpContext.Current.GetOwinContext().Get<ApplicationUserManager>().FindById(Convert.ToInt32(identity.GetUserId()));
            return (user != null) ? user.Email : string.Empty;
        }

        public static ICollection<Member_Role> GetRoles (this IIdentity identity)
        {
            var user = HttpContext.Current.GetOwinContext().Get<ApplicationUserManager>().FindById(Convert.ToInt32(identity.GetUserId()));
            return (user != null) ? user.Roles : new List<Member_Role>();
        }
    }
}
