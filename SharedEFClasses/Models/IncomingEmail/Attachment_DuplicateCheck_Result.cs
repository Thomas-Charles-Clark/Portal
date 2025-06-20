using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class Attachment_DuplicateCheck_Result
    {
        public IEnumerable<Attachment_DuplicateCheck_SelectResult> Duplicates { get; set; }
    }
}
