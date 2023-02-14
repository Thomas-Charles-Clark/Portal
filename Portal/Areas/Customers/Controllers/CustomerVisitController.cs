using Microsoft.AspNet.Identity;
using Portal.Areas.Customers.ViewModels;
using Portal.Controllers;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Customers;
using SharedEFClasses.Models.Office;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Customers.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("customers")]
    [RoutePrefix("visit")]
    [Route("{action=index}")]
    public class VisitController : BaseController
    {
        public VisitController(ApplicationUserManager _userManager, PortalDbContext _mainDbContext) : base(_userManager, _mainDbContext)
        {

        }

        /// <summary>
        /// Button / some other process on this page can direct user to auth with office, which can reply with 'code' which is 
        /// an authorisation code to be used against:
        /// $"https://login.microsoftonline.com/common/oauth2/v2.0/token?client_id=13c231f3-3e1a-4caa-9633-3fd653af3142&client_secret=tislJFVM762|%[+sxgTXF79&code={code}&redirect_url={HttpUtility.UrlEncode(Request.Url.GetLeftPart(UriPartial.Path))}&grant_type=authorization_code"
        /// </summary>
        /// <param name="code">
        ///     Authentication Code from Microsoft, if authentication succeeded and access was granted by the user
        /// </param>
        /// <param name="error">
        ///     Some error code if the authentication failed or access was not granted
        /// </param>
        /// <param name="error_description">
        ///     Description of the above
        /// </param>
        /// <returns></returns>
        public ActionResult Index(string code, string error, string error_description)
        {
            ///// OAQABAAIAAABHh4kmS_aKT5XrjzxRAtHzwCHNkVobB_qXhiNgnvwBhBiirG9dMoyy0SIss9SjOU20ZrzO80MMC6kFvCWUTwxePvtId0-ooGR857a6rTqFf9aS45-OHORSFj7vDG45arOROQ-UXfK1gKdUfBYob7VwvvfGaOWWZb01wyB-AOpr4FxOrY5YSqJ6WsQ0jopVwgerTGQbwf0r_E0fjGV1HNY9zWwQbzs_HH6F6kSS13K8xI-xWlrDFiF_IZWgwJE71ifnWZFDQSNYoCPINir_CWPDErVaq8LRhgsqyLBFTSXfAPKxcqVU-9PqO4Vd3SDEiDQhfL6Yb1-bnc_UcZn0ByO-SGsR6DvLNsdKnyvRYSj_NHY7owzu_dfngQZe6RVsJDFiEw8UObVoCdp8uL6TAaH3id9nqFNPMw5Wjtsujm3qqMnZtl7RVA3SKQo-pWPq4xQaJATZnvU8iwntufFX7R3rcwKdIK44kWYzJuRF9JTRtY37VueZT7Gm_gQ6q7uLpSIJy_qExwcVz6wbo235aC0a_B3rt-wHwthwCInNqmMg33Ut5B4S-2vlOcb8Pjfan5KNWKwHWSFrn-DC5APFWaVgAehvystjBVqziXzMGUwFrLqqGZtWmKm_GtUJIf-TJd8gAA
            // This should be wrapped in a try / catch, and inform the user if any part of the auth process failed.
            // Then... their interactions e.g. creating a visit, etc, will not engage with Outlook. Argh.
            //
            // Right, this now functions correctly and returns me an OAuth Token. Great.
            // Wrong direction to go in though, as this should definitely be known throughout the application. Re-re-read this:
            // 
            // https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols-implicit
            //
            // and implement a self-contained client model which can handle the authentication with AD.
            if (!String.IsNullOrEmpty(code))
            {
                try
                {
                    var redirectUrl = HttpUtility.UrlEncode(Request.Url.GetLeftPart(UriPartial.Path));
                    var clientSecret = HttpUtility.UrlEncode("tislJFVM762|%[+sxgTXF79");
                    var tokenRequestUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
                    var tokenRequestParams = $"client_id=13c231f3-3e1a-4caa-9633-3fd653af3142&client_secret={clientSecret}&code={code}&redirect_uri={redirectUrl}&grant_type=authorization_code";

                    using (System.Net.WebClient wc = new System.Net.WebClient())
                    {
                        wc.Headers["Content-Type"] = "application/x-www-form-urlencoded";
                        wc.Encoding = System.Text.Encoding.UTF8;
                        var response = wc.UploadString(tokenRequestUrl, tokenRequestParams);

                        var result = Newtonsoft.Json.JsonConvert.DeserializeObject<MicrosoftOnlineOAuth2Response>(response);

                        ViewBag.MicrosoftOAuthToken = result.access_token;
                    }
                }
                catch(Exception e)
                {
                    ViewBag.Exception = e;
                }
            }

            var application = PortalDb.Applications.Where(p => p.ControllerName == "visit" && p.AreaName == "customers" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());
            
            if (Session["selectedTradeAccountId"] == null)
            {
                Session["selectedTradeAccountId"] = user.TradeAccountID;
            }

            var model = new CustomerVisitViewModel(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading,
                user.DefaultTradeAccount?.TradeAccountGroupID,
                Session["selectedTradeAccountId"] as int?);

            return View("CustomerVisit", model);
        }

        [HttpPost]
        public ActionResult SaveVisit(SaveVisitModel objVisit)
        {
            if (ModelState.IsValid)
            {
                var extant = PortalDb.TradeAccountVisits.Where(p => p.TradeAccountVisitID == objVisit.TradeAccountVisitID).SingleOrDefault();

                if (extant == null)
                {
                    var visit = PortalDb.TradeAccountVisits.Add(new TradeAccountVisit() {
                        TradeAccountID = objVisit.TradeAccountID,
                        Notes = objVisit.Notes,
                        VisitDT = objVisit.VisitDT
                    });

                    PortalDb.SaveChanges();

                    foreach (var i in objVisit.Attendees)
                    {
                        PortalDb.TradeAccountVisit_TradeAccountContacts.Add(new TradeAccountVisit_TradeAccountContact() { TradeAccountContactID = i.TradeAccountContactID, TradeAccountVisitID = visit.TradeAccountVisitID });
                    }

                    PortalDb.SaveChanges();
                }
                else
                {
                    extant.VisitDT = objVisit.VisitDT;
                    extant.Notes = objVisit.Notes;

                    var attendees = PortalDb.TradeAccountVisit_TradeAccountContacts.Where(p => p.TradeAccountVisitID == objVisit.TradeAccountVisitID).ToList();

                    PortalDb.TradeAccountVisit_TradeAccountContacts.RemoveRange(attendees);

                    foreach (var i in objVisit.Attendees)
                    {
                        PortalDb.TradeAccountVisit_TradeAccountContacts.Add(new TradeAccountVisit_TradeAccountContact() { TradeAccountContactID = i.TradeAccountContactID, TradeAccountVisitID = objVisit.TradeAccountVisitID.Value });
                    }

                    PortalDb.SaveChanges();
                }

                return Json(new { success = true }, JsonRequestBehavior.DenyGet);
            }
            else
            {
                return Json(PortalFramework.ConvertModelStateErrorsToJSON(ModelState), JsonRequestBehavior.DenyGet);
            }
        }
    }
}