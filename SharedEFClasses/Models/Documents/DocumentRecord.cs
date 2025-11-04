using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Documents
{
	public class DocumentRecord
	{
		public int RowKey { get; set; }
		public short DocumentID { get; set; }
		public string DocumentLabel { get; set; }
		public byte LanguageID { get; set; }
		public string LanguageLabel { get; set; }
		public long? BasketID { get; set; }
		public int? TransactionID { get; set; }
		public int? OrderHeadID { get; set; }
		public int? TradeAccountID { get; set; }
		public string TradeAccountLabel { get; set; }
		public DateTime? Date { get; set; }
		public decimal? DocumentTotal { get; set; }
		public string CurrencyCode { get; set; }
		public string FormattingCulture { get; set; }
	}
}
