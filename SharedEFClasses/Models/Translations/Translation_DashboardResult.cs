using Org.BouncyCastle.Asn1.Mozilla;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Translations
{
	public class Translation_DashboardResult
	{
		public string Classes { get; set; }
		public int SortOrder { get; set; }
		public string Heading { get; set; }
		public string Stats { get; set; }
		public byte LanguageID { get; set; }
	}
}
