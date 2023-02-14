using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.ViewModels.ComponentModels
{
    public class MonthRangeSelectorViewModel
    {
        public DateTime? MinimumMonth { get; set; }

        public DateTime? MaximumMonth { get; set; }

        public MonthRangeSelectorViewModel(DateTime? minimumMonth = null, DateTime? maximumMonth = null)
        {
            this.MinimumMonth = minimumMonth;
            this.MaximumMonth = maximumMonth;
        }
    }
}