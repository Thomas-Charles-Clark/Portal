//using System.Linq;
//using System.Web.Mvc;
//using Portal.Models;
//using System.Data.Entity;
//using Microsoft.AspNet.Identity;
//using Microsoft.Owin.Security;
//using System.Web;
//using System.Web.Http;
//using Unity.AspNet.Mvc;
//using Unity.Injection;
//using Unity.Registration;
//using SharedEFClasses.Models;
//using SharedEFClasses;
//using Unity.Lifetime;

//[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(Portal.App_Start.UnityWebActivator), "Start")]
//[assembly: WebActivatorEx.ApplicationShutdownMethod(typeof(Portal.App_Start.UnityWebActivator), "Shutdown")]

//namespace Portal.App_Start
//{
//    /// <summary>Provides the bootstrapping for integrating Unity with ASP.NET MVC.</summary>
//    public static class UnityWebActivator
//    {
//        /// <summary>Integrates Unity when the application starts.</summary>
//        public static void Start() 
//        {
//            var container = UnityConfig.Container;// GetConfiguredContainer();

//            FilterProviders.Providers.Remove(FilterProviders.Providers.OfType<FilterAttributeFilterProvider>().First());
//            FilterProviders.Providers.Add(new UnityFilterAttributeFilterProvider(container));

//            DependencyResolver.SetResolver(new UnityDependencyResolver(container));
//            GlobalConfiguration.Configuration.DependencyResolver = new Unity.WebApi.UnityDependencyResolver(container);

//            Microsoft.Web.Infrastructure.DynamicModuleHelper.DynamicModuleUtility.RegisterModule(typeof(UnityPerRequestHttpModule));

//            // should I be using HierarchicalLifetimeManager instead? 
//            /*
//             "All components that implement IDisposable should be 
//registered with the HierarchicalLifetimeManager to ensure that they are properly disposed at the end of the request."
//             */

//            // TODO: Uncomment if you want to use PerRequestLifetimeManager

//                        //container.RegisterType(typeof(DbContext), typeof(PortalDbContext), "_mainDbContext", new PerRequestLifetimeManager(), new InjectionConstructor());
            
//                        //container.RegisterType(typeof(IUserStore<Member, int>), typeof(UserStore), "_userStore", new PerRequestLifetimeManager(), new InjectionMember[] { });
            
//                        //container.RegisterType(typeof(UserManager<Member, int>), typeof(ApplicationUserManager), "_applicationUserManager", new PerRequestLifetimeManager(), new InjectionMember[] { });

//                        container.RegisterInstance(typeof (IAuthenticationManager), "_authManager", new InjectionFactory(x => HttpContext.Current.GetOwinContext().Authentication), new HierarchicalLifetimeManager());

//            //container.RegisterType<ApplicationUserManager>();

//            //container.RegisterType<SignInManager<Member, int>, ApplicationSignInManager>(new PerRequestLifetimeManager(), new InjectionMember[] { });



//            //container.RegisterType<AccountController>(new InjectionConstructor());
//        }
         
//        /// <summary>Disposes the Unity container when the application is shut down.</summary>
//        public static void Shutdown()
//        {
//            var container = UnityConfig.Container;
//            container.Dispose();
//        }
//    }
//}