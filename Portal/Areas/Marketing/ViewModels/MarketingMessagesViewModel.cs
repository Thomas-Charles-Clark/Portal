using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
namespace Portal.Areas.Marketing.ViewModels
{
    public class MarketingMessagesViewModel : BaseViewModel
    {
        public MarketingMessagesViewModel(
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