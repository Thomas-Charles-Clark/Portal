using Microsoft.AspNet.Identity;
using Portal.Areas.Pricing.ViewModels;
using Portal.Controllers;
using Portal.Models;
using Portal.Utilities.DynamicRoles;
using System.Linq;
using System.Web.Mvc;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using System.Collections;
using SharedEFClasses;
using SharedEFClasses.Models;

namespace Portal.Areas.Pricing.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("pricing")]
    [RoutePrefix("enquiry")]
    [Route("{action=index}")]
    public class EnquiryController : BaseController
    {
        public EnquiryController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "enquiry" && p.AreaName == "pricing" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (Session["selectedTradeAccountId"] == null)
            {
                Session["selectedTradeAccountId"] = user.TradeAccountID;
            }
            else
            {

            }

            var model = new PricingEnquiryViewModel(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("PricingEnquiry", model);
        }

        public ActionResult TestBed()
        {
            return View("PricingEnquiryTestBed");
        }

        public FileResult ExportPDF([DataSourceRequest]DataSourceRequest request)
        {
            //IEnumerable products = db.Products.ToDataSourceResult(request).Data;

            //// step 1: creation of a document-object
            //var document = new Document(PageSize.A4, 10, 10, 10, 10);

            ////step 2: we create a memory stream that listens to the document
            //var output = new MemoryStream();
            //PdfWriter.GetInstance(document, output);

            ////step 3: we open the document
            //document.Open();

            ////step 4: we add content to the document
            //var numOfColumns = 4;
            //var dataTable = new PdfPTable(numOfColumns);

            //dataTable.DefaultCell.Padding = 3;

            //dataTable.DefaultCell.BorderWidth = 2;
            //dataTable.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;

            //// Adding headers
            //dataTable.AddCell("Product ID");
            //dataTable.AddCell("Product Name");
            //dataTable.AddCell("Unit Price");
            //dataTable.AddCell("Quantity Per Unit");

            //dataTable.HeaderRows = 1;
            //dataTable.DefaultCell.BorderWidth = 1;

            //foreach (Product prod in products)
            //{
            //    dataTable.AddCell(prod.ProductID.ToString());
            //    dataTable.AddCell(prod.ProductName);
            //    dataTable.AddCell(prod.UnitPrice.ToString());
            //    dataTable.AddCell(prod.QuantityPerUnit);
            //}

            //// Add table to the document
            //document.Add(dataTable);

            ////This is important don't forget to close the document
            //document.Close();

            // send the memory stream as File
            //return File(output.ToArray(), "application/pdf", "Products.pdf");
            return File(new byte[] { 0 }, "application/pdf", "Products.pdf");

        }
    }
}