using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
namespace Portal.Areas.Marketing.ViewModels
{
    public class MarketingBudgetViewModel : BaseViewModel
    {
        public MarketingBudgetViewModel(
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