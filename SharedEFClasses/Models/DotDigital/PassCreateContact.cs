using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.DotDigital
{
    public class PassCreateContact
    {
        public byte SourceID { get; set; }
        public string OperatorCode { get; set; }
        public string Email { get; set; }
        public byte DotDigitalAccountID { get; set; }
        public string FullName { get; set; }
    }
}
