using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.TradeAccounts
{
	public class TradeAccountMaintenance_TradeAccount_Search_DTO
	{
		public IEnumerable<byte> SalesMarketIDs { get; set; }

		public short? SalesRepresentativeID { get; set; }

		public short? SalesAgentID { get; set; }

		public short? SalesAreaID { get; set; }

		public short? CountryID { get; set; }

		public int? TradeAccountGroupID { get; set; }

		public short? TradeAccountTypeID { get; set; }

		public byte? PaymentTermsID { get; set; }

		public byte? PaymentTermsTypeID { get; set; }

		public bool? CreditStopped { get; set; }

		public bool Open { get; set; } = true;

		public string SearchTerm { get; set; }
	}
}
