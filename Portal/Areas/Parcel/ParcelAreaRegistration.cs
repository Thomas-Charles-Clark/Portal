using System.Web.Mvc;

namespace Portal.Areas.Parcel
{
    public class ParcelAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "parcel";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "parcel_default",
                "parcel/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}