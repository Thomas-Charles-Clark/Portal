using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SecondTestArea.Controllers
{
    public class SecondTestController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            ViewBag.Message = "This is the Second Test Area, and it has had some server-side code changes!";

            return View();
        }
    }
}