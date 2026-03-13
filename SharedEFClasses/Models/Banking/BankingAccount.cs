using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Banking
{
	[Table("Account", Schema = "banking")]
	public class BankingAccount
	{
		[Key]
		public int AccountID { get; set; }

		public string Description { get; set; }

		public string CurrencyCode { get; set; }

		public string Bank { get; set; }

		public string SortCode { get; set; }

		public string AccountCode { get; set; }

		public string IBAN { get; set; }

		public byte BraintreeLoginID { get; set; }

		[ForeignKey("CurrencyCode")]
		public virtual BankingCurrency Currency { get; set; }

		[NotMapped]
		public string Label
		{
			get
			{
				return $"{Description} - {Bank} - {IBAN}";
			}
		}
	}
}
