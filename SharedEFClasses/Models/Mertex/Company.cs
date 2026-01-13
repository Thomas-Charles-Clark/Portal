using Newtonsoft.Json;

using Org.BouncyCastle.Asn1.Mozilla;

using SharedEFClasses.Models.Mertexer;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertex
{
	[Table("Company", Schema = "Mertex")]
	public class Company
	{
		[Key]
		public string Code { get; set; }

		public string Name { get; set; }

		public byte? SortOrder { get; set; }

		[JsonIgnore]
		[InverseProperty("Company")]
		public virtual ICollection<MertexTradeAccountClassificationSuperSet> MertexTradeAccountClassificationSuperSetRecords { get; set; }

		[JsonIgnore]
		[InverseProperty("Company")]
		public virtual ICollection<TradeAccountLive> TradeAccounts { get; set; }
	}
}
