using Microsoft.AspNet.SignalR.Hubs;
using SharedEFClasses.Models.Mertexer;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Banking
{
	[Table("Currency", Schema = "banking")]
	public class BankingCurrency
	{
		[Key]
		public string Code { get; set; }

		public string Name { get; set; }

		public string FormattingCulture { get; set; }

		public DateTime CreatedDT { get; set; }

		[InverseProperty("Currency")]
		public virtual ICollection<BankingAccount> Accounts { get; set; }

		[NotMapped]
		public string Label
		{
			get
			{
				return $"{Code} - {Name}";
			}
		}
	}
}
