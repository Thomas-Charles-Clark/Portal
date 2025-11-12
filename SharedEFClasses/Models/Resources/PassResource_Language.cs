using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Resources
{
	public class PassResource_Language
	{
		public short ResourceID { get; set; }

		public byte LanguageID { get; set; }

		public Nullable<int> MemberID { get; set; }

		public string Value { get; set; }
	}
}
