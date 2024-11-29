using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using System.Threading.Tasks;
using System.Web.Http.ModelBinding;
using SharedEFClasses.Models.Orders;
using Portal.Areas.Marylebone.Models;
using SharedEFClasses.Models.Marylebone;

namespace Portal.Areas.Marylebone.Controllers
{
    [System.Web.Http.Authorize]
    public class MarylebonePackingAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public MarylebonePackingAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpGet]
        public IHttpActionResult FetchBoxes([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            PortalDb.Configuration.LazyLoadingEnabled = false;

            var boxes = PortalDb.Boxes
                .Include(p => p.BoxedItems)
                .Include(p => p.BoxedItems.Select(b => b.Product))
                .Include(p => p.BoxedItems.Select(b => b.Product.Product_Images))
                .Include(p => p.DestinationStockLocation)
                .Where(b => b.Deleted == false)
                .ToList();

            return Ok(boxes.ToDataSourceResult(request));
        }

        [HttpPost]
        public IHttpActionResult CreateNewBox([FromBody] PassBoxIdentifier dto)
        {
            var now = DateTime.Now;

            var stockLocation = PortalDb.StockLocations.SingleOrDefault(sl => sl.Code == dto.StockLocationCode);

            if (stockLocation == null)
            {
                return BadRequest("stockLocation");
            }

            if (!String.IsNullOrEmpty(dto.BoxCode)) 
            {
                var box = PortalDb.Boxes.Add(new SharedEFClasses.Models.Marylebone.Box()
                {
                    BoxCode = dto.BoxCode,
                    DestinationStockLocationID = stockLocation.StockLocationID,
                    CreatedDT = now,
                    ModifiedDT = now,
                    BoxedItems = new List<BoxedItem>()
                });

                PortalDb.SaveChanges();

                return Ok(box);
            }

            return BadRequest();
        }


        [HttpPost]
        public IHttpActionResult DeleteBox([FromBody] PassBoxIdentifier dto)
        {
            var now = DateTime.Now;

            var box = PortalDb.Boxes.Single(b => b.BoxID == dto.BoxID);

            box.DeletedDT = DateTime.Now;

            PortalDb.SaveChanges();

            return Ok(box);
        }

        [HttpPost]
        public IHttpActionResult SetBoxDestinationStockLocation([FromBody] PassBoxDestination dto)
        {
            var now = DateTime.Now;

            var box = PortalDb.Boxes.Single(b => b.BoxID == dto.BoxID);

            var stockLocation = PortalDb.StockLocations.Single(s => s.Code == dto.DestinationStockLocationCode);

            box.DestinationStockLocationID = stockLocation.StockLocationID;

            box.ModifiedDT = now;

            PortalDb.SaveChanges();

            return Ok(box);
        }

        [HttpPost]
        public IHttpActionResult AddItem([FromBody] PassBoxingItem dto)
        {
            var now = DateTime.Now;

            var product = PortalDb.Products.FirstOrDefault(p => p.Code == dto.Input || p.EAN == dto.Input);
            
            if (product != null)
            {
                var item = PortalDb.BoxedItems.SingleOrDefault(bi => bi.BoxID == dto.BoxID && bi.ProductID == product.ProductID);

                if (item != null)
                {
                    item.Quantity += 1;

                    item.ModifiedDT = now;

                    item.DeletedDT = null;
                }
                else
                {
                    item = PortalDb.BoxedItems.Add(new SharedEFClasses.Models.Marylebone.BoxedItem()
                    {
                        CreatedDT = now,
                        BoxID = dto.BoxID,
                        Quantity = 1,
                        ProductID = product.ProductID,
                        ModifiedDT = now
                    });
                }

                PortalDb.SaveChanges();

                return Ok(new
                {
                    valid = true,
                    record = item
                });
            }

            return Ok(new
            {
                valid = false
            });
        }

        [HttpPost]
        public IHttpActionResult IncreaseItemQuantity([FromBody] PassBoxingItem dto)
        {
            var now = DateTime.Now;

            var item = PortalDb.BoxedItems.Single(bi => bi.BoxedItemID == dto.BoxedItemID);

            item.Quantity += 1;

            item.ModifiedDT = now;

            PortalDb.SaveChanges();

            return Ok(item.Quantity);
        }

        [HttpPost]
        public IHttpActionResult ReduceItemQuantity([FromBody] PassBoxingItem dto)
        {
            var now = DateTime.Now;

            var item = PortalDb.BoxedItems.Single(bi => bi.BoxedItemID == dto.BoxedItemID);

            item.Quantity -= 1;

            item.ModifiedDT = now;

            if (item.Quantity == 0)
            {
                item.DeletedDT = DateTime.Now;
            }

            PortalDb.SaveChanges();

            return Ok(item.Quantity);
        }

        [HttpPost]
        public IHttpActionResult SaveBox([FromBody] PassBoxIdentifier dto)
        {
            var now = DateTime.Now;

            var item = PortalDb.Boxes.Single(b => b.BoxID == dto.BoxID);

            var stockLocation = PortalDb.StockLocations.SingleOrDefault(sl => sl.Code == dto.StockLocationCode);

            if (stockLocation == null)
            {
                return BadRequest("stockLocation");
            }

            item.DestinationStockLocationID = stockLocation.StockLocationID;

            PortalDb.SaveChanges();

            return Ok(new { });
        }
    }
}