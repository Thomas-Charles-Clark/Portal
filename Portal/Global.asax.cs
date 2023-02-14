using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Microsoft.AspNet.Identity;
using NLog;
using System.Web.Http;
using System.Web.Helpers;
using Unity.Mvc5;
using SharedEFClasses.Models.ErrorContext;
using SharedEFClasses.Utilities;
using Microsoft.AspNet.SignalR;
using Portal.Utilities.SignalR;
using Unity;
using Microsoft.Extensions.DependencyInjection;

namespace Portal
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalFilters.Filters.Add(new System.Web.Mvc.AuthorizeAttribute());

            AntiForgeryConfig.SuppressXFrameOptionsHeader = true;

            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);

            //var services = new ServiceCollection();

            //services.AddNodeServices();

            UnityConfig.RegisterTypes(UnityConfig.Container);
            var dr = new UnityDependencyResolver(UnityConfig.Container);
            DependencyResolver.SetResolver(new UnityDependencyResolver(UnityConfig.Container));

            GlobalHost.DependencyResolver = new SignalRUnityDependencyResolver(UnityConfig.Container);

            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            
            ValueProviderFactories.Factories.Add(new JsonValueProviderFactory());

            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                Formatting = Formatting.Indented,
                TypeNameHandling = TypeNameHandling.None,
                ContractResolver = new DefaultContractResolver(),
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore, // was Serialize.
                PreserveReferencesHandling = PreserveReferencesHandling.None
            };

            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12 | System.Net.SecurityProtocolType.Tls11 | System.Net.SecurityProtocolType.Tls;
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Origin, Accept");
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        }

        protected void Application_Error(object sender, EventArgs e)
        {
#if DEBUG

#else
            Logger logger = LogManager.GetLogger("ApplicationError");

            Exception exc = Server.GetLastError();
            
            logger.Error(exc, "Unhandled Exception occurred", null);

            String urlOfPage = "unknown";
            if (Request == null) { }
            else
            {
                if (Request.Url == null) { }
                else
                {
                    urlOfPage = Request.Url.ToString();
                }
            }
            
            String exceptionType = "";
            String exceptionMessage = "";
            String exceptionSource = "";
            String stackTrace = "";
            String innerExceptionType = "";
            String innerExceptionMessage = "";
            String innerExceptionSource = "";
            String innerExceptionStackTrace = "";
            
            exceptionType = exc.GetType().ToString();
            exceptionMessage = exc.Message;
            exceptionSource = exc.Source;

            if (exc.StackTrace != null)
            {
                stackTrace = exc.StackTrace;
            }
            
            if (exc.InnerException == null) { }
            else
            {
                innerExceptionType = exc.InnerException.GetType().ToString();
                innerExceptionMessage = exc.InnerException.Message;
                innerExceptionSource = exc.InnerException.Source;

                if (exc.InnerException.StackTrace != null)
                {
                    innerExceptionStackTrace = exc.InnerException.StackTrace;
                }
            }

            Int32 memberId = User.Identity.GetUserId<int>();
            
            Boolean includeErrorInLog = true;
            
            if (includeErrorInLog)
            {
                ErrorDbContext objError = new ErrorDbContext();
                objError.SaveToErrorLog(memberId,
                    exceptionType,
                    exceptionMessage,
                    exceptionSource,
                    stackTrace,
                    innerExceptionType,
                    innerExceptionMessage,
                    innerExceptionSource,
                    innerExceptionStackTrace,
                    urlOfPage,
                    PortalFramework.GetUserAgent(),
                    PortalFramework.GetIPAddress());
            }

            Server.ClearError();

            Server.TransferRequest("/major-error");

#endif
        }
    }
}
