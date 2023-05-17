using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using Portal.Models;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.MertexLive;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Portal.Areas.Sales.Controllers
{
	public class PassOrderHeadLiveEmailer
    {
		public string OrderID { get; set; }
		public string body { get; set; }
		public string subject { get; set; }
		public string replyTo { get; set; }
		public string email { get; set; }
	}

    public class OrderTrackingController : ApiController
    {
        private PortalDbContext portalDb { get; set; }
        private ApplicationUserManager userManager { get; set; }

        public OrderTrackingController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.portalDb = portalDbContext;
            this.userManager = userManager;
        }


        [HttpPost]
        public IHttpActionResult OrderSearch([FromBody]PassAutocompleteTerm objSearch)
        {
            //var result = MertexerV2DAL.OrderTrackingSearch(objSearch);

            var order = portalDb.OrderHeads_Live.Where(p => p.OrderID == objSearch.searchTerm).SingleOrDefault();

			if (order == null)
            {
				return Ok(new
				{
					searchResults = portalDb.OrderHeads_Live.Where(p => p.CustomerOrderReference.StartsWith(objSearch.searchTerm))
						.Select(p => new
						{
							p.OrderID,
							p.TradeAccountCode,
							p.CustomerOrderReference,
							p.CreatedDT
						})
						.OrderBy(p => p.OrderID)
						.Skip(0)
						.Take(10)
						.ToList()
				});
            }

            return Ok(new 
			{
				order
			});
        }

		[HttpPost]
		public async Task<IHttpActionResult> EmailTrackingInfo([FromBody]PassOrderHeadLiveEmailer objIncoming)
		{
            var resourceStore = new ResourceFetcher();

            var objOrder = portalDb.OrderHeads_Live.Where(p => p.OrderID == objIncoming.OrderID).Single();

            var resources = await resourceStore.loadResources(objOrder.TradeAccount.LanguageID ?? 1);

            int spacerId = 0;

            var inkyMarkup = $@"<container class=""blue-white"">
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
	<row>
		<columns small=""3"" large=""2"">
			<p class=""text-bold text-right"">
				<strong>{objOrder.TradeAccount.Code}</strong>
			</p>
		</columns>
		<columns small=""9"" large=""10"">
			<p>
				{objOrder.TradeAccount.Name}
			</p>
		</columns>
	</row>
	<row>
		<columns small=""3"" large=""2"">
			<p class=""text-bold text-right"">
				<strong>{resources["Order"]}</strong>
			</p>
		</columns>
		<columns small=""9"" large=""10"">
			<p>
				{objOrder.OrderID}
			</p>
		</columns>
	</row>
	<div class=""show-for-large"">
		<row>
			<columns small=""3"" large=""2"">
				<p class=""text-bold text-right"">
					<strong>{resources["Reference"]}</strong>
				</p>
			</columns>
			<columns small=""9"" large=""10"">
				<p>
					{objOrder.CustomerOrderReference}
				</p>
			</columns>
		</row>
	</div>
	<div class=""hide-for-large"">
		<row>
			<columns small=""3"" large=""2"">
				<p class=""text-bold text-right"">
					<strong>{resources["Ref"]}</strong>
				</p>
			</columns>
			<columns small=""9"" large=""10"">
				<p>
					{objOrder.CustomerOrderReference ?? resources["NotProvided"]}
				</p>
			</columns>
		</row>
	</div>
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
</container>
<container>
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
</container>
<container class=""blue-white"">
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
	<row>
		<columns small=""3"" large=""2"">
			<p class=""text-bold text-right"">
				<strong>{resources["ToCapitalised"]}:</strong>
			</p>
		</columns>
		<columns small=""8"" large=""10"">
			<p>
				{objOrder.DeliveryAddress.Replace(System.Environment.NewLine, ", ").Replace(",,", ",")}
			</p>
		</columns>
	</row>
	<row>
		<columns small=""3"" large=""2"">
			<p class=""text-bold text-right"">
				<strong>{resources["via"]}:</strong>
			</p>
		</columns>
		<columns small=""8"" large=""10"">
			<p>
				{objOrder.HaulierCode} - {objOrder.CarriageCode} - {objOrder.Carriage?.Description}
			</p>
		</columns>
	</row>
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
</container>
<container>
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
</container>";

            if (!objOrder.DespatchHeads.Any())
            {
                inkyMarkup += $@"<container class=""red-white"">
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
	<row>
		<columns small=""12"">
			<p>
				{resources["ThisOrderNotYetDespatched"]}
			</p>
		</columns>
	</row>
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
</container>
<container>
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
</container>";
            }

            if (!String.IsNullOrEmpty(objIncoming.body))
            {
                inkyMarkup += $@"
<container>
	<row>
		<columns small=""12"">
			<callout class=""primary"">
				<p class=""text-bold"">
					{resources["OperatorMessage"]}
				</p>
				<spacer id=""spacer-{++spacerId}"" size=""5""></spacer>
				<p>
					{objIncoming.body.Replace("\n", "<br>")}
				</p>
			</callout>
		</columns>
	</row>
	<row>
		<columns small=""12"">
			<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
		</columns>
	</row>
</container>
<container>
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
</container>";
            }

            if (!objOrder.DespatchHeads.Any())
            {
                inkyMarkup += $@"
<container>
	<div class=""show-for-large"">
		<row>
			<columns large=""2"">
				<p class=""text-bold text-right"">
					<strong>{resources["Order Line"]}</strong>
				</p>
			</columns>
			<columns large=""4"">
				<p class=""text-bold"">
					<strong>{resources["Product"]}</strong>
				</p>
			</columns>
			<columns large=""3"">
				<p class=""text-bold"">
					<strong>{resources["Order Quantity"]}</strong>
				</p>
			</columns>
			<columns large=""3"">
				<p class=""text-bold"">
					<strong>{resources["EstimatedDespatchDate"]}</strong>
				</p>
			</columns>
		</row>
{String.Join(System.Environment.NewLine, objOrder.OrderLines.Select((orderLine) => { return $@"
		<spacer id=""spacer-{++spacerId}"" size=""5""></spacer>
		<row>
			<columns large=""2"">
				<p class=""text-right"">
					{orderLine.LineNumber}
				</p>
			</columns>
			<columns large=""4"">
				<p>
					{orderLine.ProductCode} - {orderLine.ProductDescription}
				</p>
			</columns>
			<columns large=""3"">
				<p>
					{orderLine.QuantityOrdered} {orderLine.Product?.StockUnit?.Units}
				</p>
			</columns>
			<columns large=""3"">
				<p>
					{(orderLine.EstimatedDespatchedDate ?? resources["Unknown"])}
				</p>
			</columns>
		</row>"; }))}
	</div>
	<div class=""hide-for-large"">
		<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
		<row>
			<columns small=""2"">
				<p class=""text-bold text-right"">
					<strong>{resources["Line"]}</strong>
				</p>
			</columns>
			<columns small=""4"">
				<p class=""text-bold"">
					<strong>{resources["Product"]}</strong>
				</p>
			</columns>
			<columns small=""3"">
				<p class=""text-bold"">
					<strong>{resources["Order Qty"]}</strong>
				</p>
			</columns>
			<columns small=""3"">
				<p class=""text-bold"">
					<strong>{resources["DespatchDateEst"]}</strong>
				</p>
			</columns>
		</row>
{String.Join(System.Environment.NewLine, objOrder.OrderLines.Select((orderLine) => { return $@"
		<spacer id=""spacer-{++spacerId}"" size=""5""></spacer>
		<row>
			<columns small=""2"">
				<p class=""text-right"">
					{orderLine.LineNumber}
				</p>
			</columns>
			<columns small=""4"">
				<p>
					{orderLine.ProductCode}
				</p>
			</columns>
			<columns small=""3"">
				<p>
					{orderLine.QuantityOrdered} {orderLine.Product?.StockUnit?.Units}
				</p>
			</columns>
			<columns small=""3"">
				<p>
					{(orderLine.EstimatedDespatchedDate ?? resources["Unknown"])}
				</p>
			</columns>
		</row>
		<row>
			<columns small=""10"" class=""small-offset-2"">
				<p>
					{orderLine.ProductDescription}
				 </p>
			</columns>
		</row>"; }))}
	</div>
</container>";
            }

            if (objOrder.DespatchHeads.Where(p => p.DespatchedDT.HasValue).Any())
            {
                inkyMarkup += $@"
<container>
	<row>
		<columns>
			<p>
				{resources["PleaseFindAllTracking"]}.
			</p>
		</columns>
	</row>
</container>
<container>
	<spacer id=""spacer-{++spacerId}"" size=""30""></spacer>
</container>";

                if (objOrder.DespatchHeads.Where(p => p.DespatchedDT.HasValue).Any())
                {
                    inkyMarkup += $@"
<container>
	<div class=""show-for-large"">
{String.Join(System.Environment.NewLine, objOrder.DespatchHeads.Where(p => p.DespatchedDT.HasValue).SelectMany(p => p.ParcelHeads).ToList().Select((parcel, i) =>
                    {
                        return $@"
		<row>
			<columns large=""2"">
				<p class=""text-bold text-right"">
					<strong>{resources["Parcel"]}</strong>
				</p>
			</columns>
			<columns large=""2"">
				<p class=""text-bold"">
					<strong>{resources["Despatched"]}</strong>
				</p>
			</columns>
			<columns large=""8"">
				<p class=""text-bold""></p>
			</columns>
		</row>
		<row>
			<columns large=""2"">
				<p class=""text-right"">
					{i + 1}
				</p>
			</columns>
			<columns large=""2"">
				<p>
					{parcel.DespatchHead.DespatchedDate}
				</p>
			</columns>
			<columns large=""8"">
				<p style=""word-break:break-all;"">
					{(String.IsNullOrEmpty(parcel.TrackingURL) ? resources["No Tracking URL was found"] :
$@"<a href=""{parcel.TrackingURL}"">
						{parcel.TrackingURL}
					</a>")}
				</p>
			</columns>
		</row>
		<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
		<row>
			<columns large=""2"">
				<p class=""text-bold text-right"">
					<strong>{resources["Order Line"]}</strong>
				</p>
			</columns>
			<columns large=""4"">
				<p class=""text-bold"">
					<strong>{resources["Product"]}</strong>
				</p>
			</columns>
			<columns large=""3"">
				<p class=""text-bold"">
					<strong>{resources["Order Quantity"]}</strong>
				</p>
			</columns>
			<columns large=""3"">
				<p class=""text-bold"">
					<strong>{resources["Quantity in Parcel"]}</strong>
				</p>
			</columns>
		</row>
	{(String.Join(System.Environment.NewLine, parcel.ParcelLines.OrderBy(l => l.ParcelLineNumber).Select(line => { return $@"
		<spacer id=""spacer-{++spacerId}"" size=""5""></spacer>
		<row>
			<columns large=""2"">
				<p class=""text-right"">
					{line.ParcelLineNumber}
				</p>
			</columns>
			<columns large=""4"">
				<p>
					{line.ProductCode} - {line.Product?.BasketName}
				</p>
			</columns>
			<columns large=""3"">
				<p>
					{line.QuantityInvoiced} {line.Product?.StockUnit?.Units}
				</p>
			</columns>
			<columns large=""3"">
				<p>
					{line.QuantityDespatched} {line.Product?.StockUnit?.Units}
				</p>
			</columns>
		</row>"; })))}
		<spacer id=""spacer-{++spacerId}"" size=""40""></spacer>";
                    }))}
	</div>
	<spacer id=""spacer-{++spacerId}"" size=""30""></spacer>
	<div class=""hide-for-large"">
{String.Join(System.Environment.NewLine, objOrder.DespatchHeads.Where(p => p.DespatchedDT.HasValue).SelectMany(p => p.ParcelHeads).ToList().Select((parcel, i) =>
                    {
                        return $@"
		<row>
			<columns small=""3"">
				<p class=""text-bold text-right"">
					<strong>{resources["Parcel"]}</strong>
				</p>
			</columns>
			<columns small=""9"">
				<p>
					{i + 1}
				</p>
			</columns>
		</row>
		<row>
			<columns small=""3"">
				<p class=""text-bold text-right"">
					<strong>{resources["Sent"]}</strong>
				</p>
			</columns>
			<columns small=""9"">
				<p>
					{parcel.DespatchHead.DespatchedDate}
				</p>
			</columns>
		</row>
		<row>
			<columns small=""3"">
				<p class=""text-bold text-right"">
					<strong>{resources["Track"]}</strong>
				</p>
			</columns>
			<columns small=""9"">
				<p style=""word-break:break-all;"">
					{(String.IsNullOrEmpty(parcel.TrackingURL) ? resources["No Tracking URL was found"] : $@"<a href=""{parcel.TrackingURL}"">{parcel.TrackingURL}</a>")}
				</p>
			</columns>
		</row>
		<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
		<row>
			<columns small=""2"">
				<p class=""text-bold text-right"">
					<strong>{resources["Line"]}</strong>
				</p>
			</columns>
			<columns small=""4"">
				<p class=""text-bold"">
					<strong>{resources["Product"]}</strong>
				</p>
			</columns>
			<columns small=""3"">
				<p class=""text-bold"">
					<strong>{resources["Order Qty"]}</strong>
				</p>
			</columns>
			<columns small=""3"">
				<p class=""text-bold"">
					<strong>{resources["Parcel Qty"]}</strong>
				</p>
			</columns>
		</row>
{(String.Join(System.Environment.NewLine, parcel.ParcelLines.OrderBy(p => p.ParcelLineNumber).Select(line => { return $@"
		<spacer id=""spacer-{++spacerId}"" size=""5""></spacer>
		<row>
			<columns small=""2"">
				<p class=""text-right"">
					{line.ParcelLineNumber}
				</p>
			</columns>
			<columns small=""4"">
				<p>
					{line.ProductCode}
				</p>
			</columns>
			<columns small=""3"">
				<p>
					{line.QuantityInvoiced} {line.Product?.StockUnit?.Units}
				</p>
			</columns>
			<columns small=""3"">
				<p>
					{line.QuantityDespatched} {line.Product?.StockUnit?.Units}
				</p>
			</columns>
		</row>
		<row>
			<columns small=""10"" class=""small-offset-2"">
				<p>
					{line.Product?.BasketName}
				 </p>
			</columns>
		</row>"; })))}
		<spacer id=""spacer-{++spacerId}"" size=""30""></spacer>";
                    }))}
	</div>
</container>";
                }

                if (objOrder.DespatchHeads.Where(p => p.DespatchedDT == null).Any())
                {
                    inkyMarkup += $@"
<container>
	<spacer id=""spacer-{++spacerId}"" size=""45""></spacer>
</container>
<container class=""blue-white show-for-large"">
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
	<row class=""blue-white"">
		<columns small=""12"" large=""2"">
			<p class=""text-bold"">
				<strong>{resources["Not yet Despatched"]}</strong>
			</p>
		</columns>
	</row>
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
</container>
<container>
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
</container>
<container>
	<row>
		<columns>
			<p>
				{resources["TheFollowingItemsNotYetDespatched"]}
			</p>
		</columns>
	</row>
</container>
<container>
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
</container>
<container>
	<div class=""show-for-large"">
		<row>
			<columns large=""2"">
				<p class=""text-bold text-right"">
					<strong>{resources["Order Line"]}</strong>
				</p>
			</columns>
			<columns large=""4"">
				<p class=""text-bold"">
					<strong>{resources["Product"]}</strong>
				</p>
			</columns>
			<columns large=""3"">
				<p class=""text-bold"">
					<strong>{resources["Order Quantity"]}</strong>
				</p>
			</columns>
			<columns large=""3"">
				<p class=""text-bold"">
					<strong>{resources["Quantity in Parcel"]}</strong>
				</p>
			</columns>
		</row>
{String.Join(System.Environment.NewLine, objOrder.DespatchHeads.Where(p => p.DespatchedDT == null).SelectMany(p => p.OrderLines).ToList().Select((orderLine) => { return $@"
		<spacer id=""spacer-{++spacerId}"" size=""5""></spacer>
		<row>
			<columns large=""2"">
				<p class=""text-right"">
					{orderLine.LineNumber}
				</p>
			</columns>
			<columns large=""4"">
				<p>
					{orderLine.ProductCode} - {orderLine.ProductDescription}
				</p>
			</columns>
			<columns large=""3"">
				<p>
					{orderLine.QuantityOrdered} {orderLine.Product?.StockUnit?.Units}
				</p>
			</columns>
			<columns large=""3"">
				<p>
					{orderLine.QuantityOrdered} {orderLine.Product?.StockUnit?.Units}
				</p>
			</columns>
		</row>"; }))}
	</div>
	<div class=""hide-for-large"">
		<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
		<row>
			<columns small=""2"">
				<p class=""text-bold text-right"">
					<strong>{resources["Line"]}</strong>
				</p>
			</columns>
			<columns small=""4"">
				<p class=""text-bold"">
					<strong>{resources["Product"]}</strong>
				</p>
			</columns>
			<columns small=""3"">
				<p class=""text-bold"">
					<strong>{resources["Order Qty"]}</strong>
				</p>
			</columns>
			<columns small=""3"">
				<p class=""text-bold"">
					<strong>{resources["Parcel Qty"]}</strong>
				</p>
			</columns>
		</row>
{String.Join(System.Environment.NewLine, objOrder.DespatchHeads.Where(p => p.DespatchedDT == null).SelectMany(p => p.OrderLines).ToList().Select((orderLine) => { return $@"
		<spacer id=""spacer-{++spacerId}"" size=""5""></spacer>
		<row>
			<columns small=""2"">
				<p class=""text-right"">
					{orderLine.LineNumber}
				</p>
			</columns>
			<columns small=""4"">
				<p>
					{orderLine.ProductCode}
				</p>
			</columns>
			<columns small=""3"">
				<p>
					{orderLine.QuantityOrdered} {orderLine.Product?.StockUnit?.Units}
				</p>
			</columns>
			<columns small=""3"">
				<p>
					{orderLine.QuantityOrdered} {orderLine.Product?.StockUnit?.Units}
				</p>
			</columns>
		</row>
		<row>
			<columns small=""10"" class=""small-offset-2"">
				<p>
					{orderLine.Product?.BasketName}
				 </p>
			</columns>
		</row>"; }))}
	</div>
</container>";
                }
            }

            inkyMarkup += $@"
<container>
	<spacer id=""spacer-{++spacerId}"" size=""45""></spacer>
</container>
<container class=""blue-white"">
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
	<row>
		<columns>
			<center>
				<a href=""https://www.designersguild.com"" target=""_blank"">
					<strong class=""center-text large-text"">
						{resources["Thank you for ordering from"]} <span class=""no-wrap"">Designers Guild</span>
					</span>
				</a>
			</center>
		</columns>
	</row>
	<spacer id=""spacer-{++spacerId}"" size=""15""></spacer>
</container>
<spacer id=""spacer-{++spacerId}"" size=""16""></spacer>";

            var emailTo = objIncoming.email;

#if DEBUG
            System.Diagnostics.Debug.WriteLine("\r\n\r\n\r\n");
            System.Diagnostics.Debug.WriteLine(inkyMarkup);
            System.Diagnostics.Debug.WriteLine("\r\n\r\n\r\n");
#endif

            var replyTo = objIncoming.replyTo;

            try
            {
                using (var client = new HttpClient())
                {
                    var content = new StringContent(inkyMarkup);

                    var inkyResult = await client.PostAsync("http://vm-web1:8090/inkyUpdated/inkyUpdated.js", content);

                    if (inkyResult.StatusCode != HttpStatusCode.OK)
                    {
                        throw new Exception(await inkyResult.Content.ReadAsStringAsync());
                    }
                    else
                    {
                        inkyMarkup = await inkyResult.Content.ReadAsStringAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

#pragma warning disable 1998 // Async method lacks 'await' operators and will run synchronously
#pragma warning disable 4014 // Because this call is not awaited, execution returns immediately
            System.Threading.Tasks.Task.Factory.StartNew(async () =>
            {
                var body = inkyMarkup;

                ((EmailService)userManager.EmailService).SendFoundationEmailAsync(new IdentityMessage()
                {
                    Body = body,
                    Subject = objIncoming.subject,
                    Destination = emailTo
                },
                replyTo);
            });
#pragma warning restore 4014 // Because this call is not awaited, execution returns immediately
#pragma warning restore 1998 // Async method lacks 'await' operators and will run synchronously

            return Ok(new { });
		}
	}
}
