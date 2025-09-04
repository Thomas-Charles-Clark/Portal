using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class PassDocumentDownloadRequest
    {
        public IEnumerable<long> AttachmentIDs { get; set; }
    }
}
