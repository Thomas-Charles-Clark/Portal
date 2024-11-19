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
        public string Market { get; set; }
        public int? TransactionID { get; set; }
        public int? OrderHeadID { get; set; }
        public short? HoldReasonID { get; set; }
        public short? HoldReasonGroupID { get; set; }
        public string TradeAccountCode { get; set; }

        public OrderProductsViewModel(
            List<HoldReason> holdReasons,
            List<OrderImportSource> orderImportSources,
            string tab,
            long? basketId,
            string market,
            int? transactionId,
            int? orderHeadId,
            short? holdReasonId,
            short? holdReasonGroupId,
            string tradeAccountCode,
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
            Market = market;
            TransactionID = transactionId;
            OrderHeadID = orderHeadId;
            HoldReasonID = holdReasonId;
            HoldReasonGroupID = holdReasonGroupId;
            TradeAccountCode = tradeAccountCode;
        }
    }
}