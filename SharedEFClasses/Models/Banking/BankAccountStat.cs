using Org.BouncyCastle.Asn1.Mozilla;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Banking
{
	[Table("BankAccountStat", Schema = "portal")]
	public class BankAccountStat
	{
		[Key]
		[Column(Order = 1)]
		public DateTime Date { get; set; }

		[Key]
		[Column(Order = 2)]
		public int RowID { get; set; }

		[Key]
		[Column(Order = 3)]
		public int ColumnID { get; set; }

		public string Value { get; set; }

		public DateTime CreatedDT { get; set; }

		public DateTime ModifiedDT { get; set; }

		public int MemberID { get; set; }

		[ForeignKey("RowID")]
		public virtual BankAccountStat_Row RowReference { get; set; }

		[ForeignKey("ColumnID")]
		public virtual BankAccountStat_Column ColumnReference { get; set; }

		[ForeignKey("MemberID")]
		public virtual Member Member { get; set; }
	}
}
