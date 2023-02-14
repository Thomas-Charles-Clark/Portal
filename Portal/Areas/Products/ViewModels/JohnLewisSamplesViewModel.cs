using System.Collections.Generic;
using Portal.ViewModels;
using Portal.Models;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Samples;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses;

namespace Portal.Areas.Products.ViewModels
{
    public class SampleRequestViewModel : BaseViewModel
    {
        public SampleRequestViewModel(RoleProperties properties,
                                      List<ClientSideCountry> countries,
                                      List<TradeHaulier> hauliers,
                                      List<TradeCarriage> carriages,
                                      List<ClientSideLanguage> languages,
                                      MertexOperator defaultOperator,
                                      bool canSearch
                                      ) : base(properties)
        {
            Countries = countries;
            Hauliers = hauliers;
            Carriages = carriages;
            Languages = languages;
            DefaultOperator = defaultOperator;
            CanSearch = canSearch;
        }

        public List<ClientSideCountry> Countries { get; set; }
        public List<TradeHaulier> Hauliers { get; set; }
        public List<TradeCarriage> Carriages { get; set; }
        public List<ClientSideLanguage> Languages { get; set; }
        public MertexOperator DefaultOperator { get; set; }
        public bool CanSearch { get; set; }
    }
}