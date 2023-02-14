using Portal.Utilities;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.ViewModels.ComponentModels
{
    public class VisitSearchViewModel
    {
        public int? TradeAccountID { get; set; }
        public List<StringSelectOption> PeriodOptions { get; set; }
        public string ButtonCssOverride { get; set; }

        public VisitSearchViewModel(
            int? _tradeAccountId,
            string _buttonCssOverride)
        {
            this.TradeAccountID = _tradeAccountId;
            this.PeriodOptions = PortalFramework.GeneratePeriodOptions();
            this.ButtonCssOverride = _buttonCssOverride;
        }
    }
}