using Microsoft.AnalysisServices.AdomdClient;
using Microsoft.Owin.Security;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Accounts
{
	[Table("DGPaymentDetails", Schema = "portal")]

	public class DGPaymentDetails
	{
		[Key]
		public string Code { get; set; }

		public string PaymentDetails { get; set; }

		public string Bank { get; set; }

		public string AccountName { get; set; }

		public string SortCode { get; set; }

		public string AccountNumber { get; set; }

		public string IBAN { get; set; }

		public string Swift { get; set; }

		public string BIC { get; set; }

		public bool CaptureDailyStats { get; set; }

		public string BankAccountOwner { get; set; }

		public int BankAccountID { get; set; }
	}
}
