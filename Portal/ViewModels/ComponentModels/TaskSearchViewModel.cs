using Portal.Utilities;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.ViewModels.ComponentModels
{
    public class TaskSearchViewModel
    {
        public int? TradeAccountGroupID { get; set; }
        public int? TradeAccountID { get; set; }
        public List<StringSelectOption> PeriodOptions { get; set; }
        public List<ByteSelectOption> TaskStatusOptions { get; set; }
        public string ButtonCssOverride { get; set; }
        public TaskSearchViewModel(
            int? _tradeAccountGroupId, 
            int? _tradeAccountId,
            string _buttonCssOverride)
        {
            this.TradeAccountGroupID = _tradeAccountGroupId;
            this.TradeAccountID = _tradeAccountId;
            this.PeriodOptions = PortalFramework.GeneratePeriodOptions();
            this.TaskStatusOptions = PortalFramework.GenerateTaskStatusOptions();
            this.ButtonCssOverride = _buttonCssOverride;
        }
    }
}