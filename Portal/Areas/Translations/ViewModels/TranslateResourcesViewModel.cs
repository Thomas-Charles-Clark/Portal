using Portal.Models;
using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using System.Collections.Generic;

namespace Portal.Areas.Translations.ViewModels
{
    public class TranslateResourcesViewModel : BaseViewModel
    {
        public TranslateResourcesViewModel(
            RoleProperties properties, 
            string applicationHeading, 
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {

        }
    }
}