using SharedEFClasses;
using SharedEFClasses.Models;

namespace Portal.Areas.Accounting.ViewModels
{
    public class DailyBankingStatisticsViewModel : BaseViewModel
    {
        public DailyBankingStatisticsViewModel(
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