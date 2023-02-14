using Portal.Models;
using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;

namespace Portal.Areas.Customers.ViewModels
{
    public class CustomerVisitViewModel : BaseViewModel
    {
        public int? TradeAccountGroupID { get; set; }
        public int? TradeAccountID { get; set; }
        public bool CanSearch { get; set; }

        public CustomerVisitViewModel(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading,
            int? tradeAccountGroupId,
            int? tradeAccountId) : base(
                properties,
                applicationHeading,
                applicationSubHeading)
        {
            this.TradeAccountGroupID = tradeAccountGroupId;
            this.TradeAccountID = tradeAccountId;
            this.CanSearch = properties?.AccountSelector_CanSearch ?? false;
        }
    }
}