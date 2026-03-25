using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_DebtBreakdown_Record
	{
		public string UniVerseAccount { get; set; }
		public string DebtAgeBracketName { get; set; }
		public string InvoiceID { get; set; }
		public string InvoiceURI { get; set; }
		public DateTime InvoiceDate { get; set; }
		public DateTime DueDate { get; set; }
		public string OriginalValueInCurrency { get; set; }
		public string OutstandingAmountInCurrency { get; set; }
		public string CreditsValue { get; set; }
		public string CreditInfo { get; set; }
		public string DepositsValue { get; set; }
		public string DepositsInfo { get; set; }
		public string OverPaymentsValue { get; set; }
		public string OverPayemntsInfo { get; set; }
		public string RefundsValue { get; set; }
		public string RefundsInfo { get; set; }
		public string ProformaPaymentsValue { get; set; }
		public string ProformaPaymentsInfo { get; set; }
		public int TotalRowCount { get; set; }
	}
}
