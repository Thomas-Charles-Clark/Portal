using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertex
{
	[Table("SalesLedgerTransaction", Schema = "Mertex_Inc")]
	public class SalesLedgerTransaction_Mertex_Inc
	{
		[Key]
		public string Key { get; set; }

		public DateTime? DocumentDT { get; set; }

		public DateTime? DueDT { get; set; }
		
		public string TransactionType { get; set; }

		public decimal? OutstandingAmount { get; set; }

		public decimal? OutstandingAmountInCurrency { get; set; }

		public string TradeAccountCode { get; set; }

		public string OrderID { get; set; }
	}
}
