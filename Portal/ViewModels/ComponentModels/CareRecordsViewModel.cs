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
    public class CareRecordsViewModel
    {
        public int? TradeAccountGroupID { get; set; }
        public int? TradeAccountID { get; set; }
        public List<StringSelectOption> PeriodOptions { get; set; }
        public List<ByteSelectOption> CareRecordStatusOptions { get; set; }
        public List<ProductType> ProductTypes { get; set; }
        public string ButtonCssOverride { get; set; }
        public CareRecordsViewModel(
            int? _tradeAccountGroupId, 
            int? _tradeAccountId,
            List<ProductType> _productTypes,
            string _buttonCssOverride)
        {
            this.TradeAccountGroupID = _tradeAccountGroupId;
            this.TradeAccountID = _tradeAccountId;
            this.ProductTypes = _productTypes;
            this.PeriodOptions = PortalFramework.GeneratePeriodOptions();
            this.CareRecordStatusOptions = PortalFramework.GenerateCareRecordStatusOptions();
            this.ButtonCssOverride = _buttonCssOverride;
        }
    }
}