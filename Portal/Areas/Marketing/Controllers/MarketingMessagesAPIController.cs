using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using NLog;
using Portal.Models;
using Kendo.Mvc.UI;
using System.Web.Http.ModelBinding;
using Kendo.Mvc.Extensions;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Marketing;

namespace Portal.Areas.Marketing.Controllers
{
    [Authorize]
    public class MarketingMessagesAPIController : ApiController
    {
        private static Logger Logger = LogManager.GetCurrentClassLogger();

        private PortalDbContext portalDb { get; set; }

        public MarketingMessagesAPIController(PortalDbContext portalDbContext)
        {
            portalDb = portalDbContext;
        }

        [HttpGet]
        public DataSourceResult MarketingMessagesSearch(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassMarketingMessagesSearch objSearch)
        {
            var results = portalDb.MarketingMessagesSearch(objSearch);

            return results.Results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public IHttpActionResult LoadMarketingMessage([FromUri]PassMarketingMessageID objLoad)
        {
            var result = portalDb.MarketingMessages.Where(p => 
                p.Deleted == false &&
                p.MarketingMessageID == objLoad.MarketingMessageID
            ).SingleOrDefault();

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult SaveMarketingMessage([FromBody]PassMarketingMessage objMessage)
        {
            try
            {
                if (objMessage.MarketingMessageID.HasValue)
                {
                    var message = portalDb.MarketingMessages.Where(p => p.MarketingMessageID == objMessage.MarketingMessageID).Single();

                    message.Name = objMessage.Name;
                    message.Message = objMessage.Message;

                    portalDb.SaveChanges();
                }
                else
                {
                    portalDb.MarketingMessages.Add(new MarketingMessage()
                    {
                        Name = objMessage.Name,
                        Message = objMessage.Message
                    });

                    portalDb.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                var response = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(ex.ToString())
                };

                return ResponseMessage(response);
            }

            return Ok(new { });
        }
    }
}
