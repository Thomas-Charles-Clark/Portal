using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Documents
{
    public class PassEmailDocumentFromFilePathDto
    {
        public string Recipient { get; set; }
        public string ReplyTo { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public short DocumentID { get; set; }
        public long? BasketID { get; set; }
        public int? OrderHeadID { get; set; }
        public int? TransactionID { get; set; }
        public int? TradeAccountID { get; set; }
        public string DocumentTypeHeader { get; set; }
        public string FilePath { get; set; }
    }
}
