using Portal.Models;
using Portal.ViewModels;
using Portal.ViewModels.ComponentModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.TradeAccounts;
using System.Collections.Generic;

namespace Portal.Areas.Products.ViewModels
{
    public class SamplesViewModel : BaseViewModel
    {
        public bool CanSearch { get; set; }

        public List<ClientSideCountry> Countries { get; set; }

        public DeliverySelectorViewModel DeliverySelectorViewModel { get; set; }

        public List<ClientSideLanguage> Languages { get; set; }

        public MertexOperator DefaultOrderTaker { get; set; }

        public bool HideOrderTaker { get; set; }

        public SamplesViewModel(
            RoleProperties properties) : base(properties)
        {

        }
    }
}