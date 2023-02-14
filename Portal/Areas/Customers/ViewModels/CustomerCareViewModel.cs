namespace Portal.Areas.Customers.ViewModels
{
    public class CustomerCareViewModel
    {
        public int? TradeAccountGroupID { get; set; }
        public int? TradeAccountID { get; set; }
        public bool CanSearch { get; set; }
        public CustomerCareViewModel(
            int? tradeAccountGroupId,
            int? tradeAccountId,
            bool canSearch)
        {
            this.TradeAccountGroupID = tradeAccountGroupId;
            this.TradeAccountID = tradeAccountId;
            this.CanSearch = canSearch;
        }
    }
}