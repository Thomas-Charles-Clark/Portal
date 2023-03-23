using DocumentFormat.OpenXml.Spreadsheet;

using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

using MertexerV2SQL.Models.Misc;

using Microsoft.AspNet.Identity;

using Portal.Utilities;
using Portal.Utilities.InMemoryMultipartFormDataStreamProvider;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Utilities;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;

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
        public IHttpActionResult FetchDataItems(
            [FromUri] PassDataItemsEnquiry objEnquiry)
        {
            var results = PortalDb.FetchDataItems(objEnquiry);

            return Ok(results);
        }
    }
}
