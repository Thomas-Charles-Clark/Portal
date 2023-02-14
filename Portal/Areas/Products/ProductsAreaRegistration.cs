using System.Web.Mvc;

namespace Portal.Areas.Products
{
    public class ProductsAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "products";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "products_default",
                "products/{controller}/{action}/{id}",
                defaults: new { action = "index", id = UrlParameter.Optional }
            );
        }
    }
}