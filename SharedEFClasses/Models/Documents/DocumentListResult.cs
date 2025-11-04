using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Documents
{
	public class DocumentListResult
	{
		public IEnumerable<DocumentRecord> Results { get; set; }
	}
}
