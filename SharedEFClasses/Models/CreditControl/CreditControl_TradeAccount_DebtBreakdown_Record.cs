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
		public decimal OriginalValueInCurrency { get; set; }
		public decimal OutstandingAmountInCurrency { get; set; }
		public bool Disputed { get; set; }
	}
}
