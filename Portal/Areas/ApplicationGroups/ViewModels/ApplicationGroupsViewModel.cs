using SharedEFClasses;
using SharedEFClasses.Models;

namespace Portal.Areas.ApplicationGroups.ViewModels
{
    public class ApplicationGroupsViewModel : BaseViewModel
    {
        public ApplicationGroupsViewModel(
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