using Org.BouncyCastle.Asn1.Mozilla;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Suppliers.PaymentApprovals
{
	public class SupplierPaymentApproval_Basket_SelectRecord
	{
		[Key]
		[Column(Order = 1)]
		public int PaymentDecisionID { get; set; }

		[Key]
		[Column(Order = 2)]
		public string CurrencyCode { get; set; }

		public int SortOrder { get; set; }

		public string RequestType { get; set; }

		public string SupplierCode { get; set; }

		public string SupplierName { get; set; }

		public string RequesterName { get; set; }

		public string RequesterEmail { get; set; }

		public string FormattingCulture { get; set; }

		public decimal Request_OutstandingAmount_CUR { get; set; }

		public decimal Request_OutstandingAmount_GBP { get; set; }

		public decimal ExchangeRate { get; set; }

		public decimal Decision_Amount_CUR { get; set; }

		public decimal Decision_Amount_GPB { get; set; }
	}
}
