using Portal.Models;
using SharedEFClasses.Models.Orders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.ViewModels.ComponentModels
{
    public class ProductRangeSelectorViewModel
    {
        public string ClickFunction { get; set; }
        public string ButtonClass { get; set; }
        public List<ProductRangeButton> NewCollectionButtons { get; set; }
        public List<ProductRangeButton> ClearanceButtons { get; set; }

        public ProductRangeSelectorViewModel(string clickFunction,
            string buttonClass,
            List<ProductRangeButton> newCollectionButtons,
            List<ProductRangeButton> clearanceButtons)
        {
            ClickFunction = clickFunction;
            ButtonClass = buttonClass;
            NewCollectionButtons = newCollectionButtons;
            ClearanceButtons = clearanceButtons;
        }
    }
}