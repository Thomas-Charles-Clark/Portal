using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Controllers
{
    [Authorize]
    public class FilesController : BaseController
    {
        public FilesController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        public ActionResult FetchPDF(string path, string name)
        {
            var stream = System.IO.File.OpenRead(path);

            return File(stream, "application/pdf", name);
        }
    }
}