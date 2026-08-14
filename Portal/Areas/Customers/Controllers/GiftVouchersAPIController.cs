using Kendo.Mvc.UI;

using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Kendo.Mvc.Extensions;

using System.Data.Entity;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.IO;
using SharedEFClasses.Models.ContractPricing;
using Portal.Utilities.DynamicRoles;
using System.Collections;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using System.Dynamic;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using Portal.Areas.Products.Models;
using Portal.Areas.Customers.Models;
using System.Web.UI;
using SharedEFClasses.Models.Documents;
using SharedEFClasses.Utilities;
using DocumentFormat.OpenXml.Office2010.Excel;
using System.Data.SqlTypes;
using SharedEFClasses.Models.General;
using System.Text.Encodings.Web;
using System.Web;

namespace Portal.Areas.Customers.Controllers
{
    [DynamicRoleAuthorize]
    public class GiftVouchersAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private ApplicationUserManager UserManager { get; set; }

        public GiftVouchersAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.PortalDb = portalDbContext;
            this.UserManager = userManager;
        }

        [HttpGet]
        public DataSourceResult FetchGiftVouchers(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            return PortalDb.GiftVouchers
                //.Include(gv => gv.GiftVoucherType)
                //.Include(gv => gv.CreatedByMember)
                //.Include(gv => gv.PriceList)
                //.Include(gv => gv.PriceList.Currency)
                .AsQueryable().ToDataSourceResult(request);
        }

        [HttpPost]
#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
        public async Task<IHttpActionResult> Autocomplete([FromBody] PassAutocomplete objAutocomplete)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
        {
            var results = PortalDb.GiftVouchers
                .Where(gv => gv.Code.StartsWith(objAutocomplete.term))
                //.Include(gv => gv.GiftVoucherType)
                //.Include(gv => gv.CreatedByMember)
                //.Include(gv => gv.PriceList)
                //.Include(gv => gv.PriceList.Currency)
                .AsQueryable<GiftVoucher>();

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> GiftVoucherSelect([FromBody] PassGiftVoucher dto)
        {
            var result = await PortalDb.GiftVoucher_Select(dto);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IHttpActionResult> Create([FromBody] PassGiftVoucherCreation dto)
        {
            var now = DateTime.Now;

            var price = PortalDb.Prices.Where(p => p.ProductID == dto.ProductID && p.PriceListID == dto.PriceListID).SingleOrDefault();

            var gv = new GiftVoucher()
            {
                CreatorUserID = "Portal: Check CreatorMemberID",
                CreatorMemberID = User.Identity.GetUserId<int>(),
                AuthorisedDT = now,
                CreatedDT = now,
                Code = dto.GUID,
                CreditOrderID = dto.CreditOrderID,
                ExpiryDT = now.AddYears(1),
                GiftVoucherTypeID = dto.GiftVoucherTypeID,
                PriceListID = dto.PriceListID,
                ValueEx = price.PriceInc,
                ValueInc = price.PriceEx,
                Reason = dto.Notes,
                Message = dto.Message
            };

            PortalDb.GiftVouchers.Add(gv);

            await PortalDb.SaveChangesAsync();
            
            return Ok(gv);
        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveNotes([FromBody] PassGiftVoucherRedeem dto)
        {
            var voucher = PortalDb.GiftVouchers.SingleOrDefault(gv => gv.GiftVoucherID == dto.GiftVoucherID);

            var now = DateTime.Now;

            if (voucher != null)
            {
                voucher.RedeemOrderID = dto.OrderID;

                voucher.Reason = dto.Notes;

                await PortalDb.SaveChangesAsync();
            }

            return Ok(new { });
        }


        [HttpPost]
        public async Task<IHttpActionResult> Redeem([FromBody] PassGiftVoucherRedeem dto)
        {
            var voucher = PortalDb.GiftVouchers.SingleOrDefault(gv => gv.GiftVoucherID == dto.GiftVoucherID);

            var now = DateTime.Now;

            if (voucher != null)
            {
                voucher.RedeemOrderID = dto.OrderID;

                voucher.Reason = dto.Notes;

                voucher.UsedDT = now;

                voucher.RedeemedByMemberID = User.Identity.GetUserId<int>();

                await PortalDb.SaveChangesAsync();
            }

            return Ok(new { usedDt = now });
        }

        [HttpPost]
        public async Task<IHttpActionResult> Extend([FromBody] PassGiftVoucherExtend dto)
        {
            var voucher = PortalDb.GiftVouchers.SingleOrDefault(gv => gv.GiftVoucherID == dto.GiftVoucherID);

            if (voucher != null)
            {
                voucher.Reason = dto.Notes;

                voucher.ExpiryDT = dto.ExpiryDT;

                await PortalDb.SaveChangesAsync();
            }

            return Ok(new { });
        }

        [HttpPost]
        public async Task<IHttpActionResult> Cancel([FromBody] PassGiftVoucherCancellation dto)
        {
            var voucher = PortalDb.GiftVouchers.SingleOrDefault(gv => gv.GiftVoucherID == dto.GiftVoucherID);

            if (voucher != null)
            {
                voucher.CancelledDT = DateTime.Now;

                voucher.Reason = dto.Notes;

                await PortalDb.SaveChangesAsync();
            }

            return Ok(new { });
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchGiftVoucherPreview([FromBody] PassGiftVoucherPreview dto)
        {
            var price = PortalDb.Prices.Where(p => p.ProductID == dto.ProductID && p.PriceListID == dto.PriceListID).SingleOrDefault();

            var gc = await PortalDb.GiftVoucher_Select(new PassGiftVoucher() { Code = dto.Code });

            var stream = Utilities.Documents.GiftVoucher.GiftVoucherPDFWriter.Generate(System.Web.Hosting.HostingEnvironment.MapPath("~"), gc);

            var bytes = stream.ToArray();

            var base64 = Convert.ToBase64String(bytes, Base64FormattingOptions.None);

            return Ok(new { base64string = $"data:application/pdf;base64,{base64}" });
        }

        [HttpPost]
        public async Task<IHttpActionResult> SendGiftVoucher([FromBody] PassGiftVoucherSend dto)
        {
            var inkyMarkup = $@"
            <style type=""text/css"">
                {PortalFramework.FoundationEmailCSS}
            </style>
            <meta name=""x-apple-disable-message-reformatting""/>
            <container>
	            <row>
		            <columns>
			            <p class=""text-left"" style=""margin-top: 0"">
				            {System.Text.RegularExpressions.Regex.Replace(dto.Body, "\n", "<br/>")}
			            </p>
		            </columns>
	            </row>
                <spacer size=""15""></spacer>
            </container>
            ";

            var gv = await PortalDb.GiftVoucher_Select(new PassGiftVoucher() { Code = dto.GiftVoucherCode });

            var stream = Utilities.Documents.GiftVoucher.GiftVoucherPDFWriter.Generate(System.Web.Hosting.HostingEnvironment.MapPath("~"), gv);

            var emailTo = dto.To;

            var replyTo = dto.ReplyTo;

            using (var client = new HttpClient())
            {
                var content = new StringContent(inkyMarkup);

                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

                var inkyResult = await client.PostAsync($"{PortalFramework.InkyEndpoint}?header={HttpUtility.UrlEncode("https://www.designersguild.com/_assets/trade/invite/header-plain.jpg")}", content);

                inkyMarkup = await inkyResult.Content.ReadAsStringAsync();
            }

            var body = inkyMarkup;

            var attachments = new Dictionary<string, MemoryStream>();

            var attachmentStream = new MemoryStream();

            attachmentStream.Write(stream.GetBuffer(), 0, stream.GetBuffer().Length);

            attachmentStream.Position = 0;

            attachments.Add($"Designers Guild Gift Voucher.pdf", attachmentStream);

            var memberId = User.Identity.GetUserId<int>();

#pragma warning disable 4014
            System.Threading.Tasks.Task.Factory.StartNew(() =>
            {
                ((EmailService)UserManager.EmailService).SendFoundationEmailWithAttachmentsAsync(new IdentityMessage()
                {
                    Body = body,
                    Subject = dto.Subject,
                    Destination = emailTo
                },
                attachments,
                replyTo);
            });
#pragma warning restore 4014

            return Ok(new { });
        }
    }
}
