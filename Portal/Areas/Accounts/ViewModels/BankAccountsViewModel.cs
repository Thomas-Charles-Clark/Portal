using SharedEFClasses;
using SharedEFClasses.Models;

namespace Portal.Areas.Accounting.ViewModels
{
    public class BankAccountsViewModel : BaseViewModel
    {
        public BankAccountsViewModel(
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