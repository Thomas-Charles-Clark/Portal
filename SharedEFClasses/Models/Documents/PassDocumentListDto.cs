using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Documents
{
	public class PassDocumentListDto
	{
		public short? DocumentID { get; set; }
		public int? TradeAccountID { get; set; }
		public byte? LanguageID { get; set; }
		public DateTime? Date { get; set; }
		public string OutputMode { get; set; }
		public string UniVerseAccount { get; set; }
		public string DebtFunder { get; set; }
		public string CurrencyCode { get; set; }
	}
}
