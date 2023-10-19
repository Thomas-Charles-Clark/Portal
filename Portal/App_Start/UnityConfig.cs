using GDPR.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Security;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Web;
using Unity;
using Unity.Injection;
using Portal.Utilities.SignalR;
using SharedEFClasses.SignalR.Hubs;
using Unity.Lifetime;

namespace Portal
{
    /// <summary>
    /// Specifies the Unity configuration for the main container.
    /// </summary>
    public static class UnityConfig
    {
        #region Unity Container
        private static Lazy<IUnityContainer> container =
          new Lazy<IUnityContainer>(() =>
          {
              var container = new UnityContainer();
              RegisterTypes(container);
              return container;
          });

        /// <summary>
        /// Configured Unity Container.
        /// </summary>
        public static IUnityContainer Container => container.Value;
        #endregion

        /// <summary>
        /// Registers the type mappings with the Unity container.
        /// </summary>
        /// <param name="container">The unity container to configure.</param>
        /// <remarks>
        /// There is no need to register concrete types such as controllers or
        /// API controllers (unless you want to change the defaults), as Unity
        /// allows resolving a concrete type even if it was not previously
        /// registered.
        /// </remarks>
        public static void RegisterTypes(IUnityContainer container)
        {
            // NOTE: To load from web.config uncomment the line below.
            // Make sure to add a Unity.Configuration to the using statements.
            // container.LoadConfiguration();

            // TODO: Register your type's mappings here.
            // container.RegisterType<IProductRepository, ProductRepository>();
            
            container.RegisterType<PortalDbContext>(new InjectionConstructor());
            container.RegisterType<GDPRDbContext>();
            container.RegisterType<ApplicationSignInManager>();
            container.RegisterType<ApplicationUserManager>();
            container.RegisterType<EmailService>();

            container.RegisterType<IAuthenticationManager>(
                new InjectionFactory(c => HttpContext.Current.GetOwinContext().Authentication));

            container.RegisterType<IUserStore<Member, int>, UserStore>(
                new InjectionConstructor(typeof(PortalDbContext)));

            container.RegisterType<IUserIdProvider>(new InjectionFactory(c => new SignalRMemberIDProvider()));
            
            container.RegisterType<TaskAlertHub>(new InjectionFactory(CreateTaskAlertHub));

            container.RegisterType<BasketLockHub>(new InjectionFactory(CreateBasketLockHub));

            container.RegisterType<NotificationHub>(new InjectionFactory(CreateNotificationHub));
        }
        
        private static object CreateTaskAlertHub(IUnityContainer p)
        {
            return new TaskAlertHub(p.Resolve<PortalDbContext>());
        }

        private static object CreateBasketLockHub(IUnityContainer p)
        {
            return new BasketLockHub(p.Resolve<PortalDbContext>());
        }

        private static object CreateNotificationHub(IUnityContainer p)
        {
            return new NotificationHub(p.Resolve<PortalDbContext>());
        }
    }
}