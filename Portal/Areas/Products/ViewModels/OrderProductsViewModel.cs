using Portal.Models;
using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Orders;
using System.Collections.Generic;

namespace Portal.Areas.Products.ViewModels
{
    public class OrderProductsViewModel : BaseViewModel
    {
        public List<HoldReason> HoldReasons { get; set; }
        public List<OrderImportSource> OrderImportSources { get; set; }
        public string Tab { get; set; }
        public long? BasketID { get; set; }
        public int? TransactionID { get; set; }
        public int? OrderHeadID { get; set; }
        public short? HoldReasonID { get; set; }
        public short? HoldReasonGroupID { get; set; }

        public OrderProductsViewModel(
            List<HoldReason> holdReasons,
            List<OrderImportSource> orderImportSources,
            string tab,
            long? basketId,
            int? transactionId,
            int? orderHeadId,
            short? holdReasonId,
            short? holdReasonGroupId,
            RoleProperties properties, 
            string applicationHeading, 
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            HoldReasons = holdReasons;
            OrderImportSources = orderImportSources;
            Tab = tab;
            BasketID = basketId;
            TransactionID = transactionId;
            OrderHeadID = orderHeadId;
            HoldReasonID = holdReasonId;
        }
    }
}