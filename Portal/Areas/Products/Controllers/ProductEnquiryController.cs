using System;
using System.Data;
using System.Linq;
using System.Web.Mvc;
using Newtonsoft.Json;
using Microsoft.AspNet.Identity;
using Portal.Areas.Products.ViewModels;
using Portal.Models;
using Portal.Utilities.DynamicRoles;
using System.Configuration;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Samples;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Models.Products;

namespace Portal.Areas.Products.Controllers
{
    [DynamicRoleAuthorize]
    //[RequireTradeAccount]
    [RouteArea("products")]
    [RoutePrefix("enquiry")]
    [Route("{action=index}")]
    public class EnquiryController : BaseController
    {
        public EnquiryController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult OperatorAutocomplete(PassAutocompleteTerm objAutocomplete)
        {
            //|| p.Name.Contains(objAutocomplete.term)
            var results = PortalDb.MertexOperators.Where(p => p.Code.StartsWith(objAutocomplete.term) || p.Name.Contains(objAutocomplete.term)).Distinct().OrderBy(p => p.Name).Skip(0).Take(100).ToList();

            return Content(JsonConvert.SerializeObject(results));
        }


        [HttpPost]
        public ActionResult LoadProductInfo(PassProductPageID objProductPageID)
        {
            var result = PortalDb.ProductPage_LoadInfo(objProductPageID.productPageId, 1, DateTime.Now);

            return Json(result, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        public ActionResult LoadStockInfo(PassFetchProductStockInfoSingular objFetch)
        {
            var result = PortalDb.FetchStockInfoSingular(objFetch);

            return Json(result, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult PCAPredictFind(PassPCAPredictFind objSearch)
        {
            try
            {
                //Random rand = new Random();
                //double trueProbability = 0.3;
                //bool result = rand.NextDouble() < trueProbability;
                //if (result)
                //{
                //    throw new Exception("PCA Predict Failure Test");
                //}

                if (objSearch.id == null)
                {
                    var client = new PCAFind.PostcodeAnywhere_SoapClient();

                    var results = client.Capture_Interactive_Find_v1_00(
                        Key: ConfigurationManager.AppSettings["PCA-API-Portal"],
                        Text: objSearch.text,
                        Container: objSearch.container,
                        Origin: objSearch.origin,
                        Countries: objSearch.countries,
                        Limit: 12,
                        Language: "en-GB"
                    );

                    return Json(results, JsonRequestBehavior.DenyGet);
                }
                else
                {
                    var client = new PCARetrieve.PostcodeAnywhere_SoapClient();

                    var results = client.Capture_Interactive_Retrieve_v1_00(
                        Key: ConfigurationManager.AppSettings["PCA-API-Portal"],
                        Id: objSearch.id,
                        Field1Format: null,
                        Field2Format: null,
                        Field3Format: null,
                        Field4Format: null,
                        Field5Format: null,
                        Field6Format: null,
                        Field7Format: null,
                        Field8Format: null,
                        Field9Format: null,
                        Field10Format: null,
                        Field11Format: null,
                        Field12Format: null,
                        Field13Format: null,
                        Field14Format: null,
                        Field15Format: null,
                        Field16Format: null,
                        Field17Format: null,
                        Field18Format: null,
                        Field19Format: null,
                        Field20Format: null
                    );

                    return Json(results, JsonRequestBehavior.DenyGet);
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(ex, JsonRequestBehavior.DenyGet);
            }
        }

        [HttpPost]
        public ActionResult TestMertex(string accountNumber)
        {
            var result = new SampleOrderReturn() {
                state = "success",
                message = ""
            };

            return Json(result, JsonRequestBehavior.DenyGet);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult PlaceOrder(string order)
        {
            System.IO.StringReader sReader = new System.IO.StringReader(order);
            JsonReader jReader = new JsonTextReader(sReader);
            SampleOrder objOrder = new JsonSerializer().Deserialize<SampleOrder>(jReader);

            var result = new SampleOrderReturn()
            {
                state = "failure",
                message = "general failure"
            };

            try
            {
                var orderHeadId = PortalDb.SampleOrder_Submit(User.Identity.GetUserId<int>(), objOrder);
                if (orderHeadId == null)
                {
                    Response.StatusCode = 500;
                    result.state = "failure";
                    result.message = "Failed to create transaction";

                    return Content(result.message);
                }
                else
                {
                    result.state = "success";
                    result.message = orderHeadId.Value.ToString();
                }
            }
            catch (Exception e)
            {
                Response.StatusCode = 500;
                result.state = "failure";
                result.message = e.ToString();

                return Content(e.ToString());
            }

            return Json(result, JsonRequestBehavior.DenyGet);
        }
    }
}