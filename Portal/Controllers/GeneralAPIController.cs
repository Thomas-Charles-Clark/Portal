using DocumentFormat.OpenXml.Spreadsheet;

using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

using Microsoft.AspNet.Identity;

using Newtonsoft.Json;

using Portal.Utilities;
using Portal.Utilities.InMemoryMultipartFormDataStreamProvider;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Utilities;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;

using Framework = Portal.Utilities.Framework;

namespace Portal.Controllers
{
    public class GeneralAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public GeneralAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpPost]
        public IHttpActionResult LogClientError([FromBody]PassClientError objError)
        {
            var userId = User.Identity.GetUserId<int>();

            if (objError?.message?.StartsWith("QuotaExceededError") == true)
            {
                return Ok(new { });
            }

            PortalDb.SaveErrorToLog(
                userId,
                "Client-Side Error",
                objError?.message,
                objError?.source,
                objError?.message,
                $"Line No. {objError?.lineno}",
                $"Column No. {objError?.colno}",
                null,
                null,
                objError?.url,
                Framework.GetUserAgent(),
                Framework.GetIPAddress());

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult AutocompleteExample([FromBody]PassAutocomplete objTerm)
        {
            var results = PortalDb.TradeAccounts
                .Where(p => p.Code.StartsWith(objTerm.term) || p.Name.StartsWith(objTerm.term))
                .OrderByDescending(p => p.Code)
                .Skip(0)
                .Take(20)
                .ToList()
                .Select(p => (p.TradeAccountID, $"{p.Label}"))
                .ToList();

            return Ok(results);
        }

        [HttpGet]
        public async Task<IHttpActionResult> TestHMRCVATChecker()
        {
            var tokenPostData = new List<KeyValuePair<string, string>>()
            {
                new KeyValuePair<string, string>("grant_type", "client_credentials"),
                new KeyValuePair<string, string>("client_secret", SharedEFClasses.Utilities.Framework.HMRCDeveloperHubCheckGBVATNoClientSecret),
                new KeyValuePair<string, string>("client_id", SharedEFClasses.Utilities.Framework.HMRCDeveloperHubCheckGBVATNoClientID)
            };

            var objVATNumber = new PassVATNumber();

            objVATNumber.vatNumber = "553557881";

            var country = PortalDb.Countries.Where(p => p.Code == "GB").Single();

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Clear();

                var tokenBody = new FormUrlEncodedContent(tokenPostData);

                tokenBody.Headers.ContentType.MediaType = "application/x-www-form-urlencoded";

                var tokenResponse = await client.PostAsync($"{SharedEFClasses.Utilities.Framework.HMRCDeveloperHubSandboxBaseURL}/oauth/token", tokenBody);

                if (tokenResponse.IsSuccessStatusCode)
                {
                    var token = JsonConvert.DeserializeObject<HMRCTokenResponse>(await tokenResponse.Content.ReadAsStringAsync());

                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.hmrc.1.0+json"));

                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.access_token);

                    client.DefaultRequestHeaders.Add("scope", "read:vat");

                    var vatResponse = await client.GetAsync($"{SharedEFClasses.Utilities.Framework.HMRCDeveloperHubSandboxBaseURL}/organisations/vat/check-vat-number/lookup/{objVATNumber.vatNumber}");

                    if (vatResponse.IsSuccessStatusCode)
                    {
                        var vatCheckResult = JsonConvert.DeserializeObject<HMRCVATCheckResult>(await vatResponse.Content.ReadAsStringAsync());

                        return Ok(new { Body = new { valid = true, traderName = vatCheckResult.Target.Name }, countryName = country.Name });
                    }
                    else
                    {
                        return Ok(new { Body = new { valid = false }, countryName = country.Name, responseMessage = await vatResponse.Content.ReadAsStringAsync() });
                    }
                }
                else
                {
                    return Ok(new { Body = new { valid = false }, countryName = country.Name, responseMessage = await tokenResponse.Content.ReadAsStringAsync() });
                }
            }
        }


        [HttpPost]
        public async Task<IHttpActionResult> PostFileForm()
        {
            // Check if the request contains multipart/form-data.  
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            var provider = await Request.Content.ReadAsMultipartAsync<InMemoryMultipartFormDataStreamProvider>(new InMemoryMultipartFormDataStreamProvider());
            
            //access form data  
            NameValueCollection formData = provider.FormData;
            //access files  
            IList<HttpContent> files = provider.Files;

            HttpContent file1 = files[0];

            var fileName = file1.Headers.ContentDisposition.FileName.Trim('\"');

            var fullFilePath = $"{formData["destination"]}\\{fileName}";
                
            System.IO.File.WriteAllBytes(fullFilePath, await file1.ReadAsByteArrayAsync());

            return Ok(new
            {
                Success = true,
                Result = $"https://www.designersguild.com/_assets/product-maintenance/files/{fileName}"
            });
        }


        [HttpGet]
        public async Task<DataSourceResult> FetchDataList(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassListEnquiry objEnquiry)
        {
            var assembly = PortalFramework.GetAssembly("SharedEFClasses");

            var classList = assembly.GetTypes()
                .Where(ty => ty.IsDefined(typeof(ClassIdentifierAttribute), false))
                .ToList();

            var t = classList.SingleOrDefault(cl => cl.GetCustomAttributesData().SingleOrDefault(p => p.AttributeType == typeof(ClassIdentifierAttribute) &&
                (string)p.ConstructorArguments[0].Value == objEnquiry.ReferenceDataSetDecrypted) != null);

            if (t != null)
            {
                var results = PortalDb.FetchDataList(t, objEnquiry);

                return results.AsQueryable().ToDataSourceResult(request);
            }
            else
            {
                var results = await PortalDb.FetchDataList(objEnquiry);

                return results.AsQueryable().ToDataSourceResult(request);
            }
        }

        [HttpGet]
        public IHttpActionResult CreateDataItem(
            [FromBody]PassDataItemCreation objEnquiry)
        {
            var assembly = PortalFramework.GetAssembly("SharedEFClasses");

            var classList = assembly.GetTypes()
                .Where(ty => ty.IsDefined(typeof(ClassIdentifierAttribute), false))
                .ToList();

            var t = classList.SingleOrDefault(cl => cl.GetCustomAttributesData().SingleOrDefault(p => p.AttributeType == typeof(ClassIdentifierAttribute) &&
                (string)p.ConstructorArguments[0].Value == objEnquiry.ReferenceDataSetDecrypted) != null);

            //if (t != null)
            //{
            //    var results = PortalDb.FetchDataList(t, objEnquiry);

            //    return results.AsQueryable().ToDataSourceResult(request);
            //}
            //else
            //{
            //    var results = await PortalDb.FetchDataList(objEnquiry);

            //    return results.AsQueryable().ToDataSourceResult(request);
            //}

            return Ok(new { });
        }

        [HttpGet]
        public IHttpActionResult FetchDataItems(
            [FromUri] PassDataItemsEnquiry objEnquiry)
        {
            var results = PortalDb.FetchDataItems(objEnquiry);

            return Ok(results);
        }
    }
}
