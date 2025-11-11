using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Resources
{
	public class PassResource_Language
	{
		public short ResourceID { get; set; }

		public byte LanguageID { get; set; }

		public int? MemberID { get; set; }

		public string Value { get; set; }
	}
}
