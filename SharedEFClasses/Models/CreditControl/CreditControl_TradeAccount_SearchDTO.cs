using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
	public class CreditControl_TradeAccount_SearchDTO
	{
		public IEnumerable<byte> SalesMarketIDs { get; set; }

		public short? SalesRepresentativeID { get; set; }

		public short? SalesAgentID { get; set; }

		public short? SalesAreaID { get; set; }

		public short? CountryID { get; set; }

		public int? TradeAccountGroupID { get; set; }

		public short? TradeAccountTypeID { get; set; }

		public byte? TradeAccountTypeGroupID { get; set; }

		public byte? PaymentTermsID { get; set; }

		public byte? PaymentTermsTypeID { get; set; }

		public string CreditControllerCode { get; set; }

		public bool? CreditStopped { get; set; }

		public bool Open { get; set; } = true;

		public string SearchTerm { get; set; }

		public string SalesHistoryAnalysisPeriod { get; set; }

		public byte? LanguageID { get; set; }
	}
}
