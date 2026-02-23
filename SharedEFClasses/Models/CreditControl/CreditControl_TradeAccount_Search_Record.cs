using SharedEFClasses.Models.Pricing;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_Search_Record
	{
		public int TradeAccountID { get; set; }
		public string CurrencyCode { get; set; }
		public string FormattingCulture { get; set; }
		public string MarketName { get; set; }
		public string TradeAccountCode { get; set; }
		public string TradeAccountName { get; set; }
		public string Status { get; set; }
		public bool CreditStop { get; set; }
		public string Advisory { get; set; }
		public decimal? InsuredCreditLimit { get; set; }
		public decimal? CreditLimit { get; set; }
		public decimal? DebtTotal { get; set; }
		public decimal? DebtPlusOrdersTotal { get; set; }
		public decimal? OrdersTotalValue { get; set; }
		public decimal? OrdersInProgressValue { get; set; }
		public decimal? OrdersHeldPortalValue { get; set; }
		public decimal? OrdersHeldMertexValue { get; set; }
		public int OrdersTotalQuantity { get; set; }
		public int OrdersInProgressQuantity { get; set; }
		public int OrdersHeldPortalQuantity { get; set; }
		public int OrdersHeldMertexQuantity { get; set; }
		public decimal? NotDueTotalValue { get; set; }
		public decimal? OverdueTotalValue { get; set; }
		public decimal? Debt30DayValue { get; set; }
		public decimal? Debt60DayValue { get; set; }
		public decimal? Debt90DayValue { get; set; }
		public decimal? Debt120DayValue { get; set; }
		public decimal? DisputedValue { get; set; }
		public decimal? WrittenOffValue { get; set; }
		public decimal? NotDueTotalQuantity { get; set; }
		public decimal? OverdueTotalQuantity { get; set; }
		public decimal? Debt30DayQuantity { get; set; }
		public decimal? Debt60DayQuantity { get; set; }
		public decimal? Debt90DayQuantity { get; set; } 
		public decimal? Debt120DayQuantity { get; set; }
		public int? ClaimCount { get; set; }
		public decimal? ClaimValue { get; set; }
		public decimal? DisputedQuantity { get; set; }
		public decimal? WrittenOffQuantity { get; set; }
		public string StatementURI { get; set; }
		public decimal? StatementTotalValue { get; set; }
		public decimal? TotalQuantity { get; set; }
		public decimal? CreditsValue { get; set; }
		public decimal? DepositsValue { get; set; }
		public decimal? OverpaymentsValue { get; set; }
		public decimal? RefundsValue { get; set; }
		public int? CreditsQuantity { get; set; }
		public int? DepositsQuantity { get; set; }
		public int? OverpaymentsQuantity { get; set; }
		public int? RefundsQuantity { get; set; }
		public string SalesRank { get; set; }
		public decimal? SalesValue { get; set; }
		public int MemberCount { get; set; }
	}
}
