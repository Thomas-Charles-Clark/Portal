using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Reporting.CloseBrothers
{
	public class CloseBrothers_Fundability_Select_Record
	{
		// Top-Level Decisions

		public string Fundable { get; set; }

		public string Funder { get; set; }

		public string Reserved { get; set; }

		public string DebtAgeBracket { get; set; }

		public bool DebtAgeExclusion { get; set; }

		// Transaction Details

		public string TransactionType { get; set; }

		public string TransactionID { get; set; }

		// Document Details

		public DateTime? DocumentIssueDate { get; set; }

		public DateTime? DocumentDueDate { get; set; }

		public string TransactionCurrency { get; set; }

		public decimal? OriginalValueCUR { get; set; }

		public decimal? OriginalValueGBP { get; set; }

		public decimal? OutstandingAmountCUR { get; set; }

		public decimal? OutstandingAmountGBP { get; set; }

		// Trade Account

		public string TradeAccountDebtGroup { get; set; }

		public string HoldingAccountCode { get; set; }

		public string TradeAccountType { get; set; }
		
		public string TradeAccountCode { get; set; }

		public string TradeAccountName { get; set; }

		public decimal? AggregatedTradeAccountInsuredCreditLimitGBP { get; set; }

		// Decision Explanations

		public string NotFundedExplanation { get; set; }

		public string FirstNotFundedExplanation { get; set; }

		public string NotFundedExplanationGroup { get; set; }

		public string FirstNotFundedExplanationGroup { get; set; }

		public string ReservedExplanation { get; set; }

		public string FirstReservedExplanation { get; set; }

		public string ReservedExplanationGroup { get; set; }

		public string FirstReservedExplanationGroup { get; set; }

		// Totals / Running Totals

		public decimal? LedgerTotal { get; set; }

		public decimal? ExportTotal { get; set; }

		public decimal? TradeAccountTotal { get; set; }

		public decimal? TradeAccountDebtAgeExcludedTotal { get; set; }

		public decimal? TradeAccountRunningTotal { get; set; }

		public decimal? ExportRunningTotal { get; set; }

		public decimal? CountryRunningTotal { get; set; }

		// Funding Decision Parameters

		public string FD_TradeAccountCode { get; set; }

		public string FD_TradeAccountGroupCode { get; set; }

		public string FD_TradeAccountTypeCode { get; set; }

		public string FD_TradeAccountCurrency { get; set; }

		public string FD_TradeAccountPaymentTermsCode { get; set; }

		public string FD_TradeAccountMarketCode { get; set; }

		public string FD_InvoiceAddressCountryCode { get; set; }

		public bool FD_EUMember { get; set; }

		public bool FD_OECDMember { get; set; }

		public decimal? FD_OriginalValueGBP { get; set; }

		// Reserve Decision Parameters

		public string RD_DebtFunderCode { get; set; }

		public string RD_TradeAccountCurrency { get; set; }

		public decimal? RD_AggregatedTradeAccountInsuredCreditLimitGBP { get; set; }

		public string RD_TradeAccountPaymentTermsCode { get; set; }

		public string RD_InvoiceAddressCountryCode { get; set; }

		public string RD_DocumentPaymentTermsCode { get; set; }

		public int? RD_EndOfMonthAgedDebtInDays { get; set; }

		public decimal? RD_OriginalValueGBP { get; set; }

		public decimal? RD_OutstandingAmountGBP { get; set; }

		public bool RD_IsAdvertising { get; set; }

		public bool RD_IsExport { get; set; }

		public string RD_TradeRegion { get; set; }

		public decimal? RD_TradeAccountRunningTotalGBP { get; set; }

		public decimal? RD_ExportRunningTotalGBP { get; set; }

		public decimal? RD_CountryRunningTotalGBP { get; set; }

		public decimal? RD_LedgerTotalGBP { get; set; }

		// Presentation Fields

		public decimal? OutstandingAmountOnlyGBP { get; set; }

		public decimal? OutstandingAmountOnlyEUR { get; set; }

		// Other

		public string LedgerDataSource { get; set; }

		public bool FundableBoolean { get; set; }

		public bool ReservedBoolean { get; set; }

		public string TransactionTypeCode { get; set; }

		// Close Brothers Additional Fields

		public string VATCodesAndRates { get; set; }
	}
}
