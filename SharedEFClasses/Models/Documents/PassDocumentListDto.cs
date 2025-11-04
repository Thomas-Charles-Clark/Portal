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
	}
}
