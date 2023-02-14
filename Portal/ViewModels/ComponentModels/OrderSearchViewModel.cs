using Portal.Models;
using Portal.Utilities;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.ViewModels.ComponentModels
{
    public class OrderSearchViewModel
    {
        public int? TradeAccountGroupID { get; set; }
        public int? TradeAccountID { get; set; }
        public List<ProductType> ProductTypes { get; set; }
        public List<ByteSelectOption> OrderStatusOptions { get; set; }
        public List<StringSelectOption> PeriodOptions { get; set; }
        public string ButtonCssOverride { get; set; }
        public OrderSearchViewModel(
            int? _tradeAccountGroupId, 
            int? _tradeAccountId, 
            List<ProductType> _productTypes,
            string _buttonCssOverride)
        {
            this.TradeAccountGroupID = _tradeAccountGroupId;
            this.TradeAccountID = _tradeAccountId;
            this.ProductTypes = _productTypes;
            this.OrderStatusOptions = PortalFramework.GenerateOrderStatusOptions();
            this.PeriodOptions = PortalFramework.GeneratePeriodOptions();
            this.ButtonCssOverride = _buttonCssOverride;
        }
    }
}